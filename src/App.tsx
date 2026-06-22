import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sliders, Sparkles, Cpu, Layers, Search, Shield, 
  DollarSign, RefreshCw, AlertTriangle, Menu, Trash2, 
  Star, Terminal, Code, HelpCircle, ArrowRight, Layers2, Lock,
  MessageSquare, X, CheckCircle2
} from "lucide-react";
import { 
  SearchMode, EnterpriseState, Message, AuditLog, 
  SWARM_AGENTS, ENTERPRISE_TEMPLATES 
} from "./types";
import { submitFeedback } from "./lib/firebase";
import OnboardingTour from "./components/OnboardingTour";
import SliderMenu from "./components/SliderMenu";
import ResultsDisplay from "./components/ResultsDisplay";

export default function App() {
  // State variables
  const [sliderOpen, setSliderOpen] = useState(false);
  const [showGlobalFeedback, setShowGlobalFeedback] = useState(false);
  const [globalFeedbackRating, setGlobalFeedbackRating] = useState(0);
  const [globalFeedbackText, setGlobalFeedbackText] = useState("");
  const [globalFeedbackSubmitted, setGlobalFeedbackSubmitted] = useState(false);
  const [showTour, setShowTour] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Initializing safe neural gateway...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [enterpriseState, setEnterpriseState] = useState<EnterpriseState>({
    mode: "search",
    searchFilters: {
      dateRange: "any",
      domains: "",
      documentType: "any"
    },
    agentSubMode: "Cloud Architect",
    promptSubMode: "Executive Briefing",
    ragFiles: [],
    customAgents: [],
    temperature: 0.7,
    dataSafetyLevel: "high",
    affiliateCommissionTracker: true,
    teamCollaboration: false,
    maxResponseLength: 2048
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Sound/TTS speaking mock helper (for adding supreme enterprise feel)
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Load favorites and custom records from local storage on mount
  useEffect(() => {
    try {
      const storedFavs = localStorage.getItem("cyber_prompt_favorites");
      if (storedFavs) setFavorites(JSON.parse(storedFavs));

      const storedRAG = localStorage.getItem("cyber_prompt_rag");
      if (storedRAG) {
        setEnterpriseState(prev => ({
          ...prev,
          ragFiles: JSON.parse(storedRAG)
        }));
      }

      const storedAgents = localStorage.getItem("cyber_prompt_agents");
      if (storedAgents) {
        try {
          const parsedAgents = JSON.parse(storedAgents);
          setEnterpriseState(prev => ({
            ...prev,
            customAgents: parsedAgents
          }));
        } catch (e) {
          console.error("Custom agent restoration error:", e);
          localStorage.removeItem("cyber_prompt_agents");
        }
      }

      // Prepopulate standard logs
      addAuditLog("network", "Neural node connection successfully established.", "success");
      addAuditLog("auth", "Zero-Knowledge transmission certificate verification complete.", "success");
    } catch (e) {
      console.error("Local storage restoration error:", e);
    }
  }, []);

  // Persist custom agents
  useEffect(() => {
    localStorage.setItem("cyber_prompt_agents", JSON.stringify(enterpriseState.customAgents));
  }, [enterpriseState.customAgents]);

  // Helper to inject structured systems event logs
  const addAuditLog = (
    category: AuditLog["category"], 
    message: string, 
    status: AuditLog["status"] = "info"
  ) => {
    const newLog: AuditLog = {
      id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      category,
      message,
      status,
      nodeId: `NODE-0${Math.floor(Math.random() * 4) + 1}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleClearLogs = () => {
    setAuditLogs([]);
    addAuditLog("compliance", "Local logging buffers purged by administrator.", "warning");
  };

  // Document Registry callbacks (RAG)
  const handleRegisterDoc = (name: string, content: string) => {
    const newFile = {
      id: `RAG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      name,
      size: content.length,
      content
    };
    setEnterpriseState(prev => {
      const updated = [...prev.ragFiles, newFile];
      localStorage.setItem("cyber_prompt_rag", JSON.stringify(updated));
      return { ...prev, ragFiles: updated };
    });
    addAuditLog("rag", `Ingested resource document: '${name}' into local memory context.`, "success");
  };

  const handleRemoveDoc = (id: string) => {
    setEnterpriseState(prev => {
      const filtered = prev.ragFiles.filter(f => f.id !== id);
      localStorage.setItem("cyber_prompt_rag", JSON.stringify(filtered));
      return { ...prev, ragFiles: filtered };
    });
    addAuditLog("rag", `Deregistered context file ID: [${id}] from prompt grounding.`, "info");
  };

  // Launch prompt preset workflow helper
  const handleSelectTemplate = (promptPrefix: string) => {
    setPrompt(promptPrefix + " ");
    addAuditLog("compliance", "Loaded structured enterprise template into input workspace.", "info");
  };

  const handleToggleFavorite = (msg: Message) => {
    const isFav = favorites.includes(msg.id);
    let updated: string[];
    if (isFav) {
      updated = favorites.filter(id => id !== msg.id);
      addAuditLog("compliance", `Deregistered message TX: [${msg.metadata?.transactionId}] from saved vaults.`, "info");
    } else {
      updated = [...favorites, msg.id];
      addAuditLog("compliance", `Saved response copy [TX: ${msg.metadata?.transactionId}] to secure vault storage.`, "success");
    }
    setFavorites(updated);
    localStorage.setItem("cyber_prompt_favorites", JSON.stringify(updated));
  };

  // Holographic reassurance loops for loading states (simulates enterprise pipelines)
  useEffect(() => {
    if (!loading) return;
    const messagesPool = [
      "SYNCHRONIZING SECURE NEURAL HANDSHAKE...",
      "EXAMINING SECURE DOMAIN ENFORCE GAUGES...",
      "GROUNDING ACTIVE QUERIES WITH WEB SEARCH INDEXES...",
      "ANALYZING RAG RESOURCE VECTORS CONCURRENTLY...",
      "PACKING SECURE PACKETS FOR RECIPIENT..."
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % messagesPool.length;
      setLoadingMsg(messagesPool[idx]);
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  // Submit Prompt Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = prompt.trim();
    if (!trimmedInput || loading) return;

    setErrorMessage(null);
    setLoading(true);
    setLoadingMsg("Establishing handshake loop to server broker...");

    // Log the user's interaction
    addAuditLog("agent", `Dispatched prompt context to system [Mode: ${enterpriseState.mode.toUpperCase()}]`, "info");

    const userMsg: Message = {
      id: `MSG-U-${Date.now()}`,
      role: "user",
      text: trimmedInput,
      timestamp: new Date().toISOString(),
      mode: enterpriseState.mode
    };

    setMessages(prev => [userMsg, ...prev]);
    const currentPromptText = trimmedInput;
    setPrompt(""); // Clear input

    try {
      const selectedAgent = enterpriseState.customAgents.find(ag => ag.id === enterpriseState.agentSubMode);
      
      // API call to custom backend proxy
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: currentPromptText,
          mode: enterpriseState.mode,
          subMode: 
            enterpriseState.mode === "agents" 
              ? enterpriseState.agentSubMode 
              : enterpriseState.mode === "prompts" 
                ? enterpriseState.promptSubMode 
                : undefined,
          customAgent: selectedAgent,
          contextFiles: enterpriseState.ragFiles,
          searchFilters: enterpriseState.mode === "search" ? enterpriseState.searchFilters : undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP compliance warning: ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg: Message = {
        id: `MSG-A-${Date.now()}`,
        role: "assistant",
        text: data.text,
        timestamp: new Date().toISOString(),
        mode: enterpriseState.mode,
        metadata: data.metadata
      };

      setMessages(prev => [assistantMsg, ...prev]);
      addAuditLog("compliance", `Handshake success: parse checked transaction [${data.metadata?.transactionId}]`, "success");

    } catch (err: any) {
      console.error("Submission error:", err);
      const errMsg = err.message || "An unexpected network disruption occurred during handshake.";
      setErrorMessage(errMsg);
      addAuditLog("network", `Neural pipeline error: ${errMsg}`, "error");

      // Insert generic compliant response template to prevent empty visual block in development state
      const fallbackMsg: Message = {
        id: `MSG-A-${Date.now()}`,
        role: "assistant",
        text: `### ⚠️ PIPELINE RECOVERY NOTICE\n\nThe AI Studio Orchestration layer caught a transmission warning.\n\n**Reason:** ${errMsg}\n\n*If you are running this applet for the first time, please ensure your \`GEMINI_API_KEY\` is updated correctly in the Secrets panel in AI Studio UI.*`,
        timestamp: new Date().toISOString(),
        mode: enterpriseState.mode
      };
      setMessages(prev => [fallbackMsg, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  // Helper colors classes for background glows based on modes
  const getGlowColors = (mode: SearchMode) => {
    switch (mode) {
      case "search": return "from-blue-600/30 via-indigo-600/10 to-teal-600/5";
      case "research": return "from-purple-600/30 via-pink-600/10 to-indigo-600/5";
      case "shopping": return "from-orange-600/30 via-amber-600/10 to-yellow-600/5";
      case "agents": return "from-emerald-600/30 via-green-600/10 to-teal-600/5";
      case "prompts": return "from-rose-600/30 via-red-600/10 to-orange-600/5";
      default: return "from-purple-600/20 via-zinc-900/10 to-zinc-950";
    }
  };

  return (
    <div className="min-h-screen relative bg-[#030303] flex flex-col justify-between overflow-hidden cyber-bg-grid font-sans text-slate-100 selection:bg-purple-500/30 selection:text-white">
      
      {/* Dynamic Animated Glowing Blob Backdrops reflecting current Mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr ${getGlowColors(enterpriseState.mode)} filter blur-[120px] opacity-70 scale-150 animate-pulse transition-all duration-1000`} />
        <div className={`absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-tr ${getGlowColors(enterpriseState.mode)} filter blur-[120px] opacity-70 scale-125 animate-pulse transition-all duration-1000 delay-500`} />
      </div>

      {/* Futuristic Scanline Effect & Signal Flicker */}
      <div className="absolute inset-0 pointer-events-none scanline-overlay z-1 w-full h-full opacity-60 pointer-events-none"></div>

      {/* Main Container Layout */}
      <header className="w-full max-w-7xl mx-auto px-4 py-4 md:py-6 flex items-center justify-between border-b border-zinc-900/50 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="p-2.5 bg-black border border-zinc-800 rounded-lg group hover:border-purple-500 transition-all duration-300">
              <Cpu className="w-5 h-5 text-purple-400 group-hover:rotate-12 transition-transform" />
            </div>
            {/* Pulsing indicator node */}
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <span className="text-[9px] font-mono tracking-widest text-indigo-400 font-bold block uppercase">enterprise AI matrix</span>
            <h1 className="font-display font-bold text-base md:text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
              ORCHESTRATOR PROMPT GATEWAY
            </h1>
          </div>
        </div>

        {/* Dashboard Status Pill Grid */}
        <div className="hidden lg:flex items-center space-x-4 text-[10px] font-mono text-zinc-400 bg-zinc-950/80 border border-zinc-850 px-3 py-1.5 rounded-full">
          <span className="flex items-center gap-1.5 bg-zinc-900 px-2.5 py-0.5 rounded-full border border-zinc-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            PORT: <span className="text-zinc-200">3000</span>
          </span>
          <span className="flex items-center gap-1.5">
            ENCRYPTION: <span className="text-emerald-400 font-bold">TLS 1.3 | AES</span>
          </span>
          <span className="text-zinc-700 font-bold">•</span>
          <span className="flex items-center gap-1.5">
            COGNITIVE LOAD: <span className="text-purple-400 font-bold">OPTIMAL</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGlobalFeedback(true)}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs font-mono text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">REPORT BUG / FEEDBACK</span>
          </button>
          
          <button
            id="toggle-cabinet-btn"
            onClick={() => setSliderOpen(true)}
            className="relative px-4 py-2 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-black hover:from-purple-900/60 hover:via-indigo-900/60 border border-purple-500/30 hover:border-purple-400/80 rounded-lg text-xs font-mono font-medium tracking-wide flex items-center gap-2 hover:shadow-[0_0_15px_rgba(168,85,247,0.25)] transition-all duration-300 group cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
            <span>ENTERPRISE HUB</span>
            <div className="absolute -bottom-1 left-4 right-4 h-[2px] bg-gradient-to-r from-purple-500 via-indigo-400 to-emerald-400 opacity-80" />
          </button>
        </div>
      </header>

      {/* Main Work Surface */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 md:py-12 flex flex-col justify-start items-center space-y-8 relative z-10">
        
        {/* Top welcome disclaimer cards */}
        <div className="text-center space-y-2 max-w-xl animate-fade-in">
          <h2 className="font-display font-medium text-xl md:text-2xl text-slate-100 tracking-tight leading-snug">
            Sovereign Command & Grounding Portal
          </h2>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-md mx-auto">
            Input prompt guidelines beneath the animated spectrum. Pull open the sidebar cabinet on the top right to hot-swap compliance templates or grounding indexes.
          </p>
        </div>

        {/* Center Canvas Workspace wrapper holding the PROMPT BOX */}
        <div className="w-full relative max-w-2xl">
          
          {/* Subtle multi-colored floating glow backdrop specifically matching prompt */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-400 opacity-20 blur-xl animate-pulse -z-10 pointer-events-none"></div>

          {/* Actual animated MULTI-COLOR GRADIENT FRAME bounding box */}
          <div className="p-[1px] rounded-2xl flow-glow-border shadow-2xl relative group">
            
            {/* Internal prompt center body */}
            <div className="bg-[#09090e]/95 backdrop-blur-2xl rounded-[15px] p-4 space-y-4">
              
              {/* Header inside Prompt box: displays current functional target */}
              <div className="flex items-center justify-between text-[10px] font-mono border-b border-zinc-900 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500"></span>
                  </span>
                  <span className="text-zinc-400">TARGET APEX:</span>
                  <span className="text-slate-200 font-bold uppercase tracking-wider">
                    {enterpriseState.mode === "agents" ? `Swarm Node [${enterpriseState.agentSubMode}]` : `Orchestrator Mode [${enterpriseState.mode}]`}
                  </span>
                </div>
                <div className="text-zinc-500 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>SECURE SANDBOX</span>
                </div>
              </div>

              {/* Form Input Submit Workspace */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <textarea
                    id="primary-prompt-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe enterprise objectives, audit models, or query deep comparative maps..."
                    rows={4}
                    className="w-full bg-transparent border-0 outline-none text-sm text-slate-100 placeholder-zinc-600 focus:ring-0 resize-none font-sans leading-relaxed"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  
                  {/* Holographic Neural Grid overlay in textbox on load */}
                  {loading && (
                    <div className="absolute inset-x-0 bottom-0 top-0 bg-black/60 backdrop-blur-[1px] flex flex-col justify-center items-center space-y-3 rounded">
                      <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
                      <div className="text-center space-y-1">
                        <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold">
                          {loadingMsg}
                        </span>
                        <span className="text-[8px] font-mono text-zinc-600 uppercase block tracking-wider">
                          Zero-retention airgap channel active
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Internal Action row with quick triggers */}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-900/60 text-xs">
                  
                  {/* Mode Badge indicator trigger to open slider instantly */}
                  <button
                    type="button"
                    id="mode-badge-indicator"
                    onClick={() => setSliderOpen(true)}
                    className="px-2.5 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 rounded-lg text-[10px] font-mono font-medium text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Search className="w-3 h-3 text-purple-400" />
                    <span>MODE: <strong className="text-purple-400 font-bold uppercase">{enterpriseState.mode}</strong></span>
                    <ArrowRight className="w-3 h-3 text-zinc-500 animate-pulse" />
                  </button>

                  <div className="flex items-center space-x-2">
                    {prompt.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setPrompt("")}
                        className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                        title="Clear Workspace"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Submit layout button */}
                    <button
                      type="submit"
                      id="submit-prompt-btn"
                      disabled={!prompt.trim() || loading}
                      className={`px-4 py-1.5 rounded-lg flex items-center space-x-1.5 font-mono text-xs font-bold transition-all border cursor-pointer ${
                        prompt.trim() && !loading
                          ? "bg-purple-600 hover:bg-purple-500 border-purple-500/60 hover:shadow-[0_0_12px_rgba(168,85,247,0.4)] text-white"
                          : "bg-zinc-950 border-zinc-850 text-zinc-600 pointer-events-none"
                      }`}
                    >
                      <span>TRANSMIT</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                </div>
              </form>

            </div>
          </div>

          {/* Quick Preset Presets chips right below prompt box */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-[10px] font-mono text-zinc-500">
            <span>PRESETS:</span>
            {ENTERPRISE_TEMPLATES.map(preset => (
              <button
                key={preset.id}
                id={`preset-btn-${preset.id.replace(/\s+/g, '-')}`}
                onClick={() => {
                  setEnterpriseState(prev => ({ ...prev, mode: "prompts", promptSubMode: preset.id }));
                  handleSelectTemplate(preset.promptPrefix);
                }}
                className="px-2 py-1 bg-zinc-950/80 border border-zinc-900 rounded-full hover:border-zinc-700 hover:text-slate-200 transition-all cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

        </div>

        {/* Dynamic Interactive Results Feed list */}
        <div id="results-feed" className="w-[100%] space-y-6">
          <AnimatePresence>
            {messages.length > 0 ? (
              messages.map((msg, index) => {
                // We render Assistant response beautifully with rich markup custom parsers
                if (msg.role === "assistant") {
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35, delay: 0.1 }}
                    >
                      <ResultsDisplay 
                        message={msg}
                        onSaveFavorite={handleToggleFavorite}
                        isFavorite={favorites.includes(msg.id)}
                      />
                    </motion.div>
                  );
                }

                // Render User Prompt request box for clean chronologic logs
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-end"
                  >
                    <div className="max-w-xl bg-zinc-900/65 border border-zinc-950 px-4 py-3 rounded-xl flex items-start space-x-3 text-right">
                      <div className="flex-1 space-y-0.5">
                        <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                          prompt query • {msg.mode.toUpperCase()}
                        </div>
                        <p className="text-xs text-slate-300 font-sans tracking-wide leading-relaxed">
                          {msg.text}
                        </p>
                      </div>
                      <div className="p-1.5 bg-purple-500/10 rounded border border-purple-500/20 text-purple-400">
                        <Terminal className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              // Empty list guide template
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-10 bg-zinc-950/30 border border-zinc-900/60 rounded-xl text-center space-y-3 relative overflow-hidden"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/5 filter blur-[40px] pointer-events-none rounded-full" />
                <Sparkles className="w-8 h-8 text-indigo-400/80 mx-auto animate-pulse" />
                <div className="space-y-1 text-center">
                  <h4 className="font-display font-medium text-xs text-slate-300">Ready to Orchestrate Network Models</h4>
                  <p className="text-[10px] text-zinc-500 max-w-sm mx-auto leading-relaxed">
                    Select a mode, paste your goal requirements, or explore autonomous Specialists and custom RAG frameworks by toggling the cabinet controls above.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* Slide drawer sidebar menu */}
      <SliderMenu
        isOpen={sliderOpen}
        onClose={() => setSliderOpen(false)}
        state={enterpriseState}
        onChangeState={setEnterpriseState}
        auditLogs={auditLogs}
        onClearLogs={handleClearLogs}
        onRegisterDocument={handleRegisterDoc}
        onRemoveDocument={handleRemoveDoc}
        onSelectTemplate={handleSelectTemplate}
        onTriggerTour={() => setShowTour(true)}
      />

      <OnboardingTour isOpen={showTour} onClose={() => setShowTour(false)} />

      {/* Global Bug Report/Feedback Modal */}
      <AnimatePresence>
        {showGlobalFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden"
            >
              <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <h3 className="font-display font-medium text-sm text-slate-100">Report Bug / Feedback</h3>
                </div>
                <button 
                  onClick={() => {
                    setShowGlobalFeedback(false);
                    setGlobalFeedbackSubmitted(false);
                    setGlobalFeedbackText("");
                    setGlobalFeedbackRating(0);
                  }} 
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6">
                {globalFeedbackSubmitted ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-emerald-400">Transmission Complete</p>
                    <p className="text-xs text-zinc-400">Your feedback has been securely logged for review.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono block">Severity / Rating</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => setGlobalFeedbackRating(star)}
                            className="p-1 cursor-pointer transition-transform hover:scale-110"
                          >
                            <Star className={`w-6 h-6 ${globalFeedbackRating >= star ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono block">Details</label>
                      <textarea
                        value={globalFeedbackText}
                        onChange={e => setGlobalFeedbackText(e.target.value)}
                        placeholder="Describe the issue, feature request, or feedback..."
                        className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm text-white placeholder-zinc-600 resize-none h-32 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                      />
                    </div>
                    
                    <button
                      disabled={globalFeedbackRating === 0 && globalFeedbackText.trim() === ""}
                      onClick={async () => {
                        const success = await submitFeedback("GLOBAL_UI_REPORT", globalFeedbackRating, globalFeedbackText);
                        if (success) setGlobalFeedbackSubmitted(true);
                      }}
                      className={`w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        (globalFeedbackRating > 0 || globalFeedbackText.trim()) 
                          ? "bg-purple-600 hover:bg-purple-500 text-white cursor-pointer" 
                          : "bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed"
                      }`}
                    >
                      <Terminal className="w-4 h-4" />
                      Submit Report
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immersive compliance status ticker footer */}
      <footer className="w-full bg-black border-t border-zinc-900/80 p-4 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[10px] font-mono text-zinc-500 gap-3">
          <div className="flex flex-wrap justify-center items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              COGNITIVE CORES LOCAL: ONLINE
            </span>
            <span className="text-zinc-800">|</span>
            <span>DATA TRANSIT: <strong className="text-zinc-400 font-normal">SECURED (AES-256-GCM)</strong></span>
            <span className="text-zinc-800">|</span>
            <span>REGION PIN: <strong className="text-zinc-400 font-normal">US-EAST5 (CLOUD RUN)</strong></span>
          </div>

          <div className="text-zinc-600">
            <span>© 2026 Enterprise Cyber Prompt Hub • Verified Compliance Governance Framework</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
