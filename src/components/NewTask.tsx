import { useState, useEffect } from 'react';
import { X, MoreVertical, Calendar, Briefcase, User, Shield, Check, Plus, Tag } from 'lucide-react';
import { Task, TaskPriority } from '../types';
import { formatFriendlyDate, getTodayDateString } from '../utils';

interface NewTaskProps {
  initialTitle?: string;
  taskToEdit?: Task | null;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'completed' | 'subtasks'>) => void;
}

export default function NewTask({ initialTitle = '', taskToEdit = null, onClose, onSave }: NewTaskProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTodayDateString());
  const [priority, setPriority] = useState<TaskPriority>('Média');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Pessoal']);
  
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  // Sincroniza se for edição
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setDueDate(taskToEdit.dueDate);
      setPriority(taskToEdit.priority);
      setSelectedCategories(taskToEdit.categories);
    } else if (initialTitle) {
      setTitle(initialTitle);
    }
  }, [taskToEdit, initialTitle]);

  const handleToggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleAddNewTag = () => {
    if (newTagInput.trim()) {
      const tag = newTagInput.trim();
      if (!customTags.includes(tag)) {
        setCustomTags([...customTags, tag]);
        setSelectedCategories([...selectedCategories, tag]);
      }
      setNewTagInput('');
      setIsAddingTag(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate,
      priority: priority,
      categories: selectedCategories,
      starred: taskToEdit ? taskToEdit.starred : false,
    });
  };

  // Pre-defined categories helpers
  const presets = [
    { name: 'Trabalho', icon: Briefcase, colorClass: 'bg-[#0F0A3E] text-white border-transparent' },
    { name: 'Pessoal', icon: User, colorClass: 'bg-white text-brand-primary border-gray-200' },
    { name: 'Saúde', icon: Shield, colorClass: 'bg-white text-brand-primary border-gray-200' },
  ];

  return (
    <div id="new-task-screen" className="min-h-screen bg-[#F9F9F7] max-w-md mx-auto flex flex-col justify-between shadow-lg text-brand-primary">
      {/* Header */}
      <div className="bg-[#170C79] text-white px-4 py-4 flex items-center justify-between shadow-md">
        <button id="btn-new-task-close" onClick={onClose} className="p-1 hover:bg-white/10 rounded cursor-pointer">
          <X size={24} />
        </button>
        <span className="font-display font-bold text-lg">
          {taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
        </span>
        <button id="btn-new-task-menu" className="p-1 hover:bg-white/10 rounded cursor-pointer">
          <MoreVertical size={24} />
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 tracking-wider font-sans uppercase mb-1">
            TÍTULO DA TAREFA
          </label>
          <input
            id="input-task-title"
            type="text"
            className="w-full bg-transparent font-medium border-b border-gray-300 py-2 focus:outline-none focus:border-brand-accent-cyan text-brand-primary placeholder-gray-400 text-lg"
            placeholder="O que precisa ser feito?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 tracking-wider font-sans uppercase mb-1">
            DESCRIÇÃO
          </label>
          <textarea
            id="input-task-desc"
            className="w-full bg-white border border-gray-100 rounded-xl p-4 h-32 focus:outline-none focus:ring-1 focus:ring-brand-accent-cyan focus:border-transparent text-sm text-brand-primary placeholder-gray-400 resize-none shadow-sm"
            placeholder="Adicione mais detalhes sobre esta tarefa..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Due Date Selector */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 tracking-wider font-sans uppercase mb-2">
            DATA DE ENTREGA
          </label>
          <div className="relative bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm hover:border-gray-300">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-brand-primary" />
              <div>
                <span className="block text-[11px] text-gray-400 font-bold tracking-wider">Selecione a data</span>
                <span className="text-sm font-semibold">{formatFriendlyDate(dueDate)}</span>
              </div>
            </div>
            
            {/* HTML Input over it or custom picker */}
            <input
              id="input-task-duedate"
              type="date"
              className="absolute inset-0 opacity-0 cursor-pointer"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        {/* Priority Segmented Control */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 tracking-wider font-sans uppercase mb-2">
            PRIORIDADE
          </label>
          <div className="grid grid-cols-3 bg-gray-200/60 p-1 rounded-xl border border-gray-100 shadow-inner">
            {(['Baixa', 'Média', 'Alta'] as TaskPriority[]).map((p) => {
              const active = priority === p;
              return (
                <button
                  key={p}
                  id={`btn-priority-${p}`}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    active
                      ? 'bg-white text-brand-primary shadow-sm transform scale-102 font-bold'
                      : 'text-gray-500 hover:text-brand-primary'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[11px] font-bold text-gray-400 tracking-wider font-sans uppercase">
              CATEGORIAS
            </label>
            <button
              id="btn-add-tag-toggle"
              type="button"
              onClick={() => setIsAddingTag(!isAddingTag)}
              className="text-xs font-bold text-brand-accent-cyan flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={14} /> Nova Tag
            </button>
          </div>

          {isAddingTag && (
            <div className="flex items-center gap-2 mb-3 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
              <input
                id="input-new-tag"
                type="text"
                placeholder="Nome da tag..."
                className="w-full text-xs font-medium focus:outline-none p-1 text-brand-primary"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNewTag()}
              />
              <button
                id="btn-save-tag"
                onClick={handleAddNewTag}
                className="bg-brand-accent-cyan text-white p-1 rounded hover:bg-[#43a1b0] transition-colors cursor-pointer"
              >
                <Check size={14} />
              </button>
              <button
                id="btn-cancel-tag"
                onClick={() => setIsAddingTag(false)}
                className="bg-gray-100 text-gray-500 p-1 rounded hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {/* List presets */}
            {presets.map((preset) => {
              const active = selectedCategories.includes(preset.name);
              const IconComp = preset.icon;
              return (
                <button
                  key={preset.name}
                  id={`btn-tag-${preset.name}`}
                  type="button"
                  onClick={() => handleToggleCategory(preset.name)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? preset.colorClass === 'bg-white text-brand-primary border-gray-200' 
                        ? 'bg-brand-primary text-white border-transparent shadow-sm'
                        : preset.colorClass
                      : 'bg-white text-brand-primary border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <IconComp size={12} />
                  {preset.name}
                </button>
              );
            })}

            {/* Custom tags */}
            {customTags.map((tag) => {
              const active = selectedCategories.includes(tag);
              return (
                <button
                  key={tag}
                  id={`btn-tag-${tag}`}
                  type="button"
                  onClick={() => handleToggleCategory(tag)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#0E0A3E] text-white border-transparent'
                      : 'bg-white text-brand-primary border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Tag size={12} />
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Plant succulent visual decoration card (Screen 6) */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col pt-0 pb-0">
          <div className="flex border-b border-gray-100">
            <div className="w-[40%] bg-cover bg-center h-28" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=300')` }}>
            </div>
            <div className="w-[60%] bg-[#DFE5EA] flex items-center justify-center p-3">
              <div className="bg-white rounded-md p-2 shadow-xs w-full max-w-[150px] border border-gray-100">
                <div className="w-full h-1 bg-[#170C79]/20 rounded mb-1" />
                <div className="w-3/4 h-1 bg-[#170C79]/20 rounded mb-2.5" />
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-3 h-3 rounded-full border border-gray-400" />
                  <div className="w-10 h-1 bg-[#170C79]/40 rounded" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border border-gray-400" />
                  <div className="w-12 h-1 bg-[#170C79]/40 rounded" />
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white text-center">
            <p className="text-xs font-semibold text-gray-500 tracking-wide">
              Organize sua rotina com clareza.
            </p>
          </div>
        </div>
      </div>

      {/* Button CTA */}
      <div className="px-5 py-4 bg-white border-t border-gray-100 select-none">
        <button
          id="btn-save-task-cta"
          onClick={handleSave}
          disabled={!title.trim()}
          className={`w-full py-3 rounded-xl font-display font-bold text-sm tracking-wide flex items-center justify-center gap-1.5 transition-all text-[#170C79] ${
            title.trim()
              ? 'bg-[#8ACBD0] hover:bg-[#78b3b7] cursor-pointer shadow-md scroll-smooth active:scale-[0.99]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Check size={18} strokeWidth={2.5} />
          {taskToEdit ? 'Salvar Alterações' : 'Salvar Tarefa'}
        </button>
      </div>
    </div>
  );
}
