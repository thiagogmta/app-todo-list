import { motion } from 'motion/react';
import { TrendingUp, Zap, Clock, CheckCircle } from 'lucide-react';
import { ProductivityStats } from '../types';

interface DashboardProps {
  stats?: ProductivityStats;
}

const DEFAULT_STATS: ProductivityStats = {
  weeklyAverage: 176,
  completedCount: 1235,
  dailyStats: [
    { day: 'SEG', count: 90, colorCode: 'default' },
    { day: 'TER', count: 210, colorCode: 'primary' },
    { day: 'QUA', count: 120, colorCode: 'default' },
    { day: 'QUI', count: 235, colorCode: 'accent', active: true },
    { day: 'SEX', count: 185, colorCode: 'primary' },
    { day: 'SAB', count: 70, colorCode: 'default' },
    { day: 'DOM', count: 52, colorCode: 'default' }
  ],
  peakHour: '09:00 - 11:30',
  mostProductiveDay: 'Quinta-feira',
  streakDays: 15
};

export default function Dashboard({ stats = DEFAULT_STATS }: DashboardProps) {
  // Encontrar o maior para fins de proporção de escala da altura do gráfico
  const maxCount = Math.max(...stats.dailyStats.map(d => d.count));

  return (
    <div id="productivity-screen" className="pb-16 select-none max-w-md mx-auto text-brand-primary">
      {/* Profile Header Header */}
      <div className="bg-white p-5 flex items-center gap-4 border-b border-gray-100 shadow-xs">
        <div className="relative">
          <img
            id="img-dashboard-avatar"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
            alt="Thiago Avatar Thumbnail"
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full border-2 border-brand-accent-turquoise object-cover"
          />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
        </div>
        <div>
          <h2 className="font-display font-bold text-2xl tracking-tight text-[#170C79]">Thiago</h2>
          <p className="text-[13px] text-gray-500 font-medium">
            <span className="font-bold text-[#8ACBD0]">{stats.completedCount}</span> tarefas concluídas
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="px-5 py-6 space-y-6">
        <div>
          <h3 className="font-display font-bold text-xl text-[#170C79]">
            Gráfico de Produtividade
          </h3>
        </div>

        {/* Chart card */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 tracking-wider font-sans uppercase block mb-1">
            MÉDIA SEMANAL
          </span>
          
          {/* Main Stat Row */}
          <div className="flex items-baseline justify-between mb-6">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-display font-bold tracking-tight text-[#170C79]">{stats.weeklyAverage}</span>
              <span className="text-xs font-semibold text-gray-500">tarefas/dia</span>
            </div>
            
            <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp size={12} />
              <span>+12%</span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-44 flex items-end justify-between px-2 pt-4 relative">
            {/* Grid Line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-gray-100 z-0 pointer-events-none" />

            {stats.dailyStats.map((d) => {
              // Calcular altura proporcional baseada em maxCount
              const percentageHeight = Math.max(15, (d.count / maxCount) * 100);
              
              // Determinar cores do gráfico conforme o mockup
              let barColor = 'bg-gray-200/80 hover:bg-gray-300'; // default neutral
              let textWeight = 'font-semibold text-gray-400';
              
              if (d.colorCode === 'primary') {
                barColor = 'bg-[#170C79] hover:bg-[#2c228c]';
              } else if (d.colorCode === 'accent') {
                barColor = 'bg-[#8ACBD0] hover:bg-[#73b2b7] shadow-xs';
                textWeight = 'font-bold text-[#170C79]';
              }

              return (
                <div key={d.day} className="flex flex-col items-center gap-2.5 z-10 flex-1">
                  {/* Hover tooltip showing task count */}
                  <div className="group relative w-full flex justify-center">
                    <span className="absolute -top-7 scale-0 transition-all rounded bg-brand-primary p-1 text-[10px] text-white opacity-0 group-hover:scale-100 group-hover:opacity-100 z-20 font-bold font-sans">
                      {d.count} t
                    </span>
                    
                    {/* Animated Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${percentageHeight}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`w-4.5 rounded-full cursor-pointer transition-colors ${barColor}`}
                    />
                  </div>

                  {/* Day Label */}
                  <span className={`text-[10px] tracking-wider uppercase font-sans ${textWeight}`}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Highlights Row */}
        <div className="space-y-3.5">
          {/* Card 1: Most productive day (Deep Navy) */}
          <div className="bg-[#170C79] rounded-2xl p-5 text-white flex items-center justify-between shadow-sm">
            <div className="space-y-0.5">
              <span className="block text-[10px] font-bold text-white/60 tracking-wider font-sans uppercase">
                Dia mais produtivo
              </span>
              <span className="text-lg font-display font-bold block">
                {stats.mostProductiveDay}
              </span>
            </div>
            <div className="bg-white/10 p-3 rounded-xl text-[#8ACBD0]">
              <Zap size={22} fill="currentColor" />
            </div>
          </div>

          {/* Card 2: Peak Hours (Turquoise) */}
          <div className="bg-[#8ACBD0] rounded-2xl p-5 text-[#170C79] flex items-center justify-between shadow-sm">
            <div className="space-y-0.5">
              <span className="block text-[10px] font-bold text-[#170C79]/60 tracking-wider font-sans uppercase">
                Horário de Pico
              </span>
              <span className="text-lg font-display font-bold block">
                {stats.peakHour}
              </span>
            </div>
            <div className="bg-[#170C79]/10 p-3 rounded-xl text-[#170C79]">
              <Clock size={22} />
            </div>
          </div>

          {/* Card 3: Consistency (Gray container lowest) */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="block text-[10px] font-bold text-gray-400 tracking-wider font-sans uppercase">
                Consistência
              </span>
              <span className="text-lg font-display font-bold block text-[#170C79]">
                {stats.streakDays} dias seguidos
              </span>
            </div>
            
            {/* Visual double checklists indicators checks badge */}
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-[#8ACBD0]/20 flex items-center justify-center text-[#8ACBD0]">
                <CheckCircle size={16} fill="currentColor" className="text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#8ACBD0]/20 flex items-center justify-center text-[#8ACBD0]">
                <CheckCircle size={16} fill="currentColor" className="text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#8ACBD0]/20 flex items-center justify-center text-[#8ACBD0]">
                <CheckCircle size={16} fill="currentColor" className="text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-sans font-bold text-xs border border-gray-200">
                4
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
