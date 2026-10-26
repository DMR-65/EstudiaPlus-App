import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { localAcademicRepository } from '@/services/app-data.repository';
import { renderApp } from '@/test/renderApp';

describe('gestión de evaluaciones', () => {
  it('muestra el promedio solo con calificaciones registradas', async () => {
    renderApp('/evaluaciones');

    expect(await screen.findByText('6,4')).toBeInTheDocument();
    expect(
      screen.getByText('2 notas registradas · Escala 1,0 a 7,0'),
    ).toBeInTheDocument();
  });

  it('registra una calificación y actualiza el estado y el promedio', async () => {
    const user = userEvent.setup();
    renderApp('/evaluaciones');

    await user.click(
      await screen.findByRole('button', { name: 'Registrar calificación' }),
    );
    const dialog = await screen.findByRole('dialog');
    const gradeInput = within(dialog).getByLabelText('Calificación');

    await user.type(gradeInput, '8');
    await user.click(
      within(dialog).getByRole('button', { name: 'Guardar calificación' }),
    );
    expect(
      await within(dialog).findByText('La calificación debe estar entre 1,0 y 7,0.'),
    ).toBeInTheDocument();

    await user.clear(gradeInput);
    await user.type(gradeInput, '5.9');
    await user.click(
      within(dialog).getByRole('button', { name: 'Guardar calificación' }),
    );

    expect(await screen.findByText('5,9')).toBeInTheDocument();
    expect((await screen.findAllByText('6,2')).length).toBeGreaterThan(1);

    await waitFor(() => {
      const evaluation = localAcademicRepository
        .load()
        .evaluations.find((item) => item.id === 'eval-pueblos');
      expect(evaluation?.grade).toBe(5.9);
      expect(evaluation?.status).toBe('revisada');
    });
  });

  it('crea una evaluación programada sin inventar una calificación', async () => {
    const user = userEvent.setup();
    renderApp('/evaluaciones');

    await user.click(await screen.findByRole('button', { name: 'Nueva evaluación' }));
    const dialog = await screen.findByRole('dialog');
    await user.type(
      within(dialog).getByLabelText('Título de la evaluación'),
      'Proyecto de ciencias',
    );
    await user.type(
      within(dialog).getByLabelText('Descripción'),
      'Presentar un proyecto sobre energías renovables.',
    );
    await user.click(
      within(dialog).getByRole('button', { name: 'Crear evaluación' }),
    );

    expect(await screen.findByText('Proyecto de ciencias')).toBeInTheDocument();
    const evaluation = localAcademicRepository
      .load()
      .evaluations.find((item) => item.title === 'Proyecto de ciencias');
    expect(evaluation?.status).toBe('programada');
    expect(evaluation?.grade).toBeUndefined();
  });
});
