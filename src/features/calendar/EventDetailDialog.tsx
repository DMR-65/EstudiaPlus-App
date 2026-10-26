import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { CalendarDays, Pencil, Percent } from 'lucide-react';
import {
  EvaluationStatusChip,
  EvaluationTypeChip,
  PriorityChip,
  TaskStatusChip,
} from '@/components/common/StatusChips';
import { SubjectLabel } from '@/components/common/SubjectLabel';
import type { CalendarEvent, Evaluation, Subject, Task } from '@/types';
import { formatGrade, isTaskOverdue } from '@/utils/academic';
import { formatDate, getTodayInSantiago } from '@/utils/dates';

interface EventDetailDialogProps {
  event: CalendarEvent | null;
  task?: Task;
  evaluation?: Evaluation;
  subject?: Subject;
  onClose: () => void;
  onEdit: () => void;
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.15 }}>
        {value}
      </Typography>
    </Box>
  );
}

export function EventDetailDialog({
  event,
  task,
  evaluation,
  subject,
  onClose,
  onEdit,
}: EventDetailDialogProps) {
  const today = getTodayInSantiago();

  return (
    <Dialog open={Boolean(event)} onClose={onClose} fullWidth maxWidth="xs">
      {event && (
        <>
          <DialogTitle sx={{ pb: 1 }}>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
              <Chip
                label={event.kind === 'task' ? 'Tarea' : 'Evaluación'}
                size="small"
                color={event.kind === 'task' ? 'primary' : 'secondary'}
                variant="outlined"
              />
              {task && <PriorityChip priority={task.priority} />}
              {task && <TaskStatusChip status={task.status} />}
              {evaluation && <EvaluationTypeChip type={evaluation.type} />}
              {evaluation && <EvaluationStatusChip status={evaluation.status} />}
              {task && isTaskOverdue(task, today) && (
                <Chip label="Vencida" size="small" color="error" variant="outlined" />
              )}
            </Stack>
            {event.title}
            <Box sx={{ mt: 1 }}>
              <SubjectLabel subject={subject} />
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            {task && (
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  {task.description}
                </Typography>
                <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                  <DetailRow label="Asignada" value={formatDate(task.assignedDate)} />
                  <DetailRow label="Entrega" value={formatDate(task.dueDate)} />
                </Stack>
              </Stack>
            )}

            {evaluation && (
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  {evaluation.description}
                </Typography>
                <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                  <DetailRow label="Fecha" value={formatDate(evaluation.date)} />
                  {evaluation.weighting !== undefined && (
                    <DetailRow
                      label="Ponderación"
                      value={`${evaluation.weighting}%`}
                    />
                  )}
                  {evaluation.maxScore !== undefined && (
                    <DetailRow
                      label="Puntaje máximo"
                      value={`${evaluation.maxScore} pts`}
                    />
                  )}
                  <DetailRow
                    label="Calificación"
                    value={
                      evaluation.grade !== undefined
                        ? formatGrade(evaluation.grade)
                        : 'Sin calificación'
                    }
                  />
                </Stack>
              </Stack>
            )}

            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={0.75} alignItems="center">
              <CalendarDays size={15} color="#64748B" />
              <Typography variant="body2" color="text.secondary">
                {formatDate(event.date)}
              </Typography>
              {evaluation?.weighting !== undefined && (
                <>
                  <Percent size={14} color="#64748B" style={{ marginLeft: 8 }} />
                  <Typography variant="body2" color="text.secondary">
                    {evaluation.weighting}%
                  </Typography>
                </>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={onClose} color="inherit">
              Cerrar
            </Button>
            <Button onClick={onEdit} variant="contained" startIcon={<Pencil size={16} />}>
              Editar
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
