import Chip from '@mui/material/Chip';
import type { ChipProps } from '@mui/material/Chip';
import type { EvaluationStatus, EvaluationType, TaskPriority, TaskStatus } from '@/types';
import {
  EVALUATION_STATUS_LABELS,
  EVALUATION_TYPE_LABELS,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from '@/utils/constants';

const priorityColors: Record<TaskPriority, ChipProps['color']> = {
  baja: 'success',
  media: 'warning',
  alta: 'error',
};

const taskStatusColors: Record<TaskStatus, ChipProps['color']> = {
  pendiente: 'warning',
  en_progreso: 'info',
  completada: 'success',
};

const evaluationStatusColors: Record<EvaluationStatus, ChipProps['color']> = {
  programada: 'info',
  realizada: 'warning',
  revisada: 'success',
};

export function PriorityChip({ priority }: { priority: TaskPriority }) {
  return (
    <Chip
      label={TASK_PRIORITY_LABELS[priority]}
      color={priorityColors[priority]}
      size="small"
      variant="outlined"
    />
  );
}

export function TaskStatusChip({ status }: { status: TaskStatus }) {
  return (
    <Chip
      label={TASK_STATUS_LABELS[status]}
      color={taskStatusColors[status]}
      size="small"
      variant="outlined"
    />
  );
}

export function EvaluationStatusChip({ status }: { status: EvaluationStatus }) {
  return (
    <Chip
      label={EVALUATION_STATUS_LABELS[status]}
      color={evaluationStatusColors[status]}
      size="small"
      variant="outlined"
    />
  );
}

export function EvaluationTypeChip({ type }: { type: EvaluationType }) {
  return <Chip label={EVALUATION_TYPE_LABELS[type]} size="small" variant="outlined" />;
}
