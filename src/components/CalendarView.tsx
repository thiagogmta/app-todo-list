import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, CalendarDays, Inbox } from 'lucide-react';
import { Task } from '../types';
import { formatFriendlyDate } from '../utils';

interface CalendarViewProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onSelectTask: (taskId: string) => void;
}

export default function CalendarView({ tasks, onToggleComplete, onSelectTask }: CalendarViewProps) {
  // Current time is June 2026
  const [currentYear] = useState(2026);
  const [currentMonth] = useState(5); // June is index 5 (0-11)
  const [selectedDay, setSelectedDay] = useState(8); // Start with today, June 8th, 2026

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysInMonth = 30; // June has 30 days
  const startDayOfWeek = 1; // June 1st, 2026 is a Monday (index 1 when Sunday is 0)

  // Generate blank grids before Month Day 1
  const blanks = Array(startDayOfWeek).fill(null);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Helper to format date key YYYY-MM-DD
  const makeDateKey = (day: number) => {
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${currentYear}-${mm}-${dd}`;
  };

  const selectedDateStr = makeDateKey(selectedDay);

  // Tasks due on the selected day
  const selectedDayTasks = tasks.filter((t) => t.dueDate === selectedDateStr);

  return (
    <div id="calendar-screen" className="pb-16 max-w-md mx-auto text-brand-primary px-5 py-6 space-y-6 select-none">
      
      {/* Calendar Header selector title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="text-[#170C79]" size={22} />
          <h3 className="font-display font-bold text-xl text-[#170C79]">
            {monthNames[currentMonth]} {currentYear}
          </h3>
        </div>
        
        <div className="flex gap-1">
          <button className="p-1 hover:bg-gray-100 rounded text-gray-400 cursor-not-allowed">
            <ChevronLeft size={20} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded text-gray-400 cursor-not-allowed">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Week Day Labels */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="grid grid-cols-7 text-center text-[10px] font-bold text-gray-400 font-sans tracking-wider mb-3">
          <span>DOM</span>
          <span>SEG</span>
          <span>TER</span>
          <span>QUA</span>
          <span>QUI</span>
          <span>SEX</span>
          <span>SAB</span>
        </div>

        {/* Date Nodes Grid */}
        <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center">
          {/* Render blanks */}
          {blanks.map((_, i) => (
            <div key={`blank-${i}`} className="h-9" />
          ))}

          {/* Render days */}
          {daysArray.map((day) => {
            const dateKey = makeDateKey(day);
            const isSelected = selectedDay === day;
            const hasTasks = tasks.some((t) => t.dueDate === dateKey && !t.completed);
            
            return (
              <button
                key={day}
                id={`calendar-day-node-${day}`}
                onClick={() => setSelectedDay(day)}
                className={`h-9 w-9 rounded-full flex flex-col items-center justify-center relative font-sans font-semibold text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#170C79] text-white shadow-md font-bold'
                    : 'text-brand-primary hover:bg-gray-100'
                }`}
              >
                <span>{day}</span>
                {/* Event Indicator Bullet dot */}
                {hasTasks && !isSelected && (
                  <div className="absolute bottom-1 w-1 h-1 bg-[#8ACBD0] rounded-full" />
                )}
                {hasTasks && isSelected && (
                  <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Header */}
      <div className="space-y-3.5">
        <div className="border-b border-gray-200/50 pb-2 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 tracking-wider font-sans uppercase">
            AGENDA • {formatFriendlyDate(selectedDateStr)}
          </span>
          <span className="text-xs font-bold text-brand-accent-cyan">
            {selectedDayTasks.length} {selectedDayTasks.length === 1 ? 'tarefa' : 'tarefas'}
          </span>
        </div>

        {/* Day Agenda Lists */}
        {selectedDayTasks.length > 0 ? (
          <div className="space-y-2">
            {selectedDayTasks.map((task) => (
              <div
                key={task.id}
                id={`calendar-agenda-task-${task.id}`}
                onClick={() => onSelectTask(task.id)}
                className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-xs flex items-center justify-between hover:border-gray-200 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    id={`btn-calendar-complete-${task.id}`}
                    onClick={() => onToggleComplete(task.id)}
                    className="p-0.5 cursor-pointer"
                  >
                    <div className="w-5.5 h-5.5 rounded-full border-2 border-[#8ACBD0] flex items-center justify-center hover:bg-[#8ACBD0]/10 transition-all">
                      {task.completed && <CheckCircle size={12} className="text-[#8ACBD0]" fill="currentColor" />}
                    </div>
                  </button>
                  <span className={`text-xs font-bold tracking-wide truncate text-[#170C79] ${task.completed ? 'line-through text-gray-400 font-normal' : ''}`}>
                    {task.title}
                  </span>
                </div>
                
                <span className="inline-block bg-gray-100 text-[9px] font-bold text-gray-400/85 tracking-wider font-sans px-2 py-0.5 rounded uppercase">
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/80 rounded-2xl p-6 text-center border border-gray-100/50 shadow-xs flex flex-col items-center justify-center py-8">
            <Inbox size={22} className="text-gray-300 mb-2" />
            <span className="text-xs font-semibold text-gray-400">Nenhum compromisso para este dia.</span>
          </div>
        )}
      </div>

    </div>
  );
}
