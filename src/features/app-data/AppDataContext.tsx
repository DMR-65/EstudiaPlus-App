import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useFeedback } from '@/components/feedback/FeedbackProvider';
import { localAcademicRepository } from '@/services/app-data.repository';
import type {
  AppData,
  Evaluation,
  EvaluationDraft,
  StudentDraft,
  Subject,
  SubjectDraft,
  Task,
  TaskDraft,
} from '@/types';
import { createId } from '@/utils/id';

interface AppDataContextValue {
  data: AppData;
  createSubject: (draft: SubjectDraft) => boolean;
  updateSubject: (id: string, draft: SubjectDraft) => boolean;
  deleteSubject: (id: string) => boolean;
  createTask: (draft: TaskDraft) => boolean;
  updateTask: (id: string, draft: TaskDraft) => boolean;
  deleteTask: (id: string) => boolean;
  createEvaluation: (draft: EvaluationDraft) => boolean;
  updateEvaluation: (id: string, draft: EvaluationDraft) => boolean;
  deleteEvaluation: (id: string) => boolean;
  updateStudent: (student: StudentDraft) => boolean;
  restoreDemoData: () => boolean;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => localAcademicRepository.load());
  const { notify } = useFeedback();

  const commit = useCallback(
    (nextData: AppData): boolean => {
      try {
        localAcademicRepository.save(nextData);
        setData(nextData);
        return true;
      } catch {
        notify(
          'No se pudieron guardar los cambios en el almacenamiento local. Inténtalo nuevamente.',
          'error',
        );
        return false;
      }
    },
    [notify],
  );

  const createSubject = useCallback(
    (draft: SubjectDraft) => {
      const subject: Subject = { ...draft, id: createId() };
      return commit({ ...data, subjects: [...data.subjects, subject] });
    },
    [commit, data],
  );

  const updateSubject = useCallback(
    (id: string, draft: SubjectDraft) =>
      commit({
        ...data,
        subjects: data.subjects.map((subject) =>
          subject.id === id ? { ...draft, id } : subject,
        ),
      }),
    [commit, data],
  );

  const deleteSubject = useCallback(
    (id: string) =>
      commit({
        ...data,
        subjects: data.subjects.filter((subject) => subject.id !== id),
        tasks: data.tasks.filter((task) => task.subjectId !== id),
        evaluations: data.evaluations.filter(
          (evaluation) => evaluation.subjectId !== id,
        ),
      }),
    [commit, data],
  );

  const createTask = useCallback(
    (draft: TaskDraft) => {
      const task: Task = { ...draft, id: createId() };
      return commit({ ...data, tasks: [...data.tasks, task] });
    },
    [commit, data],
  );

  const updateTask = useCallback(
    (id: string, draft: TaskDraft) =>
      commit({
        ...data,
        tasks: data.tasks.map((task) => (task.id === id ? { ...draft, id } : task)),
      }),
    [commit, data],
  );

  const deleteTask = useCallback(
    (id: string) =>
      commit({
        ...data,
        tasks: data.tasks.filter((task) => task.id !== id),
      }),
    [commit, data],
  );

  const createEvaluation = useCallback(
    (draft: EvaluationDraft) => {
      const evaluation: Evaluation = { ...draft, id: createId() };
      return commit({
        ...data,
        evaluations: [...data.evaluations, evaluation],
      });
    },
    [commit, data],
  );

  const updateEvaluation = useCallback(
    (id: string, draft: EvaluationDraft) =>
      commit({
        ...data,
        evaluations: data.evaluations.map((evaluation) =>
          evaluation.id === id ? { ...draft, id } : evaluation,
        ),
      }),
    [commit, data],
  );

  const deleteEvaluation = useCallback(
    (id: string) =>
      commit({
        ...data,
        evaluations: data.evaluations.filter((evaluation) => evaluation.id !== id),
      }),
    [commit, data],
  );

  const updateStudent = useCallback(
    (student: StudentDraft) => commit({ ...data, student }),
    [commit, data],
  );

  const restoreDemoData = useCallback(() => {
    try {
      const initialData = localAcademicRepository.reset();
      setData(initialData);
      return true;
    } catch {
      notify('No fue posible restaurar los datos de demostración.', 'error');
      return false;
    }
  }, [notify]);

  const value: AppDataContextValue = {
    data,
    createSubject,
    updateSubject,
    deleteSubject,
    createTask,
    updateTask,
    deleteTask,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation,
    updateStudent,
    restoreDemoData,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData debe usarse dentro de AppDataProvider.');
  }

  return context;
}
