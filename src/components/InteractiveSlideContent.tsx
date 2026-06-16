import React, { useState } from 'react';
import { Slide, CaseStudy } from '../types';
import { CASE_STUDIES } from '../data/presentationData';
import { Logo } from './Logo';
import { 
  TrendingUp, Code, Laptop, Database, Cpu, Megaphone, Users, Shuffle, 
  DollarSign, Activity, Play, ArrowRight, CheckCircle2, MessageSquare, 
  Smartphone, BarChart3, Star, Mail, Phone, Globe, Sparkles, Send, 
  ChevronRight, Calendar
} from 'lucide-react';

interface ContentProps {
  slide: Slide;
}

export const InteractiveSlideContent: React.FC<ContentProps> = ({ slide }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('voogle');
  const [solutionStep, setSolutionStep] = useState<number>(0);
  const [automationSimState, setAutomationSimState] = useState<'idle' | 'lead' | 'whatsapp' | 'crm' | 'success'>('idle');
  const [aiChatLogs, setAiChatLogs] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'user', text: 'Quero otimizar o atendimento da minha clínica médica.' },
    { sender: 'bot', text: 'Olá! Sou o Agente Inteligente Meta Impulso. Consigo fazer a triagem de sintomas de pacientes comuns, responder dúvidas sobre termos e agendar consultas direto na agenda médica do especialista correto. Deseja realizar um agendamento teste?' }
  ]);
  const [aiInput, setAiInput] = useState('');

  // Icon selector helper
  const renderIcon = (name?: string, className: string = "w-6 h-6 text-[#6BCFFE]") => {
    switch (name) {
      case 'TrendingUp': return <TrendingUp className={className} />;
      case 'Code': return <Code className={className} />;
      case 'Workflow': return <Shuffle className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Megaphone': return <Megaphone className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Database': return <Database className={className} />;
      case 'Shuffle': return <Shuffle className={className} />;
      case 'DollarSign': return <DollarSign className={className} />;
      case 'Activity': return <Activity className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = aiInput;
    setAiChatLogs(prev => [...prev, { sender: 'user', text: userMsg }]);
    setAiInput('');

    setTimeout(() => {
      let botResponse = "Sua solicitação foi interpretada por nossa inteligência artificial cognitiva externa. O ticket foi atualizado!";
      if (userMsg.toLowerCase().includes('agendar') || userMsg.toLowerCase().includes('consulta')) {
        botResponse = "Perfeito! Horários disponíveis para amanhã: 14:00 (Dr. Marcos - Neuropediatra). Posso confirmar para você?";
      } else if (userMsg.toLowerCase().includes('sim') || userMsg.toLowerCase().includes('confirmar')) {
        botResponse = "✓ Agendamento realizado com sucesso! Um aviso de confirmação foi disparado para seu WhatsApp e inserido na fila comercial do CRM Voogle.";
      } else {
        botResponse = `Entendi. Estarei estruturando o playbook técnico sobre "${userMsg}" para otimizar suas conversões digitais imediatas.`;
      }
      setAiChatLogs(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 1000);
  };

  switch (slide.visualType) {
    case 'cover':
      return (
        <div className="flex flex-col lg:flex-row items-center justify-between h-full relative py-6 select-none overflow-hidden gap-8 text-left">
          {/* Pulsing neon grid aura background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,73,251,0.08),transparent_65%)] animate-pulse pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(107,207,254,0.06),transparent_50%)] pointer-events-none" />
          
          <div className="relative z-10 px-4 max-w-2xl flex flex-col items-start">
            {/* Minimalist Micro Floating Tech Tag */}
            <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6BCFFE] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6BCFFE]"></span>
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/70">Digital Growth Agency</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-6 text-white font-sans uppercase">
              <span className="block">META</span>
              <span className="block text-transparent bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] bg-clip-text">IMPULSO</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/60 font-light max-w-xl leading-relaxed mb-8">
              Marketing, Tecnologia e Inteligência Artificial para empresas que querem <span className="text-white font-medium">crescer com previsibilidade.</span>
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
                <a 
                  href="https://wa.me/5561995011614?text=Quero%20agendar%20meu%20diagn%C3%B3stico%20estrat%C3%A9gico%20Meta%20Impulso" 
                  target="_blank"
                  rel="noreferrer"
                  className="relative px-8 py-3 bg-white text-[#0F172A] rounded-full font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition hover:bg-slate-100"
                >
                  Agendar Diagnóstico
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Rotating Orbit Display */}
          <div className="relative w-72 h-72 lg:w-80 lg:h-80 shrink-0 hidden md:block">
            <div className="absolute inset-0 border-[1px] border-white/10 rounded-full animate-[spin_20s_linear_infinite]">
              <div className="absolute -top-1 left-1/2 w-2 h-2 bg-[#6BCFFE] rounded-full shadow-[0_0_10px_#6BCFFE]"></div>
            </div>
            <div className="absolute inset-8 border-[1px] border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]">
              <div className="absolute top-1/2 -right-1 w-2 h-2 bg-[#D649FB] rounded-full shadow-[0_0_10px_#D649FB]"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-36 h-36 bg-slate-900/40 backdrop-blur-2xl rounded-full border border-white/15 flex flex-col items-center justify-center text-center p-5 shadow-2xl relative overflow-hidden group">
                <Logo className="w-14 h-14 mb-1.5" glow />
                <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-bold font-sans">Impulso Médio</span>
                <span className="text-2xl font-black text-[#6BCFFE] font-mono leading-none">+312%</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'about':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl text-[#6BCFFE] font-mono tracking-wider font-semibold uppercase">{slide.subtitle}</h3>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">{slide.title}</h2>
            <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed">
              {slide.content?.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {slide.bullets?.map((item, index) => (
              <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#6BCFFE]/40 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group shadow-lg">
                <div className="mb-3 p-2 w-10 h-10 rounded-lg bg-slate-900/60 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                  {renderIcon(item.icon)}
                </div>
                <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'problem':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="text-xs text-rose-400 font-mono tracking-wider uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Vazamento de Faturamento & Gargalos
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{slide.title}</h2>
            <p className="text-slate-400 text-sm md:text-base mb-2">{slide.subtitle}</p>
            
            <div className="space-y-3 h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {slide.bullets?.map((bullet, index) => (
                <div key={index} className="flex gap-3 items-start p-2.5 rounded-lg bg-rose-950/10 border border-rose-500/10 hover:bg-rose-950/20 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20 shrink-0 mt-0.5 text-xs font-bold font-mono">
                    !
                  </div>
                  <div>
                    <h4 className="text-slate-200 font-semibold text-sm">{bullet.title}</h4>
                    <p className="text-slate-400 text-xs mt-0.5">{bullet.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-5 flex flex-col p-6 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md relative overflow-hidden shadow-2xl shadow-rose-950/20">
            <h4 className="font-semibold text-slate-200 text-sm mb-4 text-center font-mono">Rendimento Médio Operacional</h4>
            
            {/* Opportunity Loss Micro Chart */}
            <div className="flex flex-col space-y-4 py-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Modelo Convencional (Mapeado)</span>
                  <span className="text-rose-400 font-mono font-bold">Apenas 15% das metas</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-1000 w-[15%]" />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Perdas massivas em leads frios e respostas manuais demoradas.</p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#6BCFFE] font-bold">Meta Impulso (Esperado)</span>
                  <span className="text-emerald-400 font-mono font-bold">Até 92% de eficiência</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] h-full rounded-full transition-all duration-1000 w-[92%]" />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Acoplagem perfeita de publicidade paga com triagem automática inteligente.</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-rose-950/20 border border-rose-500/20 rounded-xl text-center">
              <span className="text-xs text-rose-300 font-medium">Empresas perdem até 70% do orçamento publicitário por falta de follow-up em menos de 5 minutos.</span>
            </div>
          </div>
        </div>
      );

    case 'solution':
      return (
        <div className="flex flex-col justify-between h-full space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{slide.title}</h2>
              <p className="text-slate-400 text-xs md:text-sm mt-1">{slide.subtitle}</p>
            </div>
            {/* Step triggers */}
            <div className="flex gap-1.5 bg-slate-900/80 p-1.5 rounded-lg border border-white/5">
              {slide.bullets?.map((_, i) => (
                <button 
                  key={i}
                  type="button"
                  onClick={() => setSolutionStep(i)}
                  className={`w-8 h-8 rounded-md flex items-center justify-center font-mono text-xs transition-colors ${
                    solutionStep === i 
                      ? 'bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] text-white font-bold' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Flow Loop Card */}
          <div className="flex flex-col md:flex-row items-stretch gap-4 grow min-h-[160px]">
            {/* Visual connector rail */}
            <div className="flex md:flex-col justify-between items-center bg-slate-900/60 border border-white/10 p-5 rounded-xl md:w-56 shrink-0 gap-3">
              <h4 className="text-slate-300 text-[11px] font-mono tracking-wider uppercase text-center hidden md:block">Processo Unificado</h4>
              <div className="flex md:flex-col items-center justify-center gap-3 w-full">
                {slide.bullets?.map((bullet, index) => {
                  const isActive = index === solutionStep;
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSolutionStep(index)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                          isActive 
                            ? 'bg-[#6BCFFE]/10 border-[#6BCFFE] text-[#6BCFFE] scale-110 shadow-lg shadow-[#61c9fc]/20' 
                            : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {renderIcon(bullet.icon, `w-4 h-4 ${isActive ? 'text-[#6BCFFE]' : 'text-slate-400'}`)}
                      </button>
                      {index < (slide.bullets?.length || 0) - 1 && <ChevronRight className="w-3 h-3 text-slate-600 md:rotate-90 hidden sm:block" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step card description */}
            <div className="grow p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md flex flex-col justify-center min-h-[180px]">
              {slide.bullets && slide.bullets[solutionStep] && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#D649FB]/10 border border-[#D649FB]/20 rounded-xl text-[#D649FB]">
                    {renderIcon(slide.bullets[solutionStep].icon, "w-8 h-8 text-[#D649FB]")}
                  </div>
                  <div>
                    <span className="text-xs font-mono tracking-wider text-[#6BCFFE] uppercase">Fase 0{solutionStep + 1} • {slide.bullets[solutionStep].title}</span>
                    <h3 className="text-xl font-bold text-white mt-1">Como operamos em {slide.bullets[solutionStep].title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed mt-2 max-w-xl">
                      {slide.bullets[solutionStep].description} Com isso, garantimos passagem síncrona sem atrito. Cada conversão é enriquecida na nuvem e mapeada diretamente em bancos de dados corporativos.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center font-mono text-[11px] text-slate-500">
            Nossos ecossistemas integram APIs de ferramentas líderes mundiais (HubSpot, Meta, Google, ActiveCampaign, etc.)
          </div>
        </div>
      );

    case 'list':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
          <div className="flex flex-col space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">{slide.title}</h2>
            <p className="text-slate-300 text-sm md:text-base">{slide.subtitle}</p>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
              <p className="text-slate-400 font-mono text-xs">{slide.content?.[0]}</p>
            </div>
            
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-mono text-slate-400">Ativos & Diferenciais chave:</span>
              <div className="grid grid-cols-2 gap-2">
                {slide.benefits?.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col bg-slate-900/80 p-5 rounded-2xl border border-white/10 relative shadow-2xl h-[280px] overflow-y-auto custom-scrollbar">
            <span className="text-[10px] font-mono text-slate-500 mb-3 block tracking-wide uppercase">Diferenciais Operacionais</span>
            <div className="space-y-4">
              {slide.bullets?.map((bullet, i) => (
                <div key={i} className="flex gap-3 justify-start items-start border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <div className="mt-1 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] shrink-0" />
                  <div>
                    <h4 className="text-slate-100 font-semibold text-xs md:text-sm">{bullet.title}</h4>
                    <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{bullet.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'crm':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <div className="text-xs text-[#6BCFFE] font-mono tracking-wider uppercase flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#6BCFFE]" /> Sincronização Síncrona Comercial
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">{slide.title}</h2>
            <p className="text-slate-300 text-xs md:text-sm font-light leading-relaxed">{slide.content?.[0]}</p>
            
            <div className="space-y-2.5">
              {slide.bullets?.map((bullet, idx) => (
                <div key={idx} className="flex gap-2.5 items-start p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                  <div className="w-5 h-5 rounded-full bg-[#6BCFFE]/10 flex items-center justify-center text-[#6BCFFE] font-bold text-xs shrink-0 mt-0.5 border border-[#6bcffe]/20">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-slate-200 font-bold text-xs md:text-sm">{bullet.title}</h3>
                    <p className="text-slate-400 text-xs">{bullet.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CRM flow preview simulation */}
          <div className="lg:col-span-6 flex flex-col p-5 bg-slate-900/80 rounded-2xl border border-white/10 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <span className="text-xs font-mono text-[#D649FB] flex items-center gap-1">
                <Laptop className="w-3.5 h-3.5" /> Simulador de Fluxo de Automação
              </span>
              <button 
                type="button"
                onClick={() => setAutomationSimState('idle')}
                className="text-[10px] text-slate-400 hover:text-white underline"
              >
                Resetar
              </button>
            </div>

            {/* Interactive Stages */}
            <div className="space-y-3.5 py-1">
              {/* Trigger: New Lead */}
              <div className={`p-2.5 rounded-lg border transition-all ${
                automationSimState === 'idle' 
                  ? 'bg-[#1E293B]/70 border-[#334155]' 
                  : 'bg-emerald-950/20 border-emerald-500/20 opacity-70'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Lead Capturado no Instagram
                  </span>
                  {automationSimState === 'idle' && (
                    <button 
                      type="button"
                      onClick={() => setAutomationSimState('lead')}
                      className="px-2 py-1 bg-[#6BCFFE] hover:bg-[#6BCFFE]/80 text-slate-950 font-bold text-[10px] rounded flex items-center gap-0.5 transition-colors"
                    >
                      Disparar <Play className="w-2 h-2 fill-slate-950" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Nome: Roberto Souza | Telefone: (11) 99876-5432</p>
              </div>

              {/* State: WhatsApp notification */}
              <div className={`p-2.5 rounded-lg border transition-all ${
                automationSimState === 'lead'
                  ? 'bg-[#D649FB]/10 border-[#D649FB] scale-[1.02]'
                  : automationSimState === 'whatsapp' || automationSimState === 'crm' || automationSimState === 'success'
                  ? 'bg-emerald-950/20 border-emerald-500/20 opacity-70'
                  : 'bg-slate-800/20 border-slate-700/20 opacity-40'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-green-400" /> WhatsApp do Comercial + Cliente
                  </span>
                  {automationSimState === 'lead' && (
                    <button 
                      type="button"
                      onClick={() => setAutomationSimState('whatsapp')}
                      className="px-2 py-0.5 bg-green-500 hover:bg-green-600 text-white font-semibold text-[10px] rounded transition-colors"
                    >
                      Ver Mensagem
                    </button>
                  )}
                </div>
                <div className="p-1 px-2 border border-slate-700 rounded bg-slate-900/60 mt-1.5">
                  <p className="text-[9px] font-mono text-green-300">
                    "Olá Roberto! Vi que você gostou do nosso software. Aqui está o catálogo..."
                  </p>
                </div>
              </div>

              {/* State: CRM stage status update */}
              <div className={`p-2.5 rounded-lg border transition-all ${
                automationSimState === 'whatsapp'
                  ? 'bg-[#6BCFFE]/10 border-[#6BCFFE] scale-[1.02]'
                  : automationSimState === 'crm' || automationSimState === 'success'
                  ? 'bg-emerald-950/20 border-emerald-500/20 opacity-70'
                  : 'bg-slate-800/20 border-slate-700/20 opacity-40'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-250 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-[#6BCFFE]" /> CRM Atualizado no Pipeline
                  </span>
                  {automationSimState === 'whatsapp' && (
                    <button 
                      type="button"
                      onClick={() => setAutomationSimState('crm')}
                      className="px-2 py-0.5 bg-[#6BCFFE] text-slate-950 font-bold text-[10px] rounded transition-colors"
                    >
                      Mudar Status
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Lead movido de <span className="line-through">Novo</span> para <span className="text-[#6BCFFE] font-semibold">Contato Realizado (Auto)</span></p>
              </div>

              {/* Success Final state */}
              <div className={`p-2.5 rounded-lg border transition-all ${
                automationSimState === 'crm'
                  ? 'bg-[#D649FB]/20 border-white/40 scale-[1.02]'
                  : automationSimState === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500'
                  : 'bg-slate-800/20 border-slate-700/20 opacity-40'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-200">Reengajamento Executado</span>
                  {automationSimState === 'crm' && (
                    <button 
                      type="button"
                      onClick={() => setAutomationSimState('success')}
                      className="px-2.5 py-0.5 bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] text-slate-950 font-bold text-[10px] rounded transition-colors"
                    >
                      Finalizar Fechamento
                    </button>
                  )}
                </div>
                {automationSimState === 'success' ? (
                  <p className="text-[10px] text-emerald-400 font-bold mt-1">✓ Fechamento realizado em tempo recorde (~12 minutos)! ROI de 4.5x garantido.</p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1">Garante que o vendedor receba lembrete de follow-up se o cliente travar.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      );

    case 'ia':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="text-xs text-transparent bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] bg-clip-text font-mono tracking-wider uppercase font-semibold flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-4 h-4 text-[#D649FB]" /> Inteligência Artificial Cognitiva
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">{slide.title}</h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{slide.subtitle}</p>
            <p className="text-slate-300 text-xs md:text-sm">{slide.content?.[0]}</p>
            
            <div className="flex flex-wrap gap-2 pt-1">
              {slide.bullets?.slice(0, 3).map((b, i) => (
                <div key={i} className="p-1 px-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] text-slate-300">
                  ⚡ {b.title}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive chatbot playground representing "The Future of Companies" */}
          <div className="lg:col-span-7 flex flex-col h-[280px] bg-[#0c101c] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Chat header */}
            <div className="bg-[#12182b] px-4 py-2 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-200">Demonstrativo de Agente Comercial</span>
              </div>
              <span className="text-[9px] font-mono text-slate-500">Modelo: Meta-AI v1.5</span>
            </div>

            {/* Chat logs */}
            <div className="grow p-4 space-y-3.5 overflow-y-auto custom-scrollbar select-none text-xs flex flex-col">
              {aiChatLogs.map((log, i) => (
                <div key={i} className={`flex ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    log.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none'
                  }`}>
                    {log.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic Suggestion Quick clicks */}
            <div className="px-3 py-1.5 bg-[#12182b]/80 border-t border-white/5 flex gap-2 overflow-x-auto custom-scrollbar">
              <button 
                type="button" 
                onClick={() => setAiInput('Gostaria de agendar para amanhã')}
                className="shrink-0 text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2 py-0.5 rounded border border-white/5 transition-colors"
              >
                📅 "Desejo agendar"
              </button>
              <button 
                type="button" 
                onClick={() => setAiInput('Sim, pode confirmar a consulta')}
                className="shrink-0 text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2 py-0.5 rounded border border-white/5 transition-colors"
              >
                ✓ "Sim, confirmar!"
              </button>
              <button 
                type="button" 
                onClick={() => setAiInput('Como funciona a integração com o CRM?')}
                className="shrink-0 text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2 py-0.5 rounded border border-white/5 transition-colors"
              >
                ⚙️ "Como funciona o CRM?"
              </button>
            </div>

            {/* Chat form */}
            <form onSubmit={handleAiSend} className="p-2.5 bg-[#12182b] border-t border-white/5 flex gap-2 items-center">
              <input 
                type="text" 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Digite uma mensagem de teste..."
                className="grow bg-[#0c101c] text-white placeholder-slate-500 border border-white/5 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#6BCFFE] text-xs transition-colors"
              />
              <button 
                type="submit"
                className="p-1.5 bg-[#D649FB] hover:bg-[#D649FB]/80 text-white rounded-lg transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      );

    case 'process':
      return (
        <div className="flex flex-col justify-between h-full space-y-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{slide.title}</h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1">{slide.subtitle}</p>
          </div>

          {/* Graphical Orbital Roadmap */}
          <div className="grid grid-cols-5 gap-3 items-stretch relative py-4 grow">
            {/* Flow Connector Line SVG behind the objects */}
            <div className="absolute top-[40px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#D649FB] via-indigo-500 to-[#6BCFFE] -z-10 hidden md:block" />

            {slide.bullets?.map((step, idx) => {
              const digit = idx + 1;
              return (
                <div key={idx} className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/10 hover:bg-slate-900/80 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 border border-white/15 text-white font-bold font-mono text-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform relative">
                    {/* Ring highlight */}
                    <div className="absolute inset-0 rounded-full border border-transparent group-hover:border-[#6BCFFE] transition-colors" />
                    0{digit}
                  </div>
                  <h4 className="text-white font-bold text-xs md:text-sm tracking-tight mb-1">{step.title}</h4>
                  <p className="text-slate-400 text-[10px] md:text-xs leading-relaxed max-w-xs">{step.description}</p>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center gap-2 justify-center text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#6BCFFE] animate-ping" />
            <span>Nossa equipe garante a entrega e o Go-Live da primeira versão em apenas 15 dias úteis de planejamento de sprint!</span>
          </div>
        </div>
      );

    case 'results':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
          <div className="flex flex-col space-y-4">
            <div className="text-xs text-[#6BCFFE] font-mono tracking-wider uppercase flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#6BCFFE]" /> Impacto e Métricas Contratuais
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">{slide.title}</h2>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">{slide.subtitle}</p>
            
            <div className="p-4 bg-gradient-to-r from-emerald-950/10 to-transparent border border-emerald-500/20 rounded-xl">
              <span className="text-xs font-mono text-emerald-400 block mb-1">✓ Eficiência Comercial Esperada</span>
              <p className="text-xs text-slate-305 leading-relaxed">
                Toda empresa que acopla tráfego pago + triagem por agentes inteligentes atinge previsibilidade de fechamento e reduz custos em até 62%.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {slide.bullets?.map((cell, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors shadow-lg">
                <span className="text-2xl font-bold block text-transparent bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] bg-clip-text font-mono">
                  +{idx === 0 ? '180%' : idx === 1 ? '3.5x' : idx === 2 ? '42%' : idx === 3 ? '100k+' : '60%'}
                </span>
                <h4 className="text-slate-205 font-bold text-[11px] uppercase tracking-wide mt-1.5">{cell.title}</h4>
                <p className="text-slate-400 text-[10px] mt-0.5 leading-relaxed">{cell.description}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'reasons':
      return (
        <div className="flex flex-col justify-between h-full space-y-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{slide.title}</h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1">{slide.subtitle}</p>
          </div>

          {/* Custom Bento reasons stack */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 grow">
            {slide.bullets?.slice(0, 3).map((reason, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-gradient-to-b from-white/5 to-white/[0.01] border border-white/10 hover:border-[#6BCFFE]/50 transition-colors relative flex flex-col justify-between">
                <div className="text-[#6BCFFE] mb-4">
                  {idx === 0 ? <Laptop className="w-8 h-8" /> : idx === 1 ? <Code className="w-8 h-8" /> : <Cpu className="w-8 h-8" />}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base tracking-tight mb-2">{reason.title}</h3>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {slide.bullets?.slice(3).map((reason, idx) => (
              <div key={idx} className="p-3 px-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors flex items-center gap-3">
                <div className="text-xs text-[#D649FB] font-mono shrink-0">0{idx + 4}</div>
                <div>
                  <h3 className="text-white font-bold text-xs">{reason.title}</h3>
                  <p className="text-slate-400 text-[10px]">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'cases':
      return (
        <div className="flex flex-col justify-between h-full space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{slide.title}</h2>
              <p className="text-slate-400 text-xs md:text-sm mt-1">{slide.subtitle}</p>
            </div>
            
            {/* Tab select list */}
            <div className="flex gap-1.5 overflow-x-auto max-w-full bg-slate-900/60 p-1 rounded-lg border border-white/5 shrink-0">
              {CASE_STUDIES.map((cs) => (
                <button
                  key={cs.id}
                  type="button"
                  onClick={() => setSelectedCaseId(cs.id)}
                  className={`text-[11px] px-3 py-1.5 rounded-md font-semibold transition-all shrink-0 ${
                    selectedCaseId === cs.id
                      ? 'bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cs.name}
                </button>
              ))}
            </div>
          </div>

          {/* Active Case Card Render */}
          {CASE_STUDIES.map((cs) => {
            if (cs.id !== selectedCaseId) return null;
            return (
              <div key={cs.id} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch grow relative">
                {/* Visual tags background indicator */}
                <div className="lg:col-span-7 flex flex-col justify-between p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden shadow-xl">
                  <div>
                    <span className="text-[10px] font-mono text-[#D649FB] tracking-widest uppercase">{cs.category}</span>
                    <h3 className="text-2xl font-black text-white mt-1">{cs.name}</h3>
                    <p className="text-slate-300 text-xs md:text-sm mt-2 leading-relaxed">{cs.description}</p>
                  </div>

                  <div className="mt-4">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">Tags Tecnológicas:</span>
                    <div className="flex gap-2 flex-wrap">
                      {cs.tags.map((t, idx) => (
                        <span key={idx} className="bg-slate-950/60 border border-white/10 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg">
                    <span className="text-xs text-emerald-400 font-bold block mb-0.5">Resultado Obtido:</span>
                    <p className="text-slate-300 text-xs font-light">{cs.resultsText}</p>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-3 justify-center">
                  {cs.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex justify-between items-center hover:bg-slate-900/80 transition-colors">
                      <div>
                        <h4 className="text-slate-300 font-bold text-xs">{m.label}</h4>
                        <p className="text-slate-500 text-[10px] mt-0.5">{m.description}</p>
                      </div>
                      <span className="text-2xl font-black text-transparent bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] bg-clip-text font-mono">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );

    case 'cta':
      return (
        <div className="flex flex-col items-center justify-center text-center h-full relative px-4 max-w-3xl mx-auto py-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(107,207,254,0.15),transparent_50%)] pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <span className="px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-[#D649FB]/30 text-[#D649FB] font-mono text-xs uppercase tracking-wider">
              Diagnóstico de Crescimento Gratuito
            </span>
            
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {slide.title}
            </h2>

            <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
              {slide.impactPhrase}
            </p>

            <div className="pt-4">
              <a 
                href="https://wa.me/5561995011614?text=Quero%20agendar%20meu%20diagn%C3%B3stico%20estrat%C3%A9gico%20Meta%20Impulso" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] hover:from-[#D649FB]/90 hover:to-[#6BCFFE]/90 text-slate-950 font-black text-sm uppercase tracking-wider transition-all hover:scale-105 shadow-xl shadow-purple-500/10 cursor-pointer"
              >
                <Calendar className="w-4 h-4 fill-slate-950" /> {slide.ctaText} <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <p className="text-[11px] font-mono text-slate-500">
              * Vagas limitadas para este mês baseado no teto operacional técnico de nossa equipe corporativa.
            </p>
          </div>
        </div>
      );

    case 'footer':
      return (
        <div className="flex flex-col justify-between h-full py-2">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto my-auto space-y-6">
            <Logo className="w-14 h-14" glow />

            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              {slide.title}
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-line font-medium italic">
              "{slide.impactPhrase}"
            </p>

            <div className="h-0.5 w-16 bg-white/10 rounded-full" />
            
            <p className="text-slate-400 text-xs font-mono">
              {slide.subtitle}
            </p>
          </div>

          {/* Social connections panel */}
          <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-3">
            <div className="flex gap-5">
              <span className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[11px] font-mono">
                <Phone className="w-3.5 h-3.5 text-green-400" /> +55 61 9501-1614
              </span>
              <span className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[11px] font-mono">
                <Mail className="w-3.5 h-3.5 text-[#6BCFFE]" /> metaimpulsobr@gmail.com
              </span>
              <span className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[11px] font-mono">
                <Globe className="w-3.5 h-3.5 text-[#D649FB]" /> metaimpulso.com.br
              </span>
            </div>
            
            <div className="font-mono text-[10px]">
              © 2026 Meta Impulso • Todos os direitos reservados.
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center h-full text-slate-400">
          Slide interativo com formato indisponível.
        </div>
      );
  }
};
