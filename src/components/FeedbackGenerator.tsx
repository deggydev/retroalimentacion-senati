import { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { Card, Button, Select } from './ui';
import type { Student, WorkType, FeedbackTemplate, FeedbackCategory } from '../types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../types';

interface FeedbackGeneratorProps {
  students: Student[];
  workTypes: WorkType[];
  templates: FeedbackTemplate[];
  header: string;
  footer: string;
  onCopy: () => void;
}

const categories: FeedbackCategory[] = ['excelente', 'bueno', 'regular', 'debe_mejorar', 'no_presento'];

export function FeedbackGenerator({ students, workTypes, templates, header, footer, onCopy }: FeedbackGeneratorProps) {
  const [selectedWorkType, setSelectedWorkType] = useState('');
  const [activeCategory, setActiveCategory] = useState<FeedbackCategory>('excelente');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const workType = useMemo(() => workTypes.find(w => w.id === selectedWorkType), [workTypes, selectedWorkType]);

  const activeTemplate = useMemo(() => {
    return templates.find(t => t.category === activeCategory);
  }, [templates, activeCategory]);

  const generateFeedback = (student: Student) => {
    if (!workType || !activeTemplate) return '';

    const workTypeLower = workType.name.toLowerCase();
    const article = ['a', 'e', 'i', 'o', 'u'].includes(workTypeLower[0]) ? 'el' : 'su';
    const headerText = header.replace('{nombre}', student.name);

    return `${headerText}

Se revisó ${article} ${workTypeLower}. ${activeTemplate.content}

${footer}`;
  };

  const handleCopy = async (student: Student) => {
    const feedback = generateFeedback(student);
    if (feedback) {
      await navigator.clipboard.writeText(feedback);
      setCopiedId(student.id);
      onCopy();
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  return (
    <Card title="Generador de Retroalimentación" icon="mdi:message-text">
      <div className="space-y-4">
        <Select
          label="Tipo de Trabajo"
          value={selectedWorkType}
          onChange={(e) => setSelectedWorkType(e.target.value)}
          options={workTypes.map(w => ({ value: w.id, label: w.name }))}
          placeholder="Seleccionar tipo..."
        />

        <div className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700 pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeCategory === cat
                  ? 'bg-senati text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {activeTemplate && (
          <div className={`p-3 rounded-lg border text-sm ${CATEGORY_COLORS[activeCategory]}`}>
            <span className="font-medium">Plantilla activa:</span> {activeTemplate.content.substring(0, 80)}...
          </div>
        )}

        {students.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Icon icon="mdi:account-off" className="text-4xl mx-auto mb-2 text-gray-300" />
            <p>No hay estudiantes importados</p>
          </div>
        ) : !selectedWorkType ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Icon icon="mdi:briefcase-outline" className="text-4xl mx-auto mb-2 text-gray-300" />
            <p>Selecciona un tipo de trabajo para generar comentarios</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">
                      {student.code}
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{student.name}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={copiedId === student.id ? 'success' : 'primary'}
                  icon={copiedId === student.id ? 'mdi:check' : 'mdi:content-copy'}
                  onClick={() => handleCopy(student)}
                  disabled={!activeTemplate}
                >
                  {copiedId === student.id ? 'Copiado' : 'Copiar'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
