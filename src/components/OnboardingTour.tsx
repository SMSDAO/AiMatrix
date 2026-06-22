import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight } from "lucide-react";

interface Step {
  target: string;
  title: string;
  content: string;
}

const steps: Step[] = [
  {
    target: "#primary-prompt-input",
    title: "Universal Prompt Workspace",
    content: "Type your enterprise objectives, queries, or prompt instructions here. The AI will analyze them according to the selected mode."
  },
  {
    target: "#mode-badge-indicator",
    title: "Intelligence Modes",
    content: "Switch between different specialized modes like Search, Research, or custom AI Agents to optimize model behavior."
  },
  {
    target: "#toggle-cabinet-btn",
    title: "Enterprise Hub",
    content: "Open this cabinet to manage RAG memory, load templates, and configure custom AI agents."
  },
  {
    target: "#preset-btn-Executive-Briefing",
    title: "Fast Templates",
    content: "Use these presets to instantly ground the AI in specific enterprise-grade workflows."
  }
];

export default function OnboardingTour({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [stepIdx, setStepIdx] = useState(0);

  if (!isOpen) return null;

  const currentStep = steps[stepIdx];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-zinc-600 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">
              Guidance Step {stepIdx + 1} / {steps.length}
            </span>
            <h3 className="font-display font-medium text-lg text-white">{currentStep.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{currentStep.content}</p>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[10px] text-zinc-600 font-mono">
              Target ID: {currentStep.target}
            </span>
            <button
              onClick={() => {
                if (stepIdx < steps.length - 1) {
                  setStepIdx(stepIdx + 1);
                } else {
                  onClose();
                }
              }}
              className="px-4 py-2 bg-purple-600 rounded-lg text-white font-mono text-xs font-bold hover:bg-purple-500 flex items-center gap-1.5"
            >
              {stepIdx === steps.length - 1 ? "Finish" : "Next"}
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
