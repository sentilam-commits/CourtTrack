// Dummy data + global state for CourtTrack

const FOCUS_OPTIONS = [
  'Derecha', 'Revés', 'Volea', 'Bandeja', 'Víbora',
  'Saque', 'Resto', 'Posicionamiento', 'Defensa', 'Control de red',
  'Decisiones de partido', 'Consistencia'
];

const IMPROVED_OPTIONS = [
  'Timing', 'Punto de contacto', 'Control', 'Juego de pies', 'Confianza',
  'Paciencia', 'Posicionamiento', 'Consistencia', 'Recuperación tras golpe', 'Selección de golpe'
];

const CORRECTION_OPTIONS = [
  'Demasiado swing', 'Contacto tardío', 'Mala recuperación',
  'Demasiado cerca de la red', 'Demasiado atrás',
  'Apresurar el punto', 'Split step deficiente', 'Preparación de pala baja',
  'Mala decisión bajo presión', 'Falta de paciencia'
];

const HOMEWORK_OPTIONS = [
  '10 min de voleas en pared, 3x esta semana',
  '50 swings en sombra enfocando el punto de contacto',
  '3 series de 20 derechas controladas',
  '3 series de 20 revés controlados',
  'Practicar split step antes de cada golpe',
  'Ver 10 puntos pro: ataque vs defensa',
  'Práctica de saque: 30 saques de colocación',
  'Drill de footwork: 5 minutos al día',
  'Practicar el movimiento de recuperación tras bandeja',
  'Reflexión de partido: escribir 3 puntos apresurados'
];

const SKILLS = [
  'Derecha', 'Revés', 'Volea', 'Bandeja',
  'Posicionamiento', 'Toma de decisiones', 'Consistencia', 'Confianza en partido'
];

const LEVELS = ['Principiante', 'Intermedio', 'Avanzado'];
const CLASS_TYPES = ['Privada', 'Grupo', 'Análisis de partido'];
const FREQUENCIES = ['1x / semana', '2x / semana', '3x / semana', 'Ocasional'];

const INITIAL_STUDENTS = [
  {
    id: 's1',
    name: 'Benito Álvarez',
    contact: 'benito@mail.com',
    level: 'Intermedio',
    goal: 'Mejor control de red',
    frequency: '2x / semana',
    startDate: '2025-09-12',
    scores: { 'Derecha': 4, 'Revés': 3, 'Volea': 3, 'Bandeja': 2, 'Posicionamiento': 3, 'Toma de decisiones': 3, 'Consistencia': 4, 'Confianza en partido': 3 },
    classes: [
      {
        id: 'c1', date: '2026-05-06', type: 'Privada',
        focus: 'Volea', improved: ['Punto de contacto', 'Control'],
        correction: 'Demasiado swing',
        homework: '10 min de voleas en pared, 3x esta semana',
        nextFocus: 'Bandeja',
        note: 'Buen progreso hoy. Mantén la calma en la red.',
      },
      {
        id: 'c2', date: '2026-05-02', type: 'Privada',
        focus: 'Posicionamiento', improved: ['Juego de pies'],
        correction: 'Demasiado atrás',
        homework: 'Practicar split step antes de cada golpe',
        nextFocus: 'Volea',
        note: '',
      },
      {
        id: 'c3', date: '2026-04-28', type: 'Grupo',
        focus: 'Derecha', improved: ['Timing', 'Confianza'],
        correction: 'Contacto tardío',
        homework: '3 series de 20 derechas controladas',
        nextFocus: 'Posicionamiento',
        note: 'Derecha más sólida esta sesión.',
      },
    ],
  },
  {
    id: 's2',
    name: 'Lucía Romero',
    contact: '+34 612 90 88 21',
    level: 'Avanzado',
    goal: 'Recuperación de bandeja más nítida',
    frequency: '3x / semana',
    startDate: '2024-11-03',
    scores: { 'Derecha': 5, 'Revés': 4, 'Volea': 4, 'Bandeja': 4, 'Posicionamiento': 4, 'Toma de decisiones': 4, 'Consistencia': 4, 'Confianza en partido': 5 },
    classes: [
      {
        id: 'c4', date: '2026-05-05', type: 'Análisis de partido',
        focus: 'Decisiones de partido', improved: ['Selección de golpe', 'Paciencia'],
        correction: 'Apresurar el punto',
        homework: 'Ver 10 puntos pro: ataque vs defensa',
        nextFocus: 'Defensa',
        note: 'La claridad táctica mejora rápido.',
      },
      {
        id: 'c5', date: '2026-05-01', type: 'Privada',
        focus: 'Bandeja', improved: ['Recuperación tras golpe'],
        correction: 'Mala recuperación',
        homework: 'Practicar el movimiento de recuperación tras bandeja',
        nextFocus: 'Decisiones de partido',
        note: '',
      },
    ],
  },
  {
    id: 's3',
    name: 'Marco Lindholm',
    contact: 'marco.l@mail.com',
    level: 'Principiante',
    goal: 'Construir peloteos consistentes',
    frequency: '1x / semana',
    startDate: '2026-03-20',
    scores: { 'Derecha': 2, 'Revés': 2, 'Volea': 1, 'Bandeja': 1, 'Posicionamiento': 2, 'Toma de decisiones': 2, 'Consistencia': 2, 'Confianza en partido': 2 },
    classes: [
      {
        id: 'c6', date: '2026-05-04', type: 'Privada',
        focus: 'Revés', improved: ['Timing'],
        correction: 'Preparación de pala baja',
        homework: '50 swings en sombra enfocando el punto de contacto',
        nextFocus: 'Derecha',
        note: 'Mantén la pala arriba pronto.',
      },
    ],
  },
  {
    id: 's4',
    name: 'Aïsha Benhaddou',
    contact: 'aisha.b@mail.com',
    level: 'Intermedio',
    goal: 'Segundo saque más sólido',
    frequency: '2x / semana',
    startDate: '2025-06-15',
    scores: { 'Derecha': 3, 'Revés': 4, 'Volea': 3, 'Bandeja': 3, 'Posicionamiento': 4, 'Toma de decisiones': 3, 'Consistencia': 3, 'Confianza en partido': 3 },
    classes: [
      {
        id: 'c7', date: '2026-04-30', type: 'Privada',
        focus: 'Saque', improved: ['Confianza'],
        correction: 'Mala decisión bajo presión',
        homework: 'Práctica de saque: 30 saques de colocación',
        nextFocus: 'Resto',
        note: '',
      },
    ],
  },
];

// helper
function fmtDate(iso) {
  if (!iso) return '—';
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T00:00:00`) : new Date(iso);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}
function relDate(iso) {
  if (!iso) return '—';
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T00:00:00`) : new Date(iso);
  const now = new Date('2026-05-07');
  const diff = Math.round((now - d) / 86400000);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';
  if (diff < 7) return `hace ${diff}d`;
  if (diff < 30) return `hace ${Math.round(diff/7)}sem`;
  return fmtDate(iso);
}

Object.assign(window, {
  FOCUS_OPTIONS, IMPROVED_OPTIONS, CORRECTION_OPTIONS, HOMEWORK_OPTIONS,
  SKILLS, LEVELS, CLASS_TYPES, FREQUENCIES,
  INITIAL_STUDENTS, fmtDate, relDate,
});
