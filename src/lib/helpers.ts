import { STAGES, type ProjectStage } from "./types"

const STAGE_COLORS: Record<ProjectStage, { bg: string; text: string; border: string; dot: string; light: string }> = {
  idea: {
    bg: "bg-mer-amber/15",
    text: "text-mer-amber dark:text-mer-amber-light",
    border: "border-mer-amber/30",
    dot: "bg-mer-amber",
    light: "bg-mer-amber-light/30 dark:bg-mer-amber/20",
  },
  research: {
    bg: "bg-mer-teal/15",
    text: "text-mer-teal dark:text-mer-teal-light",
    border: "border-mer-teal/30",
    dot: "bg-mer-teal",
    light: "bg-mer-teal-light/30 dark:bg-mer-teal/20",
  },
  domain: {
    bg: "bg-mer-rose/15",
    text: "text-mer-rose dark:text-mer-rose-light",
    border: "border-mer-rose/30",
    dot: "bg-mer-rose",
    light: "bg-mer-rose-light/30 dark:bg-mer-rose/20",
  },
  setup: {
    bg: "bg-mer-earth/15",
    text: "text-mer-earth dark:text-mer-earth-light",
    border: "border-mer-earth/30",
    dot: "bg-mer-earth",
    light: "bg-mer-earth-light/30 dark:bg-mer-earth/20",
  },
  build: {
    bg: "bg-mer-green/15",
    text: "text-mer-green dark:text-mer-green-light",
    border: "border-mer-green/30",
    dot: "bg-mer-green",
    light: "bg-mer-green-light/30 dark:bg-mer-green/20",
  },
  seo: {
    bg: "bg-mer-gold/15",
    text: "text-mer-gold dark:text-mer-gold-light",
    border: "border-mer-gold/30",
    dot: "bg-mer-gold",
    light: "bg-mer-gold-light/30 dark:bg-mer-gold/20",
  },
  deploy: {
    bg: "bg-mer-blue/15",
    text: "text-mer-blue dark:text-mer-blue-light",
    border: "border-mer-blue/30",
    dot: "bg-mer-blue",
    light: "bg-mer-blue-light/30 dark:bg-mer-blue/20",
  },
  monetize: {
    bg: "bg-mer-lime/15",
    text: "text-mer-lime dark:text-mer-lime-light",
    border: "border-mer-lime/30",
    dot: "bg-mer-lime",
    light: "bg-mer-lime-light/30 dark:bg-mer-lime/20",
  },
  monitor: {
    bg: "bg-mer-rust/15",
    text: "text-mer-rust dark:text-mer-rust-light",
    border: "border-mer-rust/30",
    dot: "bg-mer-rust",
    light: "bg-mer-rust-light/30 dark:bg-mer-rust/20",
  },
}

export function getStageColor(stage: ProjectStage): string {
  const c = STAGE_COLORS[stage]
  return `${c.bg} ${c.text} ${c.border}`
}

export function getStageDotColor(stage: ProjectStage): string {
  return STAGE_COLORS[stage].dot
}

export function getStageColors(stage: ProjectStage) {
  return STAGE_COLORS[stage]
}

export function getStageLabel(stage: ProjectStage): string {
  return STAGES.find((s) => s.key === stage)?.label ?? stage
}

export function getStageIndex(stage: ProjectStage): number {
  return STAGES.findIndex((s) => s.key === stage)
}

export function getStageProgress(stage: ProjectStage): number {
  return ((getStageIndex(stage) + 1) / STAGES.length) * 100
}

export function formatCurrency(amount: number, currency: "INR" | "USD"): string {
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function daysAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return "Today"
  if (diff === 1) return "Yesterday"
  if (diff < 30) return `${diff} days ago`
  if (diff < 365) return `${Math.floor(diff / 30)} months ago`
  return `${Math.floor(diff / 365)} years ago`
}