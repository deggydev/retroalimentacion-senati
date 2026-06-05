import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { Card, Button } from './ui';

interface ImportStudentsProps {
  onImport: (data: string) => number;
  onClear: () => void;
  studentCount: number;
}

export function ImportStudents({ onImport, onClear, studentCount }: ImportStudentsProps) {
  const [pasteData, setPasteData] = useState('');
  const [importedCount, setImportedCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    if (text) {
      setPasteData(text);
    }
  };

  const handleImport = () => {
    if (pasteData.trim()) {
      const count = onImport(pasteData);
      setImportedCount(count);
      setShowSuccess(true);
      setPasteData('');
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleClear = () => {
    onClear();
    setPasteData('');
    setImportedCount(0);
  };

  return (
    <Card title="Importar Estudiantes" icon="mdi:file-import">
      <div className="space-y-4">
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-senati transition-colors cursor-pointer bg-gray-50 dark:bg-gray-700/50"
          onClick={() => textareaRef.current?.focus()}
        >
          <Icon icon="mdi:clipboard-text" className="text-4xl text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-300 font-medium">Presiona Ctrl + V para pegar datos de Excel</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Formato: Código | Nombre (separados por tabulación)</p>
          <textarea
            ref={textareaRef}
            value={pasteData}
            onChange={(e) => setPasteData(e.target.value)}
            onPaste={handlePaste}
            className="mt-3 w-full h-24 p-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-senati"
            placeholder="Los datos aparecerán aquí..."
          />
        </div>

        {showSuccess && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg">
            <Icon icon="mdi:check-circle" className="text-xl" />
            <span>Se importaron {importedCount} estudiantes correctamente</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Icon icon="mdi:account-group" className="text-xl" />
            <span className="font-medium">{studentCount} estudiantes</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              icon="mdi:delete-sweep"
              onClick={handleClear}
              disabled={studentCount === 0}
            >
              Limpiar
            </Button>
            <Button
              icon="mdi:import"
              onClick={handleImport}
              disabled={!pasteData.trim()}
            >
              Importar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
