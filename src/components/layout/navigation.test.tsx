import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderApp } from '@/test/renderApp';

describe('navegación principal', () => {
  it('navega por todas las secciones del menú', async () => {
    const user = userEvent.setup();
    renderApp('/');

    expect(await screen.findByRole('heading', { name: /Hola, Martina/ })).toBeInTheDocument();

    const sections = [
      { menu: 'Perfil del estudiante', heading: 'Perfil del estudiante' },
      { menu: 'Asignaturas', heading: 'Asignaturas' },
      { menu: 'Tareas', heading: 'Tareas' },
      { menu: 'Evaluaciones', heading: 'Evaluaciones' },
      { menu: 'Calendario', heading: 'Calendario académico' },
      { menu: 'Inicio', heading: /Hola, Martina/ },
    ];

    for (const section of sections) {
      await user.click(screen.getByRole('button', { name: section.menu }));
      expect(
        await screen.findByRole('heading', { name: section.heading }),
      ).toBeInTheDocument();
    }
  });
});
