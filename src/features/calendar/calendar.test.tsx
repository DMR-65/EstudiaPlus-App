import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderApp } from '@/test/renderApp';

describe('calendario académico', () => {
  it('muestra tareas y evaluaciones y permite abrir su detalle', async () => {
    const user = userEvent.setup();
    renderApp('/calendario');

    expect(
      await screen.findByRole('heading', { name: 'Calendario académico' }),
    ).toBeInTheDocument();

    const taskEvent = await screen.findByRole('button', {
      name: 'Leer el capítulo 3 del libro',
    });
    await user.click(taskEvent);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Leer el capítulo 3 del libro')).toBeInTheDocument();
    expect(within(dialog).getByText('Tarea')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Cerrar' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Vista de agenda' }));

    expect(
      await screen.findByText('Prueba de tablas de multiplicar'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Resolver ejercicios de multiplicación'),
    ).toBeInTheDocument();
  });

  it('filtra eventos por tipo', async () => {
    const user = userEvent.setup();
    renderApp('/calendario');

    expect(
      await screen.findByText('Leer el capítulo 3 del libro'),
    ).toBeInTheDocument();

    await user.click(screen.getByLabelText('Tipo de evento'));
    await user.click(await screen.findByRole('option', { name: 'Solo evaluaciones' }));

    await waitFor(() => {
      expect(
        screen.queryByText('Leer el capítulo 3 del libro'),
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByText('Prueba de tablas de multiplicar'),
    ).toBeInTheDocument();
  });

  it('crea una tarea desde el calendario y la refleja al volver', async () => {
    const user = userEvent.setup();
    renderApp('/calendario');

    await user.click(
      await screen.findByRole('button', { name: 'Nueva tarea en esta fecha' }),
    );
    const dialog = await screen.findByRole('dialog');
    await user.type(
      within(dialog).getByLabelText('Título de la tarea'),
      'Tarea creada desde el calendario',
    );
    await user.type(
      within(dialog).getByLabelText('Descripción'),
      'Actividad registrada usando la fecha preseleccionada.',
    );
    await user.click(within(dialog).getByRole('button', { name: 'Crear tarea' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Calendario' }));

    expect(
      (await screen.findAllByText('Tarea creada desde el calendario')).length,
    ).toBeGreaterThan(0);
  });
});
