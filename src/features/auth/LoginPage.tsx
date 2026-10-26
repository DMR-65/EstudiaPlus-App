import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BookOpenCheck,
  CalendarCheck2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  Target,
} from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { loginSchema } from '@/features/auth/loginSchema';
import type { LoginFormValues } from '@/features/auth/loginSchema';
import { useAuth } from '@/features/auth/AuthContext';

const features = [
  {
    icon: BookOpenCheck,
    title: 'Tus asignaturas, siempre a mano',
    description: 'Organiza materias, docentes y colores en un solo lugar.',
  },
  {
    icon: CalendarCheck2,
    title: 'Tareas y evaluaciones sin sorpresas',
    description: 'Revisa fechas, prioridades y recordatorios de tu semana.',
  },
  {
    icon: Target,
    title: 'Sigue tu progreso académico',
    description: 'Consulta tus notas y detecta lo que necesitas reforzar.',
  },
];

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
    mode: 'onTouched',
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = (values: LoginFormValues) => {
    login(values.username, remember);
    navigate('/', { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 470 }}>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 3 }}>
            <Logo size={44} />
          </Box>

          <Card sx={{ boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)' }}>
            <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
              <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 3 }}>
                <Logo size={44} />
              </Box>
              <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.7rem', sm: '2rem' } }}>
                Bienvenido a Estudia+
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75, mb: 3 }}>
                Organiza tus estudios en un solo lugar
              </Typography>

              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={2}>
                  <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="login-username"
                        label="Usuario o correo electrónico"
                        placeholder="martina.gonzalez@example.com"
                        autoComplete="username"
                        autoFocus
                        fullWidth
                        error={Boolean(errors.username)}
                        helperText={errors.username?.message}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Mail size={18} color="#64748B" />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="login-password"
                        label="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        fullWidth
                        error={Boolean(errors.password)}
                        helperText={errors.password?.message}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockKeyhole size={18} color="#64748B" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword((current) => !current)}
                                  edge="end"
                                  aria-label={
                                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                                  }
                                >
                                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    )}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={remember}
                        onChange={(event) => setRemember(event.target.checked)}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" color="text.secondary">
                        Mantener mi sesión en este dispositivo
                      </Typography>
                    }
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{ mt: 0.5, py: 1.25 }}
                  >
                    Ingresar
                  </Button>
                </Stack>
              </Box>

              <Box
                sx={{
                  mt: 3,
                  p: 1.75,
                  borderRadius: 2.5,
                  bgcolor: '#EFF6FF',
                  border: '1px solid #DBEAFE',
                }}
              >
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <Sparkles size={17} color="#2563EB" style={{ marginTop: 2, flexShrink: 0 }} />
                  <Typography variant="body2" color="text.secondary">
                    Ingresa cualquier usuario y contraseña para continuar. Esta es una
                    demostración con datos ficticios y sin autenticación real.
                  </Typography>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          p: 6,
          color: '#FFFFFF',
          background:
            'linear-gradient(145deg, #1E3A8A 0%, #2563EB 55%, #3B82F6 100%)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 420,
            height: 420,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            top: -160,
            right: -120,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 280,
            height: 280,
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            bottom: -80,
            left: -80,
          }}
        />
        <Box sx={{ position: 'relative', maxWidth: 520 }}>
          <Typography
            variant="overline"
            sx={{ color: 'rgba(255,255,255,0.72)', letterSpacing: '0.14em' }}
          >
            Tu año académico, organizado
          </Typography>
          <Typography
            variant="h2"
            sx={{ mt: 1.5, mb: 2, fontSize: { md: '2.8rem', lg: '3.4rem' }, lineHeight: 1.08 }}
          >
            Aprende con calma.
            <br />
            Avanza con claridad.
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.82)', mb: 4 }}>
            Estudia+ reúne tus asignaturas, tareas, evaluaciones y calendario para que
            puedas concentrarte en lo importante: aprender.
          </Typography>

          <Stack spacing={2.25}>
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Stack key={feature.title} direction="row" spacing={1.75}>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2.25,
                      bgcolor: 'rgba(255,255,255,0.14)',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={21} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)', mt: 0.25 }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </Stack>
              );
            })}
          </Stack>
        </Box>
        <Typography
          variant="caption"
          sx={{ position: 'absolute', bottom: 24, color: 'rgba(255,255,255,0.55)' }}
        >
          Estudia+ · Prototipo funcional con datos ficticios
        </Typography>
      </Box>
    </Box>
  );
}
