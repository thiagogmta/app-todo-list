import { useState } from 'react';
import { ArrowLeft, Star, MoreVertical, ListTodo, Calendar, AlignLeft, CheckCircle, Trash2, X, Plus } from 'lucide-react';
import { Task, Subtask } from '../types';
import { formatFriendlyDate } from '../utils';

interface TaskDetailsProps {
  task: Task;
  onBack: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskDetails({ task, onBack, onUpdateTask, onDeleteTask }: TaskDetailsProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isEditingDate, setIsEditingDate] = useState(false);

  const toggleStar = () => {
    onUpdateTask({
      ...task,
      starred: !task.starred,
    });
  };

  const toggleTaskCompleted = () => {
    const updatedCompleted = !task.completed;
    onUpdateTask({
      ...task,
      completed: updatedCompleted,
      completedAt: updatedCompleted ? new Date().toISOString() : undefined,
    });
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map((sub) =>
      sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
    );
    onUpdateTask({
      ...task,
      subtasks: updatedSubtasks,
    });
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.filter((sub) => sub.id !== subtaskId);
    onUpdateTask({
      ...task,
      subtasks: updatedSubtasks,
    });
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSub: Subtask = {
      id: `sub-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    onUpdateTask({
      ...task,
      subtasks: [...task.subtasks, newSub],
    });
    setNewSubtaskTitle('');
  };

  const handleDateChange = (newDate: string) => {
    if (newDate) {
      onUpdateTask({
        ...task,
        dueDate: newDate,
      });
      setIsEditingDate(false);
    }
  };

  const completedSubtasksCount = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasksCount = task.subtasks.length;

  return (
    <div id="task-details-screen" className="min-h-screen bg-[#F9F9F7] max-w-md mx-auto flex flex-col justify-between shadow-lg text-brand-primary">
      {/* Header */}
      <div className="bg-[#170C79] text-white px-4 py-4 flex items-center justify-between shadow-md select-none">
        <button id="btn-details-back" onClick={onBack} className="p-1 hover:bg-white/10 rounded cursor-pointer">
          <ArrowLeft size={24} />
        </button>
        <span className="font-display font-medium text-lg">Logi</span>
        <div className="flex items-center gap-3">
          <button
            id="btn-details-star"
            onClick={toggleStar}
            className={`p-1 hover:bg-white/10 rounded cursor-pointer transition-colors ${
              task.starred ? 'text-amber-400' : 'text-white'
            }`}
          >
            <Star size={24} fill={task.starred ? 'currentColor' : 'none'} />
          </button>
          <button id="btn-details-menu" className="p-1 hover:bg-white/10 rounded cursor-pointer">
            <MoreVertical size={24} />
          </button>
        </div>
      </div>

      {/* Body Container */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        {/* Inbox tag */}
        <div>
          <span className="inline-block bg-[#E8E8E6] text-gray-500 font-sans font-bold text-[10px] tracking-wider px-3 py-1 rounded-full uppercase">
            {task.categories.length > 0 ? task.categories.join(' • ') : 'CAIXA DE ENTRADA'}
          </span>
        </div>

        {/* Big Title */}
        <div>
          <h2 className="font-display font-bold text-3xl text-[#170C79] tracking-tight leading-tight">
            {task.title}
          </h2>
        </div>

        {/* Task Cards: Description and Due Date */}
        <div className="space-y-4">
          {/* Card 1: Description */}
          <div className="bg-white rounded-2xl p-4 flex items-start gap-4 border border-gray-100 shadow-sm">
            <div className="bg-[#ECECEA] text-[#170C79] p-2.5 rounded-xl">
              <AlignLeft size={20} />
            </div>
            <div className="flex-1">
              <span className="block text-[10px] font-bold text-gray-400 tracking-wider font-sans uppercase mb-0.5">
                DESCRIÇÃO
              </span>
              <p className="text-sm text-gray-700 leading-relaxed font-normal">
                {task.description || 'Nenhum detalhe adicional.'}
              </p>
            </div>
          </div>

          {/* Card 2: Due Date */}
          <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-100 shadow-sm relative">
            <div className="flex items-center gap-4">
              <div className="bg-[#ECECEA] text-[#170C79] p-2.5 rounded-xl">
                <Calendar size={20} />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-gray-400 tracking-wider font-sans uppercase mb-0.5">
                  PRAZO
                </span>
                <span className="text-sm font-semibold block text-brand-primary">
                  {formatFriendlyDate(task.dueDate) || 'Definir data/hora'}
                </span>
              </div>
            </div>

            <div className="text-gray-400 text-xs font-semibold hover:text-brand-accent-cyan transition-colors cursor-pointer mr-1">
              {isEditingDate ? (
                <input
                  id="input-details-duedate"
                  type="date"
                  className="bg-transparent border-b border-gray-300 font-sans font-medium text-xs text-brand-primary outline-none focus:border-brand-accent-cyan"
                  value={task.dueDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  onBlur={() => setIsEditingDate(false)}
                  autoFocus
                />
              ) : (
                <span id="btn-edit-details-date" onClick={() => setIsEditingDate(true)}>Alterar ›</span>
              )}
            </div>
          </div>
        </div>

        {/* Subtasks Section */}
        <div>
          <div className="flex items-center justify-between border-b border-gray-200/50 pb-2 mb-3">
            <div className="flex items-center gap-2 text-md font-display font-bold text-[#170C79]">
              <ListTodo size={18} className="text-brand-primary" />
              <span>Subtarefas</span>
            </div>
            <span className="text-xs font-bold text-gray-400 tracking-wider">
              {totalSubtasksCount > 0 ? `${completedSubtasksCount} / ${totalSubtasksCount}` : '0/0'}
            </span>
          </div>

          {/* Subtask additions row input */}
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm mb-3">
            <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-400">
              <Plus size={14} />
            </div>
            <input
              id="input-new-subtask"
              type="text"
              placeholder="+ Nova subtarefa"
              className="flex-1 bg-transparent text-sm font-semibold focus:outline-none placeholder-gray-400 text-brand-primary"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
            />
            {newSubtaskTitle && (
              <button
                id="btn-add-subtask-cta"
                onClick={handleAddSubtask}
                className="text-xs font-bold text-brand-accent-cyan active:scale-95 transition-all cursor-pointer"
              >
                Adicionar
              </button>
            )}
          </div>

          {/* List subtask items */}
          {totalSubtasksCount > 0 ? (
            <div className="space-y-2.5">
              {task.subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  id={`subtask-item-${subtask.id}`}
                  className="bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm flex items-center justify-between"
                >
                  <label className="flex items-center gap-3 flex-1 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      className="peer hidden"
                      checked={subtask.completed}
                      onChange={() => handleToggleSubtask(subtask.id)}
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-[#8ACBD0] flex items-center justify-center peer-checked:bg-[#8ACBD0] peer-checked:border-transparent transition-all">
                      <CheckCircle
                        size={12}
                        className="text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                        fill="currentColor"
                      />
                    </div>
                    <span
                      className={`text-sm font-semibold text-brand-primary transition-all ${
                        subtask.completed ? 'line-through text-gray-400 font-normal' : ''
                      }`}
                    >
                      {subtask.title}
                    </span>
                  </label>

                  <button
                    id={`btn-delete-subtask-${subtask.id}`}
                    onClick={() => handleDeleteSubtask(subtask.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Subtask empty state layout (Screen 1) */
            <div className="flex flex-col items-center justify-center text-center py-8 px-4 select-none">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-[#8ACBD0]/60">
                <ListTodo size={28} />
              </div>
              <p className="text-xs font-semibold text-gray-400 tracking-wide max-w-[200px] leading-relaxed">
                Organize seus passos para concluir o objetivo maior.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer controls: Concluída toggle bottom banner and trash */}
      <div className="px-5 py-4 bg-[#F9F9F7] border-t border-gray-100 flex items-center gap-3 select-none">
        <button
          id="btn-toggle-task-completed"
          onClick={toggleTaskCompleted}
          className={`flex-1 py-3.5 rounded-xl font-display font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm ${
            task.completed
              ? 'bg-[#170C79] text-white hover:bg-brand-primary/90 cursor-pointer text-center'
              : 'bg-[#56B6C6] text-white hover:bg-[#4ea2b0] cursor-pointer text-center'
          }`}
        >
          <CheckCircle size={18} fill="none" strokeWidth={2.5} />
          {task.completed ? 'Reabrir Tarefa' : 'Concluída'}
        </button>

        <button
          id="btn-delete-task-trash"
          onClick={() => {
            if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
              onDeleteTask(task.id);
            }
          }}
          className="bg-gray-200/80 hover:bg-red-100 text-gray-600 hover:text-red-600 p-3.5 rounded-xl hover:shadow-sm active:scale-95 transition-all text-center cursor-pointer"
          title="Excluir tarefa"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
