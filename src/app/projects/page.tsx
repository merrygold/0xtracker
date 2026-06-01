"use client"

import { useAppStore } from "@/lib/store"
import { STAGES, type ProjectStage } from "@/lib/types"
import { getStageColor, getStageLabel, getStageDotColor, daysAgo } from "@/lib/helpers"
import Link from "next/link"
import { Plus, Search, Filter, Globe, ArrowUpDown } from "lucide-react"
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
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {projects.length} microtool{projects.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <Link href="/projects/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
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
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={stageFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStageFilter("all")}
          >
            All
          </Button>
          {STAGES.map((stage) => (
            <Button
              key={stage.key}
              variant={stageFilter === stage.key ? "default" : "outline"}
              size="sm"
              onClick={() => setStageFilter(stage.key)}
            >
              {stage.label}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No projects found</h3>
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

            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{project.name}</h3>
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
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />

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