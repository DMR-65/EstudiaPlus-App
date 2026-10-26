export const TASK_PRIORITIES = ['baja', 'media', 'alta'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_STATUSES = ['pendiente', 'en_progreso', 'completada'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const EVALUATION_TYPES = ['prueba', 'control', 'trabajo', 'exposicion', 'otro'] as const;
export type EvaluationType = (typeof EVALUATION_TYPES)[number];

export const EVALUATION_STATUSES = ['programada', 'realizada', 'revisada'] as const;
export type EvaluationStatus = (typeof EVALUATION_STATUSES)[number];

export const SHIFTS = ['Mañana', 'Tarde'] as const;
export type Shift = (typeof SHIFTS)[number];

export interface Student {
  name: string;
  course: string;
  school: string;
  academicYear: number;
  email: string;
  guardianName: string;
  shift: Shift;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  teacher: string;
  color: string;
  isActive: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  assignedDate: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface Evaluation {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  type: EvaluationType;
  date: string;
  weighting?: number;
  grade?: number;
  maxScore?: number;
  status: EvaluationStatus;
}

export interface AppData {
  version: number;
  student: Student;
  subjects: Subject[];
  tasks: Task[];
  evaluations: Evaluation[];
}

export interface Session {
  user: string;
  loggedInAt: string;
}

export type SubjectDraft = Omit<Subject, 'id'>;
export type TaskDraft = Omit<Task, 'id'>;
export type EvaluationDraft = Omit<Evaluation, 'id'>;
export type StudentDraft = Student;

export interface SubjectStats {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  totalEvaluations: number;
  pendingEvaluations: number;
}

export interface DeletionSummary {
  tasks: number;
  evaluations: number;
}

export type CalendarEventKind = 'task' | 'evaluation';

export interface CalendarEvent {
  id: string;
  kind: CalendarEventKind;
  title: string;
  subjectId: string;
  date: string;
  completed: boolean;
}
