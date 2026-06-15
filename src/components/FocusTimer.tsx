import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flame, Sparkles, Smile } from 'lucide-react';

export default function FocusTimer() {
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getPresetTime = (selectedMode: typeof mode) => {
    switch (selectedMode) {
      case 'focus':
        return 25 * 60;
      case 'shortBreak':
        return 5 * 60;
      case 'longBreak':
        return 15 * 60;
    }
  };

  const handleModeChange = (newMode: typeof mode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(getPresetTime(newMode));
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            // Alert completed
            alert(mode === 'focus' ? 'Foco completo! Excelente trabalho.' : 'Pausa finalizada! Pronto para retomar?');
            return getPresetTime(mode);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const handleTogglePlay = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(getPresetTime(mode));
  };

  const formatTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  // Circular calculations
  const totalDuration = getPresetTime(mode);
  const dashOffset = 339 - (339 * timeLeft) / totalDuration; // circle length approx 339 for radius 54

  return (
    <div id="focus-timer-screen" className="pb-16 max-w-md mx-auto text-brand-primary px-5 py-6 space-y-6 select-none">
      <div className="text-center space-y-1">
        <h3 className="font-display font-bold text-2xl text-[#170C79]">Foco Concentrado</h3>
        <p className="text-xs text-gray-500 font-medium">Método Pomodoro integrado para sua performance</p>
      </div>

      {/* Mode selectors */}
      <div className="grid grid-cols-3 bg-gray-200/60 p-1 rounded-xl border border-gray-100 shadow-inner">
        {(['focus', 'shortBreak', 'longBreak'] as const).map((m) => {
          const active = mode === m;
          let label = 'Foco';
          if (m === 'shortBreak') label = 'Pausa Curta';
          if (m === 'longBreak') label = 'Pausa Longa';

          return (
            <button
              key={m}
              id={`btn-focus-mode-${m}`}
              onClick={() => handleModeChange(m)}
              className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer text-center ${
                active
                  ? 'bg-white text-brand-primary shadow-sm font-bold'
                  : 'text-gray-500 hover:text-brand-primary'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Main interactive visual timer circle */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative w-60 h-60 flex items-center justify-center">
          {/* Background circle track */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              className="fill-none stroke-gray-100"
              strokeWidth="5"
            />
            {/* Animated foreground track */}
            <circle
              cx="60"
              cy="60"
              r="54"
              className="fill-none stroke-[#8ACBD0] transition-all duration-300"
              strokeWidth="5"
              strokeDasharray="339.29"
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Time digits and status */}
          <div className="z-10 text-center space-y-1">
            <span className="text-4xl font-mono font-bold text-[#170C79] block select-all">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block">
              {isRunning ? 'Em execução' : 'Pausado'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls panel */}
      <div className="flex items-center justify-center gap-6">
        <button
          id="btn-focus-reset"
          onClick={handleReset}
          className="bg-white p-3.5 rounded-full border border-gray-200 text-gray-500 hover:text-brand-primary hover:border-gray-300 active:scale-90 transition-all cursor-pointer shadow-sm"
          title="Reiniciar cronômetro"
        >
          <RotateCcw size={20} />
        </button>

        <button
          id="btn-focus-play-pause"
          onClick={handleTogglePlay}
          className="w-16 h-16 rounded-full bg-[#170C79] hover:bg-[#20158a] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer text-center"
        >
          {isRunning ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>

        <div className="w-12 h-12" /> {/* Placeholder spacing balance */}
      </div>

      {/* Dynamic quotes card */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-start gap-4">
        <div className="bg-[#DFE5EA] text-[#170C79] p-2.5 rounded-xl">
          {mode === 'focus' ? <Flame size={18} /> : <Smile size={18} />}
        </div>
        <div>
          <span className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-0.5">Dica de Foco</span>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            {mode === 'focus'
              ? 'Mantenha abas do navegador fechadas e o celular em outro cômodo para garantir imersão máxima nos próximos 25 minutos.'
              : 'Aproveite para esticar as pernas, beber um copo de água e respirar fundo várias vezes antes do próximo bloco.'}
          </p>
        </div>
      </div>
    </div>
  );
}
