export interface Student {
  id: string;
  code: string;
  name: string;
}

export interface WorkType {
  id: string;
  name: string;
}

export interface FeedbackTemplate {
  id: string;
  category: 'excelente' | 'bueno' | 'regular' | 'debe_mejorar' | 'no_presento';
  content: string;
}

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
