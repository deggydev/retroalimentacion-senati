import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { FeedbackTemplate, FeedbackCategory } from '../types';

const DEFAULT_TEMPLATES: FeedbackTemplate[] = [
  {
    id: '1',
    category: 'excelente',
    content: 'El trabajo evidencia un excelente dominio de los contenidos, una organización impecable y un análisis profundo. Felicitaciones por su destacado desempeño. Continúe así.',
  },
  {
    id: '2',
    category: 'bueno',
    content: 'El trabajo evidencia un buen desarrollo de los contenidos y una adecuada organización de las ideas. Continúe manteniendo este nivel de desempeño.',
  },
  {
    id: '3',
    category: 'regular',
    content: 'El trabajo cumple con los requisitos básicos, pero presenta algunas áreas de mejora en cuanto a profundidad y organización. Se recomienda revisar las observaciones realizadas.',
  },
  {
    id: '4',
    category: 'debe_mejorar',
    content: 'El trabajo presenta deficiencias significativas en contenido y estructura. Es necesario revisar los criterios de evaluación y mejorar en las próximas entregas.',
  },
  {
    id: '5',
    category: 'no_presento',
    content: 'No se registra la entrega del trabajo solicitado. Se recomienda comunicarse con el docente para conocer las opciones disponibles.',
  },
];

export function useTemplates() {
  const [templates, setTemplates] = useLocalStorage<FeedbackTemplate[]>('templates', DEFAULT_TEMPLATES);

  const addTemplate = useCallback((category: FeedbackCategory, content: string) => {
    const newTemplate: FeedbackTemplate = {
      id: crypto.randomUUID(),
      category,
      content: content.trim(),
    };
    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  }, [setTemplates]);

  const updateTemplate = useCallback((id: string, updates: Partial<Omit<FeedbackTemplate, 'id'>>) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [setTemplates]);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  }, [setTemplates]);

  const getTemplatesByCategory = useCallback((category: FeedbackCategory) => {
    return templates.filter(t => t.category === category);
  }, [templates]);

  return {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplatesByCategory,
  };
}
