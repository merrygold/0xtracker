"use client"

import { useAppStore } from "@/lib/store"
import { STAGES } from "@/lib/types"
import { getStageColor, getStageLabel, getStageDotColor, getStageColors, formatCurrency, daysAgo } from "@/lib/helpers"
import Link from "next/link"
import {
  ArrowRight,
  Plus,
  FolderKanban,
  TrendingUp,
  DollarSign,
  Globe,
  Lightbulb,
  Compass,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  const { projects, tasks, financials } = useAppStore()

  const activeProjects = projects.filter((p) => p.status === "active").length
  const completedProjects = projects.filter((p) => p.status === "completed").length
  const launchedProjects = projects.filter((p) => p.stage === "monitor").length

  const totalRevenueUSD = financials
    .filter((f) => f.type === "revenue" && f.currency === "USD")
    .reduce((sum, f) => sum + f.amount, 0)
  const totalRevenueINR = financials
    .filter((f) => f.type === "revenue" && f.currency === "INR")
    .reduce((sum, f) => sum + f.amount, 0)
  const totalCostUSD = financials
    .filter((f) => f.type === "cost" && f.currency === "USD")
    .reduce((sum, f) => sum + f.amount, 0)
  const totalCostINR = financials
    .filter((f) => f.type === "cost" && f.currency === "INR")
    .reduce((sum, f) => sum + f.amount, 0)

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your microtool websites from idea to monetization
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-mer-amber" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading tracking-tight">{projects.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeProjects} active · {completedProjects} completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Launched</CardTitle>
            <Globe className="h-4 w-4 text-mer-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading tracking-tight">{launchedProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">In monitoring stage</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-mer-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading tracking-tight">
              {formatCurrency(totalRevenueINR, "INR")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(totalRevenueUSD, "USD")} USD
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Costs</CardTitle>
            <DollarSign className="h-4 w-4 text-mer-rust" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading tracking-tight">{formatCurrency(totalCostINR, "INR")}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(totalCostUSD, "USD")} USD
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl tracking-tight">Recent Projects</h2>
            <Link href="/projects" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Compass className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg mb-1">No projects yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start tracking your microtool websites
                </p>
                <Link href="/projects/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Project
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {recentProjects.map((project) => {
                const projectTasks = tasks.filter((t) => t.projectId === project.id)
                const doneTasks = projectTasks.filter((t) => t.status === "done").length
                const totalTasks = projectTasks.length
                const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0
                const colors = getStageColors(project.stage)

                return (
                  <Link key={project.id} href={`/projects/${project.id}`}>
                    <Card className="hover:shadow-md transition-all duration-200 cursor-pointer border-border/50 group">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`h-2.5 w-2.5 rounded-full ${colors.dot}`} />
                            <span className="font-medium group-hover:text-primary transition-colors">{project.name}</span>
                            <Badge variant="outline" className={getStageColor(project.stage)}>
                              {getStageLabel(project.stage)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {project.domain && <span>{project.domain}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={progress} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground stage-number w-10 text-right">
                            {progress}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          {doneTasks}/{totalTasks} tasks · Updated {daysAgo(project.updatedAt)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="font-heading text-xl tracking-tight">Pipeline Stages</h2>
          <Card className="border-border/50">
            <CardContent className="p-4 space-y-2.5">
              {STAGES.map((stage, index) => {
                const count = projects.filter((p) => p.stage === stage.key).length
                const colors = getStageColors(stage.key)
                return (
                  <div key={stage.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-2 w-2 rounded-full ${colors.dot}`} />
                      <span className="text-sm">{stage.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs stage-number">
                      {count}
                    </Badge>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <h2 className="font-heading text-xl tracking-tight">Quick Start</h2>
          <Card className="border-border/50">
            <CardContent className="p-3 space-y-1">
              <Link href="/projects/new" className="flex items-center justify-between p-2.5 rounded-md hover:bg-accent/80 transition-colors group">
                <span className="text-sm">Create New Project</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
              <Link href="/reference" className="flex items-center justify-between p-2.5 rounded-md hover:bg-accent/80 transition-colors group">
                <span className="text-sm">Reference Guide</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}