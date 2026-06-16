import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart2, Users, RefreshCw, Play, Pause, Trash2, X, Check, HelpCircle, Sliders } from 'lucide-react';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  category: string;
  options: PollOption[];
}

interface QuickPollProps {
  isOpen: boolean;
  onClose: () => void;
  activePollId: string | null;
  setActivePollId: (id: string | null) => void;
  polls: Poll[];
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>;
}

export const QuickPollOverlay: React.FC<QuickPollProps> = ({
  isOpen,
  onClose,
  activePollId,
  setActivePollId,
  polls,
  setPolls,
}) => {
  const [selectedPollId, setSelectedPollId] = useState<string>(polls[0]?.id || '');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'control' | 'vote'>('control');

  const selectedPoll = polls.find(p => p.id === selectedPollId);
  const activeLivePoll = polls.find(p => p.id === activePollId);

  // Simulated live audience automated voting
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isSimulating && activePollId) {
      interval = setInterval(() => {
        setPolls(prevPolls =>
          prevPolls.map(p => {
            if (p.id === activePollId) {
              // Scatter votes randomly among options to simulate realistic growth
              const randomIndex = Math.floor(Math.random() * p.options.length);
              const updatedOptions = p.options.map((opt, idx) => {
                if (idx === randomIndex) {
                  return { ...opt, votes: opt.votes + Math.floor(Math.random() * 5) + 1 };
                }
                // Occasionally add smaller votes to others too
                if (Math.random() > 0.6) {
                  return { ...opt, votes: opt.votes + Math.floor(Math.random() * 2) };
                }
                return opt;
              });
              return { ...p, options: updatedOptions };
            }
            return p;
          })
        );
      }, 900);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating, activePollId, setPolls]);

  // Turn off simulation if live poll is deactivated
  useEffect(() => {
    if (!activePollId) {
      setIsSimulating(false);
    }
  }, [activePollId]);

  const handleVote = (pollId: string, optionId: string) => {
    setPolls(prevPolls =>
      prevPolls.map(p => {
        if (p.id === pollId) {
          const updatedOptions = p.options.map(opt => {
            if (opt.id === optionId) {
              return { ...opt, votes: opt.votes + 1 };
            }
            return opt;
          });
          return { ...p, options: updatedOptions };
        }
        return p;
      })
    );
  };

  const resetVotes = (pollId: string) => {
    setPolls(prevPolls =>
      prevPolls.map(p => {
        if (p.id === pollId) {
          const resetOpts = p.options.map(opt => ({ ...opt, votes: 0 }));
          return { ...p, options: resetOpts };
        }
        return p;
      })
    );
  };

  const getPollTotalVotes = (poll: Poll) => {
    return poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl bg-[#090D1A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] text-slate-950">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white font-sans">
                    Painel do Apresentador: Enquetes Rápidas
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Engajamento Interativo em Tempo Real para Webinares e Diagnósticos
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 px-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub Tabs Selection */}
            <div className="grid grid-cols-2 p-1 bg-slate-950 border-b border-white/5 mx-6 mt-4 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('control')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
                  activeTab === 'control'
                    ? 'bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 inline mr-1.5" /> Administrar Enquetes
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('vote');
                  if (activeLivePoll) {
                    setSelectedPollId(activeLivePoll.id);
                  }
                }}
                className={`py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
                  activeTab === 'vote'
                    ? 'bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5 inline mr-1.5" /> Simular Painel de Votos
              </button>
            </div>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {activeTab === 'control' ? (
                /* Administration Module */
                <div className="space-y-5">
                  <div className="p-3.5 bg-purple-950/20 border border-purple-500/20 rounded-2xl flex items-start gap-3 text-xs text-purple-200">
                    <HelpCircle className="w-5 h-5 text-[#D649FB] shrink-0" />
                    <div className="space-y-1">
                      <p className="font-semibold">Como Funciona o Engajamento por Enquetes?</p>
                      <p className="text-slate-350 leading-relaxed">
                        Selecione um tópico específico de acordo com o momento da apresentação. Ative-o para que os slides exibam um overlay imersivo. Isso incentiva o público a responder via chat ou ao vivo, enquanto você pode simular a entrada incremental de centenas de respostas para demonstrar autoridade.
                      </p>
                    </div>
                  </div>

                  {/* Poll list selector layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {polls.map((item) => {
                      const isCurrentlyActive = item.id === activePollId;
                      const isViewingThis = item.id === selectedPollId;
                      const totalVotes = getPollTotalVotes(item);

                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedPollId(item.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 text-left relative overflow-hidden group ${
                            isViewingThis
                              ? 'bg-slate-900 border-[#6BCFFE] shadow-lg shadow-[#6BCFFE]/5'
                              : 'bg-slate-950/40 border-white/5 hover:border-white/10 hover:bg-slate-950/80'
                          }`}
                        >
                          {isCurrentlyActive && (
                            <div className="absolute top-0 right-0 py-0.5 px-3 bg-emerald-500 text-slate-950 font-black font-mono text-[8px] uppercase rounded-bl-lg tracking-widest animate-pulse">
                              AO VIVO NOS SLIDES
                            </div>
                          )}

                          <div className="space-y-1">
                            <span className="text-[9px] font-mono font-bold uppercase text-slate-400 bg-white/5 px-2 py-0.5 rounded tracking-wide">
                              {item.category}
                            </span>
                            <h4 className="text-xs font-bold leading-relaxed text-white mt-2 group-hover:text-[#6BCFFE] transition-colors line-clamp-2">
                              {item.question}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-white/5 pt-2.5">
                            <span>{item.options.length} Alternativas</span>
                            <span className="font-bold text-white">{totalVotes} fotos / amostras</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Inspector / Action Box for the selected poll */}
                  {selectedPoll && (
                    <div className="p-5 bg-slate-950/80 border border-white/15 rounded-3xl space-y-4 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#D649FB] font-bold tracking-widest">
                            Configuração do Tópico Selecionado
                          </span>
                          <h3 className="text-sm font-semibold text-white mt-1">
                            {selectedPoll.question}
                          </h3>
                        </div>

                        {/* Direct display state button */}
                        <div className="shrink-0 flex gap-1.5">
                          {selectedPoll.id === activePollId ? (
                            <button
                              type="button"
                              onClick={() => {
                                setActivePollId(null);
                                setIsSimulating(false);
                              }}
                              className="px-3 py-1.5 bg-rose-500/20 text-rose-350 border border-rose-500/30 font-bold hover:bg-rose-500 hover:text-white transition-all text-xs rounded-lg cursor-pointer flex items-center gap-1"
                            >
                              <X className="w-3 h-3" /> Desativar Overlay
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setActivePollId(selectedPoll.id);
                                setSelectedPollId(selectedPoll.id);
                              }}
                              className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black uppercase text-[10px] sm:text-xs rounded-lg transition-all shadow-md shadow-emerald-500/10 cursor-pointer flex items-center gap-1 inline-flex hover:scale-[1.01]"
                            >
                              🚀 Transmitir para Tela
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Options Preview with simulated votes */}
                      <div className="space-y-2">
                        {selectedPoll.options.map((opt) => {
                          const totalVotes = getPollTotalVotes(selectedPoll);
                          const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                          return (
                            <div key={opt.id} className="relative p-2.5 rounded-xl bg-slate-900 border border-white/5 overflow-hidden">
                              {/* progress bar */}
                              <div
                                className="absolute left-0 top-0 bottom-0 bg-white/5 rounded-l-xl transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                              <div className="flex justify-between items-center relative z-10 text-[11px] font-mono">
                                <span className="text-slate-300 font-sans font-medium">{opt.text}</span>
                                <span className="font-bold text-slate-400 shrink-0">
                                  {opt.votes} vts ({percentage}%)
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Presenter simulated speed engine buttons */}
                      {selectedPoll.id === activePollId && (
                        <div className="p-4 bg-[#0F172A] border border-[#6BCFFE]/20 rounded-2xl flex flex-wrap gap-3 items-center justify-between">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-mono text-[#6BCFFE] font-bold uppercase tracking-wider flex items-center gap-1">
                              <RefreshCw className="w-3 h-3 animate-spin duration-[4s]" /> Gerador de Audiência Realista
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Simula a chegada incremental e fluida de votos do público em tempo real.
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => resetVotes(selectedPoll.id)}
                              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-350 rounded-lg transition-colors cursor-pointer text-xs"
                              title="Zerar estatísticas"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsSimulating(!isSimulating);
                              }}
                              className={`px-4 py-2 font-bold text-xs uppercase rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                                isSimulating
                                  ? 'bg-[#D649FB]/20 text-[#D649FB] border border-[#D649FB]/30 shadow-md'
                                  : 'bg-[#6BCFFE]/20 text-[#6BCFFE] border border-[#6BCFFE]/30'
                              }`}
                            >
                              {isSimulating ? (
                                <>
                                  <Pause className="w-3.5 h-3.5" /> Pausar Fluxo
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5" /> Iniciar Autovotos
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Interactive voting playground simulation */
                <div className="space-y-4">
                  <div className="p-3 bg-slate-900 rounded-2xl border border-white/5 space-y-1">
                    <p className="text-xs font-semibold text-slate-200">Painel de Votação Rápida (Cliente Final)</p>
                    <p className="text-[11px] text-slate-400">
                      Este é o painel de experiência do usuário. Em uma reunião real, os participantes acessariam esta interface para registrar sua opinião diretamente. Você pode votar nas alternativas abaixo para ver os resultados nos slides mudarem instantaneamente!
                    </p>
                  </div>

                  {selectedPoll && (
                    <div className="p-6 bg-slate-950/50 rounded-3xl border border-white/10 space-y-5">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded">
                        ENQUETE DE ENGAJAMENTO (Voto Simulado)
                      </span>
                      <h3 className="text-base font-bold text-white tracking-tight leading-relaxed">
                        {selectedPoll.question}
                      </h3>

                      <div className="space-y-2.5">
                        {selectedPoll.options.map((opt) => {
                          const totalVotes = getPollTotalVotes(selectedPoll);
                          const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleVote(selectedPoll.id, opt.id)}
                              className="w-full relative p-4 rounded-xl border border-white/5 hover:border-[#6BCFFE]/40 bg-slate-900/80 hover:bg-slate-900 transition-all text-left group overflow-hidden flex justify-between items-center cursor-pointer"
                            >
                              <div
                                className="absolute left-0 top-0 bottom-0 bg-white/[0.03] transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                              <span className="text-xs font-medium text-slate-200 group-hover:text-[#6BCFFE] relative z-10">
                                {opt.text}
                              </span>
                              <span className="text-xs font-bold font-mono text-slate-400 group-hover:text-white relative z-10 shrink-0">
                                {percentage}% ({opt.votes})
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center text-[11px] font-mono text-slate-500">
                        <span>Amostragem: {getPollTotalVotes(selectedPoll)} participantes</span>
                        <button
                          type="button"
                          onClick={() => resetVotes(selectedPoll.id)}
                          className="text-[#D649FB] hover:underline cursor-pointer"
                        >
                          Zerar Votos
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sticky Actions Footer */}
            <div className="p-6 border-t border-white/5 bg-[#070A14] flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">
                Overlay de Enquete Ativo:{' '}
                {activeLivePoll ? (
                  <strong className="text-[#6BCFFE] font-bold uppercase">{activeLivePoll.category}</strong>
                ) : (
                  <span className="text-rose-450 font-bold uppercase">Nenhum</span>
                )}
              </span>

              <div className="flex gap-2">
                {activeLivePoll && (
                  <button
                    type="button"
                    onClick={() => {
                      setActivePollId(null);
                      setIsSimulating(false);
                    }}
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-xl transition-all cursor-pointer text-xs font-semibold"
                    title="Fechar enquete ativa"
                  >
                    Ocultar da Tela
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] hover:opacity-95 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Concluir e Voltar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
