import { cleanup, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { createInitialData, localAcademicRepository } from '@/services/app-data.repository';
import { renderApp } from '@/test/renderApp';

describe('perfil del estudiante', () => {
  it('valida y guarda los cambios del perfil', async () => {
    const user = userEvent.setup();
    renderApp('/perfil');

    await user.click(await screen.findByRole('button', { name: 'Editar perfil' }));
    const emailInput = screen.getByLabelText('Correo electrónico');
    await user.clear(emailInput);
    await user.type(emailInput, 'correo-invalido');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(await screen.findByText('Ingresa un correo válido.')).toBeInTheDocument();

    await user.clear(emailInput);
    await user.type(emailInput, 'martina.nueva@example.com');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(await screen.findByText('Perfil actualizado correctamente.')).toBeInTheDocument();
    expect(
      screen.getByText('martina.nueva@example.com'),
    ).toBeInTheDocument();
    expect(
      localAcademicRepository.load().student.email,
    ).toBe('martina.nueva@example.com');

    cleanup();
    renderApp('/perfil');

    expect(
      await screen.findByText('martina.nueva@example.com'),
    ).toBeInTheDocument();
  });

  it('restaura los datos de demostración con confirmación', async () => {
    const user = userEvent.setup();
    const appData = createInitialData();
    appData.student = { ...appData.student, name: 'Nombre Temporal' };
    renderApp('/perfil', { appData });

    expect((await screen.findAllByText('Nombre Temporal')).length).toBeGreaterThan(0);
    await user.click(
      screen.getByRole('button', { name: 'Restaurar datos de demostración' }),
    );
    const dialog = await screen.findByRole('dialog');
    await user.click(
      within(dialog).getByRole('button', { name: 'Sí, restaurar' }),
    );

    expect((await screen.findAllByText('Martina González')).length).toBeGreaterThan(0);
    expect(localAcademicRepository.load().student.name).toBe('Martina González');
  });
});
