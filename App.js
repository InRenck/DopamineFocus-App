const { useState, useEffect, useRef } = React;

const App = () => {
  // --- ESTADOS ---
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDuration, setNewDuration] = useState(25); // NOVO: Estado para o tempo
  
  const [rewardMode, setRewardMode] = useState('specific'); 
  const [specificReward, setSpecificReward] = useState('');
  const [lootBoxItems, setLootBoxItems] = useState(['15 min TikTok', 'Comer um Chocolate', 'Episódio de Série', 'Cochilo de 20min']);
  const [newLootItem, setNewLootItem] = useState('');
  const [wonReward, setWonReward] = useState('');

  const [mode, setMode] = useState('planning'); 
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPanicOpen, setIsPanicOpen] = useState(false); 

  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      setIsActive(false);
      // Som de alarme poderia ir aqui
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  // --- FUNÇÕES ---
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    // NOVO: Usa o tempo escolhido ou 25 se estiver vazio
    const duration = parseInt(newDuration) || 25;

    setTasks([...tasks, { 
        id: Date.now(), 
        title: newTask, 
        completed: false, 
        duration: duration 
    }]);
    
    setNewTask('');
    setNewDuration(25); // Reseta para o padrão 25
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
    if (rewardMode === 'specific' && !specificReward) {
      alert("Defina sua recompensa!"); return;
    }
    if (rewardMode === 'lootbox' && lootBoxItems.length === 0) {
      alert("Adicione itens na sua caixa surpresa!"); return;
    }
    setMode('focus');
    setCurrentTaskIndex(0);
    // Configura o tempo baseado na primeira tarefa
    setTimeLeft(tasks[0].duration * 60);
    setWonReward('');
  };

  const completeTask = () => {
    const updatedTasks = [...tasks];
    updatedTasks[currentTaskIndex].completed = true;
    setTasks(updatedTasks);
    setIsActive(false);
    clearInterval(timerRef.current);

    const nextIndex = currentTaskIndex + 1;
    if (nextIndex < tasks.length) {
      setCurrentTaskIndex(nextIndex);
      // Pega a duração da PRÓXIMA tarefa
      setTimeLeft(tasks[nextIndex].duration * 60);
    } else {
      if (rewardMode === 'lootbox') {
        const randomItem = lootBoxItems[Math.floor(Math.random() * lootBoxItems.length)];
        setWonReward(randomItem);
      } else {
        setWonReward(specificReward);
      }
      setMode('celebration');
    }
  };

  const resetApp = () => {
    setTasks([]);
    setMode('planning');
    setIsActive(false);
    setWonReward('');
  };

  // --- SOS PANIC ---
  const panicSplitTask = () => {
    const currentTask = tasks[currentTaskIndex];
    // Divide o tempo atual por 2, ou usa 15 min padrão se for muito curto
    const halfTime = Math.max(5, Math.floor(currentTask.duration / 2));
    
    const part1 = { ...currentTask, id: Date.now(), title: `${currentTask.title} (Parte 1)`, duration: halfTime };
    const part2 = { ...currentTask, id: Date.now() + 1, title: `${currentTask.title} (Parte 2)`, duration: halfTime };
    
    const newTasks = [...tasks];
    newTasks.splice(currentTaskIndex, 1, part1, part2);
    setTasks(newTasks);
    setTimeLeft(halfTime * 60);
    setIsPanicOpen(false);
    setIsActive(false);
  };

  const panicJustFive = () => {
    setTimeLeft(5 * 60);
    setIsPanicOpen(false);
    setIsActive(true);
  };

  const panicSkip = () => {
    const nextIndex = currentTaskIndex + 1;
    if (nextIndex < tasks.length) {
      setCurrentTaskIndex(nextIndex);
      setTimeLeft(tasks[nextIndex].duration * 60);
      setIsPanicOpen(false);
      setIsActive(false);
    } else {
      setMode('celebration');
    }
  };

  // --- RENDER ---
  if (mode === 'planning') {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              🧠 Dopamine Focus
            </h1>
          </div>

          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium text-pink-400 flex items-center gap-2">
                    🎁 Recompensa
                </label>
                <div className="flex bg-slate-900 rounded-lg p-1">
                    <button onClick={() => setRewardMode('specific')} className={`px-3 py-1 text-xs rounded-md ${rewardMode === 'specific' ? 'bg-pink-600' : 'text-slate-400'}`}>Fixa</button>
                    <button onClick={() => setRewardMode('lootbox')} className={`px-3 py-1 text-xs rounded-md ${rewardMode === 'lootbox' ? 'bg-purple-600' : 'text-slate-400'}`}>🎲 Sorteio</button>
                </div>
            </div>

            {rewardMode === 'specific' ? (
                <input type="text" value={specificReward} onChange={(e) => setSpecificReward(e.target.value)} placeholder="Ex: Iced Macchiato" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 outline-none" />
            ) : (
                <div className="space-y-3">
                    <form onSubmit={addLootItem} className="flex gap-2">
                        <input type="text" value={newLootItem} onChange={(e) => setNewLootItem(e.target.value)} placeholder="Adicionar prêmio possível..." className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none" />
                        <button type="submit" className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg">➕</button>
                    </form>
                    <div className="flex flex-wrap gap-2">
                        {lootBoxItems.map((item, idx) => (
                            <span key={idx} className="bg-purple-900/40 border border-purple-500/30 text-purple-200 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            )}
          </div>

          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-xl">
            <label className="block text-sm font-medium text-purple-400 mb-2">✅ Missões e Tempo</label>
            
            {/* FORMULÁRIO ATUALIZADO COM CAMPO DE TEMPO */}
            <form onSubmit={addTask} className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={newTask} 
                onChange={(e) => setNewTask(e.target.value)} 
                placeholder="Ex: Ler 5 pág" 
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none" 
              />
              
              <div className="relative w-24">
                <input 
                    type="number" 
                    value={newDuration} 
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none text-center"
                    min="1"
                />
                <span className="absolute right-2 top-3 text-xs text-slate-500 pointer-events-none">min</span>
              </div>

              <button type="submit" className="bg-purple-600 hover:bg-purple-500 p-3 rounded-lg">➕</button>
            </form>

            <ul className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {tasks.map((task) => (
                <li key={task.id} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                  <div className="flex items-center gap-3">
                    <span className="bg-slate-800 text-xs py-1 px-2 rounded text-slate-400 font-mono">{task.duration}m</span>
                    <span>{task.title}</span>
                  </div>
                  <button onClick={() => removeTask(task.id)} className="text-slate-400 hover:text-red-400">🗑️</button>
                </li>
              ))}
            </ul>
          </div>

          <button onClick={startFocus} disabled={tasks.length === 0} className={`w-full py-4 rounded-xl text-xl font-bold shadow-lg transition-all ${tasks.length > 0 ? 'bg-gradient-to-r from-green-400 to-emerald-600 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
            Entrar no Hiperfoco 🚀
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'focus') {
    const progress = ((tasks[currentTaskIndex].duration * 60 - timeLeft) / (tasks[currentTaskIndex].duration * 60)) * 100;
    
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">
        
        {isPanicOpen && (
            <div className="absolute inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-red-500/30 w-full max-w-md p-6 rounded-2xl">
                    <h3 className="text-2xl font-bold text-red-400 mb-2">⚠️ SOS: Travou?</h3>
                    <p className="text-slate-300 mb-6">Sem culpa. Escolha uma saída:</p>
                    <div className="space-y-3">
                        <button onClick={panicSplitTask} className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl text-left border border-slate-700">✂️ Dividir Tarefa (Metade do tempo)</button>
                        <button onClick={panicJustFive} className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl text-left border border-slate-700">⚡ Só 5 Minutos (esquece o resto)</button>
                        <button onClick={panicSkip} className="w-full bg-slate-800 hover:bg-slate-700 p-4 rounded-xl text-left border border-slate-700">⏭️ Pular Tarefa</button>
                        <button onClick={() => setIsPanicOpen(false)} className="w-full mt-4 text-slate-500 text-sm">Cancelar</button>
                    </div>
                </div>
            </div>
        )}

        <button onClick={() => setIsPanicOpen(true)} className="absolute top-6 right-6 text-red-400 bg-red-900/20 px-4 py-2 rounded-full text-sm font-bold border border-red-900/50 hover:bg-red-900/40 transition-all">
            🚨 TRAVEI
        </button>

        <div className="z-10 w-full max-w-md text-center space-y-12">
          <div className="flex justify-between items-center text-slate-500">
            <span>Missão {currentTaskIndex + 1} / {tasks.length}</span>
            <span className="text-xs uppercase tracking-widest border border-slate-800 px-2 py-1 rounded">Focus Mode</span>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
              {tasks[currentTaskIndex].title}
            </h2>
          </div>

          <div className="relative cursor-pointer" onClick={() => setIsActive(!isActive)}>
            <div className={`text-8xl font-mono font-light tracking-tighter transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-600'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setIsActive(!isActive)} className="py-4 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold">
              {isActive ? '⏸️ Pausar' : '▶️ Iniciar'}
            </button>
            <button onClick={completeTask} className="py-4 rounded-xl bg-green-600 hover:bg-green-500 font-bold shadow-lg shadow-green-900/20 transform hover:-translate-y-1 transition-all">
              ✅ Feito!
            </button>
          </div>

          <div className="pt-8 opacity-60">
            <p className="text-sm text-pink-300">Working for: {rewardMode === 'lootbox' ? '🎲 Caixa Surpresa' : specificReward}</p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'celebration') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="space-y-8 max-w-lg w-full">
          <div className="inline-block p-6 rounded-full bg-green-500/20 text-green-400 mb-4 ring-4 ring-green-500/10">🏆</div>
          <h1 className="text-5xl font-bold mb-2">CONCLUÍDO!</h1>
          <p className="text-xl text-slate-300">Dopamina liberada. Procrastinação vencida.</p>

          <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 p-1 rounded-2xl shadow-2xl transform hover:scale-105 transition-all">
            <div className="bg-slate-900 rounded-xl p-10 h-full flex flex-col items-center justify-center space-y-4">
              <p className="text-sm uppercase tracking-widest text-slate-400">Recompensa Desbloqueada</p>
              <div className="text-3xl font-bold text-pink-300 animate-pulse">
                {wonReward}
              </div>
              <p className="text-xs text-slate-500">(Aproveite SEM CULPA.)</p>
            </div>
          </div>

          <button onClick={resetApp} className="mt-12 text-slate-400 hover:text-white underline">Começar novo ciclo</button>
        </div>
      </div>
    );
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);