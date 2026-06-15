import { Task } from './types';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Levar carro na oficina',
    description: 'Revisão dos 30.000 km, trocar óleo e pastilhas de freio.',
    completed: false,
    starred: true,
    dueDate: '2026-06-09',
    priority: 'Alta',
    categories: ['Pessoal'],
    subtasks: [
      { id: 'sub-1-1', title: 'Agendar horário na concessionária', completed: true },
      { id: 'sub-1-2', title: 'Pedir orçamento das peças', completed: false }
    ],
    completedAt: undefined
  },
  {
    id: 'task-2',
    title: 'Comprar novo tênis',
    description: 'Tênis de corrida com bom amortecimento para o treino de maratona.',
    completed: false,
    starred: true,
    dueDate: '2026-06-10',
    priority: 'Média',
    categories: ['Saúde', 'Pessoal'],
    subtasks: [],
    completedAt: undefined
  },
  {
    id: 'task-3',
    title: 'Limpar a área',
    description: 'Detalhes da tarefa',
    completed: false,
    starred: false,
    dueDate: '2026-06-08',
    priority: 'Baixa',
    categories: ['Pessoal'],
    subtasks: [
      { id: 'sub-3-1', title: 'Nova tarefa', completed: false }
    ],
    completedAt: undefined
  },
  {
    id: 'task-4',
    title: 'Formatar Notebook',
    description: 'Fazer backup do drive C:, reinstalar Windows 11 e softwares de trabalho.',
    completed: false,
    starred: false,
    dueDate: '2026-06-11',
    priority: 'Alta',
    categories: ['Trabalho'],
    subtasks: [],
    completedAt: undefined
  },
  {
    id: 'task-5',
    title: 'Fazer imposto de renda',
    description: 'Declarar rendimentos de 2025, informes de bancos e recibos médicos.',
    completed: false,
    starred: false,
    dueDate: '2026-06-12',
    priority: 'Alta',
    categories: ['Trabalho', 'Pessoal'],
    subtasks: [],
    completedAt: undefined
  },
  {
    id: 'task-6',
    title: 'Remarcar a consulta',
    description: 'Consulta periódica com o cardiologista.',
    completed: false,
    starred: true,
    dueDate: '2026-06-13',
    priority: 'Média',
    categories: ['Saúde'],
    subtasks: [],
    completedAt: undefined
  },
  {
    id: 'task-7',
    title: 'Trocar lâmpada de fora',
    description: 'Comprar lâmpada LED 15W branca quente para o quintal e substituir.',
    completed: false,
    starred: false,
    dueDate: '2026-06-08',
    priority: 'Baixa',
    categories: ['Pessoal'],
    subtasks: [],
    completedAt: undefined
  }
];

export function getStoredTasks(): Task[] {
  try {
    const data = localStorage.getItem('logi_tasks');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading localStorage logi_tasks', e);
  }
  return INITIAL_TASKS;
}

export function setStoredTasks(tasks: Task[]): void {
  try {
    localStorage.setItem('logi_tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error('Error writing localStorage logi_tasks', e);
  }
}

export function getStoredCategories(): string[] {
  try {
    const data = localStorage.getItem('logi_categories');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading localStorage logi_categories', e);
  }
  return ['Trabalho', 'Pessoal', 'Saúde'];
}

export function setStoredCategories(categories: string[]): void {
  try {
    localStorage.setItem('logi_categories', JSON.stringify(categories));
  } catch (e) {
    console.error('Error writing localStorage logi_categories', e);
  }
}

// Helpers for formatted date representations
export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return 'Sem data';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const day = parts[2];
  const month = months[date.getMonth()];
  return `${day} de ${month}`;
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
