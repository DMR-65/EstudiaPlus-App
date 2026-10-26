import { createMockEvaluations } from '@/data/mock-evaluations';
import { mockStudent } from '@/data/mock-student';
import { mockSubjects } from '@/data/mock-subjects';
import { createMockTasks } from '@/data/mock-tasks';
import type { AppData } from '@/types';
import {
  readFromStorage,
  STORAGE_KEYS,
  writeToStorage,
} from '@/services/local-storage.service';

export interface AcademicRepository {
  load(): AppData;
  save(data: AppData): void;
  reset(): AppData;
}

const DATA_VERSION = 1;

export function createInitialData(): AppData {
  return {
    version: DATA_VERSION,
    student: { ...mockStudent },
    subjects: mockSubjects.map((subject) => ({ ...subject })),
    tasks: createMockTasks(),
    evaluations: createMockEvaluations(),
  };
}

function isAppData(value: unknown): value is AppData {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<AppData>;
  return (
    candidate.version === DATA_VERSION &&
    typeof candidate.student === 'object' &&
    Array.isArray(candidate.subjects) &&
    Array.isArray(candidate.tasks) &&
    Array.isArray(candidate.evaluations)
  );
}

export const localAcademicRepository: AcademicRepository = {
  load() {
    const storedData = readFromStorage<unknown>(STORAGE_KEYS.data);
    if (isAppData(storedData)) {
      return storedData;
    }

    const initialData = createInitialData();
    try {
      localAcademicRepository.save(initialData);
    } catch {
      // La aplicación puede funcionar en memoria aunque el almacenamiento no esté disponible.
    }
    return initialData;
  },

  save(data) {
    writeToStorage(STORAGE_KEYS.data, data);
  },

  reset() {
    const initialData = createInitialData();
    localAcademicRepository.save(initialData);
    return initialData;
  },
};
