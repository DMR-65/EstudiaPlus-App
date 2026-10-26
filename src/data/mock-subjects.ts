import type { Subject } from '@/types';

export const mockSubjects: Subject[] = [
  {
    id: 'sub-matematica',
    name: 'Matemática',
    description: 'Números, operaciones básicas, geometría y resolución de problemas.',
    teacher: 'Profesora Paula Rojas',
    color: '#2563EB',
    isActive: true,
  },
  {
    id: 'sub-lenguaje',
    name: 'Lenguaje y Comunicación',
    description: 'Lectura, escritura y expresión oral para comprender el mundo.',
    teacher: 'Profesor Andrés Silva',
    color: '#7C3AED',
    isActive: true,
  },
  {
    id: 'sub-ciencias',
    name: 'Ciencias Naturales',
    description: 'Exploración del entorno, los seres vivos y el sistema solar.',
    teacher: 'Profesora Daniela Muñoz',
    color: '#059669',
    isActive: true,
  },
  {
    id: 'sub-historia',
    name: 'Historia, Geografía y Ciencias Sociales',
    description: 'Pueblos originarios, territorio y vida en comunidad.',
    teacher: 'Profesor Felipe Torres',
    color: '#D97706',
    isActive: true,
  },
  {
    id: 'sub-ingles',
    name: 'Inglés',
    description: 'Vocabulario, pronunciación y primeras conversaciones.',
    teacher: 'Teacher Camila Pérez',
    color: '#DB2777',
    isActive: true,
  },
  {
    id: 'sub-artes',
    name: 'Artes Visuales',
    description: 'Expresión creativa con color, forma y materiales.',
    teacher: 'Profesora Javiera Soto',
    color: '#0891B2',
    isActive: true,
  },
];
