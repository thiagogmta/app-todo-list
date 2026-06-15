export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export type TaskPriority = 'Baixa' | 'Média' | 'Alta';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  starred: boolean;
  dueDate: string; // ISO date string: YYYY-MM-DD
  priority: TaskPriority;
  categories: string[];
  subtasks: Subtask[];
  completedAt?: string; // For analytics productivity charts
}

export type ActiveTab = 'tasks' | 'calendar' | 'focus' | 'profile';

export type ViewState = 'main' | 'task-details' | 'new-task' | 'settings' | 'productivity';

export interface ProductivityStats {
  weeklyAverage: number;
  completedCount: number;
  dailyStats: {
    day: string; // 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'
    count: number;
    active?: boolean;
    colorCode?: 'default' | 'primary' | 'accent';
  }[];
  peakHour: string; // e.g., '09:00 - 11:30'
  mostProductiveDay: string; // e.g., 'Quinta-feira'
  streakDays: number;
}
