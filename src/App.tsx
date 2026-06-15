import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Search, X, CheckSquare, Calendar, Timer, User, HelpCircle, Sparkles, TrendingUp, ChevronRight, Briefcase, Plus, BookOpen } from 'lucide-react';

import { Task, ActiveTab } from './types';
import { getStoredTasks, setStoredTasks } from './utils';

// Import modular components
import TaskList from './components/TaskList';
import TaskDetails from './components/TaskDetails';
import NewTask from './components/NewTask';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import FocusTimer from './components/FocusTimer';
import QuickAdd from './components/QuickAdd';
import CalendarView from './components/CalendarView';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('tasks');
  
  // Custom screen stack navigators
  const [currentView, setCurrentView] = useState<'main' | 'task-details' | 'new-task' | 'settings' | 'productivity'>('main');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // Quick transition states
  const [quickAddTitle, setQuickAddTitle] = useState('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Search and Tag filters
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filterCategory, setFilterCategory] = useState('Todas as tarefas');

  // Load initial tasks from storage
  useEffect(() => {
    setTasks(getStoredTasks());
  }, []);

  // Persist tasks state
  const handleUpdateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    setStoredTasks(newTasks);
  };

  // Task Actions
  const handleToggleComplete = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });
    handleUpdateTasks(updated);
  };

  const handleToggleStar = (taskId: string) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, starred: !t.starred } : t));
    handleUpdateTasks(updated);
  };

  const handleSaveFullTask = (taskData: Omit<Task, 'id' | 'completed' | 'subtasks'>) => {
    if (selectedTaskId && currentView === 'new-task') {
      // Editing existing task
      const updated = tasks.map((t) => {
        if (t.id === selectedTaskId) {
          return {
            ...t,
            ...taskData,
          };
        }
        return t;
      });
      handleUpdateTasks(updated);
    } else {
      // Creating new task
      const newTaskObj: Task = {
        id: `task-${Date.now()}`,
        title: taskData.title,
        description: taskData.description,
        completed: false,
        starred: taskData.starred,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        categories: taskData.categories,
        subtasks: [],
      };
      handleUpdateTasks([newTaskObj, ...tasks]);
    }
    
    // Reset view stacks
    setCurrentView('main');
    setSelectedTaskId(null);
    setQuickAddTitle('');
  };

  const handleQuickAddSave = (taskData: { title: string; starred: boolean; dueDate: string }) => {
    const newQuickTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      description: 'Detalhes da tarefa',
      completed: false,
      starred: taskData.starred,
      dueDate: taskData.dueDate,
      priority: 'Média',
      categories: ['Pessoal'],
      subtasks: [
        { id: `sub-${Date.now()}`, title: 'Nova tarefa', completed: false }
      ],
    };
    handleUpdateTasks([newQuickTask, ...tasks]);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    handleUpdateTasks(updated);
    setCurrentView('main');
    setSelectedTaskId(null);
  };

  const handleUpdateTaskInDetails = (updatedTask: Task) => {
    const updated = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    handleUpdateTasks(updated);
  };

  // Searching query trigger
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Filter tasks in real-time with search queries
  const searchedTasks = tasks.filter((t) => {
    if (!searchQuery.trim()) return true;
    return (
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const activeTaskObj = tasks.find((t) => t.id === selectedTaskId) || null;

  // Render Stack router inside the phone frame mockup
  const renderCurrentView = () => {
    // If details screen is stacked
    if (currentView === 'task-details' && activeTaskObj) {
      return (
        <TaskDetails
          task={activeTaskObj}
          onBack={() => setCurrentView('main')}
          onUpdateTask={handleUpdateTaskInDetails}
          onDeleteTask={handleDeleteTask}
        />
      );
    }

    // If new/edit task editor is stacked
    if (currentView === 'new-task') {
      return (
        <NewTask
          initialTitle={quickAddTitle}
          taskToEdit={selectedTaskId ? activeTaskObj : null}
          onClose={() => {
            setCurrentView('main');
            setSelectedTaskId(null);
            setQuickAddTitle('');
          }}
          onSave={handleSaveFullTask}
        />
      );
    }

    // If settings view is stacked
    if (currentView === 'settings') {
      return (
        <Settings
          onClose={() => setCurrentView('main')}
          onGoToProductivity={() => setCurrentView('productivity')}
        />
      );
    }

    // If separate productivity view is stacked
    if (currentView === 'productivity') {
      return (
        <div className="bg-[#F9F9F7] min-h-screen">
          <div className="bg-[#170C79] text-white px-4 py-4 flex items-center gap-3">
            <button
              id="btn-productivity-back"
              onClick={() => setCurrentView('main')}
              className="p-1 hover:bg-white/10 rounded cursor-pointer"
            >
              <X size={24} />
            </button>
            <span className="font-display font-bold text-lg">Métricas Thiago</span>
          </div>
          <Dashboard />
        </div>
      );
    }

    // Default Main tab rendering selection
    switch (activeTab) {
      case 'calendar':
        return (
          <CalendarView
            tasks={searchedTasks}
            onToggleComplete={handleToggleComplete}
            onSelectTask={(id) => {
              setSelectedTaskId(id);
              setCurrentView('task-details');
            }}
          />
        );
      case 'focus':
        return <FocusTimer />;
      case 'profile':
        return (
          <Dashboard />
        );
      case 'tasks':
      default:
        return (
          <TaskList
            tasks={searchedTasks}
            onToggleComplete={handleToggleComplete}
            onToggleStar={handleToggleStar}
            onSelectTask={(id) => {
              setSelectedTaskId(id);
              setCurrentView('task-details');
            }}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
          />
        );
    }
  };

  const pendingStarredCount = tasks.filter(t => t.starred && !t.completed).length;

  return (
    <div id="app-viewport-container" className="min-h-screen bg-[#ECECEA] dark:bg-[#1A1C1B] font-sans transition-colors duration-300 flex justify-center py-0 md:py-6 relative">
      
      {/* Visual background decorations in desktop mode */}
      <div className="hidden lg:block absolute left-10 top-1/2 -translate-y-1/2 w-72 space-y-4 select-none">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-[#170C79] dark:text-[#8ACBD0]">
            <Sparkles size={20} />
            <span className="font-display font-bold text-lg">Logi Workspace</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed dark:text-gray-400">
            Acompanhe suas metas de forma minimalista. Use os menus de navegação do dispositivo simulado no centro para transitar entre a lista, calendário, cronômetro pomodoro e gráficos de performance.
          </p>
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estrelas Pendentes</span>
            <span className="bg-[#DFE5EA] dark:bg-gray-800 px-2 py-0.5 rounded-full text-xs font-bold text-brand-primary dark:text-[#ECECEA]">
              {pendingStarredCount}
            </span>
          </div>
        </div>
      </div>

      {/* Main Core smartphone frame wrapper mockup strictly centering the screens */}
      <div id="smartphone-mockframe" className="relative w-full max-w-md bg-[#F9F9F7] dark:bg-[#121214] min-h-screen md:min-h-[850px] md:max-h-[920px] md:rounded-[36px] flex flex-col justify-between overflow-hidden shadow-2xl border-0 md:border-[10px] md:border-slate-800/90">
        
        {/* Phone Speaker & Notch Camera line placeholder */}
        <div className="hidden md:flex absolute top-0 left-0 right-0 h-6 bg-slate-800 items-center justify-center z-50">
          <div className="w-16 h-4 bg-black rounded-b-xl flex items-center justify-center">
            <div className="w-8 h-1 bg-gray-600 rounded-full" />
          </div>
        </div>

        {/* Header container wrapper (Only inside main tab selector screen view) */}
        {currentView === 'main' && (
          <header className="bg-[#170C79] text-white px-4 pt-4 md:pt-10 pb-4 flex items-center justify-between shadow-md select-none">
            {/* Hamburger trigger */}
            <button
              id="sidebar-toggle-trigger"
              onClick={() => setIsSidebarOpen(true)}
              className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
            >
              <Menu size={24} />
            </button>

            {/* Application Brand Title */}
            <span className="font-display font-bold text-xl tracking-wide">
              {activeTab === 'tasks' ? 'Logi' : activeTab === 'calendar' ? 'Calendário' : activeTab === 'focus' ? 'Foco' : 'Perfil'}
            </span>

            {/* Profile Avatar & Search bar indicators */}
            <div className="flex items-center gap-3">
              <button
                id="search-header-trigger"
                onClick={() => setIsSearching(!isSearching)}
                className={`p-1 hover:bg-white/10 rounded transition-colors cursor-pointer ${
                  isSearching ? 'text-brand-accent-cyan bg-white/15' : ''
                }`}
              >
                <Search size={22} />
              </button>

              <button
                id="btn-profile-thumbnail-trigger"
                onClick={() => setCurrentView('settings')}
                className="w-8 h-8 rounded-full overflow-hidden border border-[#8ACBD0] hover:scale-105 active:scale-95 transition-all cursor-pointer bg-[#DFE5EA]"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                  alt="Thiago Miniature Avatar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </header>
        )}

        {/* Real-time search panel underneath title header */}
        {currentView === 'main' && isSearching && (
          <div className="bg-white border-b border-gray-100 p-3.5 flex items-center gap-2 select-none">
            <Search size={18} className="text-gray-400" />
            <input
              id="input-search"
              type="text"
              placeholder="Pesquisar nas tarefas de Thiago..."
              className="w-full text-xs font-semibold focus:outline-none p-1 text-brand-primary placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-500">
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Render active application view screen inside stack */}
        <div className="flex-1 overflow-y-auto">
          {renderCurrentView()}
        </div>

        {/* Persistent Bottom Tab Navigation (Only under Main view state screen stacks) */}
        {currentView === 'main' && (
          <nav className="bg-[#170C79] border-t border-brand-primary/10 h-18 flex items-center justify-around px-4 select-none z-41 pb-2">
            {[
              { id: 'tasks', label: 'Tasks', icon: CheckSquare },
              { id: 'calendar', label: 'Calendar', icon: Calendar },
              { id: 'focus', label: 'Focus', icon: Timer },
              { id: 'profile', label: 'Profile', icon: User }
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  id={`bottom-tab-link-${tab.id}`}
                  onClick={() => {
                    setActiveTab(tab.id as ActiveTab);
                    setIsSearching(false);
                    setSearchQuery('');
                  }}
                  className={`relative flex items-center justify-center gap-2.5 px-4 py-2 rounded-2xl transition-all cursor-pointer outline-none active:scale-95 ${
                    isActive
                      ? 'bg-[#8ACBD0] text-[#170C79] font-bold shadow-sm'
                      : 'text-white/60 hover:text-white flex-col items-center gap-1 text-[10px]'
                  }`}
                >
                  <IconComponent size={isActive ? 20 : 20} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive ? (
                    <span className="text-xs font-sans font-bold uppercase tracking-wide">
                      {tab.label}
                    </span>
                  ) : (
                    <span className="text-[9px] font-sans font-semibold text-white/50 tracking-wider">
                      {tab.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Left Side Hamburger Sliding Menu Drawer Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Sidebar backdrop */}
              <motion.div
                id="sidebar-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="absolute inset-0 bg-black z-51"
              />

              {/* Sidebar itself */}
              <motion.div
                id="sidebar-container"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="absolute top-0 bottom-0 left-0 w-3/4 max-w-[280px] bg-white dark:bg-[#121214] shadow-2xl p-5 z-52 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* Sidebar Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                    <span className="font-display font-bold text-xl text-[#170C79] dark:text-[#8ACBD0]">Logi Menu</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                      <X size={20} />
                    </button>
                  </div>

                  {/* Sidebar User Info */}
                  <div className="flex items-center gap-3 bg-[#E8E8E6]/40 dark:bg-gray-900 rounded-2xl p-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                      alt="Thiago Sidebar avatar"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full border border-brand-accent-turquoise object-cover"
                    />
                    <div>
                      <span className="block font-bold text-sm text-[#170C79] dark:text-white">Thiago</span>
                      <span className="block text-[10px] text-gray-400">thiago@beltrano.com</span>
                    </div>
                  </div>

                  {/* Category Lists Shortcuts */}
                  <div className="space-y-1.5 pt-2">
                    <span className="block text-[9px] font-bold text-gray-400 tracking-wider uppercase mb-1">CATEGORIAS</span>
                    {[
                      { name: 'Todas as tarefas', filter: 'Todas as tarefas', icon: BookOpen },
                      { name: 'Trabalho', filter: 'Trabalho', icon: Briefcase },
                      { name: 'Pessoal', filter: 'Pessoal', icon: User },
                    ].map((cat) => {
                      const CatIconComp = cat.icon;
                      const active = filterCategory === cat.filter;
                      return (
                        <button
                          key={cat.name}
                          id={`btn-sidebar-filter-${cat.name}`}
                          onClick={() => {
                            setFilterCategory(cat.filter);
                            setActiveTab('tasks');
                            setIsSidebarOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                            active
                              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-brand-primary'
                              : 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-brand-primary dark:text-[#ECECEA]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <CatIconComp size={15} />
                            <span>{cat.name}</span>
                          </div>
                          <ChevronRight size={14} className="text-gray-400" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sidebar Footer info */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <HelpCircle size={15} />
                    <span>Logi v1.0.0</span>
                  </div>
                  <span className="font-semibold text-[10px]">Thiago © 2026</span>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Sliding Quick Add Task Drawer */}
        <QuickAdd
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          onSave={handleQuickAddSave}
          onOpenFullEdit={(title) => {
            setQuickAddTitle(title);
            setCurrentView('new-task');
          }}
        />

      </div>
    </div>
  );
}
