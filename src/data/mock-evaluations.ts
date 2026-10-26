import type { Evaluation } from '@/types';
import { addDaysToDateOnly, getTodayInSantiago } from '@/utils/dates';

function relativeDate(days: number): string {
  return addDaysToDateOnly(getTodayInSantiago(), days);
}

export function createMockEvaluations(): Evaluation[] {
  return [
    {
      id: 'eval-tablas',
      title: 'Prueba de tablas de multiplicar',
      description: 'Evaluación escrita de las tablas del 2 al 9 con ejercicios de aplicación.',
      subjectId: 'sub-matematica',
      type: 'prueba',
      date: relativeDate(4),
      weighting: 25,
      maxScore: 40,
      status: 'programada',
    },
    {
      id: 'eval-comprension',
      title: 'Control de comprensión lectora',
      description: 'Preguntas de comprensión sobre el texto “El árbol viajero”.',
      subjectId: 'sub-lenguaje',
      type: 'control',
      date: relativeDate(-8),
      weighting: 20,
      grade: 6.2,
      maxScore: 30,
      status: 'revisada',
    },
    {
      id: 'eval-sistema-solar',
      title: 'Evaluación del sistema solar',
      description: 'Presentación de la maqueta y explicación oral de los planetas.',
      subjectId: 'sub-ciencias',
      type: 'trabajo',
      date: relativeDate(10),
      weighting: 20,
      maxScore: 50,
      status: 'programada',
    },
    {
      id: 'eval-pueblos',
      title: 'Exposición sobre pueblos originarios',
      description: 'Exposición grupal sobre una cultura originaria y su legado.',
      subjectId: 'sub-historia',
      type: 'exposicion',
      date: relativeDate(-5),
      weighting: 15,
      maxScore: 30,
      status: 'realizada',
    },
    {
      id: 'eval-vocabulario',
      title: 'Prueba de vocabulario en inglés',
      description: 'Vocabulario de animales, colores y partes de la casa.',
      subjectId: 'sub-ingles',
      type: 'prueba',
      date: relativeDate(7),
      weighting: 15,
      maxScore: 25,
      status: 'programada',
    },
    {
      id: 'eval-expresion',
      title: 'Trabajo de expresión escrita',
      description: 'Escritura de un relato breve a partir de una imagen.',
      subjectId: 'sub-lenguaje',
      type: 'trabajo',
      date: relativeDate(-20),
      weighting: 10,
      grade: 6.5,
      maxScore: 40,
      status: 'revisada',
    },
  ];
}
