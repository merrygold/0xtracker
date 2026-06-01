"use client"

import { useAppStore } from "@/lib/store"
import { STAGES, type ProjectStage } from "@/lib/types"
import { getStageColor, getStageLabel, getStageDotColor, getStageColors, daysAgo } from "@/lib/helpers"
import Link from "next/link"
import { Plus, Search, Globe, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"

export default function ProjectsPage() {
  const { projects, tasks } = useAppStore()
  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState<ProjectStage | "all">("all")

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.domain.toLowerCase().includes(search.toLowerCase()) ||
      p.mainKeyword.toLowerCase().includes(search.toLowerCase())
    const matchesStage = stageFilter === "all" || p.stage === stageFilter
    return matchesSearch && matchesStage
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {projects.length} microtool{projects.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <Button
            variant={stageFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStageFilter("all")}
          >
            All
          </Button>
          {STAGES.map((stage) => {
            const colors = getStageColors(stage.key)
            return (
              <Button
                key={stage.key}
                variant={stageFilter === stage.key ? "default" : "outline"}
                size="sm"
                onClick={() => setStageFilter(stage.key)}
                className="gap-1.5"
              >
                <div className={`h-2 w-2 rounded-full ${colors.dot}`} />
                {stage.label}
              </Button>
            )
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Globe className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="font-heading text-lg mb-1">No projects found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {projects.length === 0
                ? "Create your first microtool project to get started"
                : "Try adjusting your search or filter"}
            </p>
            {projects.length === 0 && (
              <Link href="/projects/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Project
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => {
            const projectTasks = tasks.filter((t) => t.projectId === project.id)
            const doneTasks = projectTasks.filter((t) => t.status === "done").length
            const totalTasks = projectTasks.length
            const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0
            const stageTasks = projectTasks.filter((t) => t.stage === project.stage)
            const stageDone = stageTasks.filter((t) => t.status === "done").length
            const colors = getStageColors(project.stage)

            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="hover:shadow-md transition-all duration-200 cursor-pointer h-full border-border/50 group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium group-hover:text-primary transition-colors">{project.name}</h3>
                        {project.domain && (
                          <p className="text-xs text-muted-foreground mt-0.5">{project.domain}</p>
                        )}
                      </div>
                      <Badge variant="outline" className={getStageColor(project.stage)}>
                        {getStageLabel(project.stage)}
                      </Badge>
                    </div>

                    {project.mainKeyword && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {project.mainKeyword}
                        </Badge>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Overall Progress</span>
                        <span className="stage-number">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {getStageLabel(project.stage)}: {stageDone}/{stageTasks.length}
                        </span>
                        <span>{daysAgo(project.updatedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}