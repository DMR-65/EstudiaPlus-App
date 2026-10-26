import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Pencil,
  Trash2,
} from 'lucide-react';
import { PriorityChip } from '@/components/common/StatusChips';
import { SubjectLabel } from '@/components/common/SubjectLabel';
import type { Subject, Task, TaskStatus } from '@/types';
import { isTaskDueSoon, isTaskOverdue } from '@/utils/academic';
import { TASK_STATUS_LABELS } from '@/utils/constants';
import { formatDate } from '@/utils/dates';

interface TaskCardProps {
  task: Task;
  subject?: Subject;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: TaskStatus) => void;
  today: string;
}

export function TaskCard({
  task,
  subject,
  onEdit,
  onDelete,
  onStatusChange,
  today,
}: TaskCardProps) {
  const completed = task.status === 'completada';
  const overdue = isTaskOverdue(task, today);
  const dueSoon = isTaskDueSoon(task, today);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        opacity: completed ? 0.72 : 1,
        borderColor: overdue ? 'error.light' : dueSoon ? 'warning.light' : 'divider',
      }}
    >
      <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Tooltip title={completed ? 'Marcar como pendiente' : 'Marcar como completada'}>
            <IconButton
              onClick={() => onStatusChange(completed ? 'pendiente' : 'completada')}
              aria-label={
                completed
                  ? `Marcar ${task.title} como pendiente`
                  : `Marcar ${task.title} como completada`
              }
              sx={{ mt: -0.5, color: completed ? 'success.main' : 'text.secondary' }}
            >
              {completed ? <CheckCircle2 size={23} /> : <Circle size={23} />}
            </IconButton>
          </Tooltip>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <SubjectLabel subject={subject} />
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.02rem',
                mt: 0.5,
                textDecoration: completed ? 'line-through' : 'none',
              }}
            >
              {task.title}
            </Typography>
          </Box>

          <Stack direction="row" spacing={0.25}>
            <Tooltip title="Editar tarea">
              <IconButton size="small" onClick={onEdit} aria-label={`Editar ${task.title}`}>
                <Pencil size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar tarea">
              <IconButton
                size="small"
                color="error"
                onClick={onDelete}
                aria-label={`Eliminar ${task.title}`}
              >
                <Trash2 size={16} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1.25,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 40,
          }}
        >
          {task.description}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
          <PriorityChip priority={task.priority} />
          {overdue && (
            <Chip label="Vencida" color="error" size="small" variant="outlined" />
          )}
          {dueSoon && !overdue && (
            <Chip
              label="Vence pronto"
              color="warning"
              size="small"
              variant="outlined"
              icon={<Clock3 size={13} />}
            />
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={0.75}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <CalendarDays size={14} color="#64748B" />
            <Typography variant="caption" color="text.secondary">
              Asignada: {formatDate(task.assignedDate)}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Clock3 size={14} color={overdue ? '#DC2626' : '#64748B'} />
            <Typography
              variant="caption"
              color={overdue ? 'error.main' : 'text.secondary'}
              sx={{ fontWeight: overdue ? 600 : 400 }}
            >
              Entrega: {formatDate(task.dueDate)}
            </Typography>
          </Stack>
        </Stack>

        <Select
          value={task.status}
          onChange={(event) => onStatusChange(event.target.value as TaskStatus)}
          size="small"
          fullWidth
          aria-label={`Cambiar estado de ${task.title}`}
          sx={{ mt: 2 }}
        >
          {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </CardContent>
    </Card>
  );
}
