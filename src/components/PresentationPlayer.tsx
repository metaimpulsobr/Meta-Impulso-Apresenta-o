import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SLIDES_DATA } from '../data/presentationData';
import { InteractiveSlideContent } from './InteractiveSlideContent';
import { ExportModal } from './ExportModal';
import { Logo } from './Logo';
import { QuickPollOverlay, Poll } from './QuickPollOverlay';
import { 
  ChevronLeft, ChevronRight, Play, Pause, Maximize2, Minimize2, 
  Settings, CloudLightning, FileDown, Layers, CreditCard, Sparkles, 
  Share2, Laptop, Calendar, Clock, RotateCcw, FileText, Check, Plus, Minus, Tv, BarChart2
} from 'lucide-react';

export const PresentationPlayer: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  
  // Quick Poll states
  const [isPollControlOpen, setIsPollControlOpen] = useState<boolean>(false);
  const [activePollId, setActivePollId] = useState<string | null>(null);
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: 'gargalo_comercial',
      question: 'Qual é o maior gargalo no processo de aquisição comercial da sua empresa hoje?',
      category: 'GARGALO COMERCIAL',
      options: [
        { id: 'g1', text: 'Lentidão no atendimento inicial do lead pelo WhatsApp', votes: 12 },
        { id: 'g2', text: 'Os leads gerados são muito desqualificados ou frios', votes: 18 },
        { id: 'g3', text: 'Falta de remarketing e acompanhamento comercial sistemático', votes: 8 },
        { id: 'g4', text: 'Sem processos claros ou CRM para organizar o pipeline', votes: 14 }
      ]
    },
    {
      id: 'uso_ia_comercial',
      question: 'De que maneira sua empresa já inseriu Inteligência Artificial ativa no atendimento?',
      category: 'FUTURO DA IA',
      options: [
        { id: 'i1', text: 'Sim, agentes que qualificam e agendam reuniões 24/7', votes: 4 },
        { id: 'i2', text: 'Apenas chatbots baseados em fluxos rígidos de perguntas', votes: 16 },
        { id: 'i3', text: 'Geração de textos ou consultas ocasionais com ChatGPT', votes: 19 },
        { id: 'i4', text: 'Ainda não implementamos nada automatizado', votes: 11 }
      ]
    },
    {
      id: 'segredo_landingpage',
      question: 'O que você considera mais crítico para que uma Landing Page passe de 25% de conversão?',
      category: 'SITES DE ELITE',
      options: [
        { id: 'l1', text: 'Velocidade instantânea de carregamento (tecnologia React)', votes: 9 },
        { id: 'l2', text: 'Design limpo e arquitetado com psicologia de vendas', votes: 15 },
        { id: 'l3', text: 'Proposta de valor agressiva com manifesto impactante', votes: 20 },
        { id: 'l4', text: 'Depoimentos e provas sociais muito robustas', votes: 13 }
      ]
    },
    {
      id: 'midas_investimento',
      question: 'Se recebesse R$ 20.000 para injetar no marketing amanhã, onde seria a prioridade?',
      category: 'CRESCIMENTO DE ELITE',
      options: [
        { id: 'm1', text: 'Maximizar anúncios de conversão de elite', votes: 17 },
        { id: 'm2', text: 'Criar Landing Page de carregamento instantâneo', votes: 7 },
        { id: 'm3', text: 'Estruturar CRM de acompanhamento cirúrgico', votes: 5 },
        { id: 'm4', text: 'Implementar IA e agentes no funil comercial', votes: 15 }
      ]
    }
  ]);

  // Speaker Mode states
  const [isSpeakerMode, setIsSpeakerMode] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(1200); // 20 minutes default
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [speakerFontSize, setSpeakerFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [checkedNotes, setCheckedNotes] = useState<Record<string, boolean>>({});
  
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const totalSlides = SLIDES_DATA.length;
  const currentSlide = SLIDES_DATA[currentSlideIndex];

  // Reset speaker checklist checkboxes when moving to a new slide
  useEffect(() => {
    setCheckedNotes({});
  }, [currentSlideIndex]);

  // Speaker Mode countdown timer background task
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isTimerActive && timerSeconds > 0) {
      intervalId = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerActive(false);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isTimerActive, timerSeconds]);

  // Navigate functions
  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  }, [totalSlides]);

  // Handle autoplay loop
  useEffect(() => {
    if (isPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        nextSlide();
      }, 6500); // 6.5s auto transition
    } else {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isPlaying, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevents key scrolling defaults
      if (['ArrowLeft', 'ArrowRight', 'Space', 'Backspace'].includes(e.key)) {
        // Only run check if not focused on input fields
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        
        e.preventDefault();
        
        if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
          prevSlide();
        } else if (e.key === 'ArrowRight' || e.key === 'Space') {
          nextSlide();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextSlide, prevSlide]);

  // Fullscreen toggle helper
  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
        // Fallback: visual viewport simulation
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Synchronise status of standard HTML full-screen event change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col font-sans text-white select-none relative overflow-hidden">
      {/* Immersive radial gradient auras & dot grid pattern from Design specifications */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]" 
          style={{ background: 'radial-gradient(circle, #D649FB 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 blur-[150px]" 
          style={{ background: 'radial-gradient(circle, #6BCFFE 0%, transparent 70%)' }}
        />
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: 'radial-gradient(#6BCFFE 0.5px, transparent 0.5px)', 
            backgroundSize: '32px 32px' 
          }}
        />
      </div>

      {/* Header bar */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-10 py-5 border-b border-white/5 backdrop-blur-md bg-white/5">
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10" glow />
          <span className="text-xl lg:text-2xl font-black tracking-tighter uppercase font-sans">
            META <span className="text-[#6BCFFE]">IMPULSO</span>
          </span>
        </div>

        {/* Dynamic Navigation tags */}
        <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/50">
          <span>Marketing</span>
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          <span>Tecnologia</span>
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
          <span>IA</span>
        </div>

        {/* Header CTA & Export actions */}
        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/5561995011614?text=Olá!%20Fiquei%20interessado%20na%20Meta%20Impulso%20conversando%20com%20o%20apresentador."
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex px-5 py-2.5 bg-white/5 border border-white/10 rounded-full font-bold text-xs uppercase tracking-wider backdrop-blur-sm text-white hover:bg-white/10 transition-all items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" /> Agendar Diagnóstico
          </a>
          <button
            type="button"
            onClick={() => setIsSpeakerMode(!isSpeakerMode)}
            className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              isSpeakerMode 
                ? 'bg-purple-600 text-white border border-purple-400/30 shadow-md shadow-purple-500/20' 
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" /> {isSpeakerMode ? 'Slide Normal' : 'Modo Palestrante'}
          </button>
          <button
            type="button"
            onClick={() => setIsPollControlOpen(true)}
            className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activePollId 
                ? 'bg-[#10B981] text-slate-950 border border-emerald-400/50 shadow-md shadow-emerald-500/20 font-black' 
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-emerald-400" /> {activePollId ? 'Enquete Ativa' : 'Enquetes'}
          </button>
          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] hover:opacity-95 text-slate-950 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#D649FB]/20 flex items-center gap-1.5 cursor-pointer"
          >
            <CloudLightning className="w-3.5 h-3.5" /> Exportar
          </button>
        </div>
      </header>

      {/* Main content body */}
      <div className="flex flex-1 relative z-10 overflow-hidden">
        {/* Left Sidebar Navigator */}
        <aside className="w-72 border-r border-white/5 bg-white/5 backdrop-blur-xl p-5 flex flex-col gap-2 shrink-0 hidden md:flex">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 px-2 font-mono">
            Evolução Estratégica
          </div>
          
          {/* Scrollable list of steps */}
          <div className="flex-1 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)] pr-1 custom-scrollbar">
            {SLIDES_DATA.map((slide, index) => {
              const isActive = index === currentSlideIndex;
              const names = [
                "Capa / Manifesto",
                "Quem Somos",
                "Gargalos do Mercado",
                "Ecossistema Digital",
                "Tráfego Pago Elite",
                "Sites de Elite",
                "CRM & Automação",
                "Futuro com IA",
                "Como Trabalhamos",
                "O Que Esperar",
                "Por Que Escolher-nos",
                "Cases de Sucesso",
                "Pronto para Crescer?",
                "Manifesto Final"
              ];
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                    isActive
                      ? "bg-white/10 border border-white/10 text-white font-semibold"
                      : "hover:bg-white/5 border border-transparent text-white/40 hover:text-white/70"
                  }`}
                >
                  <span className={`text-xs font-mono font-bold ${isActive ? "text-[#D649FB]" : ""}`}>
                    {slide.id < 10 ? `0${slide.id}` : slide.id}
                  </span>
                  <span className="text-xs truncate">{names[index] || slide.title}</span>
                </button>
              );
            })}
          </div>

          {/* Project Status Bottom Box */}
          <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/5">
            <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-tighter">Status do Projeto</p>
            <p className="text-xs text-[#6BCFFE] font-medium">Diagnóstico Estratégico Disponível</p>
          </div>
        </aside>

        {/* Content Viewer Section */}
        <section className="flex-1 p-6 lg:p-10 flex flex-col relative overflow-hidden justify-between h-full bg-slate-900/35 backdrop-blur-sm">
          {/* Top Indicator */}
          <div className="flex justify-between items-center pb-2 mb-2 select-none border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="p-1 px-2 rounded bg-white/5 text-[9px] font-mono uppercase tracking-widest text-slate-300">
                {currentSlide.visualType === 'cover' ? 'Abertura' : currentSlide.visualType === 'footer' ? 'Considerações' : `Slide ${currentSlide.id}`}
              </span>
              <p className="text-xs text-slate-400 font-mono hidden md:block">META IMPULSO v1.2</p>
            </div>
            <span className="text-[10px] font-mono text-[#6BCFFE] tracking-wider uppercase font-semibold">
              Sistemas Inteligentes de Aquisição
            </span>
          </div>

          {/* Actual slide display workspace */}
          <div 
            ref={playerRef}
            id="presentation_stage"
            className={`grow flex flex-col justify-center relative transition-all duration-300 ${
              isFullscreen ? 'fixed inset-0 z-50 bg-[#0F172A] p-12' : 'py-3'
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlideIndex}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                className="w-full flex-1 flex flex-col justify-center"
              >
                <InteractiveSlideContent slide={currentSlide} />
              </motion.div>
            </AnimatePresence>

            {/* Floating Audience Quick Poll Overlay */}
            <AnimatePresence>
              {activePollId && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  className="absolute inset-x-4 md:inset-x-8 bottom-16 z-40 p-5 rounded-2xl bg-slate-950/95 border border-[#6BCFFE]/20 shadow-2xl backdrop-blur-md max-w-lg mx-auto flex flex-col gap-3 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-350 px-2 py-0.5 rounded tracking-widest font-black">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Interação ao Vivo
                    </span>
                    <button
                      type="button"
                      onClick={() => setActivePollId(null)}
                      className="text-white/45 hover:text-white hover:bg-white/10 px-1.5 py-0.5 rounded font-mono text-[9px] cursor-pointer"
                    >
                      Ocultar lousa
                    </button>
                  </div>

                  <h3 className="text-xs md:text-sm font-extrabold text-white tracking-tight leading-relaxed">
                    {polls.find(p => p.id === activePollId)?.question}
                  </h3>

                  <div className="space-y-1.5">
                    {polls.find(p => p.id === activePollId)?.options.map(opt => {
                      const activePollObj = polls.find(p => p.id === activePollId)!;
                      const totalVotes = activePollObj.options.reduce((sum, o) => sum + o.votes, 0);
                      const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                      return (
                        <div 
                          key={opt.id}
                          onClick={() => {
                            setPolls(prevPolls =>
                              prevPolls.map(p => {
                                if (p.id === activePollId) {
                                  const updatedOptions = p.options.map(o => {
                                    if (o.id === opt.id) {
                                      return { ...o, votes: o.votes + 1 };
                                    }
                                    return o;
                                  });
                                  return { ...p, options: updatedOptions };
                                }
                                return p;
                              })
                            );
                          }}
                          className="w-full relative p-2 rounded-xl border border-white/5 bg-slate-900 hover:bg-slate-850 transition-all flex justify-between items-center group overflow-hidden cursor-pointer"
                        >
                          <div 
                            className="absolute left-0 top-0 bottom-0 bg-white/[0.04] transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                          <span className="text-[11px] font-medium text-slate-200 group-hover:text-[#6BCFFE] relative z-10">
                            {opt.text}
                          </span>
                          <span className="text-[11px] font-bold font-mono text-slate-400 group-hover:text-white relative z-10 shrink-0">
                            {percentage}% ({opt.votes} vts)
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
                    <span>💡 Clique em qualquer opção para simular seu voto</span>
                    <span>Total de participantes: {polls.find(p => p.id === activePollId) ? polls.find(p => p.id === activePollId)!.options.reduce((sum, o) => sum + o.votes, 0) : 0}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Float shortcuts overlay for full screen or easy access */}
            <div className="absolute bottom-4 right-0 z-30 flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-xl border border-white/10 backdrop-blur-md opacity-45 hover:opacity-100 transition-opacity">
              <button 
                type="button"
                onClick={prevSlide}
                className="p-1.5 hover:text-[#6BCFFE] transition-colors rounded hover:bg-white/5"
                title="Slide anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                type="button" 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 hover:text-[#6BCFFE] transition-colors rounded hover:bg-white/5"
                title={isPlaying ? "Pausar apresentação" : "Executar automático"}
              >
                {isPlaying ? <Pause className="w-4 h-4 text-[#D649FB]" /> : <Play className="w-4 h-4 text-[#6BCFFE]" />}
              </button>
              <button 
                type="button"
                onClick={nextSlide}
                className="p-1.5 hover:text-[#6BCFFE] transition-colors rounded hover:bg-white/5"
                title="Próximo slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <button 
                type="button"
                onClick={toggleFullscreen}
                className="p-1.5 hover:text-[#D649FB] transition-colors rounded hover:bg-white/5"
                title="Alternar tela cheia"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Navigation Filmstrip and Quick Slider indicators */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-slate-500 font-semibold">{currentSlideIndex + 1} / {totalSlides}</span>
              <div className="grow bg-slate-900 border border-white/5 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-[#6BCFFE] font-bold">100%</span>
            </div>

            {/* Small screen inline controls */}
            <div className="sm:hidden flex justify-between items-center">
              <button
                type="button"
                onClick={prevSlide}
                className="px-3 py-1 bg-white/5 text-xs rounded hover:bg-white/10"
              >
                Anterior
              </button>
              <span className="text-xs text-slate-400 font-mono">Slide {currentSlideIndex + 1} de {totalSlides}</span>
              <button
                type="button"
                onClick={nextSlide}
                className="px-3 py-1 bg-white/5 text-xs rounded hover:bg-white/10"
              >
                Próximo
              </button>
            </div>
          </div>
        </section>

        {/* Speaker Mode Sidebar */}
        <AnimatePresence>
          {isSpeakerMode && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="border-l border-white/5 bg-[#0B0F19]/95 backdrop-blur-2xl flex flex-col shrink-0 overflow-hidden relative z-20"
            >
              <div className="w-[380px] p-6 flex flex-col h-full overflow-y-auto custom-scrollbar gap-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                    <span className="text-xs font-mono tracking-widest text-[#D649FB] font-bold uppercase">PAINEL DO PALESTRANTE</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsSpeakerMode(false)}
                    className="text-white/40 hover:text-white text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>

                {/* Countdown Timer Widget & Presets */}
                <div className="bg-slate-900/60 rounded-2xl border border-white/5 p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#6BCFFE]" /> Cronômetro Regressivo
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-black ${
                      timerSeconds === 0 ? 'bg-rose-500/20 text-rose-350 animate-pulse' :
                      timerSeconds < 120 ? 'bg-orange-500/20 text-orange-350 animate-pulse' :
                      'bg-emerald-500/20 text-emerald-350'
                    }`}>
                      {timerSeconds === 0 ? 'FIM DE TEMPO' : isTimerActive ? 'ATIVO' : 'PAUSADO'}
                    </span>
                  </div>

                  {/* Timer Value Display */}
                  <div className="flex items-center justify-between py-1 px-3 bg-slate-950/80 rounded-xl border border-white/5">
                    <span className="font-mono text-4xl font-bold tracking-widest text-white">
                      {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:{(timerSeconds % 60).toString().padStart(2, '0')}
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      {/* Adjust controls */}
                      <button
                        type="button"
                        onClick={() => setTimerSeconds((prev) => Math.max(0, prev - 60))}
                        className="p-1 px-2 bg-white/5 hover:bg-white/10 rounded font-mono text-xs text-slate-300 transition-colors cursor-pointer"
                        title="Remover 1 minuto"
                      >
                        -1m
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimerSeconds((prev) => prev + 60)}
                        className="p-1 px-2 bg-white/5 hover:bg-white/10 rounded font-mono text-xs text-slate-300 transition-colors cursor-pointer"
                        title="Adicionar 1 minuto"
                      >
                        +1m
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsTimerActive(!isTimerActive)}
                        className={`p-2 rounded transition-all cursor-pointer ${
                          isTimerActive ? 'bg-[#D649FB]/20 text-[#D649FB]' : 'bg-[#6BCFFE]/20 text-[#6BCFFE]'
                        }`}
                        title={isTimerActive ? "Pausar cronômetro" : "Iniciar cronômetro"}
                      >
                        {isTimerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTimerSeconds(1200);
                          setIsTimerActive(false);
                        }}
                        className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded transition-colors cursor-pointer"
                        title="Reiniciar cronômetro"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Preset Pills */}
                  <div className="grid grid-cols-4 gap-1.5 text-[10px] font-bold font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        setTimerSeconds(600);
                        setIsTimerActive(false);
                      }}
                      className="py-1 bg-white/5 hover:bg-white/10 hover:text-[#6BCFFE] rounded transition-colors text-slate-400 cursor-pointer"
                    >
                      10m
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTimerSeconds(900);
                        setIsTimerActive(false);
                      }}
                      className="py-1 bg-white/5 hover:bg-white/10 hover:text-[#6BCFFE] rounded transition-colors text-slate-400 cursor-pointer"
                    >
                      15m
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTimerSeconds(1200);
                        setIsTimerActive(false);
                      }}
                      className="py-1 bg-white/5 hover:bg-white/10 hover:text-[#6BCFFE] rounded transition-colors text-slate-400 cursor-pointer"
                    >
                      20m
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTimerSeconds(1800);
                        setIsTimerActive(false);
                      }}
                      className="py-1 bg-white/5 hover:bg-white/10 hover:text-[#D649FB] rounded transition-colors text-slate-400 cursor-pointer"
                    >
                      30m
                    </button>
                  </div>
                </div>

                {/* Controladores Rápidos de Enquetes no Modo Palestrante */}
                <div className="bg-slate-900/60 rounded-2xl border border-white/5 p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
                      <BarChart2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Controle de Enquetes
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsPollControlOpen(true)}
                      className="text-[10px] font-mono text-[#D649FB] hover:underline font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Painel Completo
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    {activePollId ? (
                      <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-[10px] text-emerald-300 font-mono font-bold">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            TRANSMITINDO AO VIVO
                          </span>
                          <span>
                            {polls.find(p => p.id === activePollId)?.options.reduce((sum, o) => sum + o.votes, 0)} vts
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-white line-clamp-1 truncate">
                          {polls.find(p => p.id === activePollId)?.question}
                        </p>
                        <div className="flex gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setActivePollId(null);
                            }}
                            className="flex-1 py-1 px-2 bg-slate-900 hover:bg-slate-800 text-[10px] font-mono font-bold text-rose-400 hover:text-white rounded border border-white/5 transition-colors cursor-pointer"
                          >
                            Fechar Overlay
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPolls(prev => prev.map(p => {
                                if (p.id === activePollId) {
                                  return {
                                    ...p,
                                    options: p.options.map(o => ({ ...o, votes: o.votes + Math.floor(Math.random() * 3) + 1 }))
                                  };
                                }
                                return p;
                              }));
                            }}
                            className="py-1 px-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-mono font-black rounded transition-colors cursor-pointer"
                          >
                            + Simular Votos
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-[11px] text-slate-400">
                          Selecione um tema de enquete para impulsionar a interação dos slides:
                        </p>
                        <div className="flex gap-2">
                          <select
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value) {
                                setActivePollId(value);
                              }
                            }}
                            className="flex-1 bg-slate-950 border border-white/10 rounded-lg p-1.5 text-xs text-slate-200 outline-none focus:border-[#6BCFFE]"
                            defaultValue=""
                          >
                            <option value="" disabled>-- Selecionar Enquete --</option>
                            {polls.map(p => (
                              <option key={p.id} value={p.id}>{p.category}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setIsPollControlOpen(true)}
                            className="p-1 px-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 text-xs transition-colors cursor-pointer font-bold shrink-0"
                          >
                            Painel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Speaker Notes Header and Size control */}
                <div className="flex flex-col gap-2 grow">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#D649FB]" /> Notas Privadas do Slide
                    </span>
                    
                    {/* Font sizes */}
                    <div className="flex items-center bg-slate-950 p-0.5 rounded border border-white/5 gap-1 text-[9px] font-bold font-mono">
                      <button
                        type="button"
                        onClick={() => setSpeakerFontSize('sm')}
                        className={`px-1.5 py-0.5 rounded cursor-pointer ${speakerFontSize === 'sm' ? 'bg-[#6BCFFE] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                        title="Fonte Pequena"
                      >
                        A-
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpeakerFontSize('base')}
                        className={`px-1.5 py-0.5 rounded cursor-pointer ${speakerFontSize === 'base' ? 'bg-[#6BCFFE] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                        title="Fonte Padrão"
                      >
                        A
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpeakerFontSize('lg')}
                        className={`px-1.5 py-0.5 rounded cursor-pointer ${speakerFontSize === 'lg' ? 'bg-[#6BCFFE] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                        title="Fonte Grande"
                      >
                        A+
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpeakerFontSize('xl')}
                        className={`px-1.5 py-0.5 rounded cursor-pointer ${speakerFontSize === 'xl' ? 'bg-[#6BCFFE] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                        title="Fonte Gigante"
                      >
                        A++
                      </button>
                    </div>
                  </div>

                  {/* Speaker Notes list checklist container */}
                  <div className="bg-slate-900/40 rounded-2xl border border-white/5 flex-1 p-4 overflow-y-auto max-h-[360px] custom-scrollbar space-y-3">
                    {currentSlide.speakerNotes && currentSlide.speakerNotes.length > 0 ? (
                      currentSlide.speakerNotes.map((note, index) => {
                        const noteId = `note-${currentSlide.id}-${index}`;
                        const isChecked = !!checkedNotes[noteId];
                        return (
                          <div 
                            key={index} 
                            onClick={() => setCheckedNotes(prev => ({ ...prev, [noteId]: !isChecked }))}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 select-none ${
                              isChecked 
                                ? 'bg-emerald-950/20 border-emerald-500/20 opacity-55' 
                                : 'bg-slate-950/50 border-white/5 hover:border-white/10'
                            }`}
                          >
                            <div className="pt-0.5">
                              <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                isChecked 
                                  ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                                  : 'border-white/20 border-slate-700 bg-slate-900'
                              }`}>
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>
                            <p className={`${
                              speakerFontSize === 'sm' ? 'text-xs text-slate-350' :
                              speakerFontSize === 'lg' ? 'text-base text-slate-200' :
                              speakerFontSize === 'xl' ? 'text-lg text-white font-medium' :
                              'text-sm text-slate-300'
                            } ${isChecked ? 'line-through text-slate-500' : ''} leading-relaxed`}>
                              {note}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-6 text-slate-500 text-xs font-mono">
                        Nenhuma diretriz de rodapé cadastrada para este slide. Use o pitch planejado.
                      </div>
                    )}
                  </div>
                </div>

                {/* Next Slide Preview Section */}
                {currentSlideIndex < totalSlides - 1 && (
                  <div className="bg-gradient-to-tr from-slate-900/90 to-purple-950/10 p-4 rounded-2xl border border-white/5 space-y-2 mt-auto">
                    <span className="text-[9px] font-mono uppercase text-[#6BCFFE] font-bold tracking-widest block">PRÓXIMO TÓPICO</span>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-100 truncate max-w-[200px]">
                        {SLIDES_DATA[currentSlideIndex + 1]?.title}
                      </p>
                      <span className="text-[9px] font-mono uppercase bg-white/5 text-slate-400 px-1.5 py-0.5 rounded shrink-0">
                        {SLIDES_DATA[currentSlideIndex + 1]?.visualType}
                      </span>
                    </div>
                    {SLIDES_DATA[currentSlideIndex + 1]?.subtitle && (
                      <p className="text-[11px] text-slate-400 line-clamp-1 truncate">
                        {SLIDES_DATA[currentSlideIndex + 1]?.subtitle}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Outer Footer from the Immersive UI design mockup */}
      <footer className="relative z-10 px-6 lg:px-10 py-5 border-t border-white/5 flex flex-col md:flex-row items-center justify-between bg-white/5 backdrop-blur-md gap-4">
        <div className="flex flex-wrap gap-8 lg:gap-14 w-full md:w-auto">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase text-white/30 tracking-widest font-mono">WhatsApp</span>
            <span className="text-xs font-semibold text-slate-200 mt-0.5 hover:text-[#6BCFFE] transition-colors cursor-pointer">+55 61 9501-1614</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-[9px] uppercase text-white/30 tracking-widest font-mono">E-mail</span>
            <span className="text-xs font-semibold text-slate-200 mt-0.5 hover:text-[#6BCFFE] transition-colors cursor-pointer">metaimpulsobr@gmail.com</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-[9px] uppercase text-white/30 tracking-widest font-mono">Sede Digital</span>
            <span className="text-xs font-semibold text-slate-200 mt-0.5 hover:text-[#6BCFFE] transition-colors cursor-pointer">metaimpulso.com.br</span>
          </div>
        </div>

        <div className="text-white/40 italic font-serif text-xs text-right mt-2 md:mt-0 font-light select-none">
          "Empresas inteligentes constroem sistemas que geram crescimento."
        </div>
      </footer>

      {/* Exporter modal launcher */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />

      {/* Quick Poll System Overlay Panel */}
      <QuickPollOverlay
        isOpen={isPollControlOpen}
        onClose={() => setIsPollControlOpen(false)}
        activePollId={activePollId}
        setActivePollId={setActivePollId}
        polls={polls}
        setPolls={setPolls}
      />
    </div>
  );
};
