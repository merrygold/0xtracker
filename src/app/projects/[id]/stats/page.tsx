"use client"

import { useAppStore } from "@/lib/store"
import { formatCurrency } from "@/lib/helpers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts"

export default function StatsPage() {
  const params = useParams()
  const projectId = params.id as string
  const { projects, financials, tasks } = useAppStore()

  const project = projects.find((p) => p.id === projectId)
  const projectFinancials = financials.filter((f) => f.projectId === projectId)
  const projectTasks = tasks.filter((t) => t.projectId === projectId)

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="font-heading text-xl mb-2">Project not found</h2>
        <Link href="/projects">
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    )
  }

  const totalRevenueINR = projectFinancials
    .filter((f) => f.type === "revenue" && f.currency === "INR")
    .reduce((sum, f) => sum + f.amount, 0)
  const totalCostINR = projectFinancials
    .filter((f) => f.type === "cost" && f.currency === "INR")
    .reduce((sum, f) => sum + f.amount, 0)

  const revenueByMonth: Record<string, { month: string; revenue: number; cost: number }> = {}
  projectFinancials.forEach((f) => {
    const month = f.date.slice(0, 7)
    if (!revenueByMonth[month]) {
      revenueByMonth[month] = { month, revenue: 0, cost: 0 }
    }
    if (f.type === "revenue" && f.currency === "INR") {
      revenueByMonth[month].revenue += f.amount
    }
    if (f.type === "cost" && f.currency === "INR") {
      revenueByMonth[month].cost += f.amount
    }
  })
  const chartData = Object.values(revenueByMonth).sort((a, b) =>
    a.month.localeCompare(b.month)
  )

  const stageStats = ["idea", "research", "domain", "setup", "build", "seo", "deploy", "monetize", "monitor"].map(
    (stage) => {
      const st = projectTasks.filter((t) => t.stage === stage)
      const done = st.filter((t) => t.status === "done").length
      return { stage: stage.charAt(0).toUpperCase() + stage.slice(1), total: st.length, done }
    }
  )

  const apiNote = (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
      <p>
        <strong className="text-foreground">API Integration Coming Soon:</strong> Google Analytics, Search Console, and AdSense API
        integration will auto-pull real stats. For now, use the Finance page to manually track revenue.
      </p>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/projects/${projectId}`}>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl tracking-tight">
            Stats — {project.name}
          </h1>
          <p className="text-muted-foreground text-sm">Analytics and performance tracking</p>
        </div>
      </div>

      {apiNote}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Revenue (INR)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading tracking-tight text-mer-green">{formatCurrency(totalRevenueINR, "INR")}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Cost (INR)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading tracking-tight text-mer-rust">{formatCurrency(totalCostINR, "INR")}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Net Profit (INR)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-heading tracking-tight ${totalRevenueINR - totalCostINR >= 0 ? "text-mer-green" : "text-mer-rust"}`}>
              {formatCurrency(totalRevenueINR - totalCostINR, "INR")}
            </div>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading">Revenue vs Costs (Monthly)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 12 }} />
                <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#3E7C54" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cost" name="Cost" fill="#925248" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading">Task Completion by Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stageStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" className="text-xs" tick={{ fontSize: 12 }} />
              <YAxis dataKey="stage" type="category" width={80} className="text-xs" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              />
              <Legend />
              <Bar dataKey="done" name="Completed" fill="#487A74" radius={[0, 4, 4, 0]} stackId="a" />
              <Bar dataKey="total" name="Total" fill="var(--muted)" radius={[0, 4, 4, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {chartData.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground">
              No financial data yet. Add entries in the Finance tab to see charts.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}