import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Card, Button, Input } from './ui';
import type { WorkType, SubWork } from '../types';

interface WorkTypesProps {
  workTypes: WorkType[];
  subWorks: SubWork[];
  onAddWorkType: (name: string) => void;
  onUpdateWorkType: (id: string, name: string) => void;
  onDeleteWorkType: (id: string) => void;
  onAddSubWork: (name: string, workTypeId: string) => void;
  onUpdateSubWork: (id: string, name: string) => void;
  onDeleteSubWork: (id: string) => void;
  className?: string;
}

export function WorkTypes({ 
  workTypes, 
  subWorks, 
  onAddWorkType,
  onUpdateWorkType,
  onDeleteWorkType,
  onAddSubWork, 
  onUpdateSubWork, 
  onDeleteSubWork, 
  className = '' 
}: WorkTypesProps) {
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [newWorkTypeName, setNewWorkTypeName] = useState('');
  const [newSubWorkName, setNewSubWorkName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddWorkType = () => {
    if (newWorkTypeName.trim()) {
      onAddWorkType(newWorkTypeName.trim());
      setNewWorkTypeName('');
    }
  };

  const handleAddSubWork = (workTypeId: string) => {
    if (newSubWorkName.trim()) {
      onAddSubWork(newSubWorkName.trim(), workTypeId);
      setNewSubWorkName('');
    }
  };

  const startEdit = (sw: SubWork) => {
    setEditingId(sw.id);
    setEditValue(sw.name);
  };

  const saveEdit = () => {
    if (editingId && editValue.trim()) {
      onUpdateSubWork(editingId, editValue.trim());
      setEditingId(null);
    }
  };

  const getSubWorksByType = (workTypeId: string) => {
    return subWorks.filter(sw => sw.workTypeId === workTypeId);
  };

  const startEditType = (wt: WorkType) => {
    setEditingTypeId(wt.id);
    setEditValue(wt.name);
  };

  const saveEditType = () => {
    if (editingTypeId && editValue.trim()) {
      onUpdateWorkType(editingTypeId, editValue.trim());
      setEditingTypeId(null);
      setEditValue('');
    }
  };

  return (
    <Card title="Tipos de Trabajo" icon="mdi:briefcase" className={className}>
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Nuevo tipo de trabajo..."
            value={newWorkTypeName}
            onChange={(e) => setNewWorkTypeName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddWorkType()}
          />
          <Button icon="mdi:plus" onClick={handleAddWorkType} disabled={!newWorkTypeName.trim()}>
            Agregar
          </Button>
        </div>

        <div className="space-y-2">
        {workTypes.map((wt) => {
          const typeSubWorks = getSubWorksByType(wt.id);
          const isExpanded = expandedType === wt.id;
          
          return (
            <div key={wt.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden group/type">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700/50">
                {editingTypeId === wt.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEditType()}
                      className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-senati flex-1"
                      autoFocus
                    />
                    <button onClick={saveEditType} className="text-emerald-600 hover:text-emerald-700">
                      <Icon icon="mdi:check" />
                    </button>
                    <button onClick={() => { setEditingTypeId(null); setEditValue(''); }} className="text-gray-400 hover:text-gray-600">
                      <Icon icon="mdi:close" />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setExpandedType(isExpanded ? null : wt.id)}
                      className="flex items-center gap-2 flex-1 hover:bg-gray-100 dark:hover:bg-gray-700 -mx-3 -my-2 px-3 py-2 transition-colors"
                    >
                      <Icon icon={wt.icon} className="text-senati text-lg" />
                      <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{wt.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded-full">
                        {typeSubWorks.length}
                      </span>
                      <Icon 
                        icon={isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'} 
                        className="text-gray-400 ml-auto"
                      />
                    </button>
                    <div className="hidden group-hover/type:flex items-center gap-1 ml-2">
                      <button onClick={() => startEditType(wt)} className="p-1 text-gray-400 hover:text-senati rounded">
                        <Icon icon="mdi:pencil" className="text-sm" />
                      </button>
                      <button onClick={() => onDeleteWorkType(wt.id)} className="p-1 text-gray-400 hover:text-red-600 rounded">
                        <Icon icon="mdi:delete" className="text-sm" />
                      </button>
                    </div>
                  </>
                )}
              </div>
              
              {isExpanded && (
                <div className="p-3 bg-white dark:bg-gray-800 space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nuevo subtrabajo..."
                      value={newSubWorkName}
                      onChange={(e) => setNewSubWorkName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSubWork(wt.id)}
                      className="flex-1"
                    />
                    <Button 
                      icon="mdi:plus" 
                      size="sm"
                      onClick={() => handleAddSubWork(wt.id)} 
                      disabled={!newSubWorkName.trim()}
                    >
                      Agregar
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {typeSubWorks.map((sw) => (
                      <div
                        key={sw.id}
                        className="group flex items-center gap-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {editingId === sw.id ? (
                          <>
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                              className="px-2 py-0.5 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-senati w-24"
                              autoFocus
                            />
                            <button onClick={saveEdit} className="text-emerald-600 hover:text-emerald-700">
                              <Icon icon="mdi:check" className="text-sm" />
                            </button>
                            <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">
                              <Icon icon="mdi:close" className="text-sm" />
                            </button>
                          </>
                        ) : (
                          <>
                            <Icon icon="mdi:tag" className="text-senati text-xs" />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{sw.name}</span>
                            <div className="hidden group-hover:flex items-center gap-1">
                              <button onClick={() => startEdit(sw)} className="text-gray-400 hover:text-senati">
                                <Icon icon="mdi:pencil" className="text-xs" />
                              </button>
                              <button onClick={() => onDeleteSubWork(sw.id)} className="text-gray-400 hover:text-red-600">
                                <Icon icon="mdi:close" className="text-xs" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    
                    {typeSubWorks.length === 0 && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                        No hay subtrabajos definidos
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </Card>
  );
}
