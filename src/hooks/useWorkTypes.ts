import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { WorkType } from '../types';

const DEFAULT_WORK_TYPES: WorkType[] = [
  { id: '1', name: 'Informe' },
  { id: '2', name: 'Exposición' },
  { id: '3', name: 'Proyecto Final' },
  { id: '4', name: 'Laboratorio' },
  { id: '5', name: 'Práctica' },
  { id: '6', name: 'Tarea' },
];

export function useWorkTypes() {
  const [workTypes, setWorkTypes] = useLocalStorage<WorkType[]>('workTypes', DEFAULT_WORK_TYPES);

  const addWorkType = useCallback((name: string) => {
    const newWorkType: WorkType = {
      id: crypto.randomUUID(),
      name: name.trim(),
    };
    setWorkTypes(prev => [...prev, newWorkType]);
    return newWorkType;
  }, [setWorkTypes]);

  const updateWorkType = useCallback((id: string, name: string) => {
    setWorkTypes(prev => prev.map(wt => wt.id === id ? { ...wt, name: name.trim() } : wt));
  }, [setWorkTypes]);

  const deleteWorkType = useCallback((id: string) => {
    setWorkTypes(prev => prev.filter(wt => wt.id !== id));
  }, [setWorkTypes]);

  return {
    workTypes,
    addWorkType,
    updateWorkType,
    deleteWorkType,
  };
}
