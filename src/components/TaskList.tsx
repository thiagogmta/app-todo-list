import { useState } from 'react';
import { Star, CheckCircle, ChevronDown, Plus, Moon, HelpCircle, Sparkles, TrendingUp, Clock as ClockIcon } from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onToggleStar: (taskId: string) => void;
  onSelectTask: (taskId: string) => void;
  onOpenQuickAdd: () => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
}

export default function TaskList({
  tasks,
  onToggleComplete,
  onToggleStar,
  onSelectTask,
  onOpenQuickAdd,
  filterCategory,
  setFilterCategory
}: TaskListProps) {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Filter tasks based on category selections
  const filteredTasks = tasks.filter((t) => {
    if (filterCategory === 'Todas as tarefas') {
      return !t.completed;
    }
    if (filterCategory === 'Com estrela') {
      return t.starred && !t.completed;
    }
    if (filterCategory === 'Concluídas') {
      return t.completed;
    }
    return t.categories.includes(filterCategory) && !t.completed;
  });

  // Grouping tasks: Put starred ones at the top "COM ESTRELA" if not explicitly viewing Completed
  const starredTasks = filteredTasks.filter((t) => t.starred);
  const otherTasks = filteredTasks.filter((t) => !t.starred);

  // Available filters
  const filterOptions = ['Todas as tarefas', 'Com estrela', 'Trabalho', 'Pessoal', 'Saúde', 'Concluídas'];

  return (
    <div id="task-list-view" className="pb-24 px-4 pt-4 space-y-5 select-none text-brand-primary max-w-md mx-auto relative min-h-[calc(100vh-140px)]">
      
      {/* Selector dropdown header (Screen 8) */}
      <div className="relative">
        <button
          id="btn-active-filter"
          onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          className="w-full bg-[#E8E8E6] hover:bg-gray-200 text-brand-primary font-sans font-bold text-sm tracking-wide py-3 px-4 rounded-xl flex items-center justify-between shadow-xs transition-colors cursor-pointer"
        >
          <span>{filterCategory}</span>
          <ChevronDown size={18} className={`transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showFilterDropdown && (
          <>
            {/* Overlay background to dismiss */}
            <div className="fixed inset-0 z-30" onClick={() => setShowFilterDropdown(false)} />
            
            {/* Options list */}
            <div className="absolute top-12 left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-40 overflow-hidden">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  id={`btn-filter-opt-${opt}`}
                  onClick={() => {
                    setFilterCategory(opt);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left font-sans font-bold text-xs tracking-wide py-3.5 px-5 hover:bg-gray-50 transition-colors cursor-pointer block ${
                    filterCategory === opt ? 'text-[#56B6C6] bg-cyan-50/20' : 'text-brand-primary'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Task display grouped by "COM ESTRELA" or "TAREFAS RECENTES" */}
      <div className="space-y-4">
        {/* Starred items section */}
        {starredTasks.length > 0 && (
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-1.5 px-1 py-1">
              <span className="text-[10px] font-bold text-gray-400 tracking-wider font-sans uppercase">
                COM ESTRELA
              </span>
              <span className="w-5 h-5 rounded-full bg-gray-200/80 text-[10px] font-bold text-gray-500 flex items-center justify-center">
                {starredTasks.length}
              </span>
            </div>

            {starredTasks.map((task) => (
              <div
                key={task.id}
                id={`task-card-${task.id}`}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center justify-between hover:border-gray-200 transition-all cursor-pointer"
                onClick={() => onSelectTask(task.id)}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    id={`btn-checklist-task-${task.id}`}
                    onClick={() => onToggleComplete(task.id)}
                    className="p-0.5 cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-[#8ACBD0] flex items-center justify-center hover:bg-[#8ACBD0]/10 transition-all">
                      {task.completed && <CheckCircle size={14} className="text-[#8ACBD0]" fill="currentColor" />}
                    </div>
                  </button>

                  <span
                    className={`font-sans font-bold text-sm tracking-wide text-[#170C79] truncate ${
                      task.completed ? 'line-through text-gray-400 font-normal' : ''
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                <button
                  id={`btn-star-task-${task.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(task.id);
                  }}
                  className="text-amber-500 hover:scale-105 active:scale-95 transition-all p-1 cursor-pointer"
                >
                  <Star size={18} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Regular normal items section */}
        {otherTasks.length > 0 && (
          <div className="space-y-2 mt-5">
            <div className="flex items-center gap-1.5 px-1 py-1">
              <span className="text-[10px] font-bold text-gray-400 tracking-wider font-sans uppercase">
                TAREFAS
              </span>
              <span className="w-5 h-5 rounded-full bg-gray-200/80 text-[10px] font-bold text-gray-500 flex items-center justify-center">
                {otherTasks.length}
              </span>
            </div>

            {otherTasks.map((task) => (
              <div
                key={task.id}
                id={`task-card-${task.id}`}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center justify-between hover:border-gray-200 transition-all cursor-pointer"
                onClick={() => onSelectTask(task.id)}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    id={`btn-checklist-task-${task.id}`}
                    onClick={() => onToggleComplete(task.id)}
                    className="p-0.5 cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-all">
                      {task.completed && <CheckCircle size={14} className="text-[#8ACBD0]" fill="currentColor" />}
                    </div>
                  </button>

                  <span
                    className={`font-sans font-bold text-sm tracking-wide text-[#170C79] truncate ${
                      task.completed ? 'line-through text-gray-400 font-normal' : ''
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                <button
                  id={`btn-star-task-${task.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(task.id);
                  }}
                  className="text-gray-300 hover:text-amber-500 transition-colors p-1 cursor-pointer"
                >
                  <Star size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty state overlay */}
        {filteredTasks.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center py-12 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <Sparkles size={28} />
            </div>
            <h4 className="font-display font-bold text-sm text-[#170C79] mb-1">Sem tarefas pendentes</h4>
            <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
              Tudo pronto por aqui! Clique no botão + abaixo para cadastrar novos afazeres.
            </p>
          </div>
        )}
      </div>

      {/* Grid double statistic details card row at bottom of listing (Screen 3) */}
      <div className="grid grid-cols-2 gap-4 pt-6">
        {/* Card 1: Produtividade 85% */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-28">
          <div className="space-y-0.5 z-10">
            <span className="block text-[8px] font-bold text-gray-400 tracking-wider font-sans uppercase">
              PRODUTIVIDADE
            </span>
            <span className="text-2xl font-display font-bold text-[#170C79] block">
              85%
            </span>
            <span className="text-[10px] text-gray-400 font-medium block">
              Nesta semana
            </span>
          </div>

          {/* Line Chart Vector Background (Screen 3) */}
          <div className="absolute bottom-1 right-2 w-16 h-12 text-[#8ACBD0]/20 pointer-events-none z-0">
            <svg viewBox="0 0 100 50" fill="none" className="w-full h-full stroke-[#8ACBD0]" strokeWidth="3">
              <path d="M0 45 C 20 40, 40 30, 60 20 C 80 10, 90 2, 100 0" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: Próxima Aula de Yoga */}
        <div className="bg-[#E4F4F6] rounded-2xl p-4 border border-cyan-100/50 shadow-sm relative overflow-hidden flex flex-col justify-between h-28">
          <div className="space-y-0.5 z-10">
            <span className="block text-[8px] font-bold text-cyan-600/70 tracking-wider font-sans uppercase">
              PRÓXIMA
            </span>
            <span className="text-[13px] font-display font-bold text-[#170C79] leading-tight block truncate max-w-[140px]">
              Aula de Yoga
            </span>
            <span className="text-[10px] text-gray-500 font-medium block">
              Às 18:30h
            </span>
          </div>

          {/* Alarm clock vector background (Screen 3) */}
          <div className="absolute -bottom-4 -right-4 w-16 h-16 text-[#56B6C6]/15 pointer-events-none z-0">
            <ClockIcon size={64} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Bottom Floating Circular Add Button */}
      <div className="fixed bottom-20 right-5 z-40 max-w-md mx-auto">
        <button
          id="btn-main-floating-add"
          onClick={onOpenQuickAdd}
          className="w-14 h-14 rounded-full bg-[#170C79] text-[#8ACBD0] flex items-center justify-center shadow-xl active:scale-95 hover:bg-[#251996] transition-all cursor-pointer text-center"
          title="Nova tarefa rápida"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      </div>

    </div>
  );
}
