import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Student } from '../types';

export function useStudents() {
  const [students, setStudents] = useLocalStorage<Student[]>('students', []);

  const importStudents = useCallback((data: string) => {
    const lines = data.trim().split('\n').filter(line => line.trim());
    const newStudents: Student[] = [];

    for (const line of lines) {
      const parts = line.split('\t');
      if (parts.length >= 2) {
        const code = parts[0].trim();
        const name = parts[1].trim();
        if (code && name) {
          newStudents.push({
            id: crypto.randomUUID(),
            code,
            name,
          });
        }
      }
    }

    if (newStudents.length > 0) {
      setStudents(prev => [...prev, ...newStudents]);
    }

    return newStudents.length;
  }, [setStudents]);

  const updateStudent = useCallback((id: string, updates: Partial<Omit<Student, 'id'>>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, [setStudents]);

  const deleteStudent = useCallback((id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  }, [setStudents]);

  const clearStudents = useCallback(() => {
    setStudents([]);
  }, [setStudents]);

  return {
    students,
    importStudents,
    updateStudent,
    deleteStudent,
    clearStudents,
  };
}
