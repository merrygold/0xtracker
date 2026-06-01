"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { STAGES, type ProjectStage, type TaskStatus } from "@/lib/types"
import {
  getStageColor,
  getStageLabel,
  getStageDotColor,
  formatCurrency,
  daysAgo,
  getStageProgress,
} from "@/lib/helpers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  Settings,
  BarChart3,
  DollarSign,
  BookOpen,
  GripVertical,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

const STATUS_CONFIG: Record<
  TaskStatus,
  { icon: typeof CheckCircle2; label: string; color: string }
> = {
  todo: { icon: Circle, label: "To Do", color: "text-muted-foreground" },
  in_progress: { icon: Clock, label: "In Progress", color: "text-blue-500" },
  done: { icon: CheckCircle2, label: "Done", color: "text-green-500" },
  blocked: { icon: AlertCircle, label: "Blocked", color: "text-red-500" },
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const { projects, tasks, updateProject, addTask, updateTask, deleteTask, deleteProject } =
    useAppStore()

  const project = projects.find((p) => p.id === projectId)
  const projectTasks = tasks.filter((t) => t.projectId === projectId)

  const [activeStage, setActiveStage] = useState<ProjectStage | null>(null)
  const [addingTask, setAddingTask] = useState<ProjectStage | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-semibold mb-2">Project not found</h2>
        <Link href="/projects">
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    )
  }

  const doneTasks = projectTasks.filter((t) => t.status === "done").length
  const totalTasks = projectTasks.length
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const stageTasks = (stage: ProjectStage) =>
    projectTasks
      .filter((t) => t.stage === stage)
      .sort((a, b) => a.sortOrder - b.sortOrder)

  const currentStageProgress = () => {
    const st = stageTasks(project.stage)
    const done = st.filter((t) => t.status === "done").length
    return { done, total: st.length }
  }

  const handleAddTask = (stage: ProjectStage) => {
    if (!newTaskTitle.trim()) return
    addTask({
      projectId,
      stage,
      title: newTaskTitle.trim(),
      description: "",
      status: "todo",
      sortOrder: stageTasks(stage).length,
      notes: "",
      links: [],
    })
    setNewTaskTitle("")
    setAddingTask(null)
  }

  const cycleStatus = (taskId: string, currentStatus: TaskStatus) => {
    const order: TaskStatus[] = ["todo", "in_progress", "done", "blocked"]
    const nextIndex = (order.indexOf(currentStatus) + 1) % order.length
    updateTask(taskId, { status: order[nextIndex] })
  }

  const handleDeleteProject = () => {
    deleteProject(projectId)
    router.push("/projects")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
            <Badge variant="outline" className={getStageColor(project.stage)}>
              {getStageLabel(project.stage)}
            </Badge>
          </div>
          {project.domain && (
            <p className="text-sm text-muted-foreground mt-0.5">{project.domain}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/projects/${projectId}/finance`}>
            <Button variant="outline" size="sm">
              <DollarSign className="h-4 w-4 mr-1" />
              Finance
            </Button>
          </Link>
          <Link href={`/projects/${projectId}/stats`}>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-1" />
              Stats
            </Button>
          </Link>
          <Link href={`/projects/${projectId}/reference`}>
            <Button variant="outline" size="sm">
              <BookOpen className="h-4 w-4 mr-1" />
              Reference
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{progress}%</div>
            <p className="text-xs text-muted-foreground">Overall Progress</p>
            <Progress value={progress} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {doneTasks}/{totalTasks}
            </div>
            <p className="text-xs text-muted-foreground">Tasks Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {currentStageProgress().done}/{currentStageProgress().total}
            </div>
            <p className="text-xs text-muted-foreground">
              {getStageLabel(project.stage)} Stage
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{daysAgo(project.updatedAt)}</div>
            <p className="text-xs text-muted-foreground">Last Updated</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {STAGES.map((stage, index) => {
          const st = stageTasks(stage.key)
          const done = st.filter((t) => t.status === "done").length
          const isCurrentStage = project.stage === stage.key
          const isExpanded = activeStage === stage.key || isCurrentStage

          return (
            <button
              key={stage.key}
              onClick={() => setActiveStage(isExpanded && activeStage === stage.key ? null : stage.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                isCurrentStage
                  ? getStageColor(stage.key) + " border font-medium"
                  : isExpanded
                  ? "bg-accent text-accent-foreground border"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <div className={`h-2 w-2 rounded-full ${getStageDotColor(stage.key)}`} />
              <span>{stage.label}</span>
              <span className="text-xs opacity-70">
                {done}/{st.length}
              </span>
            </button>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className={`lg:col-span-${!activeStage ? "3" : "2"} space-y-4`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {getStageLabel(activeStage || project.stage)} Tasks
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddingTask(activeStage || project.stage)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </div>

          {addingTask === (activeStage || project.stage) && (
            <Card>
              <CardContent className="p-4 flex gap-2">
                <Input
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTask(addingTask!)}
                  autoFocus
                />
                <Button size="sm" onClick={() => handleAddTask(addingTask!)}>
                  Add
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setAddingTask(null); setNewTaskTitle("") }}>
                  Cancel
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            {stageTasks(activeStage || project.stage).map((task) => {
              const statusConfig = STATUS_CONFIG[task.status]
              const StatusIcon = statusConfig.icon
              const isEditing = editingTask === task.id

              return (
                <Card
                  key={task.id}
                  className={`transition-colors ${task.status === "done" ? "opacity-60" : ""}`}
                >
                  <CardContent className="p-4">
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          defaultValue={task.title}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              updateTask(task.id, { title: (e.target as HTMLInputElement).value })
                              setEditingTask(null)
                            }
                          }}
                          onBlur={(e) => {
                            updateTask(task.id, { title: e.target.value })
                            setEditingTask(null)
                          }}
                        />
                        <Textarea
                          defaultValue={task.notes}
                          placeholder="Notes..."
                          onBlur={(e) => updateTask(task.id, { notes: e.target.value })}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingTask(null)}
                          >
                            Done
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => cycleStatus(task.id, task.status)}
                          className={`mt-0.5 ${statusConfig.color} hover:opacity-80`}
                          title={`Status: ${statusConfig.label} (click to cycle)`}
                        >
                          <StatusIcon className="h-5 w-5" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${
                              task.status === "done" ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {task.title}
                          </p>
                          {task.notes && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {task.notes}
                            </p>
                          )}
                          {task.checklistItems.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {task.checklistItems.map((item) => (
                                <label
                                  key={item.id}
                                  className="flex items-center gap-2 text-xs cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={item.checked}
                                    onChange={() =>
                                      useAppStore
                                        .getState()
                                        .toggleChecklistItem(task.id, item.id)
                                    }
                                    className="rounded"
                                  />
                                  <span className={item.checked ? "line-through text-muted-foreground" : ""}>
                                    {item.text}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setEditingTask(task.id)}
                          >
                            <Settings className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}

            {stageTasks(activeStage || project.stage).length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">No tasks for this stage</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {activeStage && activeStage !== project.stage && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    updateProject(projectId, { stage: activeStage })
                  }}
                >
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Move Project to {getStageLabel(activeStage)} Stage
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {!activeStage && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stage Progress</h3>
            <Card>
              <CardContent className="p-4 space-y-4">
                {STAGES.map((stage) => {
                  const st = stageTasks(stage.key)
                  const done = st.filter((t) => t.status === "done").length
                  const pct = st.length > 0 ? Math.round((done / st.length) * 100) : 0
                  const isCurrent = project.stage === stage.key

                  return (
                    <div key={stage.key} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${getStageDotColor(stage.key)}`}
                          />
                          <span className={isCurrent ? "font-medium" : "text-muted-foreground"}>
                            {stage.label}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {done}/{st.length}
                        </span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <h3 className="text-lg font-semibold">Project Info</h3>
            <Card>
              <CardContent className="p-4 space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Main Keyword</span>
                  <p className="font-medium">{project.mainKeyword || "—"}</p>
                </div>
                {project.competitorUrls.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Competitors</span>
                    <div className="mt-1 space-y-1">
                      {project.competitorUrls.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline text-xs"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {url.replace(/^https?:\/\//, "").slice(0, 30)}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {project.supportingKeywords.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Keywords</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.supportingKeywords.slice(0, 8).map((kw) => (
                        <Badge key={kw} variant="secondary" className="text-xs">
                          {kw}
                        </Badge>
                      ))}
                      {project.supportingKeywords.length > 8 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.supportingKeywords.length - 8} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
            <Card className="border-destructive/50">
              <CardContent className="p-4">
                {!showDeleteConfirm ? (
                  <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Project
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Are you sure? This cannot be undone.</p>
                    <div className="flex gap-2">
                      <Button variant="destructive" size="sm" onClick={handleDeleteProject}>
                        Delete
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}