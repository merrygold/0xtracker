"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { STAGES, type ProjectStage } from "@/lib/types"
import { getStageColor, getStageLabel, getStageDotColor, getStageColors } from "@/lib/helpers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Check, Compass } from "lucide-react"

export default function NewProjectPage() {
  const router = useRouter()
  const addProject = useAppStore((s) => s.addProject)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: "",
    domain: "",
    mainKeyword: "",
    stage: "idea" as ProjectStage,
    competitorUrls: "",
    supportingKeywords: "",
    faqQuestions: "",
  })

  const steps = ["Basic Info", "Keywords & Competitors", "Review & Create"]

  const handleCreate = () => {
    const competitorUrls = form.competitorUrls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean)
    const supportingKeywords = form.supportingKeywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)
    const faqQuestions = form.faqQuestions
      .split("\n")
      .map((q) => q.trim())
      .filter(Boolean)

    const id = addProject({
      name: form.name,
      domain: form.domain,
      mainKeyword: form.mainKeyword,
      stage: form.stage,
      status: "active",
      competitorUrls,
      supportingKeywords,
      faqQuestions,
    })

    router.push(`/projects/${id}`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-3xl tracking-tight">Create New Project</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Set up a new microtool website project
        </p>
      </div>

      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium transition-all duration-200 ${
                i < step
                  ? "bg-primary text-primary-foreground"
                  : i === step
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:block ${i === step ? "font-medium text-primary" : "text-muted-foreground"}`}>
              {s}
            </span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-border mx-1" />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-heading">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground">Project Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Real Online Ruler"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain" className="text-xs uppercase tracking-wider text-muted-foreground">Domain Name</Label>
              <Input
                id="domain"
                placeholder="e.g., realonlineruler.com"
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Only buy the domain after finishing the website. This is just for tracking.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyword" className="text-xs uppercase tracking-wider text-muted-foreground">Main Keyword *</Label>
              <Input
                id="keyword"
                placeholder="e.g., online ruler"
                value={form.mainKeyword}
                onChange={(e) => setForm({ ...form, mainKeyword: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Starting Stage</Label>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((s) => {
                  const colors = getStageColors(s.key)
                  return (
                    <Badge
                      key={s.key}
                      variant={form.stage === s.key ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-150 ${form.stage !== s.key ? getStageColor(s.key) : ""}`}
                      onClick={() => setForm({ ...form, stage: s.key })}
                    >
                      <div className={`h-2 w-2 rounded-full mr-1.5 ${colors.dot}`} />
                      {s.label}
                    </Badge>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-heading">Keywords & Competitors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="competitors" className="text-xs uppercase tracking-wider text-muted-foreground">Competitor URLs (one per line)</Label>
              <Textarea
                id="competitors"
                placeholder={`https://ruler-online.net\nhttps://online-ruler.com`}
                rows={4}
                value={form.competitorUrls}
                onChange={(e) => setForm({ ...form, competitorUrls: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Paste competitor URLs. Your AI agent will analyze them to build better.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords" className="text-xs uppercase tracking-wider text-muted-foreground">Supporting Keywords (comma separated)</Label>
              <Textarea
                id="keywords"
                placeholder="ruler online, online ruler cm, ruler inches, measure online..."
                rows={3}
                value={form.supportingKeywords}
                onChange={(e) => setForm({ ...form, supportingKeywords: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Find these using Ahrefs Keyword Generator. Only include relevant keywords.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="faqs" className="text-xs uppercase tracking-wider text-muted-foreground">FAQ Questions (one per line)</Label>
              <Textarea
                id="faqs"
                placeholder={`How accurate is an online ruler?\nHow do I calibrate my screen for measurement?\nCan I measure in both inches and centimeters?`}
                rows={4}
                value={form.faqQuestions}
                onChange={(e) => setForm({ ...form, faqQuestions: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                From Ahrefs Questions tab and Google &quot;People Also Ask&quot;
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-heading">Review & Create</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{form.name || "—"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Domain</span>
                <span className="font-medium">{form.domain || "—"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Main Keyword</span>
                <span className="font-medium">{form.mainKeyword || "—"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Stage</span>
                <Badge variant="outline" className={getStageColor(form.stage)}>
                  {getStageLabel(form.stage)}
                </Badge>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Competitors</span>
                <span className="font-medium stage-number">
                  {form.competitorUrls.split("\n").filter(Boolean).length} URLs
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Supporting Keywords</span>
                <span className="font-medium stage-number">
                  {form.supportingKeywords.split(",").filter(Boolean).length} keywords
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">FAQ Questions</span>
                <span className="font-medium stage-number">
                  {form.faqQuestions.split("\n").filter(Boolean).length} questions
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm">
                A checklist with all tasks for each of the 9 pipeline stages will be automatically created.
                You can customize and add more tasks after creation.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => step > 0 ? setStep(step - 1) : router.push("/projects")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {step > 0 ? "Back" : "Cancel"}
        </Button>

        {step < steps.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} disabled={step === 0 && !form.name}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleCreate} disabled={!form.name || !form.mainKeyword}>
            Create Project
          </Button>
        )}
      </div>
    </div>
  )
}