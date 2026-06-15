import { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { Card, Button, Select } from './ui';
import type { Student, SubWork, FeedbackTemplate, FeedbackCategory, WorkType } from '../types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../types';

interface FeedbackGeneratorProps {
  students: Student[];
  workTypes: WorkType[];
  subWorks: SubWork[];
  templates: FeedbackTemplate[];
  header: string;
  footer: string;
  onCopy: () => void;
}

const categories: FeedbackCategory[] = ['excelente', 'bueno', 'regular', 'debe_mejorar', 'no_presento'];

export function FeedbackGenerator({ students, workTypes, subWorks, templates, header, footer, onCopy }: FeedbackGeneratorProps) {
  const [selectedWorkTypeId, setSelectedWorkTypeId] = useState<string>('');
  const [selectedSubWorkId, setSelectedSubWorkId] = useState('');
  const [activeCategory, setActiveCategory] = useState<FeedbackCategory>('excelente');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedStudents, setCopiedStudents] = useState<Set<string>>(new Set());

  const filteredSubWorks = useMemo(() => 
    selectedWorkTypeId ? subWorks.filter(sw => sw.workTypeId === selectedWorkTypeId) : [],
    [subWorks, selectedWorkTypeId]
  );

  const selectedSubWork = useMemo(() => 
    subWorks.find(sw => sw.id === selectedSubWorkId),
    [subWorks, selectedSubWorkId]
  );

  const activeTemplate = useMemo(() => {
    if (!selectedWorkTypeId) return null;
    return templates.find(t => t.workTypeId === selectedWorkTypeId && t.category === activeCategory);
  }, [templates, selectedWorkTypeId, activeCategory]);

  const generateFeedback = (student: Student) => {
    if (!selectedSubWork || !activeTemplate) return '';

    const subWorkLower = selectedSubWork.name.toLowerCase();
    const article = ['a', 'e', 'i', 'o', 'u'].includes(subWorkLower[0]) ? 'el' : 'su';
    const headerText = header.replace('{nombre}', student.name);

    return `${headerText}

Se revisó ${article} ${subWorkLower}. ${activeTemplate.content}

${footer}`;
  };

  const handleCopy = async (student: Student) => {
    const feedback = generateFeedback(student);
    if (feedback) {
      await navigator.clipboard.writeText(feedback);
      setCopiedId(student.id);
      setCopiedStudents(prev => new Set(prev).add(student.id));
      onCopy();
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  const clearCopiedStudents = () => {
    setCopiedStudents(new Set());
  };

  const handleWorkTypeChange = (workTypeId: string) => {
    setSelectedWorkTypeId(workTypeId);
    setSelectedSubWorkId('');
  };

  return (
    <Card 
        title="Generador de Retroalimentación" 
        icon="mdi:message-text"
        headerAction={
          <button
            onClick={clearCopiedStudents}
            className="text-xs text-senati hover:underline flex items-center gap-1"
            disabled={copiedStudents.size === 0}
          >
            <Icon icon="mdi:refresh" className="text-sm" />
            Resetear
          </button>
        }
      >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Tipo de Trabajo"
            value={selectedWorkTypeId}
            onChange={(e) => handleWorkTypeChange(e.target.value)}
            options={workTypes.map(wt => ({ value: wt.id, label: wt.name }))}
            placeholder="Seleccionar tipo..."
          />
          <Select
            label="Subtrabajo"
            value={selectedSubWorkId}
            onChange={(e) => setSelectedSubWorkId(e.target.value)}
            options={filteredSubWorks.map(sw => ({ value: sw.id, label: sw.name }))}
            placeholder="Seleccionar subtrabajo..."
            disabled={!selectedWorkTypeId}
          />
        </div>

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
        ) : !selectedWorkTypeId ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Icon icon="mdi:briefcase-outline" className="text-4xl mx-auto mb-2 text-gray-300" />
            <p>Selecciona un tipo de trabajo para generar comentarios</p>
          </div>
        ) : !selectedSubWorkId ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Icon icon="mdi:file-document-outline" className="text-4xl mx-auto mb-2 text-gray-300" />
            <p>Selecciona un subtrabajo para generar comentarios</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {copiedStudents.size > 0 && `${copiedStudents.size} de ${students.length} copiados`}
              </span>
              {copiedStudents.size > 0 && (
                <button
                  onClick={clearCopiedStudents}
                  className="text-xs text-senati hover:underline"
                >
                  Limpiar marcados
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {students.map((student) => {
                const isCopied = copiedStudents.has(student.id);
                const isJustCopied = copiedId === student.id;
                
                return (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isCopied 
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800' 
                        : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {isCopied && (
                          <Icon icon="mdi:check-circle" className="text-emerald-500 text-sm shrink-0" />
                        )}
                        <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                          isCopied 
                            ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-800/50' 
                            : 'text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600'
                        }`}>
                          {student.code}
                        </span>
                        <span className={`font-medium truncate ${
                          isCopied 
                            ? 'text-emerald-800 dark:text-emerald-200' 
                            : 'text-gray-800 dark:text-gray-200'
                        }`}>
                          {student.name}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={isJustCopied ? 'success' : isCopied ? 'secondary' : 'primary'}
                      icon={isJustCopied ? 'mdi:check' : isCopied ? 'mdi:check-circle' : 'mdi:content-copy'}
                      onClick={() => handleCopy(student)}
                      disabled={!activeTemplate || !selectedSubWork}
                    >
                      {isJustCopied ? 'Copiado' : isCopied ? 'Copiado' : 'Copiar'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
