import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { localAuthRepository } from '@/services/auth.repository';
import { renderApp } from '@/test/renderApp';

describe('autenticación simulada', () => {
  it('valida que usuario y contraseña no estén vacíos', async () => {
    const user = userEvent.setup();
    renderApp('/login', { authenticated: false });

    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(
      await screen.findByText('Ingresa tu usuario o correo electrónico.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Ingresa tu contraseña.')).toBeInTheDocument();
    expect(screen.queryByText(/Hola, Martina/)).not.toBeInTheDocument();
  });

  it('permite ingresar con cualquier credencial no vacía y guarda la sesión', async () => {
    const user = userEvent.setup();
    renderApp('/login', { authenticated: false });

    await user.type(
      screen.getByLabelText('Usuario o correo electrónico'),
      'estudiante.prueba',
    );
    await user.type(screen.getByLabelText('Contraseña'), 'cualquier-clave');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(
      await screen.findByRole('heading', { name: /Hola, Martina/ }),
    ).toBeInTheDocument();
    expect(localAuthRepository.load()?.user).toBe('estudiante.prueba');
  });

  it('permite cerrar sesión desde el menú de usuario', async () => {
    const user = userEvent.setup();
    renderApp('/');

    await user.click(screen.getByRole('button', { name: 'Abrir menú de usuario' }));
    await user.click(screen.getByRole('menuitem', { name: 'Cerrar sesión' }));

    expect(
      await screen.findByRole('heading', { name: 'Bienvenido a Estudia+' }),
    ).toBeInTheDocument();
    expect(localAuthRepository.load()).toBeNull();
  });

  it('redirige al login cuando se accede a una ruta protegida sin sesión', async () => {
    renderApp('/tareas', { authenticated: false });

    expect(
      await screen.findByRole('heading', { name: 'Bienvenido a Estudia+' }),
    ).toBeInTheDocument();
  });
});
