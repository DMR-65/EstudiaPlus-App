import type { Task } from '@/types';
import { addDaysToDateOnly, getTodayInSantiago } from '@/utils/dates';

function relativeDate(days: number): string {
  return addDaysToDateOnly(getTodayInSantiago(), days);
}

export function createMockTasks(): Task[] {
  return [
    {
      id: 'task-multiplicacion',
      title: 'Resolver ejercicios de multiplicación',
      description:
        'Completar las páginas 42 y 43 del cuaderno de ejercicios y revisar las tablas del 6 al 9.',
      subjectId: 'sub-matematica',
      assignedDate: relativeDate(-10),
      dueDate: relativeDate(-3),
      priority: 'alta',
      status: 'pendiente',
    },
    {
      id: 'task-lectura',
      title: 'Leer el capítulo 3 del libro',
      description:
        'Leer el capítulo 3 de “Las aventuras de Martina” y anotar tres ideas principales.',
      subjectId: 'sub-lenguaje',
      assignedDate: relativeDate(-4),
      dueDate: relativeDate(1),
      priority: 'media',
      status: 'en_progreso',
    },
    {
      id: 'task-maqueta',
      title: 'Preparar una maqueta del sistema solar',
      description:
        'Construir una maqueta con los ocho planetas, sus nombres y una breve descripción.',
      subjectId: 'sub-ciencias',
      assignedDate: relativeDate(-6),
      dueDate: relativeDate(5),
      priority: 'alta',
      status: 'pendiente',
    },
    {
      id: 'task-culturas',
      title: 'Investigar las culturas originarias',
      description:
        'Buscar información sobre los pueblos originarios de Chile y preparar un resumen ilustrado.',
      subjectId: 'sub-historia',
      assignedDate: relativeDate(-18),
      dueDate: relativeDate(-7),
      priority: 'media',
      status: 'completada',
    },
    {
      id: 'task-vocabulario',
      title: 'Practicar vocabulario de animales en inglés',
      description:
        'Repasar la lista de 15 animales y escribir una oración con cada uno de los cinco favoritos.',
      subjectId: 'sub-ingles',
      assignedDate: relativeDate(-2),
      dueDate: relativeDate(9),
      priority: 'baja',
      status: 'pendiente',
    },
    {
      id: 'task-collage',
      title: 'Crear un collage con materiales reciclados',
      description:
        'Diseñar un collage inspirado en la naturaleza usando papeles, tapas y revistas.',
      subjectId: 'sub-artes',
      assignedDate: relativeDate(-5),
      dueDate: relativeDate(2),
      priority: 'media',
      status: 'pendiente',
    },
    {
      id: 'task-problemas',
      title: 'Problemas de suma y resta',
      description:
        'Resolver la guía de problemas cotidianos y explicar el procedimiento de dos de ellos.',
      subjectId: 'sub-matematica',
      assignedDate: relativeDate(-14),
      dueDate: relativeDate(-9),
      priority: 'baja',
      status: 'completada',
    },
  ];
}
