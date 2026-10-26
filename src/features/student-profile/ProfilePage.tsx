import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BookOpenCheck,
  CalendarClock,
  Clock3,
  GraduationCap,
  Mail,
  Pencil,
  RotateCcw,
  School,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { InitialsAvatar } from '@/components/common/InitialsAvatar';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { useFeedback } from '@/components/feedback/FeedbackProvider';
import { useAppData } from '@/features/app-data/AppDataContext';
import { studentSchema } from '@/features/student-profile/studentSchema';
import type { StudentFormValues } from '@/features/student-profile/studentSchema';
import { SHIFTS } from '@/types';
import type { ReactNode } from 'react';

interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value: string | number;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          bgcolor: '#EFF6FF',
          color: 'primary.main',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.15 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

export function ProfilePage() {
  const { data, updateStudent, restoreDemoData } = useAppData();
  const { notify } = useFeedback();
  const [editing, setEditing] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const { student } = data;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      ...student,
      academicYear: String(student.academicYear),
    },
    mode: 'onTouched',
  });

  const startEditing = () => {
    reset({ ...student, academicYear: String(student.academicYear) });
    setEditing(true);
  };

  const cancelEditing = () => {
    reset({ ...student, academicYear: String(student.academicYear) });
    setEditing(false);
  };

  const onSubmit = (values: StudentFormValues) => {
    const success = updateStudent({
      ...values,
      academicYear: Number(values.academicYear),
    });

    if (success) {
      notify('Perfil actualizado correctamente.');
      setEditing(false);
    }
  };

  const handleRestore = () => {
    const success = restoreDemoData();
    if (success) {
      setRestoreOpen(false);
      setEditing(false);
      notify('Datos de demostración restaurados correctamente.');
    }
  };

  return (
    <Box>
      <PageHeader
        title="Perfil del estudiante"
        subtitle="Consulta y actualiza tus datos académicos de demostración."
        actions={
          !editing && (
            <Button variant="contained" startIcon={<Pencil size={17} />} onClick={startEditing}>
              Editar perfil
            </Button>
          )
        }
      />

      {editing ? (
        <Card>
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
              <InitialsAvatar name={student.name} size={48} />
              <Box>
                <Typography variant="h6">Editar datos personales</Typography>
                <Typography variant="body2" color="text.secondary">
                  Los cambios se guardan en este dispositivo.
                </Typography>
              </Box>
            </Stack>

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                gap: 2,
              }}
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre completo"
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Correo electrónico"
                    type="email"
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="course"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Curso"
                    error={Boolean(errors.course)}
                    helperText={errors.course?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="school"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Establecimiento"
                    error={Boolean(errors.school)}
                    helperText={errors.school?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="academicYear"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Año académico"
                    inputMode="numeric"
                    error={Boolean(errors.academicYear)}
                    helperText={errors.academicYear?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="shift"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Jornada"
                    error={Boolean(errors.shift)}
                    helperText={errors.shift?.message}
                    fullWidth
                  >
                    {SHIFTS.map((shift) => (
                      <MenuItem key={shift} value={shift}>
                        {shift}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="guardianName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre del apoderado"
                    error={Boolean(errors.guardianName)}
                    helperText={errors.guardianName?.message}
                    fullWidth
                    sx={{ gridColumn: { sm: 'span 2' } }}
                  />
                )}
              />

              <Stack
                direction="row"
                spacing={1.5}
                justifyContent="flex-end"
                sx={{ gridColumn: { sm: 'span 2' }, mt: 1 }}
              >
                <Button
                  onClick={cancelEditing}
                  color="inherit"
                  startIcon={<X size={17} />}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  Guardar cambios
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.1fr) minmax(0, 0.9fr)' },
            gap: 2.5,
          }}
        >
          <Card
            sx={{
              background:
                'linear-gradient(135deg, #1E3A8A 0%, #2563EB 62%, #3B82F6 100%)',
              color: '#FFFFFF',
              border: 'none',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                width: 280,
                height: 280,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.08)',
                top: -100,
                right: -80,
              }}
            />
            <CardContent sx={{ p: { xs: 3, md: 4 }, position: 'relative' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <InitialsAvatar
                  name={student.name}
                  size={82}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.18)',
                    color: '#FFFFFF',
                    border: '2px solid rgba(255,255,255,0.4)',
                  }}
                />
                <Box>
                  <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.72)' }}>
                    Estudiante
                  </Typography>
                  <Typography variant="h4" sx={{ fontSize: { xs: '1.7rem', md: '2.1rem' } }}>
                    {student.name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.82)', mt: 0.5 }}>
                    {student.course} · {student.school}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.18)', my: 3 }} />

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                  gap: 2,
                }}
              >
                {[
                  { icon: <CalendarClock size={17} />, label: 'Año académico', value: student.academicYear },
                  { icon: <Clock3 size={17} />, label: 'Jornada', value: student.shift },
                  { icon: <School size={17} />, label: 'Establecimiento', value: student.school },
                  { icon: <GraduationCap size={17} />, label: 'Curso', value: student.course },
                ].map((item) => (
                  <Stack key={item.label} direction="row" spacing={1.25} alignItems="center">
                    <Box sx={{ opacity: 0.8 }}>{item.icon}</Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Stack spacing={2.5}>
            <SectionCard title="Datos de contacto" subtitle="Información ficticia de la cuenta">
              <Stack spacing={2}>
                <InfoRow
                  icon={<Mail size={18} />}
                  label="Correo electrónico"
                  value={student.email}
                />
                <InfoRow
                  icon={<UsersRound size={18} />}
                  label="Apoderado"
                  value={student.guardianName}
                />
                <InfoRow
                  icon={<UserRound size={18} />}
                  label="Jornada"
                  value={student.shift}
                />
              </Stack>
            </SectionCard>

            <SectionCard
              title="Datos de demostración"
              subtitle="Restaura la información original del prototipo"
            >
              <Stack spacing={1.5}>
                <Typography variant="body2" color="text.secondary">
                  Esta acción reemplaza el perfil, las asignaturas, las tareas y las
                  evaluaciones por los datos iniciales de ejemplo. No cierra tu sesión.
                </Typography>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<RotateCcw size={17} />}
                  onClick={() => setRestoreOpen(true)}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Restaurar datos de demostración
                </Button>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BookOpenCheck size={15} color="#64748B" />
                  <Typography variant="caption" color="text.secondary">
                    Todos los datos son ficticios y se guardan en localStorage.
                  </Typography>
                </Stack>
              </Stack>
            </SectionCard>
          </Stack>
        </Box>
      )}

      <ConfirmDialog
        open={restoreOpen}
        title="¿Restaurar los datos de demostración?"
        description="Se eliminarán los cambios que hayas realizado en el perfil, asignaturas, tareas y evaluaciones. Esta acción no se puede deshacer."
        confirmLabel="Sí, restaurar"
        confirmColor="warning"
        onConfirm={handleRestore}
        onClose={() => setRestoreOpen(false)}
      />
    </Box>
  );
}
