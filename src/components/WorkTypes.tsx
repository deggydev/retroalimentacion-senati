import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Card, Button, Input } from './ui';
import type { WorkType } from '../types';

interface WorkTypesProps {
  workTypes: WorkType[];
  onAdd: (name: string) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export function WorkTypes({ workTypes, onAdd, onUpdate, onDelete, className = '' }: WorkTypesProps) {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = () => {
    if (newName.trim()) {
      onAdd(newName.trim());
      setNewName('');
    }
  };

  const startEdit = (wt: WorkType) => {
    setEditingId(wt.id);
    setEditValue(wt.name);
  };

  const saveEdit = () => {
    if (editingId && editValue.trim()) {
      onUpdate(editingId, editValue.trim());
      setEditingId(null);
    }
  };

  return (
    <Card title="Tipos de Trabajo" icon="mdi:briefcase" className={className}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Nuevo tipo de trabajo..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button icon="mdi:plus" onClick={handleAdd} disabled={!newName.trim()}>
            Agregar
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {workTypes.map((wt) => (
            <div
              key={wt.id}
              className="group flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {editingId === wt.id ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-senati"
                    autoFocus
                  />
                  <button onClick={saveEdit} className="text-emerald-600 hover:text-emerald-700">
                    <Icon icon="mdi:check" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">
                    <Icon icon="mdi:close" />
                  </button>
                </>
              ) : (
                <>
                  <Icon icon="mdi:tag" className="text-senati" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{wt.name}</span>
                  <div className="hidden group-hover:flex items-center gap-1 ml-1">
                    <button onClick={() => startEdit(wt)} className="text-gray-400 hover:text-senati">
                      <Icon icon="mdi:pencil" className="text-sm" />
                    </button>
                    <button onClick={() => onDelete(wt.id)} className="text-gray-400 hover:text-red-600">
                      <Icon icon="mdi:close" className="text-sm" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {workTypes.length === 0 && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            <p>No hay tipos de trabajo definidos</p>
          </div>
        )}
      </div>
    </Card>
  );
}
