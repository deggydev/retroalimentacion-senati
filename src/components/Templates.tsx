import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Card, Button, Select } from './ui';
import type { FeedbackTemplate, FeedbackCategory, WorkType } from '../types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../types';

interface TemplatesProps {
  templates: FeedbackTemplate[];
  workTypes: WorkType[];
  onAdd: (workTypeId: string, category: FeedbackCategory, content: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<FeedbackTemplate, 'id'>>) => void;
  onDelete: (id: string) => void;
  className?: string;
}

const categories: FeedbackCategory[] = ['excelente', 'bueno', 'regular', 'debe_mejorar', 'no_presento'];

export function Templates({ templates, workTypes, onAdd, onUpdate, onDelete, className = '' }: TemplatesProps) {
  const [selectedWorkType, setSelectedWorkType] = useState<string>('');
  const [newCategory, setNewCategory] = useState<FeedbackCategory>('bueno');
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ category: '' as FeedbackCategory, content: '' });
  const [filterCategory, setFilterCategory] = useState<FeedbackCategory | 'all'>('all');

  const handleAdd = () => {
    if (newContent.trim()) {
      onAdd(selectedWorkType, newCategory, newContent.trim());
      setNewContent('');
    }
  };

  const startEdit = (template: FeedbackTemplate) => {
    setEditingId(template.id);
    setEditValues({ category: template.category, content: template.content });
  };

  const saveEdit = () => {
    if (editingId && editValues.content.trim()) {
      onUpdate(editingId, { category: editValues.category, content: editValues.content.trim() });
      setEditingId(null);
    }
  };

  const filteredTemplates = templates
    .filter(t => t.workTypeId === selectedWorkType)
    .filter(t => filterCategory === 'all' || t.category === filterCategory);

  const currentWorkType = workTypes.find(wt => wt.id === selectedWorkType);

  return (
    <Card title="Plantillas de Retroalimentación" icon="mdi:text-box-multiple" className={className}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700 pb-3">
          {workTypes.map(wt => (
            <button
              key={wt.id}
              onClick={() => setSelectedWorkType(wt.id)}
              className={`flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedWorkType === wt.id
                  ? 'bg-senati text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon icon={wt.icon} className="text-sm" />
              <span className="hidden sm:inline">{wt.name}</span>
            </button>
          ))}
        </div>

        <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex gap-2">
            <Select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as FeedbackCategory)}
              options={categories.map(c => ({ value: c, label: CATEGORY_LABELS[c] }))}
              className="w-36"
            />
            <Button icon="mdi:plus" size="sm" onClick={handleAdd} disabled={!newContent.trim()}>
              Agregar
            </Button>
          </div>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder={`Plantilla para ${currentWorkType?.name}...`}
            className="w-full h-16 p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-senati"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">Filtrar:</span>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-2 py-0.5 text-xs rounded-full transition-colors ${filterCategory === 'all' ? 'bg-senati text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              Todas
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2 py-0.5 text-xs rounded-full transition-colors ${filterCategory === cat ? 'bg-senati text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`p-2 rounded-lg border ${CATEGORY_COLORS[template.category]}`}
            >
              {editingId === template.id ? (
                <div className="space-y-2">
                  <Select
                    value={editValues.category}
                    onChange={(e) => setEditValues({ ...editValues, category: e.target.value as FeedbackCategory })}
                    options={categories.map(c => ({ value: c, label: CATEGORY_LABELS[c] }))}
                    className="w-36"
                  />
                  <textarea
                    value={editValues.content}
                    onChange={(e) => setEditValues({ ...editValues, content: e.target.value })}
                    className="w-full h-16 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-senati"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="success" icon="mdi:check" onClick={saveEdit}>
                      Guardar
                    </Button>
                    <Button size="sm" variant="ghost" icon="mdi:close" onClick={() => setEditingId(null)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <span className="inline-block px-1.5 py-0.5 text-xs font-medium rounded-full bg-white/50 mb-1">
                      {CATEGORY_LABELS[template.category]}
                    </span>
                    <p className="text-xs">{template.content}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => startEdit(template)}
                      className="p-1 rounded hover:bg-white/50 transition-colors"
                    >
                      <Icon icon="mdi:pencil" className="text-xs" />
                    </button>
                    <button
                      onClick={() => onDelete(template.id)}
                      className="p-1 rounded hover:bg-white/50 transition-colors"
                    >
                      <Icon icon="mdi:delete" className="text-xs" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-3 text-gray-500 dark:text-gray-400">
            <p className="text-sm">No hay plantillas para {currentWorkType?.name}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
