import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Project, Task, Financial, DomainResearch, ProjectStage, TaskStatus } from "./types"
import { STAGE_CHECKLISTS } from "./types"

function generateId(): string {
  return crypto.randomUUID()
}

interface AppState {
  projects: Project[]
  tasks: Task[]
  financials: Financial[]
  domainResearch: DomainResearch[]

  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => string
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void

  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "checklistItems">) => string
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (taskId: string, newStage: ProjectStage, newSortOrder: number) => void
  toggleChecklistItem: (taskId: string, itemId: string) => void
  addChecklistItem: (taskId: string, text: string) => void
  removeChecklistItem: (taskId: string, itemId: string) => void

  addFinancial: (financial: Omit<Financial, "id" | "createdAt">) => string
  updateFinancial: (id: string, updates: Partial<Financial>) => void
  deleteFinancial: (id: string) => void

  addDomainResearch: (domain: Omit<DomainResearch, "id">) => string
  updateDomainResearch: (id: string, updates: Partial<DomainResearch>) => void
  deleteDomainResearch: (id: string) => void

  initializeStageTasks: (projectId: string) => void
  getProjectStats: (projectId: string) => { totalTasks: number; completedTasks: number; percentage: number }
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: [],
      tasks: [],
      financials: [],
      domainResearch: [],

      addProject: (projectData) => {
        const id = generateId()
        const now = new Date().toISOString()
        const project: Project = {
          ...projectData,
          id,
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({ projects: [...state.projects, project] }))

        const state = get()
        for (const stage of Object.keys(STAGE_CHECKLISTS) as ProjectStage[]) {
          const items = STAGE_CHECKLISTS[stage]
          for (let i = 0; i < items.length; i++) {
            state.addTask({
              projectId: id,
              stage,
              title: items[i],
              description: "",
              status: "todo" as TaskStatus,
              sortOrder: i,
              notes: "",
              links: [],
            })
          }
        }

        return id
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }))
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          tasks: state.tasks.filter((t) => t.projectId !== id),
          financials: state.financials.filter((f) => f.projectId !== id),
          domainResearch: state.domainResearch.filter((d) => d.projectId !== id),
        }))
      },

      addTask: (taskData) => {
        const id = generateId()
        const now = new Date().toISOString()
        const task: Task = {
          ...taskData,
          id,
          checklistItems: [],
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({ tasks: [...state.tasks, task] }))
        return id
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        }))
      },

      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }))
      },

      moveTask: (taskId, newStage, newSortOrder) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, stage: newStage, sortOrder: newSortOrder, updatedAt: new Date().toISOString() }
              : t
          ),
        }))
      },

      toggleChecklistItem: (taskId, itemId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  checklistItems: t.checklistItems.map((ci) =>
                    ci.id === itemId ? { ...ci, checked: !ci.checked } : ci
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }))
      },

      addChecklistItem: (taskId, text) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  checklistItems: [...t.checklistItems, { id: generateId(), text, checked: false }],
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }))
      },

      removeChecklistItem: (taskId, itemId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  checklistItems: t.checklistItems.filter((ci) => ci.id !== itemId),
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }))
      },

      addFinancial: (financialData) => {
        const id = generateId()
        const now = new Date().toISOString()
        const financial: Financial = { ...financialData, id, createdAt: now }
        set((state) => ({ financials: [...state.financials, financial] }))
        return id
      },

      updateFinancial: (id, updates) => {
        set((state) => ({
          financials: state.financials.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        }))
      },

      deleteFinancial: (id) => {
        set((state) => ({ financials: state.financials.filter((f) => f.id !== id) }))
      },

      addDomainResearch: (domainData) => {
        const id = generateId()
        const domain: DomainResearch = { ...domainData, id }
        set((state) => ({ domainResearch: [...state.domainResearch, domain] }))
        return id
      },

      updateDomainResearch: (id, updates) => {
        set((state) => ({
          domainResearch: state.domainResearch.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        }))
      },

      deleteDomainResearch: (id) => {
        set((state) => ({ domainResearch: state.domainResearch.filter((d) => d.id !== id) }))
      },

      initializeStageTasks: (projectId) => {
        const state = get()
        const existingTasks = state.tasks.filter((t) => t.projectId === projectId)
        if (existingTasks.length > 0) return

        for (const stage of Object.keys(STAGE_CHECKLISTS) as ProjectStage[]) {
          const items = STAGE_CHECKLISTS[stage]
          for (let i = 0; i < items.length; i++) {
            state.addTask({
              projectId,
              stage,
              title: items[i],
              description: "",
              status: "todo" as TaskStatus,
              sortOrder: i,
              notes: "",
              links: [],
            })
          }
        }
      },

      getProjectStats: (projectId) => {
        const state = get()
        const projectTasks = state.tasks.filter((t) => t.projectId === projectId)
        const totalTasks = projectTasks.length
        const completedTasks = projectTasks.filter((t) => t.status === "done").length
        const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
        return { totalTasks, completedTasks, percentage }
      },
    }),
    {
      name: "0xtracker-storage",
    }
  )
)