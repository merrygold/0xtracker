"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { FINANCIAL_CATEGORIES, type Project } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/helpers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function FinancePage() {
  const params = useParams()
  const projectId = params.id as string
  const { projects, financials, addFinancial, deleteFinancial } = useAppStore()

  const project = projects.find((p) => p.id === projectId)
  const projectFinancials = financials.filter((f) => f.projectId === projectId)

  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    type: "cost" as "cost" | "revenue",
    category: "domain" as string,
    amount: "",
    currency: "INR" as "INR" | "USD",
    date: new Date().toISOString().split("T")[0],
    source: "",
    notes: "",
  })

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

  const totalRevenueINR = projectFinancials
    .filter((f) => f.type === "revenue" && f.currency === "INR")
    .reduce((sum, f) => sum + f.amount, 0)
  const totalRevenueUSD = projectFinancials
    .filter((f) => f.type === "revenue" && f.currency === "USD")
    .reduce((sum, f) => sum + f.amount, 0)
  const totalCostINR = projectFinancials
    .filter((f) => f.type === "cost" && f.currency === "INR")
    .reduce((sum, f) => sum + f.amount, 0)
  const totalCostUSD = projectFinancials
    .filter((f) => f.type === "cost" && f.currency === "USD")
    .reduce((sum, f) => sum + f.amount, 0)
  const profitINR = totalRevenueINR - totalCostINR
  const profitUSD = totalRevenueUSD - totalCostUSD

  const handleAdd = () => {
    if (!form.amount || isNaN(Number(form.amount))) return
    addFinancial({
      projectId,
      type: form.type,
      category: form.category as "domain" | "hosting" | "api" | "adsense" | "other",
      amount: Number(form.amount),
      currency: form.currency,
      date: form.date,
      source: form.source,
      notes: form.notes,
    })
    setShowAdd(false)
    setForm({
      type: "cost",
      category: "domain",
      amount: "",
      currency: "INR",
      date: new Date().toISOString().split("T")[0],
      source: "",
      notes: "",
    })
  }

  const sortedFinancials = [...projectFinancials].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/projects/${projectId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Financials — {project.name}
          </h1>
          <p className="text-muted-foreground text-sm">Track costs and revenue</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(totalRevenueINR, "INR")}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(totalRevenueUSD, "USD")} USD</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Costs</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(totalCostINR, "INR")}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(totalCostUSD, "USD")} USD</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-xl font-bold ${profitINR >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(profitINR, "INR")}
            </div>
            <p className={`text-xs ${profitUSD >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(profitUSD, "USD")} USD
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ROI</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {totalCostINR > 0
                ? `${Math.round((profitINR / totalCostINR) * 100)}%`
                : "—"}
            </div>
            <p className="text-xs text-muted-foreground">Return on investment</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Transactions</h2>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {showAdd && (
        <Card>
          <CardHeader>
            <CardTitle>Add Financial Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm({ ...form, type: v as "cost" | "revenue" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cost">Cost</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v ?? "domain" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FINANCIAL_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={form.currency}
                  onValueChange={(v) => setForm({ ...form, currency: v as "INR" | "USD" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Source</Label>
                <Input
                  placeholder="e.g., Namecheap, Google AdSense"
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Optional notes..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={!form.amount}>
                Save Entry
              </Button>
              <Button variant="outline" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {sortedFinancials.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No transactions yet</h3>
            <p className="text-sm text-muted-foreground">
              Track your domain costs, hosting, and AdSense revenue
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {sortedFinancials.map((f) => (
            <Card key={f.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      f.type === "revenue"
                        ? "bg-green-500/15 text-green-600"
                        : "bg-red-500/15 text-red-600"
                    }`}
                  >
                    {f.type === "revenue" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {f.category.charAt(0).toUpperCase() + f.category.slice(1)}
                      {f.source && ` — ${f.source}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(f.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-semibold ${
                      f.type === "revenue" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {f.type === "revenue" ? "+" : "-"}
                    {formatCurrency(f.amount, f.currency)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => deleteFinancial(f.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}