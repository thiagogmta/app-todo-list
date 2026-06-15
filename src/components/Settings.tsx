import { useState, useEffect } from 'react';
import { X, Bell, Moon, BarChart3, HelpCircle, LogOut, Edit, Camera } from 'lucide-react';

interface SettingsProps {
  onClose: () => void;
  onGoToProductivity: () => void;
}

export default function Settings({ onClose, onGoToProductivity }: SettingsProps) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle Dark Mode at DOM body level
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      // Set dark variables
      root.style.setProperty('--color-brand-neutral-bg', '#1E1E24');
      root.style.setProperty('--color-brand-primary', '#ECECEA');
      root.style.setProperty('--color-brand-neutral-light', '#2E2F3E');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--color-brand-neutral-bg', '#ececea');
      root.style.setProperty('--color-brand-primary', '#170c79');
      root.style.setProperty('--color-brand-neutral-light', '#f4f4f2');
    }
  }, [darkMode]);

  return (
    <div id="settings-screen" className="min-h-screen bg-[#F9F9F7] dark:bg-[#121214] max-w-md mx-auto relative flex flex-col justify-between py-6 px-5 shadow-lg text-brand-primary select-none">
      {/* Top Close Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          id="btn-settings-close"
          onClick={onClose}
          className="p-1.5 hover:bg-gray-200/50 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer text-gray-500"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Avatar Section */}
      <div className="flex-1 flex flex-col items-center pt-8 space-y-5">
        {/* Large Avatar container */}
        <div className="relative">
          <img
            id="img-settings-avatar"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
            alt="Thiago Avatar Large"
            referrerPolicy="no-referrer"
            className="w-24 h-24 rounded-full border-4 border-[#8ACBD0] object-cover shadow-md"
          />
          <button
            id="btn-edit-avatar"
            onClick={() => alert('Para mudar de foto, conecte ao Google Cloud Storage')}
            className="absolute bottom-0 right-0 bg-[#170C79] hover:bg-[#2b1f8c] text-white p-2 rounded-full border border-white cursor-pointer shadow-sm active:scale-95 transition-all"
          >
            <Camera size={14} />
          </button>
        </div>

        {/* User Info labels */}
        <div className="text-center">
          <h2 className="font-display font-bold text-2xl tracking-tight text-[#170C79] dark:text-[#E8E8E6]">
            Thiago
          </h2>
          <p className="text-xs text-gray-400 font-medium tracking-wide">
            thiago@beltrano.com
          </p>
        </div>

        {/* Settings options lists rows */}
        <div className="w-full space-y-4 pt-4">
          {/* Row 1: Notifications */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-50 dark:bg-indigo-950 p-2.5 rounded-xl text-[#170C79] dark:text-[#8ACBD0]">
                <Bell size={20} />
              </div>
              <span className="text-sm font-semibold text-brand-primary dark:text-[#ECECEA]">
                Notificações do aplicativo
              </span>
            </div>

            {/* Switch Toggle */}
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                id="toggle-notifications"
                type="checkbox"
                className="sr-only peer"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#56B6C6]" />
            </label>
          </div>

          {/* Row 2: Dark Theme toggle */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-50 dark:bg-indigo-950 p-2.5 rounded-xl text-[#170C79] dark:text-[#8ACBD0]">
                <Moon size={20} />
              </div>
              <span className="text-sm font-semibold text-brand-primary dark:text-[#ECECEA]">
                Tema escuro
              </span>
            </div>

            {/* Switch Toggle */}
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                id="toggle-darktheme"
                type="checkbox"
                className="sr-only peer"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#56B6C6]" />
            </label>
          </div>

          {/* Row 3: Minha produtividade link card */}
          <button
            id="btn-settings-productivity"
            onClick={onGoToProductivity}
            className="w-full bg-[#5C5AE8] hover:bg-[#4d4be0] active:scale-[0.99] text-white rounded-2xl p-4.5 flex items-center justify-center gap-3 shadow-md transition-all cursor-pointer text-center"
          >
            <BarChart3 size={20} />
            <span className="font-display font-bold text-sm tracking-wide">
              Minha produtividade
            </span>
          </button>
        </div>
      </div>

      {/* Footer Support Buttons */}
      <div className="grid grid-cols-2 gap-4 pt-6 mt-4 select-none">
        <button
          id="btn-settings-help"
          onClick={() => alert('Central de Ajuda: suport_logi@beltrano.com')}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 focus:outline-none font-bold text-sm text-gray-600 dark:text-[#ECECEA] py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <HelpCircle size={18} />
          <span>Ajuda</span>
        </button>

        <button
          id="btn-settings-exit"
          onClick={() => alert('Saindo de Thiago...')}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-red-50 focus:outline-none font-bold text-sm text-[#CC4646] py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
