import { useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useStudents, useWorkTypes, useTemplates, useTheme } from './hooks';
import logoSenati from './assets/logo-senati.png';
import {
  ImportStudents,
  StudentList,
  WorkTypes,
  Templates,
  MessageSettings,
  FeedbackGenerator,
  ParticlesBackground,
} from './components';
import { Toast } from './components/ui';

function App() {
  const { students, importStudents, updateStudent, deleteStudent, clearStudents } = useStudents();
  const { workTypes, addWorkType, updateWorkType, deleteWorkType } = useWorkTypes();
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useTemplates();
  const { theme, toggleTheme } = useTheme();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [messageHeader, setMessageHeader] = useState(() => localStorage.getItem('feedback_header') || 'Estimado/a {nombre}:');
  const [messageFooter, setMessageFooter] = useState(() => localStorage.getItem('feedback_footer') || 'Saludos cordiales.');

  const handleSettingsChange = useCallback((header: string, footer: string) => {
    setMessageHeader(header);
    setMessageFooter(footer);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-linear-to-br from-slate-50 to-senati-light dark:from-gray-900 dark:to-gray-800 transition-colors -z-20"></div>
      <ParticlesBackground />
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logoSenati} alt="SENATI" className="h-12 w-auto" />
              <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-senati rounded-lg">
                  <Icon icon="mdi:comment-text-multiple" className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Retroalimentación Docente</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sistema de gestión de comentarios</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
              >
                <Icon
                  icon={theme === 'light' ? 'mdi:weather-night' : 'mdi:weather-sunny'}
                  className="text-xl text-gray-600 dark:text-yellow-400"
                />
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Icon icon="mdi:cloud-check" className="text-emerald-500" />
                <span className="hidden sm:inline">Guardado automático</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <ImportStudents
              onImport={importStudents}
              onClear={clearStudents}
              studentCount={students.length}
            />
            <StudentList
              students={students}
              onUpdate={updateStudent}
              onDelete={deleteStudent}
            />
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WorkTypes
                workTypes={workTypes}
                onAdd={addWorkType}
                onUpdate={updateWorkType}
                onDelete={deleteWorkType}
              />
              <MessageSettings onSettingsChange={handleSettingsChange} />
            </div>
            <Templates
              templates={templates}
              onAdd={addTemplate}
              onUpdate={updateTemplate}
              onDelete={deleteTemplate}
            />
            <FeedbackGenerator
              students={students}
              workTypes={workTypes}
              templates={templates}
              header={messageHeader}
              footer={messageFooter}
              onCopy={() => showToast('Comentario copiado al portapapeles')}
            />
          </div>
        </div>
      </main>

      <footer className="mt-8 py-6 text-center border-t border-gray-100 dark:border-gray-700">
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">
          Retroalimentación Docente © {new Date().getFullYear()}
        </p>
        <a
          href="https://github.com/deggydev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-senati dark:hover:text-senati transition-colors group"
        >
          <span>Hecho con</span>
          <Icon
            icon="mdi:heart"
            className="text-red-500 animate-heartbeat group-hover:scale-125 transition-transform"
          />
          <span>por</span>
          <span className="font-semibold text-gray-700 dark:text-gray-300 group-hover:text-senati">Diego Lipa</span>
          <Icon icon="mdi:github" className="text-lg" />
          <span className="font-bold text-lg animate-shimmer tracking-wider">DEGGY</span>
        </a>
      </footer>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
