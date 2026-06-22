export type SearchMode = "search" | "research" | "shopping" | "agents" | "prompts";

export interface CustomAgent {
  id: string;
  name: string;
  purpose: string;
  knowledgeBase: string;
  interactionStyle: string;
}

export interface FileRef {
  id: string;
  name: string;
  size: number; // in bytes
  content: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  category: "auth" | "rag" | "compliance" | "network" | "agent";
  message: string;
  status: "success" | "warning" | "info" | "error";
  nodeId: string;
}

export interface SearchFilters {
  dateRange: "any" | "past_24h" | "past_week" | "past_month" | "past_year";
  domains: string;
  documentType: "any" | "pdf" | "docx" | "html";
}

export interface EnterpriseState {
  mode: SearchMode;
  searchFilters: SearchFilters;
  agentSubMode: string; // Specialist name for "agents" mode
  promptSubMode: string; // Template ID for "prompts" mode
  ragFiles: FileRef[];
  customAgents: CustomAgent[];
  temperature: number;
  dataSafetyLevel: "standard" | "high" | "fortress";
  affiliateCommissionTracker: boolean;
  teamCollaboration: boolean;
  maxResponseLength: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  mode: SearchMode;
  metadata?: {
    modelUsed: string;
    promptTokens: number;
    completionTokens: number;
    searchGroundingUsed: boolean;
    latencyMs: number;
    timestamp: string;
    agentRole: string;
    governanceVerified: boolean;
    transactionId: string;
  };
}

export const SWARM_AGENTS = [
  { id: "Cloud Architect", name: "Cloud Architect AI", subtitle: "Infrastructure & Security", description: "Design cloud deployments, microservices architectures, and robust security policies.", icon: "Server" },
  { id: "Legal Counsel", name: "Legal Counsel AI", subtitle: "Regulatory & Compliance", description: "Audit contracts, assess state compliance, and explore international regulatory hazards.", icon: "Shield" },
  { id: "Finance Specialist", name: "Finance Specialist AI", subtitle: "Valuations & Markets", description: "Interpret spreadsheets, calculate financial projection loops, and evaluate CAPEX.", icon: "TrendingUp" },
  { id: "Strategic Planner", name: "Strategic Planner AI", subtitle: "Growth & Integration", description: "Draft multi-quarter corporate roadmaps, OKR matrices, and competitor defensive pivots.", icon: "Compass" },
  { id: "Marketing Swarm", name: "Marketing Swarm AI", subtitle: "User Acquisition & Brand", description: "Generate copy variations, run messaging visual concepts, and calculate ad-spend ROI.", icon: "Megaphone" }
];

export const ENTERPRISE_TEMPLATES = [
  { 
    id: "Executive Briefing", 
    label: "Briefing Matrix", 
    description: "Build a high-density, strategic summary from long raw notes.", 
    promptPrefix: "Synthesize the following information into an Executive Briefing Matrix. Structure it into Actionable Key Findings, Risk Impact Score (1-10), and Recommended Next Steps." 
  },
  { 
    id: "Smart Code Review", 
    label: "Security & Optimization", 
    description: "Scan code modules for structural vulnerabilities, leaks, and quality.", 
    promptPrefix: "Perform a Security and Optimization Review on this code snippet. List any structural optimization recommendations, security leaks, memory efficiency scores, and provide a revised secure refactor." 
  },
  { 
    id: "Global Market Analyzer", 
    label: "Strategic Competitor Intelligence", 
    description: "Evaluate macroeconomic market shifts, competitors, and growth vectors.", 
    promptPrefix: "Execute a competitor intelligence review. Analyze market trends, competitor defensive hurdles, potential expansion levers, and outline a strategic timeline for market penetration." 
  },
  { 
    id: "Corporate Tone Polisher", 
    label: "PR & Investor Relations", 
    description: "Eradicate casual or ambiguous phrases with executive-grade phrasing.", 
    promptPrefix: "Refine the following message for PR, board-level, and investor relations. Elevate vocabulary, maintain absolute professional accountability, and make the tone highly authoritative yet strategic." 
  }
];
