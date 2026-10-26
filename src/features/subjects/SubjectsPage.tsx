import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { BookOpen, Plus, Search, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { useFeedback } from '@/components/feedback/FeedbackProvider';
import { useAppData } from '@/features/app-data/AppDataContext';
import { SubjectCard } from '@/features/subjects/SubjectCard';
import { SubjectFormDialog } from '@/features/subjects/SubjectFormDialog';
import type { Subject, SubjectDraft } from '@/types';
import { getSubjectStats } from '@/utils/academic';

export function SubjectsPage() {
  const { data, createSubject, updateSubject, deleteSubject } = useAppData();
  const { notify } = useFeedback();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);

  const { subjects, tasks, evaluations } = data;

  useEffect(() => {
    const createRequested = searchParams.get('nueva') === '1';
    const editId = searchParams.get('editar');

    if (!createRequested && !editId) {
      return;
    }

    if (createRequested) {
      setEditingSubject(null);
      setDialogOpen(true);
    }

    if (editId) {
      const subject = subjects.find((item) => item.id === editId);
      if (subject) {
        setEditingSubject(subject);
        setDialogOpen(true);
      }
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('nueva');
    nextParams.delete('editar');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams, subjects]);

  const filteredSubjects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) {
      return subjects;
    }

    return subjects.filter((subject) =>
      subject.name.toLowerCase().includes(normalizedSearch),
    );
  }, [search, subjects]);

  const openCreate = () => {
    setEditingSubject(null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingSubject(null);
  };

  const handleSave = (draft: SubjectDraft): boolean => {
    const success = editingSubject
      ? updateSubject(editingSubject.id, draft)
      : createSubject(draft);

    if (success) {
      notify(
        editingSubject
          ? 'Asignatura actualizada correctamente.'
          : 'Asignatura creada correctamente.',
      );
    }

    return success;
  };

  const handleToggleActive = (subject: Subject) => {
    const success = updateSubject(subject.id, {
      name: subject.name,
      description: subject.description,
      teacher: subject.teacher,
      color: subject.color,
      isActive: !subject.isActive,
    });

    if (success) {
      notify(
        subject.isActive
          ? `“${subject.name}” quedó inactiva.`
          : `“${subject.name}” quedó activa.`,
      );
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    const success = deleteSubject(deleteTarget.id);
    if (success) {
      notify(`Asignatura “${deleteTarget.name}” eliminada.`);
      setDeleteTarget(null);
    }
  };

  const deleteTaskCount = deleteTarget
    ? tasks.filter((task) => task.subjectId === deleteTarget.id).length
    : 0;
  const deleteEvaluationCount = deleteTarget
    ? evaluations.filter((evaluation) => evaluation.subjectId === deleteTarget.id).length
    : 0;

  return (
    <Box>
      <PageHeader
        title="Asignaturas"
        subtitle="Organiza las materias de tu año escolar y su información principal."
        actions={
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={openCreate}>
            Nueva asignatura
          </Button>
        }
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <TextField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar asignaturas por nombre"
          aria-label="Buscar asignaturas por nombre"
          sx={{ maxWidth: { sm: 380 }, width: '100%' }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={17} color="#64748B" />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    onClick={() => setSearch('')}
                    aria-label="Limpiar búsqueda"
                    sx={{ minWidth: 0, p: 0.5 }}
                  >
                    <X size={16} />
                  </Button>
                </InputAdornment>
              ) : undefined,
            },
          }}
        />
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {filteredSubjects.length} de {subjects.length} asignaturas
          </Typography>
        </Stack>
      </Box>

      {subjects.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={26} />}
          title="Aún no tienes asignaturas"
          description="Crea tu primera asignatura para comenzar a registrar tareas y evaluaciones."
          action={
            <Button variant="contained" startIcon={<Plus size={17} />} onClick={openCreate}>
              Crear asignatura
            </Button>
          }
        />
      ) : filteredSubjects.length === 0 ? (
        <EmptyState
          icon={<Search size={26} />}
          title="No encontramos asignaturas"
          description={`No hay resultados para “${search}”. Prueba con otro nombre.`}
          action={
            <Button variant="outlined" onClick={() => setSearch('')}>
              Limpiar búsqueda
            </Button>
          }
        />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              xl: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 2.5,
          }}
        >
          {filteredSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              stats={getSubjectStats(subject.id, tasks, evaluations)}
              onEdit={() => {
                setEditingSubject(subject);
                setDialogOpen(true);
              }}
              onDelete={() => setDeleteTarget(subject)}
              onToggleActive={() => handleToggleActive(subject)}
            />
          ))}
        </Box>
      )}

      <SubjectFormDialog
        open={dialogOpen}
        subject={editingSubject}
        onClose={closeDialog}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar asignatura"
        description={
          deleteTarget ? (
            <Box>
              <Typography variant="body2" color="text.secondary">
                ¿Seguro que quieres eliminar “{deleteTarget.name}”?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {deleteTaskCount + deleteEvaluationCount > 0
                  ? `También se eliminarán ${deleteTaskCount} ${
                      deleteTaskCount === 1 ? 'tarea' : 'tareas'
                    } y ${deleteEvaluationCount} ${
                      deleteEvaluationCount === 1 ? 'evaluación' : 'evaluaciones'
                    } asociadas. Esta acción no se puede deshacer.`
                  : 'Esta asignatura no tiene tareas ni evaluaciones asociadas. Esta acción no se puede deshacer.'}
              </Typography>
            </Box>
          ) : ''
        }
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
