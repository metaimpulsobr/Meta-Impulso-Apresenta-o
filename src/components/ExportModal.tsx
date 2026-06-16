import React, { useState, useEffect } from 'react';
import { 
  X, AlertTriangle, CheckCircle2, Loader2, Key, HelpCircle, 
  ExternalLink, FileSpreadsheet, Check, RefreshCw
} from 'lucide-react';
import { 
  initiateGoogleOAuthPopup, logoutGoogle, getGoogleUser, 
  getCurrentClientId, setClientId, getCachedToken, setCachedToken, GoogleUser 
} from '../lib/googleAuth';
import { exportMetaImpulsoSlides, downloadMetaImpulsoPptx } from '../lib/slidesExporter';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [clientIdInput, setClientIdInput] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  
  // Selection tab
  const [activeTab, setActiveTab] = useState<'pptx' | 'google'>('pptx');
  
  // Exporter states
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportStep, setExportStep] = useState<string>('');
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportedPresentationId, setExportedPresentationId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // PowerPoint native browser generator
  const handleDownloadPptx = async () => {
    setIsExporting(true);
    setExportStep('Inicializando PowerPoint...');
    setExportProgress(10);
    setErrorMsg(null);
    try {
      await downloadMetaImpulsoPptx((step, percentage) => {
        setExportStep(step);
        setExportProgress(percentage);
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao baixar arquivo PowerPoint.');
    } finally {
      setIsExporting(false);
    }
  };

  // Default credentials detection on load
  useEffect(() => {
    // Look to see if there is a saved Client ID in local storage for convenience
    const storedId = localStorage.getItem('meta_impulso_client_id');
    if (storedId) {
      setClientIdInput(storedId);
      setClientId(storedId);
    }
    
    const token = getCachedToken();
    if (token) {
      setIsAuthenticated(true);
      setGoogleUser(getGoogleUser());
    }
  }, []);

  if (!isOpen) return null;

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientIdInput.trim()) return;
    setClientId(clientIdInput.trim());
    localStorage.setItem('meta_impulso_client_id', clientIdInput.trim());
    setErrorMsg(null);
  };

  const handleGoogleLogin = async () => {
    if (!clientIdInput.trim()) {
      setErrorMsg("Você precisa de um Client ID do Google Cloud para poder fazer autenticação direta.");
      return;
    }

    setIsAuthenticating(true);
    setErrorMsg(null);
    try {
      const scopes = [
        'https://www.googleapis.com/auth/presentations',
        'https://www.googleapis.com/auth/drive.file'
      ];
      
      const token = await initiateGoogleOAuthPopup(clientIdInput.trim(), scopes);
      if (token) {
        setIsAuthenticated(true);
        setGoogleUser(getGoogleUser());
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao autenticar com o Google.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    logoutGoogle();
    setIsAuthenticated(false);
    setGoogleUser(null);
    setExportedPresentationId(null);
    setErrorMsg(null);
  };

  const handleRunExport = async () => {
    const token = getCachedToken();
    if (!token) {
      setErrorMsg("Sessão de autenticação expirada ou inválida. Por favor, faça login novamente.");
      setIsAuthenticated(false);
      return;
    }

    setIsExporting(true);
    setExportedPresentationId(null);
    setErrorMsg(null);
    try {
      const presentationId = await exportMetaImpulsoSlides(token, (step, percentage) => {
        setExportStep(step);
        setExportProgress(percentage);
      });
      setExportedPresentationId(presentationId);
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocorreu um erro inesperado ao se comunicar com a API do Google Slides.');
    } finally {
      setIsExporting(false);
    }
  };

  const slidesUrl = exportedPresentationId 
    ? `https://docs.google.com/presentation/d/${exportedPresentationId}/edit` 
    : '';

  const handleCopyLink = () => {
    if (!slidesUrl) return;
    navigator.clipboard.writeText(slidesUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2005);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative flex flex-col text-white">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] text-slate-950 text-xs font-bold font-mono">EXPORT</span>
            <h2 className="text-lg font-bold font-mono tracking-wide">Exportador Google Slides</h2>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Option Selection Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('pptx');
                setErrorMsg(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
                activeTab === 'pptx' 
                  ? 'bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] text-slate-950 font-bold shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Baixar PowerPoint (.PPTX)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('google');
                setErrorMsg(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
                activeTab === 'google' 
                  ? 'bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] text-slate-950 font-bold shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sincronizar Google Slides
            </button>
          </div>

          {activeTab === 'pptx' ? (
            /* PPTX local export */
            <div className="space-y-4">
              <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl flex items-start gap-3 text-xs text-purple-200">
                <HelpCircle className="w-5 h-5 text-[#D649FB] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Download Direto e Offline</p>
                  <p className="text-slate-300 leading-relaxed">
                    Obtenha o arquivo PowerPoint <strong className="text-white">.pptx</strong> completo com todos os 14 slides premium com um único clique. Compatível com Microsoft PowerPoint, Apple Keynote, LibreOffice e upload direto no Google Drive.
                  </p>
                </div>
              </div>

              {!isExporting ? (
                <div className="text-center py-2">
                  <button
                    type="button"
                    onClick={handleDownloadPptx}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] hover:from-[#D649FB]/90 hover:to-[#6BCFFE]/90 text-slate-950 font-black tracking-wide text-xs uppercase shadow-lg hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    📥 Baixar Apresentação PowerPoint (.pptx)
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-3">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-350">{exportStep}</span>
                    <span className="text-[#6BCFFE] font-bold">{exportProgress}%</span>
                  </div>
                  
                  {/* Progress Bar Container */}
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] h-full rounded-full transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Google Slides direct sync */
            <>
              {/* Informational intro banner with OAuth warnings */}
              <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl flex items-start gap-3 text-xs text-purple-200">
                <HelpCircle className="w-5 h-5 text-[#D649FB] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Integração Direta e Segura</p>
                  <p className="text-slate-300 leading-relaxed">
                    Este exportador conecta-se diretamente à API do Google Slides usando seu próprio login. Os slides são criados automaticamente na sua conta do Google Drive.
                  </p>
                </div>
              </div>

              {/* Step 1: Configuration client-id */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Passo 1: Credenciais do Google Cloud Project</span>
                
                <form onSubmit={handleSaveClientId} className="flex gap-2 items-center">
                  <div className="grow relative">
                    <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input 
                      type="text"
                      placeholder="Informe seu Google Cloud Client ID..."
                      value={clientIdInput}
                      onChange={(e) => setClientIdInput(e.target.value)}
                      disabled={isAuthenticated || isExporting}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#6BCFFE] transition-colors font-mono"
                    />
                  </div>
                  {!isAuthenticated && (
                    <button
                      type="submit"
                      disabled={!clientIdInput.trim() || isExporting}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg shrink-0 transition-colors cursor-pointer disabled:opacity-40"
                    >
                      Salvar
                    </button>
                  )}
                </form>

                <div className="flex justify-between text-[11px] px-1 text-slate-400">
                  <button 
                    type="button" 
                    onClick={() => setShowHelp(!showHelp)}
                    className="text-[#6BCFFE] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Como configurar meu Client ID?
                  </button>
                  {clientIdInput && <span className="text-emerald-400">✓ Salvo na memória</span>}
                </div>

                {showHelp && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-3 text-xs leading-relaxed text-slate-300">
                    <p className="font-bold text-[#6BCFFE]">Como obter um Client ID no Google Cloud Console:</p>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>Acesse o <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-purple-400 underline inline-flex items-center gap-0.5">Console do Google Cloud <ExternalLink className="w-3 h-3" /></a></li>
                      <li>Crie ou selecione um projeto e habilite as APIs: <span className="font-mono text-[10px] bg-white/5 px-1 py-0.5 rounded text-white">Google Slides API</span> e <span className="font-mono text-[10px] bg-white/5 px-1 py-0.5 rounded text-white">Google Drive API</span>.</li>
                      <li>Acesse <strong>APIs e Serviços &gt; Tela de consentimento OAuth</strong>, configure um tipo "Externo" e preencha as informações básicas. Adicione seu e-mail de teste nos "Usuários de teste" (MUITO IMPORTANTE!).</li>
                      <li>Vá em <strong>APIs e Serviços &gt; Credenciais</strong>, clique em <strong>Criar Credenciais &gt; ID do cliente OAuth</strong>.</li>
                      <li>Selecione o tipo de aplicativo "Aplicativo da Web". Em "Origens JavaScript autorizadas", adicione o domínio atual: <span className="font-mono text-[10px] bg-white/5 px-1 py-0.5 select-all rounded text-orange-300">{window.location.origin}</span></li>
                      <li>Cole o Client ID gerado no campo acima.</li>
                    </ol>
                  </div>
                )}
              </div>

              <div className="h-px bg-white/10" />

              {/* Step 2: Auth block */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Passo 2: Iniciar Sessão Segura</span>
                
                {isAuthenticated ? (
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-100">Sessão Ativa</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{googleUser?.name || 'Google User'} ({googleUser?.email})</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isExporting}
                      className="px-2.5 py-1 text-[10px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded transition-colors cursor-pointer"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center flex-col items-center py-3 bg-slate-950 rounded-xl border border-white/5 gap-3">
                    <p className="text-xs text-slate-400 max-w-xs text-center">Inicie o login seguro temporário na Google via popup.</p>
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={isAuthenticating || !clientIdInput.trim()}
                      className="px-5 py-2.5 rounded-lg bg-white text-slate-950 font-bold text-xs shadow-md shadow-white/5 hover:bg-slate-200 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-40"
                    >
                      {isAuthenticating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                          Autenticando...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                          </svg>
                          Fazer Login com a Google
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Step 3: Run Export and console log */}
              {isAuthenticated && (
                <div className="space-y-4 pt-2">
                  <div className="h-px bg-white/10" />
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Passo 3: Compile e Grave os Slides</span>
                  
                  {!isExporting && !exportedPresentationId ? (
                    <div className="text-center py-1">
                      <button
                        type="button"
                        onClick={handleRunExport}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] hover:from-[#D649FB]/90 hover:to-[#6BCFFE]/90 text-slate-950 font-black tracking-wide text-xs uppercase shadow-lg hover:scale-[1.01] transition-all cursor-pointer"
                      >
                        🚀 Compilar e Exportar Slide Deck Completo (14 Slides)
                      </button>
                    </div>
                  ) : isExporting ? (
                    <div className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-3">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-350">{exportStep}</span>
                        <span className="text-[#6BCFFE] font-bold">{exportProgress}%</span>
                      </div>
                      
                      {/* Progress Bar Container */}
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="bg-gradient-to-r from-[#D649FB] to-[#6BCFFE] h-full rounded-full transition-all duration-300"
                          style={{ width: `${exportProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : null}

                  {/* Success Presentation Block */}
                  {exportedPresentationId && (
                    <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500 border-dashed space-y-4 shadow-xl">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Apresentação Gerada com Sucesso!</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Você pode acessar, gerenciar e apresentar os slides diretamente no Google Slides. O arquivo foi adicionado à raiz do seu Google Drive corporativo.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <a 
                          href={slidesUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="grow py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wide rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          Abrir no Google Slides <ExternalLink className="w-4 h-4" />
                        </a>
                        
                        <button 
                          type="button"
                          onClick={handleCopyLink}
                          className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wide rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <RefreshCw className="w-4 h-4" />}
                          {copiedLink ? "Link Copiado!" : "Copiar Link"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Technical error warnings */}
          {errorMsg && (
            <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-xl flex items-start gap-3 text-xs text-rose-400">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold font-mono">Erro de Processo detectado</p>
                <p className="text-slate-400 mt-1 leading-relaxed">{errorMsg}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1.5 uppercase">Código de status: LOCAL_OAUTH_EXPIRED</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-white/5 text-right flex justify-between items-center text-[10px] text-slate-500">
          <span>Servidores Integrados: metaimpulso.com.br</span>
          <span>Security Level: SSL/TLS Direct Channel</span>
        </div>

      </div>
    </div>
  );
};
