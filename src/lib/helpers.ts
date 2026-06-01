import { STAGES, type ProjectStage } from "./types"

export function getStageColor(stage: ProjectStage): string {
  const colors: Record<ProjectStage, string> = {
    idea: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/25",
    research: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/25",
    domain: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/25",
    setup: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/25",
    build: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/25",
    seo: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/25",
    deploy: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/25",
    monetize: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
    monitor: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/25",
  }
  return colors[stage]
}

export function getStageDotColor(stage: ProjectStage): string {
  const colors: Record<ProjectStage, string> = {
    idea: "bg-purple-500",
    research: "bg-blue-500",
    domain: "bg-cyan-500",
    setup: "bg-orange-500",
    build: "bg-green-500",
    seo: "bg-yellow-500",
    deploy: "bg-indigo-500",
    monetize: "bg-emerald-500",
    monitor: "bg-rose-500",
  }
  return colors[stage]
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