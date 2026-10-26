import type {
  EvaluationStatus,
  EvaluationType,
  TaskPriority,
  TaskStatus,
} from '@/types';

export const APP_NAME = 'Estudia+';
export const TIME_ZONE = 'America/Santiago';

export const SUBJECT_COLORS = [
  '#2563EB',
  '#7C3AED',
  '#059669',
  '#D97706',
  '#DB2777',
  '#0891B2',
  '#DC2626',
  '#4F46E5',
];

export const GRADE_SCALE = {
  min: 1,
  max: 7,
  passing: 4,
} as const;

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completada: 'Completada',
};

export const EVALUATION_TYPE_LABELS: Record<EvaluationType, string> = {
  prueba: 'Prueba',
  control: 'Control',
  trabajo: 'Trabajo',
  exposicion: 'Exposición',
  otro: 'Otro',
};

export const EVALUATION_STATUS_LABELS: Record<EvaluationStatus, string> = {
  programada: 'Programada',
  realizada: 'Realizada',
  revisada: 'Revisada',
};

export const DUE_SOON_DAYS = 3;
export const UPCOMING_EVENT_DAYS = 7;
