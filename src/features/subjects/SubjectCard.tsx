import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ClipboardCheck,
  ListTodo,
  Pencil,
  Trash2,
  UserRound,
} from 'lucide-react';
import type { Subject, SubjectStats } from '@/types';

interface SubjectCardProps {
  subject: Subject;
  stats: SubjectStats;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

export function SubjectCard({
  subject,
  stats,
  onEdit,
  onDelete,
  onToggleActive,
}: SubjectCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        opacity: subject.isActive ? 1 : 0.72,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 5,
          bgcolor: subject.color,
        },
      }}
    >
      <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
          <Stack direction="row" spacing={1.25} sx={{ minWidth: 0 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                bgcolor: `${subject.color}16`,
                color: subject.color,
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: subject.color,
                }}
              />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontSize: '1.05rem', lineHeight: 1.3 }}>
                {subject.name}
              </Typography>
              <Chip
                label={subject.isActive ? 'Activa' : 'Inactiva'}
                color={subject.isActive ? 'success' : 'default'}
                size="small"
                variant="outlined"
                sx={{ mt: 0.75, height: 22 }}
              />
            </Box>
          </Stack>
          <Tooltip title={subject.isActive ? 'Desactivar asignatura' : 'Activar asignatura'}>
            <Switch
              checked={subject.isActive}
              onChange={onToggleActive}
              slotProps={{
                input: { 'aria-label': `Alternar estado de ${subject.name}` },
              }}
            />
          </Tooltip>
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1.75,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 40,
          }}
        >
          {subject.description}
        </Typography>

        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 1.5 }}>
          <UserRound size={15} color="#64748B" />
          <Typography variant="caption" color="text.secondary" noWrap>
            {subject.teacher}
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          <Chip
            icon={<ListTodo size={14} />}
            label={`${stats.totalTasks} tareas`}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<ClipboardCheck size={14} />}
            label={`${stats.totalEvaluations} evaluaciones`}
            size="small"
            variant="outlined"
          />
          {stats.pendingTasks > 0 && (
            <Chip
              label={`${stats.pendingTasks} pendientes`}
              size="small"
              color="warning"
              variant="outlined"
            />
          )}
        </Stack>

        <Box sx={{ mt: 'auto' }}>
          <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {stats.completedTasks} de {stats.totalTasks} tareas completadas
            </Typography>
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Editar asignatura">
                <IconButton onClick={onEdit} size="small" aria-label={`Editar ${subject.name}`}>
                  <Pencil size={17} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar asignatura">
                <IconButton
                  onClick={onDelete}
                  size="small"
                  color="error"
                  aria-label={`Eliminar ${subject.name}`}
                >
                  <Trash2 size={17} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
          <Button
            size="small"
            fullWidth
            variant="outlined"
            onClick={onEdit}
            sx={{ mt: 1.5 }}
          >
            Ver y editar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
