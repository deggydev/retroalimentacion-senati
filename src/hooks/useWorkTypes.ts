import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { SubWork, WorkType } from '../types';
import { DEFAULT_WORK_TYPES, DEFAULT_SUBWORKS } from '../types';

const WORK_TYPE_ICONS = [
  'mdi:folder',
  'mdi:book-open',
  'mdi:clipboard-text',
  'mdi:lightbulb',
  'mdi:target',
  'mdi:chart-bar',
  'mdi:cog',
  'mdi:star',
];

export function useWorkTypes() {
  const [workTypes, setWorkTypes] = useLocalStorage<WorkType[]>('workTypesV2', DEFAULT_WORK_TYPES);
  const [subWorks, setSubWorks] = useLocalStorage<SubWork[]>('subWorksV2', DEFAULT_SUBWORKS);

  const addWorkType = useCallback((name: string) => {
    const randomIcon = WORK_TYPE_ICONS[Math.floor(Math.random() * WORK_TYPE_ICONS.length)];
    const newWorkType: WorkType = {
      id: crypto.randomUUID(),
      name: name.trim(),
      icon: randomIcon,
    };
    setWorkTypes(prev => [...prev, newWorkType]);
    return newWorkType;
  }, [setWorkTypes]);

  const updateWorkType = useCallback((id: string, name: string) => {
    setWorkTypes(prev => prev.map(wt => wt.id === id ? { ...wt, name: name.trim() } : wt));
  }, [setWorkTypes]);

  const deleteWorkType = useCallback((id: string) => {
    setWorkTypes(prev => prev.filter(wt => wt.id !== id));
    setSubWorks(prev => prev.filter(sw => sw.workTypeId !== id));
  }, [setWorkTypes, setSubWorks]);

  const addSubWork = useCallback((name: string, workTypeId: string) => {
    const newSubWork: SubWork = {
      id: crypto.randomUUID(),
      name: name.trim(),
      workTypeId,
    };
    setSubWorks(prev => [...prev, newSubWork]);
    return newSubWork;
  }, [setSubWorks]);

  const updateSubWork = useCallback((id: string, name: string) => {
    setSubWorks(prev => prev.map(sw => sw.id === id ? { ...sw, name: name.trim() } : sw));
  }, [setSubWorks]);

  const deleteSubWork = useCallback((id: string) => {
    setSubWorks(prev => prev.filter(sw => sw.id !== id));
  }, [setSubWorks]);

  const getSubWorksByType = useCallback((workTypeId: string) => {
    return subWorks.filter(sw => sw.workTypeId === workTypeId);
  }, [subWorks]);

  return {
    workTypes,
    subWorks,
    addWorkType,
    updateWorkType,
    deleteWorkType,
    addSubWork,
    updateSubWork,
    deleteSubWork,
    getSubWorksByType,
  };
}
