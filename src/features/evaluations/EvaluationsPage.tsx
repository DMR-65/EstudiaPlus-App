import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { CalendarClock, ClipboardCheck, GraduationCap, Plus, Star } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { useFeedback } from '@/components/feedback/FeedbackProvider';
import { useAppData } from '@/features/app-data/AppDataContext';
import { EvaluationCard } from '@/features/evaluations/EvaluationCard';
import { EvaluationFormDialog } from '@/features/evaluations/EvaluationFormDialog';
import { GradeDialog } from '@/features/evaluations/GradeDialog';
import { EVALUATION_STATUSES } from '@/types';
import type {
  Evaluation,
  EvaluationDraft,
  EvaluationStatus,
} from '@/types';
import {
  calculateAcademicAverage,
  countUpcomingEvaluations,
  formatGrade,
} from '@/utils/academic';
import { EVALUATION_STATUS_LABELS } from '@/utils/constants';
import { getTodayInSantiago } from '@/utils/dates';

type SortOrder = 'date-asc' | 'date-desc';

function evaluationToDraft(evaluation: Evaluation): EvaluationDraft {
  return {
    title: evaluation.title,
    description: evaluation.description,
    subjectId: evaluation.subjectId,
    type: evaluation.type,
    date: evaluation.date,
    weighting: evaluation.weighting,
    grade: evaluation.grade,
    maxScore: evaluation.maxScore,
    status: evaluation.status,
  };
}

export function EvaluationsPage() {
  const { data, createEvaluation, updateEvaluation, deleteEvaluation } = useAppData();
  const { notify } = useFeedback();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<EvaluationStatus | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('date-asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Evaluation | null>(null);
  const [gradeTarget, setGradeTarget] = useState<Evaluation | null>(null);

  const { evaluations, subjects } = data;
  const today = getTodayInSantiago();
  const average = calculateAcademicAverage(evaluations);
  const gradedCount = evaluations.filter(
    (evaluation) => typeof evaluation.grade === 'number',
  ).length;
  const upcomingCount = countUpcomingEvaluations(evaluations, today);

  useEffect(() => {
    const subjectParam = searchParams.get('asignatura');
    const createRequested = searchParams.get('nueva') === '1';
    const editId = searchParams.get('editar');
    const dateParam = searchParams.get('fecha');

    let shouldClear = false;

    if (subjectParam && subjects.some((subject) => subject.id === subjectParam)) {
      setSubjectFilter(subjectParam);
      shouldClear = true;
    }

    if (createRequested) {
      setEditingEvaluation(null);
      setDefaultDate(dateParam ?? undefined);
      setDialogOpen(true);
      shouldClear = true;
    } else if (editId) {
      const evaluation = evaluations.find((item) => item.id === editId);
      if (evaluation) {
        setEditingEvaluation(evaluation);
        setDefaultDate(undefined);
        setDialogOpen(true);
        shouldClear = true;
      }
    }

    if (shouldClear) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('asignatura');
      nextParams.delete('nueva');
      nextParams.delete('editar');
      nextParams.delete('fecha');
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchParams, setSearchParams, subjects, evaluations]);

  const filteredEvaluations = useMemo(
    () =>
      evaluations
        .filter((evaluation) => {
          if (subjectFilter !== 'all' && evaluation.subjectId !== subjectFilter) {
            return false;
          }
          if (statusFilter !== 'all' && evaluation.status !== statusFilter) {
            return false;
          }
          return true;
        })
        .sort((a, b) => {
          const comparison = a.date.localeCompare(b.date);
          return sortOrder === 'date-asc' ? comparison : -comparison;
        }),
    [evaluations, subjectFilter, statusFilter, sortOrder],
  );

  const openCreate = () => {
    if (subjects.length === 0) {
      notify('Primero crea una asignatura para registrar evaluaciones.', 'warning');
      navigate('/asignaturas?nueva=1');
      return;
    }

    setEditingEvaluation(null);
    setDefaultDate(undefined);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingEvaluation(null);
    setDefaultDate(undefined);
  };

  const handleSave = (draft: EvaluationDraft): boolean => {
    const success = editingEvaluation
      ? updateEvaluation(editingEvaluation.id, draft)
      : createEvaluation(draft);

    if (success) {
      notify(
        editingEvaluation
          ? 'Evaluación actualizada correctamente.'
          : 'Evaluación creada correctamente.',
      );
    }

    return success;
  };

  const handleGrade = (grade: number): boolean => {
    if (!gradeTarget) {
      return false;
    }

    const success = updateEvaluation(gradeTarget.id, {
      ...evaluationToDraft(gradeTarget),
      grade,
      status: 'revisada',
    });

    if (success) {
      notify('Calificación registrada correctamente.');
    }

    return success;
  };

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    const success = deleteEvaluation(deleteTarget.id);
    if (success) {
      notify('Evaluación eliminada correctamente.');
      setDeleteTarget(null);
    }
  };

  if (subjects.length === 0) {
    return (
      <Box>
        <PageHeader
          title="Evaluaciones"
          subtitle="Organiza tus pruebas, controles y trabajos."
        />
        <EmptyState
          icon={<ClipboardCheck size={26} />}
          title="Primero crea una asignatura"
          description="Las evaluaciones deben estar asociadas a una asignatura. Crea una para comenzar."
          action={
            <Button variant="contained" onClick={() => navigate('/asignaturas?nueva=1')}>
              Ir a asignaturas
            </Button>
          }
        />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Evaluaciones"
        subtitle="Planifica tus pruebas y controles, y registra tus calificaciones."
        actions={
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={openCreate}>
            Nueva evaluación
          </Button>
        }
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
          gap: 2,
          mb: 2.5,
        }}
      >
        <StatCard
          label="Promedio académico"
          value={average !== null ? formatGrade(average) : '—'}
          helper={
            gradedCount > 0
              ? `${gradedCount} ${gradedCount === 1 ? 'nota registrada' : 'notas registradas'} · Escala 1,0 a 7,0`
              : 'Aún no hay calificaciones registradas'
          }
          icon={<GraduationCap size={21} />}
          color="#059669"
        />
        <StatCard
          label="Notas registradas"
          value={gradedCount}
          helper={`De ${evaluations.length} evaluaciones en total`}
          icon={<Star size={21} />}
          color="#D97706"
        />
        <StatCard
          label="Evaluaciones próximas"
          value={upcomingCount}
          helper="Programadas desde hoy"
          icon={<CalendarClock size={21} />}
          color="#7C3AED"
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(3, minmax(0, 1fr))',
          },
          gap: 1.5,
          mb: 2,
        }}
      >
        <TextField
          select
          value={subjectFilter}
          onChange={(event) => setSubjectFilter(event.target.value)}
          label="Asignatura"
          aria-label="Filtrar evaluaciones por asignatura"
        >
          <MenuItem value="all">Todas</MenuItem>
          {subjects.map((subject) => (
            <MenuItem key={subject.id} value={subject.id}>
              {subject.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as EvaluationStatus | 'all')
          }
          label="Estado"
          aria-label="Filtrar evaluaciones por estado"
        >
          <MenuItem value="all">Todos</MenuItem>
          {EVALUATION_STATUSES.map((status) => (
            <MenuItem key={status} value={status}>
              {EVALUATION_STATUS_LABELS[status]}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value as SortOrder)}
          label="Ordenar por fecha"
          aria-label="Ordenar evaluaciones por fecha"
        >
          <MenuItem value="date-asc">Más próxima primero</MenuItem>
          <MenuItem value="date-desc">Más lejana primero</MenuItem>
        </TextField>
      </Box>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Typography variant="body2" color="text.secondary">
          {filteredEvaluations.length} de {evaluations.length} evaluaciones
        </Typography>
        {(subjectFilter !== 'all' || statusFilter !== 'all') && (
          <Button
            size="small"
            onClick={() => {
              setSubjectFilter('all');
              setStatusFilter('all');
            }}
          >
            Limpiar filtros
          </Button>
        )}
      </Stack>

      {filteredEvaluations.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheck size={26} />}
          title={
            evaluations.length === 0
              ? 'Aún no tienes evaluaciones'
              : 'No encontramos evaluaciones'
          }
          description={
            evaluations.length === 0
              ? 'Registra tu primera prueba, control o trabajo para planificar mejor.'
              : 'Prueba cambiando los filtros seleccionados.'
          }
          action={
            evaluations.length === 0 ? (
              <Button variant="contained" startIcon={<Plus size={17} />} onClick={openCreate}>
                Registrar evaluación
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() => {
                  setSubjectFilter('all');
                  setStatusFilter('all');
                }}
              >
                Limpiar filtros
              </Button>
            )
          }
        />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, minmax(0, 1fr))',
              xl: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 2.5,
          }}
        >
          {filteredEvaluations.map((evaluation) => (
            <EvaluationCard
              key={evaluation.id}
              evaluation={evaluation}
              subject={subjects.find((subject) => subject.id === evaluation.subjectId)}
              onEdit={() => {
                setEditingEvaluation(evaluation);
                setDefaultDate(undefined);
                setDialogOpen(true);
              }}
              onDelete={() => setDeleteTarget(evaluation)}
              onGrade={() => setGradeTarget(evaluation)}
            />
          ))}
        </Box>
      )}

      <EvaluationFormDialog
        open={dialogOpen}
        evaluation={editingEvaluation}
        subjects={subjects}
        defaultDate={defaultDate}
        onClose={closeDialog}
        onSubmit={handleSave}
      />

      <GradeDialog
        open={Boolean(gradeTarget)}
        evaluation={gradeTarget}
        onClose={() => setGradeTarget(null)}
        onSubmit={handleGrade}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar evaluación"
        description={
          deleteTarget
            ? `¿Seguro que quieres eliminar “${deleteTarget.title}”? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
