import type {
  CalendarEvent,
  Evaluation,
  SubjectStats,
  Task,
} from '@/types';
import {
  DUE_SOON_DAYS,
  GRADE_SCALE,
  UPCOMING_EVENT_DAYS,
} from '@/utils/constants';
import { daysFromToday, getTodayInSantiago } from '@/utils/dates';

export interface GradeScale {
  min: number;
  max: number;
  passing: number;
}

export function isTaskCompleted(task: Task): boolean {
  return task.status === 'completada';
}

export function isTaskOverdue(task: Task, today = getTodayInSantiago()): boolean {
  return !isTaskCompleted(task) && task.dueDate < today;
}

export function isTaskDueSoon(task: Task, today = getTodayInSantiago()): boolean {
  if (isTaskCompleted(task)) {
    return false;
  }

  const days = daysFromToday(task.dueDate, today);
  return days >= 0 && days <= DUE_SOON_DAYS;
}

export function isEvaluationUpcoming(
  evaluation: Evaluation,
  today = getTodayInSantiago(),
): boolean {
  return evaluation.status === 'programada' && evaluation.date >= today;
}

export function isCalendarEventUpcoming(
  event: CalendarEvent,
  today = getTodayInSantiago(),
): boolean {
  if (event.kind === 'task' && event.completed) {
    return false;
  }

  const days = daysFromToday(event.date, today);
  return days >= 0 && days <= UPCOMING_EVENT_DAYS;
}

export function calculateAverage(
  grades: Array<number | undefined>,
  scale: GradeScale = GRADE_SCALE,
): number | null {
  const validGrades = grades.filter(
    (grade): grade is number =>
      typeof grade === 'number' &&
      Number.isFinite(grade) &&
      grade >= scale.min &&
      grade <= scale.max,
  );

  if (validGrades.length === 0) {
    return null;
  }

  const average = validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length;
  return Math.round(average * 10) / 10;
}

export function calculateAcademicAverage(
  evaluations: Evaluation[],
  scale: GradeScale = GRADE_SCALE,
): number | null {
  return calculateAverage(
    evaluations.map((evaluation) => evaluation.grade),
    scale,
  );
}

export function formatGrade(grade: number | null | undefined): string {
  if (typeof grade !== 'number' || !Number.isFinite(grade)) {
    return 'Sin calificaciones';
  }

  return grade.toFixed(1).replace('.', ',');
}

export function getSubjectStats(
  subjectId: string,
  tasks: Task[],
  evaluations: Evaluation[],
): SubjectStats {
  const subjectTasks = tasks.filter((task) => task.subjectId === subjectId);
  const subjectEvaluations = evaluations.filter(
    (evaluation) => evaluation.subjectId === subjectId,
  );

  return {
    totalTasks: subjectTasks.length,
    pendingTasks: subjectTasks.filter((task) => !isTaskCompleted(task)).length,
    completedTasks: subjectTasks.filter(isTaskCompleted).length,
    totalEvaluations: subjectEvaluations.length,
    pendingEvaluations: subjectEvaluations.filter(
      (evaluation) => evaluation.status === 'programada',
    ).length,
  };
}

export function countPendingTasks(tasks: Task[]): number {
  return tasks.filter((task) => !isTaskCompleted(task)).length;
}

export function countOverdueTasks(tasks: Task[], today = getTodayInSantiago()): number {
  return tasks.filter((task) => isTaskOverdue(task, today)).length;
}

export function countUpcomingEvaluations(
  evaluations: Evaluation[],
  today = getTodayInSantiago(),
): number {
  return evaluations.filter((evaluation) => isEvaluationUpcoming(evaluation, today)).length;
}

export function buildCalendarEvents(
  tasks: Task[],
  evaluations: Evaluation[],
): CalendarEvent[] {
  const taskEvents: CalendarEvent[] = tasks.map((task) => ({
    id: task.id,
    kind: 'task',
    title: task.title,
    subjectId: task.subjectId,
    date: task.dueDate,
    completed: isTaskCompleted(task),
  }));

  const evaluationEvents: CalendarEvent[] = evaluations.map((evaluation) => ({
    id: evaluation.id,
    kind: 'evaluation',
    title: evaluation.title,
    subjectId: evaluation.subjectId,
    date: evaluation.date,
    completed: evaluation.status === 'revisada',
  }));

  return [...taskEvents, ...evaluationEvents].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

export function getNextEvaluation(
  evaluations: Evaluation[],
  today = getTodayInSantiago(),
): Evaluation | undefined {
  return evaluations
    .filter((evaluation) => isEvaluationUpcoming(evaluation, today))
    .sort((a, b) => a.date.localeCompare(b.date))[0];
}
