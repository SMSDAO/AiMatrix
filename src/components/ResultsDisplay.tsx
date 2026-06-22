import React, { useState } from "react";
import { 
  Copy, Check, Bookmark, Star, Calendar, Cpu, ArrowUpRight, 
  ExternalLink, Layers, Search, Shield, DollarSign, Terminal, 
  CheckCircle2, Flame, RefreshCcw, ThumbsUp, MessageSquare
} from "lucide-react";
import { Message, SearchMode } from "../types";
import { submitFeedback } from "../lib/firebase";

interface ResultsDisplayProps {
  message: Message;
  onSaveFavorite?: (msg: Message) => void;
  isFavorite?: boolean;
}

export default function ResultsDisplay({
  message,
  onSaveFavorite,
  isFavorite = false
}: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [viewRaw, setViewRaw] = useState(false);
  
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasMetadata = !!message.metadata;
  const meta = message.metadata;

  // Simple, highly resilient React 19 Custom Markdown parsing / structuring helper
  const renderFormattedText = (rawText: string) => {
    if (!rawText) return null;

    // Splits paragraphs
    const blocks = rawText.split(/\n\n+/);

    return (
      <div className="space-y-4 text-xs tracking-wide leading-relaxed text-slate-300">
        {blocks.map((block, bIdx) => {
          const trimmed = block.trim();
          if (!trimmed) return null;

          // Check if it's a heading
          if (trimmed.startsWith("# ")) {
            return (
              <h1 key={bIdx} className="font-display font-bold text-lg text-slate-100 border-b border-zinc-800 pb-1 mt-5 first:mt-0 tracking-tight">
                {trimmed.replace("# ", "")}
              </h1>
            );
          }
          if (trimmed.startsWith("## ")) {
            return (
              <h2 key={bIdx} className="font-display font-semibold text-sm text-purple-400 mt-4 first:mt-0">
                {trimmed.replace("## ", "")}
              </h2>
            );
          }
          if (trimmed.startsWith("### ")) {
            return (
              <h3 key={bIdx} className="font-display font-medium text-xs text-indigo-400 mt-2">
                {trimmed.replace("### ", "")}
              </h3>
            );
          }

          // Check if it's an inline quote/callout block
          if (trimmed.startsWith("> ")) {
            return (
              <blockquote key={bIdx} className="border-l-2 border-purple-500 bg-purple-950/10 p-3 rounded-r text-slate-400 italic">
                {trimmed.replace(/^> \s*/gm, "")}
              </blockquote>
            );
          }

          // Check if it's a markdown table
          if (trimmed.includes("|") && trimmed.split("\n")[1]?.includes("-")) {
            const rows = trimmed.split("\n");
            const headers = rows[0].split("|").map(h => h.trim()).filter(h => h);
            // row idx 1 is separator
            const dataRows = rows.slice(2).map(r => r.split("|").map(td => td.trim()).filter(td => td));

            return (
              <div key={bIdx} className="overflow-x-auto my-3 border border-zinc-800 rounded-lg">
                <table className="min-w-full divide-y divide-zinc-800 text-[11px]">
                  <thead className="bg-zinc-950">
                    <tr>
                      {headers.map((h, i) => (
                        <th key={i} className="px-3 py-2 text-left font-semibold text-purple-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80 bg-zinc-900/10">
                    {dataRows.map((dr, ri) => (
                      <tr key={ri} className="hover:bg-zinc-900/30">
                        {dr.map((val, ci) => (
                          <td key={ci} className="px-3 py-2 text-slate-300 font-mono">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          // Check if it's bullet list items
          if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            const items = trimmed.split(/\n[\-*]\s+/);
            return (
              <ul key={bIdx} className="list-disc pl-5 space-y-1 my-2">
                {items.map((item, iIdx) => (
                  <li key={iIdx} className="text-slate-300">
                    {item.replace(/^[-*]\s+/, "")}
                  </li>
                ))}
              </ul>
            );
          }

          // Normal text
          return (
            <p key={bIdx} className="text-slate-300 font-sans leading-relaxed">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  const getModeIconAndLabel = (mode: SearchMode, role: string) => {
    switch (mode) {
      case "search":
        return { icon: Search, label: "GROUNDED WEB DATA", color: "text-blue-400", bg: "bg-blue-500/10" };
      case "research":
        return { icon: Layers, label: "R&D COMPARATIVE REPORT", color: "text-purple-400", bg: "bg-purple-500/10" };
      case "shopping":
        return { icon: DollarSign, label: "COMMERCE INTEL TRACKER", color: "text-orange-400", bg: "bg-orange-500/10" };
      case "agents":
        return { icon: Cpu, label: `AGENT: ${role.toUpperCase()}`, color: "text-emerald-400", bg: "bg-emerald-500/10" };
      case "prompts":
        return { icon: Terminal, label: "WORKFLOW TEMPLATE EXECUTIVE", color: "text-red-400", bg: "bg-red-500/10" };
      default:
        return { icon: Cpu, label: "GENERAL INTEL", color: "text-slate-400", bg: "bg-zinc-800" };
    }
  };

  const displayConfig = getModeIconAndLabel(message.mode, meta?.agentRole || "");
  const HeaderIcon = displayConfig.icon;

  return (
    <div className="w-full bg-[#08080c]/90 border border-zinc-800/80 rounded-xl overflow-hidden shadow-2xl relative select-text hover:border-zinc-700/60 transition-all duration-300">
      
      {/* Dynamic Scanline aesthetic overlay inside result box */}
      <div className="flowing-scanline opacity-5"></div>

      {/* Structured Result Header */}
      <div className="bg-zinc-950/80 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className={`p-1.5 rounded ${displayConfig.bg}`}>
            <HeaderIcon className={`w-4 h-4 ${displayConfig.color}`} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">compliance response</span>
            <span className="text-xs font-display font-medium text-slate-200 tracking-tight flex items-center gap-1.5">
              {displayConfig.label}
              {meta?.searchGroundingUsed && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                  SEARCH GROUNDED
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Toolbar buttons */}
        <div className="flex items-center space-x-1.5">
          {onSaveFavorite && (
            <button
              onClick={() => onSaveFavorite(message)}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                isFavorite 
                  ? "bg-amber-500/10 text-amber-400" 
                  : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
              title="Save to favorites"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          <button
            onClick={() => setViewRaw(!viewRaw)}
            className={`px-2 py-1 text-[10px] font-mono rounded border transition-all cursor-pointer ${
              viewRaw 
                ? "bg-purple-900/20 border-purple-500/30 text-purple-400" 
                : "border-zinc-800 hover:bg-zinc-800 text-zinc-400"
            }`}
          >
            RAW
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-all flex items-center gap-1 cursor-pointer"
            title="Copy Report"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 animate-scale-up" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Response Output Box */}
      <div className="p-5 font-sans leading-relaxed text-slate-300">
        {viewRaw ? (
          <pre className="p-3 bg-black/40 border border-zinc-900 rounded-lg text-[11px] font-mono whitespace-pre-wrap overflow-x-auto text-zinc-400 select-all">
            {message.text}
          </pre>
        ) : (
          renderFormattedText(message.text)
        )}
      </div>

      {/* Dynamic Telemetry Footer Metrics */}
      {hasMetadata && (
        <div className="bg-zinc-950/50 px-4 py-2.5 border-t border-zinc-900/60 flex flex-wrap items-center justify-between text-[9px] font-mono text-zinc-500 gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-purple-500" /> 
              {meta.modelUsed}
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" />
              Latency: <strong className="text-zinc-400 font-bold">{meta.latencyMs}ms</strong>
            </span>
            <span className="text-zinc-600">|</span>
            <span>
              Tokens: <strong className="text-zinc-400 font-medium">In: {meta.promptTokens}</strong> • <strong className="text-zinc-400 font-medium">Out: {meta.completionTokens}</strong>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowFeedback(!showFeedback)}
              className="px-2 py-1 flex items-center gap-1.5 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded transition-all cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" />
              Feedback
            </button>
            <span className="flex items-center gap-1 text-emerald-500">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              GOVERNANCE SIGNED
            </span>
            <span className="text-zinc-700 font-bold">•</span>
            <span className="text-zinc-600 bg-zinc-900/50 px-1.5 py-0.5 rounded border border-zinc-800">
              {meta.transactionId}
            </span>
          </div>
        </div>
      )}

      {/* Feedback Panel */}
      {showFeedback && (
        <div className="bg-zinc-900/50 border-t border-zinc-800 p-4 animate-fade-in space-y-3">
          {feedbackSubmitted ? (
            <div className="text-emerald-400 text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Feedback recorded. Thank you.
            </div>
          ) : (
            <>
              <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Evaluate Response</div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setFeedbackRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star className={`w-5 h-5 ${feedbackRating >= star ? "fill-amber-400 text-amber-400" : "text-zinc-600"}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                placeholder="Optional feedback comments..."
                className="w-full bg-black border border-zinc-800 rounded p-2 text-xs text-white placeholder-zinc-600 resize-none h-16"
              />
              <button
                disabled={feedbackRating === 0}
                onClick={async () => {
                  const success = await submitFeedback(hasMetadata ? meta.transactionId : message.id, feedbackRating, feedbackText);
                  if (success) setFeedbackSubmitted(true);
                }}
                className={`text-xs font-bold py-1.5 px-4 rounded ${feedbackRating > 0 ? "bg-purple-600 hover:bg-purple-500 text-white cursor-pointer" : "bg-zinc-800 text-zinc-600 cursor-not-allowed"}`}
              >
                Submit Feedback
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
