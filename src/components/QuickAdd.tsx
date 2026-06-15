import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlignLeft, Calendar, Star, X } from 'lucide-react';
import { getTodayDateString } from '../utils';

interface QuickAddProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: { title: string; starred: boolean; dueDate: string }) => void;
  onOpenFullEdit: (initialTitle: string) => void;
}

export default function QuickAdd({ isOpen, onClose, onSave, onOpenFullEdit }: QuickAddProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const [isStarred, setIsStarred] = useState(false);
  const [dueDate, setDueDate] = useState(getTodayDateString());

  // Portuguese visual keyboard simulation
  const keyboardRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
    ['123', 'espaço', 'RETORNO']
  ];

  const handleKeyPress = (key: string) => {
    if (key === 'shift') return; // visual auxiliary
    if (key === 'backspace') {
      setTaskTitle((prev) => prev.slice(0, -1));
    } else if (key === 'espaço') {
      setTaskTitle((prev) => prev + ' ');
    } else if (key === 'RETORNO') {
      handleSave();
    } else if (key === '123') {
      // simulate symbol or just append space
    } else {
      setTaskTitle((prev) => prev + key);
    }
  };

  const handleSave = () => {
    if (!taskTitle.trim()) return;
    onSave({
      title: taskTitle,
      starred: isStarred,
      dueDate: dueDate,
    });
    setTaskTitle('');
    setIsStarred(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            id="quick-add-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-55"
          />

          {/* Drawer content */}
          <motion.div
            id="quick-add-drawer"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#F9F9F7] rounded-t-2xl shadow-2xl z-56 flex flex-col overflow-hidden select-none border-t border-gray-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 bg-white">
              <h3 className="font-display font-bold text-lg text-brand-primary">Nova tarefa</h3>
              <button
                id="btn-quick-save"
                onClick={handleSave}
                disabled={!taskTitle.trim()}
                className={`font-semibold text-sm tracking-wide ${
                  taskTitle.trim() ? 'text-brand-accent-cyan cursor-pointer' : 'text-gray-400'
                }`}
              >
                SALVAR
              </button>
            </div>

            {/* Input area */}
            <div className="bg-white p-5 pb-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <input
                  id="input-quick-add"
                  type="text"
                  placeholder="Nova tarefa"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full text-lg font-medium text-brand-primary placeholder-gray-400 focus:outline-none"
                  autoFocus
                />
                {taskTitle && (
                  <button onClick={() => setTaskTitle('')} className="text-gray-400 hover:text-gray-600">
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Metadata Toggles Area */}
            <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100 text-gray-500">
              <div className="flex items-center gap-5">
                <button
                  id="btn-quick-details"
                  onClick={() => {
                    onOpenFullEdit(taskTitle);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 hover:text-brand-primary p-1 cursor-pointer"
                  title="Fazer descrição da tarefa"
                >
                  <AlignLeft size={20} className="text-gray-400" />
                </button>
                
                <button
                  id="btn-quick-date"
                  onClick={() => {
                    // Toggle a simple date trigger or just mock it to next date
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const tStr = tomorrow.toISOString().split('T')[0];
                    setDueDate(dueDate === getTodayDateString() ? tStr : getTodayDateString());
                  }}
                  className={`flex items-center gap-1 hover:text-brand-primary p-1 cursor-pointer ${
                    dueDate !== getTodayDateString() ? 'text-brand-accent-cyan' : 'text-gray-400'
                  }`}
                  title="Definir data de entrega"
                >
                  <Calendar size={20} />
                  {dueDate !== getTodayDateString() && (
                    <span className="text-xs font-semibold">Amanhã</span>
                  )}
                </button>

                <button
                  id="btn-quick-star"
                  onClick={() => setIsStarred(!isStarred)}
                  className={`p-1 cursor-pointer transition-colors ${
                    isStarred ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'
                  }`}
                  title="Adicionar estrela"
                >
                  <Star size={20} fill={isStarred ? 'currentColor' : 'none'} />
                </button>
              </div>

              <button
                id="btn-quick-add-details"
                onClick={() => {
                  onOpenFullEdit(taskTitle);
                  onClose();
                }}
                className="text-xs font-semibold text-gray-400 hover:text-brand-primary transition-colors py-1 px-2.5 rounded-full bg-gray-50 hover:bg-gray-100"
              >
                Adicionar detalhes
              </button>
            </div>

            {/* Simulated virtual keyboard (To match Screen 5 exactly) */}
            <div className="bg-[#D1D5DB] p-2 flex flex-col gap-1.5 border-t border-gray-300">
              {keyboardRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1 w-full">
                  {row.map((key) => {
                    let keyWidth = 'flex-1';
                    let keyLabel: ReactNode = key;
                    let customBg = 'bg-white hover:bg-gray-100 text-gray-800';

                    if (key === 'shift') {
                      keyWidth = 'w-[11%]';
                      customBg = 'bg-[#AAAEB7] hover:bg-gray-200 text-gray-700';
                      keyLabel = '⇧';
                    } else if (key === 'backspace') {
                      keyWidth = 'w-[11%]';
                      customBg = 'bg-[#AAAEB7] hover:bg-gray-200 text-gray-700 font-bold';
                      keyLabel = '⌫';
                    } else if (key === '123') {
                      keyWidth = 'w-[18%]';
                      customBg = 'bg-[#AAAEB7] hover:bg-gray-200 text-gray-800 text-xs font-semibold';
                      keyLabel = '123';
                    } else if (key === 'espaço') {
                      keyWidth = 'w-[50%]';
                      customBg = 'bg-white hover:bg-gray-50 text-gray-500 text-xs font-medium uppercase';
                      keyLabel = 'espaço';
                    } else if (key === 'RETORNO') {
                      keyWidth = 'w-[25%]';
                      customBg = 'bg-[#4B5563] text-white hover:bg-gray-700 text-xs font-bold uppercase';
                      keyLabel = 'retorno';
                    }

                    return (
                      <button
                        key={key}
                        onClick={() => handleKeyPress(key)}
                        className={`h-10 rounded shadow-sm flex items-center justify-center font-sans font-medium text-sm border-b-2 border-gray-400 transition-all active:scale-95 cursor-pointer ${keyWidth} ${customBg}`}
                      >
                        {keyLabel}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="h-6 bg-[#D1D5DB]" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
