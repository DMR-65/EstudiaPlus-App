import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  CalendarDays,
  ClipboardCheck,
  Pencil,
  Percent,
  Star,
  Trash2,
} from 'lucide-react';
import {
  EvaluationStatusChip,
  EvaluationTypeChip,
} from '@/components/common/StatusChips';
import { SubjectLabel } from '@/components/common/SubjectLabel';
import type { Evaluation, Subject } from '@/types';
import { formatGrade, isEvaluationUpcoming } from '@/utils/academic';
import { formatDate, getTodayInSantiago } from '@/utils/dates';

interface EvaluationCardProps {
  evaluation: Evaluation;
  subject?: Subject;
  onEdit: () => void;
  onDelete: () => void;
  onGrade: () => void;
}

export function EvaluationCard({
  evaluation,
  subject,
  onEdit,
  onDelete,
  onGrade,
}: EvaluationCardProps) {
  const today = getTodayInSantiago();
  const upcoming = isEvaluationUpcoming(evaluation, today);
  const isProgrammed = evaluation.status === 'programada';
  const hasGrade = typeof evaluation.grade === 'number';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 4,
          bgcolor: subject?.color ?? 'primary.main',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            <EvaluationTypeChip type={evaluation.type} />
            <EvaluationStatusChip status={evaluation.status} />
            {upcoming && (
              <Chip
                label={evaluation.date === today ? 'Hoy' : 'Próxima'}
                color="primary"
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
          <Stack direction="row" spacing={0.25}>
            <Tooltip title="Editar evaluación">
              <IconButton
                size="small"
                onClick={onEdit}
                aria-label={`Editar ${evaluation.title}`}
              >
                <Pencil size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar evaluación">
              <IconButton
                size="small"
                color="error"
                onClick={onDelete}
                aria-label={`Eliminar ${evaluation.title}`}
              >
                <Trash2 size={16} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Box sx={{ mt: 1.5 }}>
          <SubjectLabel subject={subject} />
          <Typography variant="h6" sx={{ fontSize: '1.05rem', mt: 0.5 }}>
            {evaluation.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: 40,
            }}
          >
            {evaluation.description}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <CalendarDays size={14} color="#64748B" />
            <Typography variant="caption" color="text.secondary">
              {formatDate(evaluation.date)}
            </Typography>
          </Stack>
          {evaluation.weighting !== undefined && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Percent size={14} color="#64748B" />
              <Typography variant="caption" color="text.secondary">
                {evaluation.weighting}% ponderación
              </Typography>
            </Stack>
          )}
          {evaluation.maxScore !== undefined && (
            <Typography variant="caption" color="text.secondary">
              Puntaje máximo: {evaluation.maxScore}
            </Typography>
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 'auto' }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2.5,
              bgcolor: hasGrade ? '#F0FDF4' : '#F8FAFC',
              color: hasGrade ? 'success.dark' : 'text.secondary',
              border: '1px solid',
              borderColor: hasGrade ? '#BBF7D0' : 'divider',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            {hasGrade ? (
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'success.dark' }}>
                {formatGrade(evaluation.grade)}
              </Typography>
            ) : (
              <ClipboardCheck size={22} />
            )}
          </Box>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Calificación
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {hasGrade
                ? 'Registrada'
                : isProgrammed
                  ? 'Se registrará al rendir la evaluación'
                  : 'Pendiente de registrar'}
            </Typography>
          </Box>
        </Stack>

        {!isProgrammed && (
          <Button
            size="small"
            variant="outlined"
            fullWidth
            startIcon={<Star size={15} />}
            onClick={onGrade}
            sx={{ mt: 2 }}
          >
            {hasGrade ? 'Editar calificación' : 'Registrar calificación'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
