import { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { Card, Button, Input } from './ui';
import type { Student } from '../types';

interface StudentListProps {
  students: Student[];
  onUpdate: (id: string, updates: Partial<Omit<Student, 'id'>>) => void;
  onDelete: (id: string) => void;
}

type SortField = 'code' | 'name';
type SortOrder = 'asc' | 'desc';

export function StudentList({ students, onUpdate, onDelete }: StudentListProps) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('code');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ code: '', name: '' });

  const filteredStudents = useMemo(() => {
    let result = students.filter(
      (s) =>
        s.code.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    result.sort((a, b) => {
      const aVal = a[sortField].toLowerCase();
      const bVal = b[sortField].toLowerCase();
      const comparison = aVal.localeCompare(bVal);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [students, search, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const startEdit = (student: Student) => {
    setEditingId(student.id);
    setEditValues({ code: student.code, name: student.name });
  };

  const saveEdit = () => {
    if (editingId && editValues.code.trim() && editValues.name.trim()) {
      onUpdate(editingId, { code: editValues.code.trim(), name: editValues.name.trim() });
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ code: '', name: '' });
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <Icon
      icon={sortField === field ? (sortOrder === 'asc' ? 'mdi:arrow-up' : 'mdi:arrow-down') : 'mdi:unfold-more-horizontal'}
      className={`text-sm ${sortField === field ? 'text-senati' : 'text-gray-400'}`}
    />
  );

  return (
    <Card title="Lista de Estudiantes" icon="mdi:account-multiple">
      <div className="space-y-4">
        <Input
          icon="mdi:magnify"
          placeholder="Buscar por código o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {students.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Icon icon="mdi:account-off" className="text-4xl mx-auto mb-2 text-gray-300" />
            <p>No hay estudiantes importados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th
                    className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-300 cursor-pointer hover:text-senati"
                    onClick={() => handleSort('code')}
                  >
                    <div className="flex items-center gap-1">
                      Código <SortIcon field="code" />
                    </div>
                  </th>
                  <th
                    className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-300 cursor-pointer hover:text-senati"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Nombre <SortIcon field="name" />
                    </div>
                  </th>
                  <th className="text-right py-2 px-3 font-medium text-gray-600 dark:text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    {editingId === student.id ? (
                      <>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={editValues.code}
                            onChange={(e) => setEditValues({ ...editValues, code: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-senati"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={editValues.name}
                            onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-senati"
                          />
                        </td>
                        <td className="py-2 px-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="success" icon="mdi:check" onClick={saveEdit} />
                            <Button size="sm" variant="ghost" icon="mdi:close" onClick={cancelEdit} />
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 px-3 font-mono text-gray-700 dark:text-gray-300">{student.code}</td>
                        <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{student.name}</td>
                        <td className="py-2 px-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="ghost" icon="mdi:pencil" onClick={() => startEdit(student)} />
                            <Button size="sm" variant="danger" icon="mdi:delete" onClick={() => onDelete(student.id)} />
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredStudents.length === 0 && students.length > 0 && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            <p>No se encontraron resultados para "{search}"</p>
          </div>
        )}
      </div>
    </Card>
  );
}
