export interface Student {
  id: string;
  code: string;
  name: string;
}

export interface SubWork {
  id: string;
  name: string;
  workTypeId: string;
}

export interface WorkType {
  id: string;
  name: string;
  icon: string;
}

export interface FeedbackTemplate {
  id: string;
  workTypeId: string;
  category: 'excelente' | 'bueno' | 'regular' | 'debe_mejorar' | 'no_presento';
  content: string;
}

export const DEFAULT_WORK_TYPES: WorkType[] = [
  { id: 'productos_academicos', name: 'Productos Académicos', icon: 'mdi:file-document' },
  { id: 'presentaciones', name: 'Presentaciones', icon: 'mdi:presentation' },
  { id: 'competencias_habilidades', name: 'Competencias y Habilidades', icon: 'mdi:head-cog' },
  { id: 'participacion', name: 'Participación', icon: 'mdi:hand-wave' },
  { id: 'plataformas_externas', name: 'Plataformas Externas', icon: 'mdi:web' },
];

export const DEFAULT_SUBWORKS: SubWork[] = [
  { id: 'informes', name: 'Informes', workTypeId: 'productos_academicos' },
  { id: 'informe_semanal', name: 'Informe Semanal', workTypeId: 'productos_academicos' },
  { id: 'tareas', name: 'Tareas', workTypeId: 'productos_academicos' },
  { id: 'entregable_final', name: 'Entregable Final', workTypeId: 'productos_academicos' },
  { id: 'proyecto_final', name: 'Proyecto Final', workTypeId: 'productos_academicos' },
  { id: 'exposiciones', name: 'Exposiciones', workTypeId: 'presentaciones' },
  { id: 'habilidades', name: 'Habilidades', workTypeId: 'competencias_habilidades' },
  { id: 'participacion_clase', name: 'Participación', workTypeId: 'participacion' },
  { id: 'plataforma_externa', name: 'Plataforma Externas', workTypeId: 'plataformas_externas' },
];

export type FeedbackCategory = FeedbackTemplate['category'];

export const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  excelente: 'Excelente',
  bueno: 'Bueno',
  regular: 'Regular',
  debe_mejorar: 'Debe mejorar',
  no_presento: 'No presentó',
};

export const CATEGORY_COLORS: Record<FeedbackCategory, string> = {
  excelente: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  bueno: 'bg-blue-100 text-blue-700 border-blue-300',
  regular: 'bg-amber-100 text-amber-700 border-amber-300',
  debe_mejorar: 'bg-orange-100 text-orange-700 border-orange-300',
  no_presento: 'bg-red-100 text-red-700 border-red-300',
};
