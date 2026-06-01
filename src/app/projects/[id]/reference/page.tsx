"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { STAGES, STAGE_CHECKLISTS, STAGE_TIPS, type ProjectStage } from "@/lib/types"
import { getStageColor, getStageLabel, getStageDotColor } from "@/lib/helpers"
import { AI_BUILD_PROMPT_TEMPLATE, SEO_PROMPT_TEMPLATE } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Copy, Check, Lightbulb, AlertTriangle, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function ReferencePage() {
  const params = useParams()
  const projectId = params.id as string
  const { projects, tasks, updateTask } = useAppStore()

  const project = projects.find((p) => p.id === projectId)
  const [activeStage, setActiveStage] = useState<ProjectStage>("idea")
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null)

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

  const projectTasks = tasks.filter(
    (t) => t.projectId === projectId && t.stage === activeStage
  )

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedPrompt(id)
    setTimeout(() => setCopiedPrompt(null), 2000)
  }

  const buildPrompt = AI_BUILD_PROMPT_TEMPLATE
    .replace("{{DOMAIN}}", project.domain || "my-tool.com")
    .replace("{{DESCRIPTION}}", `A ${project.mainKeyword} microtool website`)
    .replace("{{MAIN_KEYWORD}}", project.mainKeyword)
    .replace(
      "{{COMPETITOR_URLS}}",
      project.competitorUrls.map((url) => `- ${url}`).join("\n") || "None provided"
    )

  const seoPrompt = SEO_PROMPT_TEMPLATE
    .replace("{{MAIN_KEYWORD}}", project.mainKeyword)
    .replace(
      "{{SUPPORTING_KEYWORDS}}",
      project.supportingKeywords.join(", ") || "None provided"
    )

  const tips = STAGE_TIPS[activeStage]
  const checklist = STAGE_CHECKLISTS[activeStage]

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
            Reference — {project.name}
          </h1>
          <p className="text-muted-foreground text-sm">Checklists, tips, and prompts for each stage</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {STAGES.map((stage) => (
          <Button
            key={stage.key}
            variant={activeStage === stage.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveStage(stage.key)}
            className="whitespace-nowrap"
          >
            <div className={`h-2 w-2 rounded-full mr-2 ${getStageDotColor(stage.key)}`} />
            {stage.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Checkbox disabled checked className="h-4 w-4" />
            Stage Checklist
          </h2>
          <Card>
            <CardContent className="p-4 space-y-3">
              {checklist.map((item, index) => {
                const matchingTask = projectTasks.find((t) => t.title === item)
                const isChecked = matchingTask?.status === "done"

                return (
                  <div key={index} className="flex items-start gap-3">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        if (matchingTask) {
                          updateTask(matchingTask.id, {
                            status: checked ? "done" : "todo",
                          })
                        }
                      }}
                    />
                    <span
                      className={`text-sm ${
                        isChecked ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {item}
                    </span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Do&apos;s & Don&apos;ts
            </h2>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
                  <Check className="h-4 w-4" /> Do&apos;s
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <ul className="space-y-2">
                  {tips.dos.map((doItem, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{doItem}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Don&apos;ts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <ul className="space-y-2">
                  {tips.donts.map((dontItem, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>{dontItem}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {(activeStage === "build" || activeStage === "seo") && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Copy className="h-5 w-5" />
                Ready-to-use Prompts
              </h2>

              {activeStage === "build" && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      AI Build Prompt
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(buildPrompt, "build")}
                      >
                        {copiedPrompt === "build" ? (
                          <><Check className="h-3.5 w-3.5 mr-1" /> Copied</>
                        ) : (
                          <><Copy className="h-3.5 w-3.5 mr-1" /> Copy</>
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
                      {buildPrompt}
                    </pre>
                  </CardContent>
                </Card>
              )}

              {activeStage === "seo" && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      SEO Prompt
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(seoPrompt, "seo")}
                      >
                        {copiedPrompt === "seo" ? (
                          <><Check className="h-3.5 w-3.5 mr-1" /> Copied</>
                        ) : (
                          <><Copy className="h-3.5 w-3.5 mr-1" /> Copy</>
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
                      {seoPrompt}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeStage === "domain" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Domain Research Tools</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <a
                  href="https://instantdomainsearch.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  instantdomainsearch.com — Search for .com domains
                </a>
                <a
                  href="https://www.namecheap.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Namecheap — Buy domains (credit card)
                </a>
                <a
                  href="https://www.godaddy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  GoDaddy — Buy domains (UPI option)
                </a>
              </CardContent>
            </Card>
          )}

          {activeStage === "setup" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Setup Resources</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <a
                  href="https://astro.build"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Astro JS — SEO-friendly framework
                </a>
                <a
                  href="https://vercel.com/design"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Vercel design.md — Design guidelines
                </a>
                <a
                  href="https://cursor.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Cursor — AI code editor
                </a>
                <a
                  href="https://claude.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Claude Code — AI coding agent
                </a>
              </CardContent>
            </Card>
          )}

          {activeStage === "build" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Build Tools</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <a
                  href="https://logofa.st"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Logofa.st — Create favicons
                </a>
                <a
                  href="https://realfavicongenerator.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Real Favicon Generator — Generate all favicon sizes
                </a>
              </CardContent>
            </Card>
          )}

          {activeStage === "research" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Research Tools</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <a
                  href="https://ahrefs.com/keyword-generator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Ahrefs Keyword Generator — Free keyword research
                </a>
              </CardContent>
            </Card>
          )}

          {activeStage === "deploy" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Deployment Resources</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <a
                  href="https://pages.cloudflare.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Cloudflare Pages — Free hosting
                </a>
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Google Search Console
                </a>
                <a
                  href="https://www.bing.com/webmasters"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Bing Webmaster Tools
                </a>
                <a
                  href="https://analytics.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Google Analytics
                </a>
              </CardContent>
            </Card>
          )}

          {activeStage === "monetize" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Monetization Resources</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <a
                  href="https://www.google.com/adsense"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Google AdSense — Apply for ad revenue
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}