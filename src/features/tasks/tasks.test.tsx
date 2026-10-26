import { cleanup, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { localAcademicRepository } from '@/services/app-data.repository';
import { renderApp } from '@/test/renderApp';

describe('gestión de tareas', () => {
  it('valida el formulario y crea una tarea persistente', async () => {
    const user = userEvent.setup();
    renderApp('/tareas');

    await user.click(await screen.findByRole('button', { name: 'Nueva tarea' }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Crear tarea' }));

    expect(
      await within(dialog).findByText('El título debe tener al menos 3 caracteres.'),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText('La descripción debe tener al menos 5 caracteres.'),
    ).toBeInTheDocument();

    await user.type(
      within(dialog).getByLabelText('Título de la tarea'),
      'Preparar exposición de ciencias',
    );
    await user.type(
      within(dialog).getByLabelText('Descripción'),
      'Preparar laminas y materiales para presentar el experimento.',
    );
    await user.click(within(dialog).getByRole('button', { name: 'Crear tarea' }));

    expect(await screen.findByText('Preparar exposición de ciencias')).toBeInTheDocument();
    expect(
      localAcademicRepository
        .load()
        .tasks.some((task) => task.title === 'Preparar exposición de ciencias'),
    ).toBe(true);

    cleanup();
    renderApp('/tareas');

    expect(
      await screen.findByText('Preparar exposición de ciencias'),
    ).toBeInTheDocument();
  });

  it('permite marcar una tarea como completada y editarla', async () => {
    const user = userEvent.setup();
    renderApp('/tareas');

    await user.click(
      await screen.findByRole('button', {
        name: 'Marcar Leer el capítulo 3 del libro como completada',
      }),
    );

    await waitFor(() => {
      const task = localAcademicRepository
        .load()
        .tasks.find((item) => item.id === 'task-lectura');
      expect(task?.status).toBe('completada');
    });

    await user.click(
      screen.getByRole('button', { name: 'Editar Leer el capítulo 3 del libro' }),
    );
    const dialog = await screen.findByRole('dialog');
    const titleInput = within(dialog).getByLabelText('Título de la tarea');
    await user.clear(titleInput);
    await user.type(titleInput, 'Leer el capítulo final del libro');
    await user.click(within(dialog).getByRole('button', { name: 'Guardar cambios' }));

    expect(await screen.findByText('Leer el capítulo final del libro')).toBeInTheDocument();
  });

  it('busca tareas por título y evidencia las vencidas', async () => {
    const user = userEvent.setup();
    renderApp('/tareas');

    expect(await screen.findByText('Resolver ejercicios de multiplicación')).toBeInTheDocument();
    expect(screen.getAllByText('Vencida').length).toBeGreaterThan(0);

    const searchInput = screen.getByPlaceholderText('Buscar por título');
    await user.type(searchInput, 'sistema solar');

    expect(searchInput).toHaveValue('sistema solar');
    expect(await screen.findByText('1 de 7 tareas')).toBeInTheDocument();
    expect(
      screen.getByText('Preparar una maqueta del sistema solar'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Resolver ejercicios de multiplicación'),
    ).not.toBeInTheDocument();
  });
});
