import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { createInitialData, localAcademicRepository } from '@/services/app-data.repository';
import { renderApp } from '@/test/renderApp';

describe('gestión de asignaturas', () => {
  it('crea y edita una asignatura, persistiendo los cambios', async () => {
    const user = userEvent.setup();
    renderApp('/asignaturas');

    expect(await screen.findByRole('heading', { name: 'Asignaturas' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Nueva asignatura' }));

    const createDialog = await screen.findByRole('dialog');
    await user.type(
      within(createDialog).getByLabelText('Nombre de la asignatura'),
      'Música',
    );
    await user.type(
      within(createDialog).getByLabelText('Descripción'),
      'Aprendizaje de ritmo, escucha y expresión musical.',
    );
    await user.type(
      within(createDialog).getByLabelText('Profesor ficticio'),
      'Profesora Valentina Paz',
    );
    await user.click(
      within(createDialog).getByRole('button', { name: 'Crear asignatura' }),
    );

    expect(await screen.findByText('Música')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    const storedAfterCreate = localAcademicRepository.load();
    expect(storedAfterCreate.subjects.some((subject) => subject.name === 'Música')).toBe(
      true,
    );

    await user.click(screen.getByRole('button', { name: 'Editar Música' }));
    const editDialog = await screen.findByRole('dialog');
    const nameInput = within(editDialog).getByLabelText('Nombre de la asignatura');
    await user.clear(nameInput);
    await user.type(nameInput, 'Música y Movimiento');
    await user.click(
      within(editDialog).getByRole('button', { name: 'Guardar cambios' }),
    );

    expect(await screen.findByText('Música y Movimiento')).toBeInTheDocument();
    expect(
      localAcademicRepository.load().subjects.find((subject) => subject.name === 'Música y Movimiento'),
    ).toBeDefined();
  });

  it('elimina una asignatura con confirmación', async () => {
    const user = userEvent.setup();
    renderApp('/asignaturas');

    await user.click(await screen.findByRole('button', { name: 'Eliminar Artes Visuales' }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText(/Artes Visuales/)).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Eliminar' }));

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: 'Eliminar Artes Visuales' }),
      ).not.toBeInTheDocument();
    });
    expect(
      localAcademicRepository.load().subjects.some(
        (subject) => subject.name === 'Artes Visuales',
      ),
    ).toBe(false);
  });

  it('elimina en cascada las tareas y evaluaciones asociadas', async () => {
    const user = userEvent.setup();
    const appData = createInitialData();
    appData.subjects.push({
      id: 'sub-musica',
      name: 'Música',
      description: 'Música y movimiento.',
      teacher: 'Profesora Valentina Paz',
      color: '#4F46E5',
      isActive: true,
    });
    appData.tasks.push({
      id: 'task-musica',
      title: 'Practicar la canción',
      description: 'Practicar la canción para la clase.',
      subjectId: 'sub-musica',
      assignedDate: '2026-10-20',
      dueDate: '2026-10-30',
      priority: 'media',
      status: 'pendiente',
    });
    appData.evaluations.push({
      id: 'eval-musica',
      title: 'Presentación musical',
      description: 'Presentar una canción en grupo.',
      subjectId: 'sub-musica',
      type: 'exposicion',
      date: '2026-11-02',
      status: 'programada',
    });

    renderApp('/asignaturas', { appData });

    await user.click(await screen.findByRole('button', { name: 'Eliminar Música' }));
    const dialog = await screen.findByRole('dialog');
    expect(
      within(dialog).getByText(/También se eliminarán 1 tarea y 1 evaluación/),
    ).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Eliminar' }));

    await waitFor(() => {
      const stored = localAcademicRepository.load();
      expect(stored.subjects.some((subject) => subject.id === 'sub-musica')).toBe(false);
      expect(stored.tasks.some((task) => task.subjectId === 'sub-musica')).toBe(false);
      expect(
        stored.evaluations.some((evaluation) => evaluation.subjectId === 'sub-musica'),
      ).toBe(false);
    });
  });
});
