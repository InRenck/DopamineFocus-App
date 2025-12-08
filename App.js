const { useState, useEffect, useRef } = React;

const THEMES = {
  default: { name: 'Padrão', bg: '#0f172a', card: '#1e293b', accent: '#9333ea', text: '#fff' },
  neon:    { name: 'Neon Cyber', bg: '#050505', card: '#171717', accent: '#00ff00', text: '#00ff00' },
  coffee:  { name: 'Coffee Shop', bg: '#271c19', card: '#3c2a20', accent: '#d4a373', text: '#faedcd' }
};

const EASY_TASKS = [
  "Beba um copo d'água devagar.",
  "Estique os braços lá no alto por 10s.",
  "Arrume apenas 3 objetos na sua mesa.",
  "Respire fundo 5 vezes.",
  "Olhe pela janela e ache algo verde."
];


const AppContainer = ({ children, customStyle }) => (
  <div 
    className="min-h-screen transition-colors duration-500 flex flex-col items-center justify-center p-6 font-sans"
    style={{
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-main)',
        ...customStyle 
    }}
  >
      {children}
  </div>
);

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDuration, setNewDuration] = useState(25);
  
  const [rewardMode, setRewardMode] = useState('specific'); 
  const [specificReward, setSpecificReward] = useState('');
  const [lootBoxItems, setLootBoxItems] = useState(['15 min TikTok', 'Comer um Chocolate', 'Episódio de Série', 'Cochilo de 20min']);
  const [newLootItem, setNewLootItem] = useState('');
  const [wonReward, setWonReward] = useState('');

  const [mode, setMode] = useState('planning'); 
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [maxTime, setMaxTime] = useState(25 * 60); 
  const [isActive, setIsActive] = useState(false);
  
  const [isPanicOpen, setIsPanicOpen] = useState(false); 
  const [sosMode, setSosMode] = useState('menu'); 
  const [sosChallenge, setSosChallenge] = useState('');
  
  const [brownNoisePlaying, setBrownNoisePlaying] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentTheme, setCurrentTheme] = useState('default');

  const timerRef = useRef(null);
  const brownNoiseAudio = useRef(null);
  const alarmAudio = useRef(null);

  useEffect(() => {
    brownNoiseAudio.current = new Audio('brown_noise.mp3'); 
    brownNoiseAudio.current.loop = true;
    
    alarmAudio.current = new Audio('alarm.mp3');
    
    const savedSessions = localStorage.getItem('dopamineSessions');
    if (savedSessions) setCompletedSessions(parseInt(savedSessions));

    return () => {
        if(brownNoiseAudio.current) {
            brownNoiseAudio.current.pause();
            brownNoiseAudio.current = null;
        }
    };
  }, []);

  useEffect(() => {
    if (brownNoiseAudio.current) {
        if (brownNoisePlaying && isActive) {
            brownNoiseAudio.current.play().catch(e => console.log("Audio play failed", e));
        } else {
            brownNoiseAudio.current.pause();
        }
    }
  }, [brownNoisePlaying, isActive]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      if (alarmAudio.current) alarmAudio.current.play();
      completeTask();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getThemeStyle = () => {
      const t = THEMES[currentTheme];
      return {
          '--bg-color': t.bg,
          '--card-bg': t.card,
          '--accent': t.accent,
          '--text-main': t.text
      };
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const duration = parseInt(newDuration) || 25;
    setTasks([...tasks, { id: Date.now(), title: newTask, completed: false, duration: duration }]);
    setNewTask('');
    setNewDuration(25);
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addLootItem = (e) => {
    e.preventDefault();
    if (!newLootItem.trim()) return;
    setLootBoxItems([...lootBoxItems, newLootItem]);
    setNewLootItem('');
  };

  const startFocus = () => {
    if (tasks.length === 0) return;
    if (rewardMode === 'specific' && !specificReward) { alert("Defina sua recompensa!"); return; }
    if (rewardMode === 'lootbox' && lootBoxItems.length === 0) { alert("Adicione itens na caixa!"); return; }
    
    setMode('focus');
    setCurrentTaskIndex(0);

    const durationInSeconds = tasks[0].duration * 60;
    setTimeLeft(durationInSeconds);
    setMaxTime(durationInSeconds);

    setWonReward('');
    setBrownNoisePlaying(false); 
  };

  const completeTask = () => {
    setIsActive(false);
    clearInterval(timerRef.current);
    
    const newTotal = completedSessions + 1;
    setCompletedSessions(newTotal);
    localStorage.setItem('dopamineSessions', newTotal.toString());
    checkUnlocks(newTotal);

    const updatedTasks = [...tasks];
    updatedTasks[currentTaskIndex].completed = true;
    setTasks(updatedTasks);

    const nextIndex = currentTaskIndex + 1;
    if (nextIndex < tasks.length) {
      setCurrentTaskIndex(nextIndex);
      const nextDuration = tasks[nextIndex].duration * 60;
      setTimeLeft(nextDuration);
      setMaxTime(nextDuration);
    } else {
      finishCycle();
    }
  };

  const checkUnlocks = (total) => {
      if (total === 5 && currentTheme === 'default') alert("🏆 NOVO TEMA DESBLOQUEADO: Neon Cyber!");
      if (total === 10 && currentTheme !== 'coffee') alert("🏆 NOVO TEMA DESBLOQUEADO: Coffee Shop!");
  };

  const finishCycle = () => {
    if (rewardMode === 'lootbox') {
      const randomItem = lootBoxItems[Math.floor(Math.random() * lootBoxItems.length)];
      setWonReward(randomItem);
    } else {
      setWonReward(specificReward);
    }
    setMode('celebration');
    setBrownNoisePlaying(false);
  };

  const resetApp = () => {
    setTasks([]);
    setMode('planning');
    setIsActive(false);
    setWonReward('');
  };

  const openPanic = () => {
      setIsPanicOpen(true);
      setIsActive(false); 
      setSosMode('menu');
  };

  const panicSplitTask = () => {
    const currentTask = tasks[currentTaskIndex];
    const halfTime = Math.max(5, Math.floor(currentTask.duration / 2));
    const part1 = { ...currentTask, id: Date.now(), title: `${currentTask.title} (Pt 1)`, duration: halfTime };
    const part2 = { ...currentTask, id: Date.now() + 1, title: `${currentTask.title} (Pt 2)`, duration: halfTime };
    const newTasks = [...tasks];
    newTasks.splice(currentTaskIndex, 1, part1, part2);
    setTasks(newTasks);
    
    setTimeLeft(halfTime * 60);
    setMaxTime(halfTime * 60);
    setIsPanicOpen(false);
  };

  const panicJustFive = () => {
    const fiveMin = 5 * 60;
    setTimeLeft(fiveMin);
    setMaxTime(fiveMin);
    setIsPanicOpen(false);
    setIsActive(true); 
  };

  const panicSkip = () => {
    const nextIndex = currentTaskIndex + 1;
    if (nextIndex < tasks.length) {
      setCurrentTaskIndex(nextIndex);
      const nextTime = tasks[nextIndex].duration * 60;
      setTimeLeft(nextTime);
      setMaxTime(nextTime);
      setIsPanicOpen(false);
    } else {
      finishCycle();
    }
  };

  const panicBreathing = () => {
      setSosMode('breathing');
  };

  const panicChallenge = () => {
      const random = EASY_TASKS[Math.floor(Math.random() * EASY_TASKS.length)];
      setSosChallenge(random);
      setSosMode('challenge');
  };

  if (mode === 'planning') {
    return (
      <AppContainer customStyle={getThemeStyle()}>
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-1" style={{ color: 'var(--accent)' }}>
              🧠 Dopamine Focus
            </h1>
            <p className="text-xs opacity-50">Sessões Completas: {completedSessions}</p>
            
            <div className="flex justify-center gap-2 mt-2">
                <button onClick={() => setCurrentTheme('default')} className={`w-3 h-3 rounded-full border ${currentTheme === 'default' ? 'bg-white' : 'bg-slate-700'}`} title="Padrão"></button>
                {completedSessions >= 5 && <button onClick={() => setCurrentTheme('neon')} className={`w-3 h-3 rounded-full border border-green-500 ${currentTheme === 'neon' ? 'bg-green-500' : 'bg-transparent'}`} title="Neon"></button>}
                {completedSessions >= 10 && <button onClick={() => setCurrentTheme('coffee')} className={`w-3 h-3 rounded-full border border-yellow-700 ${currentTheme === 'coffee' ? 'bg-yellow-700' : 'bg-transparent'}`} title="Coffee"></button>}
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 shadow-xl" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                    🎁 Recompensa
                </label>
                <div className="flex bg-black/20 rounded-lg p-1">
                    <button onClick={() => setRewardMode('specific')} className={`px-3 py-1 text-xs rounded-md transition-colors ${rewardMode === 'specific' ? 'bg-white/20 text-white' : 'text-white/40'}`}>Fixa</button>
                    <button onClick={() => setRewardMode('lootbox')} className={`px-3 py-1 text-xs rounded-md transition-colors ${rewardMode === 'lootbox' ? 'bg-white/20 text-white' : 'text-white/40'}`}>🎲 Sorteio</button>
                </div>
            </div>

            {rewardMode === 'specific' ? (
                <input type="text" value={specificReward} onChange={(e) => setSpecificReward(e.target.value)} placeholder="Ex: Café Gelado" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:ring-2 outline-none" style={{ '--tw-ring-color': 'var(--accent)' }} />
            ) : (
                <div className="space-y-3">
                    <form onSubmit={addLootItem} className="flex gap-2">
                        <input type="text" value={newLootItem} onChange={(e) => setNewLootItem(e.target.value)} placeholder="Add prêmio..." className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:border-white/50" />
                        <button type="submit" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg">➕</button>
                    </form>
                    <div className="flex flex-wrap gap-2">
                        {lootBoxItems.map((item, idx) => (
                            <span key={idx} className="bg-white/5 border border-white/10 text-white/70 text-xs px-2 py-1 rounded-full">{item}</span>
                        ))}
                    </div>
                </div>
            )}
          </div>

          <div className="p-5 rounded-2xl border border-white/10 shadow-xl" style={{ backgroundColor: 'var(--card-bg)' }}>
            <label className="block text-sm font-bold mb-2" style={{ color: 'var(--accent)' }}> O que preciso fazer? </label>
            <form onSubmit={addTask} className="flex gap-2 mb-4">
              <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Nova missão..." className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-white/50" autoFocus />
              <div className="relative w-20">
                <input type="number" value={newDuration} onChange={(e) => setNewDuration(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-center text-white outline-none" min="1" />
                <span className="absolute right-1 top-3 text-[10px] opacity-50 pointer-events-none">min</span>
              </div>
              <button type="submit" className="bg-white/10 hover:bg-white/20 p-3 rounded-lg text-white">➕</button>
            </form>
            <ul className="space-y-2 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
              {tasks.map((task) => (
                <li key={task.id} className="flex justify-between items-center bg-black/10 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="bg-white/10 text-[10px] py-1 px-2 rounded font-mono">{task.duration}m</span>
                    <span>{task.title}</span>
                  </div>
                  <button onClick={() => removeTask(task.id)} className="text-white/30 hover:text-red-400 transition-colors">✕</button>
                </li>
              ))}
            </ul>
          </div>

          <button onClick={startFocus} disabled={tasks.length === 0} className={`w-full py-4 rounded-xl text-xl font-bold shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 ${tasks.length > 0 ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`} style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-color)' }}>
            Hiperfoco
          </button>
        </div>
      </AppContainer>
    );
  }

  if (mode === 'focus') {
    const progress = (timeLeft / maxTime) * 100;
    
    return (
      <AppContainer customStyle={getThemeStyle()}>
        {isPanicOpen && (
            <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-slate-900 border border-red-500/30 w-full max-w-md p-6 rounded-2xl shadow-2xl animate-fade-in">
                    
                    {sosMode === 'menu' && (
                        <>
                            <h3 className="text-2xl font-bold text-red-400 mb-1">⚠️ SOS: Travou?</h3>
                            <p className="text-slate-400 mb-6 text-sm">Sem culpa. Escolha uma saída estratégica.</p>
                            <div className="space-y-3">
                                <button onClick={panicJustFive} className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl text-left border border-slate-700 flex items-center gap-3 group">
                                    <span className="text-2xl group-hover:scale-110 transition-transform">⚡</span>
                                    <div>
                                        <div className="font-bold text-white">Só 5 Minutos</div>
                                        <div className="text-xs text-slate-400">Esqueça o resto, faça só um pouquinho.</div>
                                    </div>
                                </button>
                                
                                <button onClick={panicBreathing} className="w-full bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-left border border-slate-700 flex items-center gap-3">
                                    <span className="text-xl">🧘</span> <span className="text-slate-200">Respirar e Acalmar (Reset)</span>
                                </button>

                                <button onClick={panicChallenge} className="w-full bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-left border border-slate-700 flex items-center gap-3">
                                    <span className="text-xl">🎲</span> <span className="text-slate-200">Me dê um desafio ridículo de fácil</span>
                                </button>

                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <button onClick={panicSplitTask} className="bg-slate-800/50 hover:bg-slate-800 p-3 rounded-lg text-sm text-slate-300 border border-slate-700/50">✂️ Dividir Tarefa</button>
                                    <button onClick={panicSkip} className="bg-slate-800/50 hover:bg-slate-800 p-3 rounded-lg text-sm text-slate-300 border border-slate-700/50">⏭️ Pular</button>
                                </div>

                                <button onClick={() => setIsPanicOpen(false)} className="w-full mt-4 text-slate-500 hover:text-white text-sm py-2">Voltar (Cancelar)</button>
                            </div>
                        </>
                    )}

                    {sosMode === 'breathing' && (
                        <div className="text-center py-8">
                            <div className="w-32 h-32 bg-blue-500/20 rounded-full mx-auto mb-8 animate-[pulse_4s_ease-in-out_infinite] flex items-center justify-center border-4 border-blue-500/40">
                                <span className="text-blue-200 text-xs">Inspire... expire</span>
                            </div>
                            <h3 className="text-xl font-bold text-blue-100">Acalme o sistema.</h3>
                            <p className="text-slate-400 mt-2 mb-6">Foque apenas no círculo pulsando.</p>
                            <button onClick={() => setSosMode('menu')} className="bg-slate-800 px-6 py-2 rounded-lg text-white">Voltar</button>
                        </div>
                    )}

                    {sosMode === 'challenge' && (
                        <div className="text-center py-6">
                            <div className="text-4xl mb-4">🎲</div>
                            <h3 className="text-lg text-purple-300 font-bold mb-2">Sua Missão Flash:</h3>
                            <div className="bg-purple-900/30 p-4 rounded-xl border border-purple-500/30 mb-6">
                                <p className="text-xl text-white font-medium">"{sosChallenge}"</p>
                            </div>
                            <p className="text-slate-400 text-xs mb-6">Faça agora. Não pense. Só faça.</p>
                            <button onClick={() => { setIsPanicOpen(false); setIsActive(true); }} className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl text-white font-bold">Feito! Voltar ao Foco</button>
                        </div>
                    )}

                </div>
            </div>
        )}

        <button onClick={openPanic} className="absolute top-6 right-6 text-red-400 bg-red-950/30 px-4 py-2 rounded-full text-sm font-bold border border-red-500/20 hover:bg-red-900/40 hover:scale-105 transition-all z-10">
            🚨 TRAVEI
        </button>

        <div className="z-10 w-full max-w-md text-center space-y-12">
          <div className="flex justify-between items-center opacity-60">
            <span>Missão {currentTaskIndex + 1} / {tasks.length}</span>
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setBrownNoisePlaying(!brownNoisePlaying)}
                    className={`text-xs px-2 py-1 rounded border flex items-center gap-1 transition-all ${brownNoisePlaying ? 'bg-white text-black border-white' : 'border-white/30 text-white/50'}`}
                >
                    {brownNoisePlaying ? '🔊 Noise ON' : 'Noise OFF'}
                </button>
                <span className="text-xs uppercase tracking-widest border border-white/20 px-2 py-1 rounded">Focus Mode</span>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: 'var(--text-main)' }}>
              {tasks[currentTaskIndex].title}
            </h2>
          </div>

          <div className="relative cursor-pointer group" onClick={() => setIsActive(!isActive)}>
            <div className={`text-8xl font-mono font-light tracking-tighter transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
              {formatTime(timeLeft)}
            </div>
            <p className="text-sm opacity-0 group-hover:opacity-50 transition-opacity absolute w-full text-center -bottom-4">{isActive ? 'Clique para Pausar' : 'Clique para Iniciar'}</p>
          </div>

          <div className="w-full h-6 bg-slate-700 rounded-full overflow-hidden border border-slate-600 shadow-inner">
            <div 
                className="h-full transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                style={{ 
                    width: `${progress}%`,
                    backgroundColor: progress < 20 ? '#ef4444' : 'var(--accent)'
                }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setIsActive(!isActive)} className="py-4 rounded-xl bg-white/10 hover:bg-white/20 font-semibold text-white transition-colors">
              {isActive ? 'Pausar' : 'Continuar'}
            </button>
            <button onClick={completeTask} className="py-4 rounded-xl font-bold shadow-lg shadow-green-900/20 transform hover:-translate-y-1 transition-all bg-green-600 hover:bg-green-500 text-white">
              ✅ Concluir
            </button>
          </div>

          <div className="pt-8 opacity-60">
            <p className="text-sm" style={{ color: 'var(--accent)' }}>Working for: <span className="font-bold text-white">{rewardMode === 'lootbox' ? '🎲 Caixa Surpresa' : specificReward}</span></p>
          </div>
        </div>
      </AppContainer>
    );
  }

  if (mode === 'celebration') {
    return (
      <AppContainer customStyle={getThemeStyle()}>
        <div className="space-y-8 max-w-lg w-full text-center">
          <div className="inline-block p-6 rounded-full mb-4 animate-bounce" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}>🏆</div>
          <h1 className="text-5xl font-bold mb-2 text-white">CONCLUÍDO!</h1>
          <p className="text-xl opacity-70">Dopamina liberada. Ciclo encerrado.</p>

          <div className="p-1 rounded-2xl shadow-2xl transform hover:scale-105 transition-all bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            <div className="rounded-xl p-10 h-full flex flex-col items-center justify-center space-y-4" style={{ backgroundColor: 'var(--card-bg)' }}>
              <p className="text-sm uppercase tracking-widest opacity-60">Recompensa Desbloqueada</p>
              <div className="text-4xl font-bold animate-pulse" style={{ color: 'var(--accent)' }}>
                {wonReward}
              </div>
              <p className="text-xs opacity-50">(Aproveite SEM CULPA.)</p>
            </div>
          </div>

          <button onClick={resetApp} className="mt-12 opacity-50 hover:opacity-100 hover:underline transition-opacity">Começar novo ciclo</button>
        </div>
      </AppContainer>
    );
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);