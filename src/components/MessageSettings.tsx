import { useState, useEffect } from 'react';
import { Card, Button } from './ui';

const DEFAULT_HEADER = 'Estimado/a {nombre}:';
const DEFAULT_FOOTER = 'Saludos cordiales.';

interface MessageSettingsProps {
  onSettingsChange: (header: string, footer: string) => void;
  className?: string;
}

export function MessageSettings({ onSettingsChange, className = '' }: MessageSettingsProps) {
  const [header, setHeader] = useState(() => localStorage.getItem('feedback_header') || DEFAULT_HEADER);
  const [footer, setFooter] = useState(() => localStorage.getItem('feedback_footer') || DEFAULT_FOOTER);

  useEffect(() => {
    onSettingsChange(header, footer);
  }, [header, footer, onSettingsChange]);

  const handleSave = () => {
    localStorage.setItem('feedback_header', header);
    localStorage.setItem('feedback_footer', footer);
  };

  const handleRestore = () => {
    setHeader(DEFAULT_HEADER);
    setFooter(DEFAULT_FOOTER);
    localStorage.setItem('feedback_header', DEFAULT_HEADER);
    localStorage.setItem('feedback_footer', DEFAULT_FOOTER);
  };

  return (
    <Card title="Personalizar Mensaje" icon="mdi:message-cog" className={className}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Saludo <span className="text-gray-400 dark:text-gray-500 font-normal">(usa {'{nombre}'} para insertar el nombre)</span>
          </label>
          <input
            type="text"
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-senati"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Despedida
          </label>
          <input
            type="text"
            value={footer}
            onChange={(e) => setFooter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-senati"
          />
        </div>
        <div className="flex gap-2">
          <Button size="sm" icon="mdi:content-save" onClick={handleSave}>
            Guardar
          </Button>
          <Button size="sm" variant="ghost" icon="mdi:restore" onClick={handleRestore}>
            Restaurar
          </Button>
        </div>
      </div>
    </Card>
  );
}
