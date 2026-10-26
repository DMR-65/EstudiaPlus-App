import {
  Box,
  Button,
  ButtonBase,
  Card,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  BookPlus,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardPlus,
  Clock3,
  GraduationCap,
  ListTodo,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { PriorityChip, TaskStatusChip } from '@/components/common/StatusChips';
import { StatCard } from '@/components/common/StatCard';
import { SubjectLabel } from '@/components/common/SubjectLabel';
import { useAppData } from '@/features/app-data/AppDataContext';
import {
  calculateAcademicAverage,
  countOverdueTasks,
  countPendingTasks,
  countUpcomingEvaluations,
  formatGrade,
  getSubjectStats,
  isEvaluationUpcoming,
  isTaskCompleted,
  isTaskOverdue,
} from '@/utils/academic';
import { formatDate, getTodayInSantiago } from '@/utils/dates';
import { EVALUATION_TYPE_LABELS } from '@/utils/constants';

const quickActions = [
  {
    label: 'Crear asignatura',
    description: 'Agrega una nueva materia',
    icon: BookPlus,
    path: '/asignaturas?nueva=1',
    color: '#2563EB',
  },
  {
    label: 'Registrar tarea',
    description: 'Anota un nuevo trabajo',
    icon: ClipboardPlus,
    path: '/tareas?nueva=1',
    color: '#7C3AED',
  },
  {
    label: 'Registrar evaluación',
    description: 'Agenda una prueba o control',
    icon: CalendarPlus,
    path: '/evaluaciones?nueva=1',
    color: '#D97706',
  },
  {
    label: 'Ver calendario',
    description: 'Revisa tu mes completo',
    icon: CalendarDays,
    path: '/calendario',
    color: '#059669',
  },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { data } = useAppData();
  const today = getTodayInSantiago();
  const { student, subjects, tasks, evaluations } = data;

  const activeSubjects = subjects.filter((subject) => subject.isActive);
  const pendingTasks = countPendingTasks(tasks);
  const overdueTasks = countOverdueTasks(tasks, today);
  const upcomingEvaluations = countUpcomingEvaluations(evaluations, today);
  const average = calculateAcademicAverage(evaluations);
  const gradedCount = evaluations.filter(
    (evaluation) => typeof evaluation.grade === 'number',
  ).length;

  const nextTasks = tasks
    .filter((task) => !isTaskCompleted(task))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  const nextEvaluations = evaluations
    .filter((evaluation) => isEvaluationUpcoming(evaluation, today))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  const completedTasks = tasks.length - pendingTasks;
  const chartData = [
    { name: 'Completadas', value: completedTasks, color: '#16A34A' },
    { name: 'Pendientes', value: pendingTasks, color: '#F59E0B' },
  ];

  const firstName = student.name.split(' ')[0] ?? student.name;

  return (
    <Box>
      <PageHeader
        title={`Hola, ${firstName}`}
        subtitle="Este es el resumen de tu semana académica. Todo lo importante, en un vistazo."
        actions={
          <Button
            variant="contained"
            startIcon={<CalendarDays size={18} />}
            onClick={() => navigate('/calendario')}
          >
            Ver calendario
          </Button>
        }
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(5, minmax(0, 1fr))',
          },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          label="Total de asignaturas"
          value={subjects.length}
          helper={`${activeSubjects.length} activas`}
          icon={<BookOpen size={21} />}
          color="#2563EB"
        />
        <StatCard
          label="Tareas pendientes"
          value={pendingTasks}
          helper={overdueTasks > 0 ? `${overdueTasks} vencidas` : 'Todo al día'}
          icon={<ListTodo size={21} />}
          color={overdueTasks > 0 ? '#DC2626' : '#D97706'}
        />
        <StatCard
          label="Evaluaciones próximas"
          value={upcomingEvaluations}
          helper="Programadas desde hoy"
          icon={<ClipboardCheck size={21} />}
          color="#7C3AED"
        />
        <StatCard
          label="Tareas vencidas"
          value={overdueTasks}
          helper={overdueTasks > 0 ? 'Requieren atención' : 'Sin atrasos'}
          icon={<AlertTriangle size={21} />}
          color="#DC2626"
        />
        <StatCard
          label="Promedio académico"
          value={average !== null ? formatGrade(average) : '—'}
          helper={
            gradedCount > 0
              ? `${gradedCount} ${gradedCount === 1 ? 'nota registrada' : 'notas registradas'}`
              : 'Sin calificaciones'
          }
          icon={<GraduationCap size={21} />}
          color="#059669"
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.35fr) minmax(0, 1fr)' },
          gap: 2.5,
          mb: 2.5,
        }}
      >
        <SectionCard
          title="Próximas tareas"
          subtitle="Trabajos pendientes ordenados por fecha de entrega"
          action={
            <Button
              size="small"
              endIcon={<ArrowRight size={16} />}
              onClick={() => navigate('/tareas')}
            >
              Ver todas
            </Button>
          }
        >
          {nextTasks.length === 0 ? (
            <EmptyState
              compact
              icon={<CheckCircle2 size={24} />}
              title="No tienes tareas pendientes"
              description="Cuando registres una tarea, aparecerá aquí."
              action={
                <Button variant="outlined" onClick={() => navigate('/tareas?nueva=1')}>
                  Registrar tarea
                </Button>
              }
            />
          ) : (
            <Stack spacing={1.25}>
              {nextTasks.map((task) => {
                const subject = subjects.find((item) => item.id === task.subjectId);
                const overdue = isTaskOverdue(task, today);

                return (
                  <ButtonBase
                    key={task.id}
                    onClick={() => navigate(`/tareas?editar=${task.id}`)}
                    sx={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      p: 1.5,
                      borderRadius: 2.5,
                      border: '1px solid',
                      borderColor: overdue ? 'error.light' : 'divider',
                      bgcolor: overdue ? 'rgba(220, 38, 38, 0.035)' : 'transparent',
                      transition: 'background-color 0.15s ease, border-color 0.15s ease',
                      '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.light' },
                    }}
                  >
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      spacing={1}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                          <SubjectLabel subject={subject} />
                          {overdue && (
                            <Chip
                              label="Vencida"
                              color="error"
                              size="small"
                              variant="outlined"
                              sx={{ height: 21, fontSize: '0.7rem' }}
                            />
                          )}
                        </Stack>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                          {task.title}
                        </Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                          <Clock3 size={13} color="#64748B" />
                          <Typography variant="caption" color="text.secondary">
                            Entrega: {formatDate(task.dueDate)}
                          </Typography>
                        </Stack>
                      </Box>
                      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                        <PriorityChip priority={task.priority} />
                        <TaskStatusChip status={task.status} />
                      </Stack>
                    </Stack>
                  </ButtonBase>
                );
              })}
            </Stack>
          )}
        </SectionCard>

        <SectionCard
          title="Próximas evaluaciones"
          subtitle="Pruebas, controles y trabajos programados"
          action={
            <Button
              size="small"
              endIcon={<ArrowRight size={16} />}
              onClick={() => navigate('/evaluaciones')}
            >
              Ver todas
            </Button>
          }
        >
          {nextEvaluations.length === 0 ? (
            <EmptyState
              compact
              icon={<ClipboardCheck size={24} />}
              title="Sin evaluaciones próximas"
              description="No hay evaluaciones programadas desde hoy."
              action={
                <Button variant="outlined" onClick={() => navigate('/evaluaciones?nueva=1')}>
                  Registrar evaluación
                </Button>
              }
            />
          ) : (
            <Stack spacing={1.25}>
              {nextEvaluations.map((evaluation) => {
                const subject = subjects.find((item) => item.id === evaluation.subjectId);
                return (
                  <ButtonBase
                    key={evaluation.id}
                    onClick={() => navigate(`/evaluaciones?editar=${evaluation.id}`)}
                    sx={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      p: 1.5,
                      borderRadius: 2.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.light' },
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      <Box sx={{ minWidth: 0 }}>
                        <SubjectLabel subject={subject} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 0.5 }} noWrap>
                          {evaluation.title}
                        </Typography>
                      </Box>
                      <Chip
                        label={EVALUATION_TYPE_LABELS[evaluation.type]}
                        size="small"
                        variant="outlined"
                        sx={{ height: 23, flexShrink: 0 }}
                      />
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.75 }}>
                      <CalendarDays size={13} color="#64748B" />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(evaluation.date)}
                      </Typography>
                      {evaluation.weighting !== undefined && (
                        <Typography variant="caption" color="text.secondary">
                          · {evaluation.weighting}% de ponderación
                        </Typography>
                      )}
                    </Stack>
                  </ButtonBase>
                );
              })}
            </Stack>
          )}
        </SectionCard>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(0, 1.35fr)' },
          gap: 2.5,
          mb: 2.5,
        }}
      >
        <SectionCard
          title="Actividad académica"
          subtitle="Tareas completadas frente a pendientes"
        >
          {tasks.length === 0 ? (
            <EmptyState
              compact
              icon={<ListTodo size={24} />}
              title="Sin actividad todavía"
              description="Registra tus primeras tareas para ver tu progreso."
            />
          ) : (
            <Box sx={{ position: 'relative' }}>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={90}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" iconSize={9} />
                </PieChart>
              </ResponsiveContainer>
              <Box
                sx={{
                  position: 'absolute',
                  top: 89,
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {tasks.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  tareas
                </Typography>
              </Box>
            </Box>
          )}
        </SectionCard>

        <SectionCard
          title="Accesos rápidos"
          subtitle="Crea o revisa tu información académica en segundos"
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
              gap: 1.5,
            }}
          >
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <ButtonBase
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    p: 1.75,
                    borderRadius: 2.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { borderColor: 'primary.light', bgcolor: 'action.hover' },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        bgcolor: `${action.color}14`,
                        color: action.color,
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} />
                    </Box>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {action.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {action.description}
                      </Typography>
                    </Box>
                    <ChevronRight size={17} color="#94A3B8" />
                  </Stack>
                </ButtonBase>
              );
            })}
          </Box>
        </SectionCard>
      </Box>

      <SectionCard
        title="Resumen por asignatura"
        subtitle="Estado de tus asignaturas activas"
        action={
          <Button
            size="small"
            endIcon={<ArrowRight size={16} />}
            onClick={() => navigate('/asignaturas')}
          >
            Gestionar
          </Button>
        }
      >
        {activeSubjects.length === 0 ? (
          <EmptyState
            compact
            icon={<BookOpen size={24} />}
            title="No hay asignaturas activas"
            description="Crea o activa una asignatura para comenzar a organizar tus tareas."
            action={
              <Button variant="outlined" onClick={() => navigate('/asignaturas?nueva=1')}>
                Crear asignatura
              </Button>
            }
          />
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              gap: 1.5,
            }}
          >
            {activeSubjects.map((subject) => {
              const stats = getSubjectStats(subject.id, tasks, evaluations);
              return (
                <Card
                  key={subject.id}
                  variant="outlined"
                  sx={{
                    boxShadow: 'none',
                    borderColor: 'divider',
                    borderLeft: `4px solid ${subject.color}`,
                  }}
                >
                  <Box sx={{ p: 1.75 }}>
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                          {subject.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap display="block">
                          {subject.teacher}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        aria-label={`Ver tareas de ${subject.name}`}
                        onClick={() => navigate(`/tareas?asignatura=${subject.id}`)}
                      >
                        <ChevronRight size={18} />
                      </IconButton>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ mt: 1.25 }} flexWrap="wrap" useFlexGap>
                      <Chip
                        label={`${stats.pendingTasks} tareas pendientes`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={`${stats.pendingEvaluations} evaluaciones`}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                  </Box>
                </Card>
              );
            })}
          </Box>
        )}
      </SectionCard>
    </Box>
  );
}
