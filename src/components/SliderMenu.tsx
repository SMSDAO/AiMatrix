import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Search, Shield, Layers, Activity, FileText, Trash2, Cpu, 
  Sparkles, TrendingUp, DollarSign, Database, Plus, Sliders, 
  Server, Compass, Megaphone, Check, Lock, AlertCircle
} from "lucide-react";
import { 
  SearchMode, EnterpriseState, SWARM_AGENTS, ENTERPRISE_TEMPLATES, FileRef, AuditLog 
} from "../types";

interface SliderMenuProps {
  isOpen: boolean;
  onClose: () => void;
  state: EnterpriseState;
  onChangeState: (updater: (prev: EnterpriseState) => EnterpriseState) => void;
  auditLogs: AuditLog[];
  onClearLogs: () => void;
  onRegisterDocument: (name: string, content: string) => void;
  onRemoveDocument: (id: string) => void;
  onSelectTemplate: (promptText: string) => void;
  onTriggerTour: () => void;
}

export default function SliderMenu({
  isOpen,
  onClose,
  state,
  onChangeState,
  auditLogs,
  onClearLogs,
  onRegisterDocument,
  onRemoveDocument,
  onSelectTemplate,
  onTriggerTour
}: SliderMenuProps) {
  const [activeTab, setActiveTab] = useState<"functions" | "rag" | "compliance" | "analytics">("functions");
  const [newDocName, setNewDocName] = useState("");
  const [newDocContent, setNewDocContent] = useState("");
  const [isAddingDoc, setIsAddingDoc] = useState(false);

  // File Ref upload helper
  const handleAddDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !newDocContent.trim()) return;
    onRegisterDocument(newDocName.trim(), newDocContent.trim());
    setNewDocName("");
    setNewDocContent("");
    setIsAddingDoc(false);
  };

  const selectMode = (mode: SearchMode) => {
    onChangeState(prev => ({ ...prev, mode }));
  };

  const getSubModeSummary = () => {
    if (state.mode === "agents") return `Active Swarm: ${state.agentSubMode}`;
    if (state.mode === "prompts") return `Active Template: ${state.promptSubMode}`;
    return "All systems operational";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            id="slider-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 cursor-pointer"
          />

          {/* Sliding Side Cabinet */}
          <motion.div
            id="slider-cabinet"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed top-0 right-0 h-screen w-full max-w-lg bg-[#0a0a0f] border-l border-zinc-800 shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header section with Cyber Design */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80 scanline-overlay relative">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-lg">
                  <Sliders className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-display font-medium text-lg text-slate-100 tracking-tight flex items-center">
                    ENTERPRISE CONTROL CABINET
                  </h2>
                  <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
                    Governance Status: <span className="text-emerald-400">ACTIVE & VERIFIED</span>
                  </p>
                </div>
              </div>
              <button
                id="close-slider-btn"
                onClick={onClose}
                className="p-2 hover:bg-zinc-800 rounded-full text-slate-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sticky Tab Navigation inside panel */}
            <div className="flex border-b border-zinc-800 bg-zinc-950 text-xs font-mono">
              {[
                { id: "functions", label: "SWARM MODES", icon: Cpu },
                { id: "rag", label: "KNOWLEDGE (RAG)", icon: Database },
                { id: "compliance", label: "GOVERNANCE", icon: Shield },
                { id: "analytics", label: "DIAGNOSTICS", icon: Activity }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-3 flex flex-col items-center gap-1 border-b-2 transition-all cursor-pointer ${
                      isActive 
                        ? "border-purple-500 text-purple-400 bg-purple-500/5 font-bold" 
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-zinc-900/40"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable Contents based on active tab */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* TAB 1: SWARM MODES & GENERAL FUNCTIONS */}
              {activeTab === "functions" && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Primary Grid Mode selector */}
                  <div>
                    <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">Orchestrator Search Mode</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "search", title: "Web Grounding", desc: "Real-time verification", glow: "hover:border-blue-500/50", icon: Search, color: "text-blue-400" },
                        { id: "research", title: "R&D Deep Analyst", desc: "Multi-perspective synthesis", glow: "hover:border-purple-500/50", icon: Layers, color: "text-purple-400" },
                        { id: "shopping", title: "Commerce Intel", desc: "Affiliate & pricing", glow: "hover:border-orange-500/50", icon: DollarSign, color: "text-orange-400" },
                        { id: "agents", title: "Autonomous Swarm", desc: "Domain experts", glow: "hover:border-green-500/50", icon: Cpu, color: "text-green-400" },
                        { id: "prompts", title: "Corporate Templates", desc: "Checklist runtimes", glow: "hover:border-red-500/50", icon: FileText, color: "text-red-400" },
                      ].map(m => {
                        const Icon = m.icon;
                        const isSel = state.mode === m.id;
                        return (
                          <button
                            key={m.id}
                            id={`mode-${m.id}`}
                            onClick={() => selectMode(m.id as SearchMode)}
                            className={`p-3 rounded-lg border text-left transition-all duration-200 group relative ${
                              isSel 
                                ? "border-purple-500/80 bg-purple-950/20 shadow-[0_0_12px_rgba(168,85,247,0.15)]" 
                                : `border-zinc-800 bg-zinc-900/40 ${m.glow}`
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <Icon className={`w-4 h-4 ${isSel ? "text-purple-400" : m.color}`} />
                              <span className="text-xs font-medium text-slate-200">{m.title}</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 block leading-tight">{m.desc}</span>
                            {isSel && (
                              <span className="absolute top-1 right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mode-Specific Settings Layer */}
                  {state.mode === "search" && (
                    <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-4">
                      <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Advanced Search Filters</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] text-zinc-500 font-mono mb-1 block">Date Range</label>
                          <select 
                            className="w-full bg-black border border-zinc-800 rounded p-2 text-xs text-white"
                            value={state.searchFilters.dateRange}
                            onChange={(e) => onChangeState(prev => ({ 
                              ...prev, 
                              searchFilters: { ...prev.searchFilters, dateRange: e.target.value as any } 
                            }))}
                          >
                            <option value="any">Any Time</option>
                            <option value="past_24h">Past 24 Hours</option>
                            <option value="past_week">Past Week</option>
                            <option value="past_month">Past Month</option>
                            <option value="past_year">Past Year</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-[10px] text-zinc-500 font-mono mb-1 block">Specific Domains/Sources (e.g. site:github.com)</label>
                          <input 
                            type="text"
                            placeholder="Optional: Enter domains..."
                            className="w-full bg-black border border-zinc-800 rounded p-2 text-xs text-white placeholder-zinc-700"
                            value={state.searchFilters.domains}
                            onChange={(e) => onChangeState(prev => ({ 
                              ...prev, 
                              searchFilters: { ...prev.searchFilters, domains: e.target.value } 
                            }))}
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-zinc-500 font-mono mb-1 block">Document Type</label>
                          <select 
                            className="w-full bg-black border border-zinc-800 rounded p-2 text-xs text-white"
                            value={state.searchFilters.documentType}
                            onChange={(e) => onChangeState(prev => ({ 
                              ...prev, 
                              searchFilters: { ...prev.searchFilters, documentType: e.target.value as any } 
                            }))}
                          >
                            <option value="any">Any Type</option>
                            <option value="pdf">PDF (.pdf)</option>
                            <option value="docx">Word (.docx)</option>
                            <option value="html">Web Page (.html)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {state.mode === "agents" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Configure Specialized Swarm</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">{4 + state.customAgents.length} Live Agents</span>
                        </div>
                        <div className="space-y-2">
                          {[...SWARM_AGENTS, ...state.customAgents.map(ag => ({ id: ag.id, name: ag.name, subtitle: "Custom Agent", description: ag.purpose }))].map(agent => {
                            const isActive = state.agentSubMode === agent.id;
                            return (
                              <button
                                key={agent.id}
                                id={`agent-submode-${agent.id.replace(/\s+/g, '-')}`}
                                onClick={() => onChangeState(prev => ({ ...prev, agentSubMode: agent.id }))}
                                className={`w-full p-2.5 rounded text-left border transition-all text-xs flex items-center justify-between ${
                                  isActive 
                                    ? "border-emerald-500 bg-emerald-950/10 text-emerald-400" 
                                    : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 text-zinc-300"
                                }`}
                              >
                                <div>
                                  <span className="font-medium block">{agent.name}</span>
                                  <span className="text-[10px] text-zinc-500">{agent.subtitle}</span>
                                </div>
                                {isActive ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <span className="w-2 h-2 rounded-full bg-zinc-700" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom Agent Addition Form */}
                      <div className="p-4 bg-purple-950/10 border border-purple-500/30 rounded-lg space-y-3">
                        <h4 className="text-xs font-mono text-purple-300 font-bold uppercase tracking-wider">Create Custom Agent</h4>
                        <input type="text" placeholder="Agent Name" className="w-full p-2 bg-black border border-zinc-800 rounded text-xs text-white" id="new-agent-name" />
                        <input type="text" placeholder="Purpose" className="w-full p-2 bg-black border border-zinc-800 rounded text-xs text-white" id="new-agent-purpose" />
                        <input type="text" placeholder="Knowledge Base (e.g. Doc URL/Topics)" className="w-full p-2 bg-black border border-zinc-800 rounded text-xs text-white" id="new-agent-kb" />
                        <input type="text" placeholder="Interaction Style (e.g. Formal, Concise)" className="w-full p-2 bg-black border border-zinc-800 rounded text-xs text-white" id="new-agent-style" />
                        <button 
                          className="w-full py-2 bg-purple-600 rounded text-white text-xs font-bold"
                          onClick={() => {
                            const name = (document.getElementById("new-agent-name") as HTMLInputElement).value;
                            const purpose = (document.getElementById("new-agent-purpose") as HTMLInputElement).value;
                            const knowledgeBase = (document.getElementById("new-agent-kb") as HTMLInputElement).value;
                            const interactionStyle = (document.getElementById("new-agent-style") as HTMLInputElement).value;
                            
                            if (name && purpose) {
                              onChangeState(prev => ({
                                ...prev,
                                customAgents: [...prev.customAgents, { id: `CUST-${Date.now()}`, name, purpose, knowledgeBase, interactionStyle }]
                              }));
                              (document.getElementById("new-agent-name") as HTMLInputElement).value = "";
                              (document.getElementById("new-agent-purpose") as HTMLInputElement).value = "";
                              (document.getElementById("new-agent-kb") as HTMLInputElement).value = "";
                              (document.getElementById("new-agent-style") as HTMLInputElement).value = "";
                            }
                          }}
                        >
                          Register Agent
                        </button>
                      </div>
                    </div>
                  )}

                  {state.mode === "prompts" && (
                    <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Select Corporate Template</h4>
                        <span className="text-[10px] text-zinc-500 font-mono">1 Click Execute</span>
                      </div>
                      <div className="space-y-2">
                        {ENTERPRISE_TEMPLATES.map(tmpl => {
                          const isSel = state.promptSubMode === tmpl.id;
                          return (
                            <button
                              key={tmpl.id}
                              id={`prompt-submode-${tmpl.id.replace(/\s+/g, '-')}`}
                              onClick={() => {
                                onChangeState(prev => ({ ...prev, promptSubMode: tmpl.id }));
                                onSelectTemplate(tmpl.promptPrefix);
                              }}
                              className={`w-full p-3 rounded-lg text-left border transition-all space-y-1 ${
                                isSel 
                                  ? "border-red-500 bg-red-950/10 text-red-400" 
                                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 text-zinc-300"
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold">{tmpl.label}</span>
                                {isSel && <span className="text-[9px] px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded border border-red-500/20 font-mono">LOADED</span>}
                              </div>
                              <p className="text-[10px] text-zinc-500 leading-tight">{tmpl.description}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {state.mode === "shopping" && (
                    <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-xs font-mono text-zinc-300">Affiliate Pipelines Enabled</h4>
                          <span className="text-[10px] text-orange-400 font-mono font-bold">8 ACTIVE NETWORKS</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-snug">
                          All outbound links and queries inject compliant tracker loops to claim automated product commissions (4% - 12%).
                        </p>
                      </div>

                      <div className="space-y-1.5 font-mono text-[10px] text-zinc-400">
                        <div className="flex justify-between items-center bg-zinc-900/50 p-1.5 rounded">
                          <span>Amazon Associates Pipeline</span>
                          <span className="text-emerald-400 font-bold">4.0%</span>
                        </div>
                        <div className="flex justify-between items-center bg-zinc-900/50 p-1.5 rounded">
                          <span>eBay Partner Network</span>
                          <span className="text-emerald-400 font-bold">6.0%</span>
                        </div>
                        <div className="flex justify-between items-center bg-zinc-900/50 p-1.5 rounded">
                          <span>CJ Affiliates Integration</span>
                          <span className="text-emerald-400 font-bold">8.0%</span>
                        </div>
                        <div className="flex justify-between items-center bg-zinc-900/50 p-1.5 rounded">
                          <span>Rakuten Revenue Loop</span>
                          <span className="text-emerald-400 font-bold">10.0%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                        <span className="text-xs text-zinc-400 font-mono">Commission Tracker Injection</span>
                        <input
                          type="checkbox"
                          checked={state.affiliateCommissionTracker}
                          onChange={(e) => onChangeState(prev => ({ ...prev, affiliateCommissionTracker: e.target.checked }))}
                          className="rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* General Features Switches */}
                  <div className="space-y-3 pt-3 border-t border-zinc-800">
                    <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Enterprise Framework Toggles</h4>
                    
                    <div className="flex items-center justify-between p-2.5 bg-zinc-900/30 rounded-lg border border-zinc-800">
                      <div>
                        <span className="text-xs font-semibold text-zinc-200 block">Workspace Collaboration</span>
                        <span className="text-[10px] text-zinc-500">Live document syncing for enterprise teams</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={state.teamCollaboration}
                        onChange={(e) => onChangeState(prev => ({ ...prev, teamCollaboration: e.target.checked }))}
                        className="rounded border-zinc-700 bg-zinc-900 text-purple-500 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: RAG INJECTED SERVICES */}
              {activeTab === "rag" && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">Enterprise Grounding Knowledge Context</h3>
                    <p className="text-[10px] text-zinc-500 leading-snug">
                      Inject raw content fragments and structural files directly into system prompts. This provides immediate, factual data alignment, bypassing fine-tuning delays.
                    </p>
                  </div>

                  {/* List registered files */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">REGISTERED DOCUMENTS ({state.ragFiles.length})</span>
                    {state.ragFiles.length === 0 ? (
                      <div className="p-8 border border-dashed border-zinc-800 rounded-lg text-center text-zinc-600">
                        <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <span className="text-xs block font-mono">No active RAG document registries.</span>
                        <p className="text-[10px] text-zinc-600 mt-1">Register customized specifications or metrics below.</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {state.ragFiles.map(file => (
                          <div key={file.id} className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-lg flex items-center justify-between">
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <FileText className="w-4 h-4 text-purple-400 flex-shrink-0" />
                              <div className="truncate">
                                <span className="text-xs text-zinc-200 block font-medium truncate">{file.name}</span>
                                <span className="text-[9px] font-mono text-zinc-500">{file.content.length} characters • RAG active</span>
                              </div>
                            </div>
                            <button
                              onClick={() => onRemoveDocument(file.id)}
                              className="p-1.5 hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 rounded transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* New Document Registration Form */}
                  <div className="pt-4 border-t border-zinc-800">
                    {!isAddingDoc ? (
                      <button
                        onClick={() => setIsAddingDoc(true)}
                        className="w-full py-2 bg-purple-900/20 hover:bg-purple-900/40 border border-purple-500/30 hover:border-purple-500/50 text-purple-400 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Register Knowledge Source (RAG File)</span>
                      </button>
                    ) : (
                      <form onSubmit={handleAddDocSubmit} className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-3">
                        <h4 className="text-xs font-mono text-zinc-300">New Grounding Registry</h4>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Document name (e.g. Q3_Earnings_Spec.txt)"
                            value={newDocName}
                            onChange={(e) => setNewDocName(e.target.value)}
                            required
                            className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500"
                          />
                          <textarea
                            placeholder="Paste knowledge fragments here..."
                            rows={4}
                            value={newDocContent}
                            onChange={(e) => setNewDocContent(e.target.value)}
                            required
                            className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-zinc-600 focus:outline-none focus:border-purple-500"
                          />
                        </div>
                        <div className="flex space-x-2 text-xs">
                          <button
                            type="submit"
                            className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded font-medium transition-all cursor-pointer"
                          >
                            Add Document
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAddingDoc(false)}
                            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 3: GOVERNANCE, COMPLIANCE & SAFETY */}
              {activeTab === "compliance" && (
                <div className="space-y-6 animate-fade-in text-xs">
                  
                  {/* Explanatory security banner */}
                  <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-lg flex items-start space-x-2.5">
                    <Lock className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-zinc-200 block">Neural Data Fortress active</span>
                      <p className="text-[10px] text-zinc-400 leading-snug mt-0.5">
                        Zero-retention logging protocols is enforced. Prompts bypass external vendor storage loops, locked strictly under military-grade regional boundaries.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onTriggerTour}
                    className="w-full py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Restart Onboarding Tour
                  </button>

                  {/* Temperature Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between font-mono">
                      <span className="text-zinc-400">COGNITIVE TEMPERATURE</span>
                      <span className="text-purple-400 font-bold">{state.temperature.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.1"
                      value={state.temperature}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        onChangeState(prev => ({ ...prev, temperature: val }));
                      }}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
                      <span>0.1 (Strict Compliance / Factual)</span>
                      <span>1.0 (High Innovation / Fluid)</span>
                    </div>
                  </div>

                  {/* Safety Fortress Levels */}
                  <div className="space-y-2">
                    <h4 className="font-mono text-zinc-400 tracking-wider">SECURE TRANSMISSION ENVELOPE</h4>
                    <div className="space-y-2">
                      {[
                        { id: "standard", label: "Standard Sandbox", desc: "Standard SSL with prompt parsing filtering.", shieldColor: "text-zinc-500" },
                        { id: "high", label: "High Isolation Vault", desc: "Data anonymization pipelines active.", shieldColor: "text-indigo-400" },
                        { id: "fortress", label: "Zero-Knowledge Airgap", desc: "Double-encrypt routing bypasses all neural telemetry.", shieldColor: "text-purple-400" }
                      ].map(level => {
                        const isSelect = state.dataSafetyLevel === level.id;
                        return (
                          <button
                            key={level.id}
                            onClick={() => onChangeState(prev => ({ ...prev, dataSafetyLevel: level.id as any }))}
                            className={`w-full p-3 rounded-lg border text-left transition-all ${
                              isSelect 
                                ? "border-purple-500 bg-purple-950/10 text-purple-200" 
                                : "border-zinc-800 hover:border-zinc-750 bg-zinc-900/20 text-zinc-400"
                            }`}
                          >
                            <div className="flex items-center space-x-2 text-slate-200 font-medium mb-0.5">
                              <Lock className={`w-3.5 h-3.5 ${level.shieldColor}`} />
                              <span>{level.label}</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 block leading-tight">{level.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Response Length parameter */}
                  <div className="space-y-2 border-t border-zinc-800 pt-4">
                    <div className="flex justify-between font-mono">
                      <span className="text-zinc-400">MAX RESPONSE LENGTH</span>
                      <span className="text-slate-300">{state.maxResponseLength} tokens</span>
                    </div>
                    <input
                      type="range"
                      min="256"
                      max="4096"
                      step="256"
                      value={state.maxResponseLength}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        onChangeState(prev => ({ ...prev, maxResponseLength: val }));
                      }}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                </div>
              )}

              {/* TAB 4: DIAGNOSTICS & SYSTEM AUDIT LOGS */}
              {activeTab === "analytics" && (
                <div className="space-y-5 animate-fade-in">
                  
                  {/* Analytic Meters */}
                  <div>
                    <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">Platform Telemetry Stats</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-lg">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Average Latency</span>
                        <div className="flex items-baseline space-x-1 mt-1">
                          <span className="text-xl font-display font-medium text-purple-400">421</span>
                          <span className="text-[10px] text-zinc-600 font-mono">ms</span>
                        </div>
                      </div>
                      <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-lg">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Data Encrypted</span>
                        <div className="flex items-baseline space-x-1 mt-1">
                          <span className="text-xl font-display font-medium text-emerald-400">100%</span>
                          <span className="text-[10px] text-zinc-600 font-mono">AES-256</span>
                        </div>
                      </div>
                      <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-lg">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Tokens Tracked</span>
                        <div className="flex items-baseline space-x-1 mt-1">
                          <span className="text-xl font-display font-medium text-purple-400">12.4K</span>
                          <span className="text-[10px] text-zinc-600 font-mono">/hr</span>
                        </div>
                      </div>
                      <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-lg">
                        <span className="text-[10px] font-mono text-zinc-500 block uppercase">Swarm Swaps</span>
                        <div className="flex items-baseline space-x-1 mt-1">
                          <span className="text-xl font-display font-medium text-indigo-400">5 / 5</span>
                          <span className="text-[10px] text-zinc-600 font-mono">Neural</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Audit Logs System */}
                  <div className="pt-4 border-t border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
                        Live Security Audit Logs
                      </span>
                      <button
                        onClick={onClearLogs}
                        className="text-[9px] font-mono text-zinc-500 hover:text-white transition-all cursor-pointer"
                      >
                        Clear Buffer
                      </button>
                    </div>

                    <div className="bg-black/80 border border-zinc-800 rounded-lg p-3 h-56 overflow-y-auto font-mono text-[9.5px] leading-relaxed space-y-2 select-all relative">
                      <div className="flowing-scanline opacity-10"></div>
                      {auditLogs.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-zinc-700">
                          <span>Waiting for compliance activities...</span>
                        </div>
                      ) : (
                        auditLogs.map(log => {
                          let color = "text-indigo-400";
                          if (log.status === "success") color = "text-emerald-400";
                          if (log.status === "warning") color = "text-amber-400";
                          if (log.status === "error") color = "text-rose-400";
                          return (
                            <div key={log.id} className="border-b border-zinc-900/80 pb-1.5 last:border-0">
                              <div className="flex items-center justify-between text-zinc-500 text-[8.5px] mb-0.5">
                                <span>{log.timestamp.slice(11, 19)} • {log.category.toUpperCase()}</span>
                                <span className="font-bold uppercase text-[8px]">{log.nodeId}</span>
                              </div>
                              <p className={`font-mono ${color}`}>{log.message}</p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Slider Bottom footer with Active status detail */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-800 text-center font-mono text-[10px] text-zinc-500 flex items-center justify-between">
              <span>ORCHESTRATOR STATUS</span>
              <span className="text-[9px] px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20 font-bold uppercase tracking-wide">
                {getSubModeSummary()}
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
