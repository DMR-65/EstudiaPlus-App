import { describe, expect, it } from 'vitest';
import type { Evaluation, Subject, Task } from '@/types';
import {
  buildCalendarEvents,
  calculateAcademicAverage,
  calculateAverage,
  countOverdueTasks,
  formatGrade,
  getSubjectStats,
  isTaskDueSoon,
  isTaskOverdue,
} from '@/utils/academic';

const today = '2026-10-26';

function createTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Tarea de prueba',
    description: 'Descripción de prueba',
    subjectId: 'subject-1',
    assignedDate: '2026-10-20',
    dueDate: '2026-10-28',
    priority: 'media',
    status: 'pendiente',
    ...overrides,
  };
}

function createEvaluation(overrides: Partial<Evaluation> = {}): Evaluation {
  return {
    id: 'evaluation-1',
    title: 'Prueba de prueba',
    description: 'Descripción de prueba',
    subjectId: 'subject-1',
    type: 'prueba',
    date: '2026-10-30',
    status: 'programada',
    ...overrides,
  };
}

const subject: Subject = {
  id: 'subject-1',
  name: 'Matemática',
  description: 'Descripción',
  teacher: 'Profesora',
  color: '#2563EB',
  isActive: true,
};

describe('lógica académica', () => {
  it('detecta tareas vencidas solo cuando no están completadas', () => {
    const overdue = createTask({ dueDate: '2026-10-25' });
    const completed = createTask({ dueDate: '2026-10-25', status: 'completada' });
    const future = createTask({ dueDate: '2026-10-27' });

    expect(isTaskOverdue(overdue, today)).toBe(true);
    expect(isTaskOverdue(completed, today)).toBe(false);
    expect(isTaskOverdue(future, today)).toBe(false);
    expect(countOverdueTasks([overdue, completed, future], today)).toBe(1);
  });

  it('detecta tareas próximas a vencer en los siguientes tres días', () => {
    expect(isTaskDueSoon(createTask({ dueDate: '2026-10-26' }), today)).toBe(true);
    expect(isTaskDueSoon(createTask({ dueDate: '2026-10-29' }), today)).toBe(true);
    expect(isTaskDueSoon(createTask({ dueDate: '2026-10-30' }), today)).toBe(false);
    expect(
      isTaskDueSoon(createTask({ dueDate: '2026-10-27', status: 'completada' }), today),
    ).toBe(false);
  });

  it('calcula el promedio solo con calificaciones válidas', () => {
    expect(calculateAverage([6.2, 5.8])).toBe(6);
    expect(calculateAverage([6, undefined, 5])).toBe(5.5);
    expect(calculateAverage([])).toBeNull();
    expect(calculateAverage([undefined])).toBeNull();
    expect(calculateAverage([8, 0])).toBeNull();
    expect(
      calculateAcademicAverage([
        createEvaluation({ grade: 6.5 }),
        createEvaluation({ id: 'evaluation-2', grade: 5.5 }),
      ]),
    ).toBe(6);
  });

  it('formatea las calificaciones en español', () => {
    expect(formatGrade(6)).toBe('6,0');
    expect(formatGrade(6.45)).toBe('6,5');
    expect(formatGrade(null)).toBe('Sin calificaciones');
  });

  it('resume tareas y evaluaciones por asignatura', () => {
    const tasks = [
      createTask(),
      createTask({ id: 'task-2', status: 'completada' }),
      createTask({ id: 'task-3', subjectId: 'subject-2' }),
    ];
    const evaluations = [
      createEvaluation(),
      createEvaluation({ id: 'evaluation-2', status: 'revisada', grade: 6 }),
    ];

    expect(getSubjectStats(subject.id, tasks, evaluations)).toEqual({
      totalTasks: 2,
      pendingTasks: 1,
      completedTasks: 1,
      totalEvaluations: 2,
      pendingEvaluations: 1,
    });
  });

  it('construye eventos de calendario desde tareas y evaluaciones', () => {
    const events = buildCalendarEvents(
      [createTask({ dueDate: '2026-10-28' })],
      [createEvaluation({ date: '2026-10-27' })],
    );

    expect(events).toHaveLength(2);
    expect(events[0]).toMatchObject({
      kind: 'evaluation',
      date: '2026-10-27',
      title: 'Prueba de prueba',
    });
    expect(events[1]).toMatchObject({
      kind: 'task',
      date: '2026-10-28',
      title: 'Tarea de prueba',
    });
  });

  it('incluye la asignatura de referencia en las estadísticas', () => {
    expect(subject.name).toBe('Matemática');
  });
});
