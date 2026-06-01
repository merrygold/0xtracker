"use client"

import { useState } from "react"
import { STAGES, STAGE_CHECKLISTS, STAGE_TIPS, type ProjectStage } from "@/lib/types"
import { getStageColor, getStageLabel, getStageDotColor, getStageColors } from "@/lib/helpers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, AlertTriangle, Lightbulb, ExternalLink, Copy } from "lucide-react"
import { SEO_PROMPT_TEMPLATE, AI_BUILD_PROMPT_TEMPLATE } from "@/lib/types"

export default function ReferencePage() {
  const [activeStage, setActiveStage] = useState<ProjectStage>("idea")
  const checklist = STAGE_CHECKLISTS[activeStage]
  const tips = STAGE_TIPS[activeStage]
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedPrompt(id)
    setTimeout(() => setCopiedPrompt(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl tracking-tight">Reference Guide</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Complete checklists, tips, and prompts for building microtool websites
        </p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1">
        {STAGES.map((stage) => {
          const colors = getStageColors(stage.key)
          return (
            <Button
              key={stage.key}
              variant={activeStage === stage.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveStage(stage.key)}
              className="whitespace-nowrap gap-1.5"
            >
              <div className={`h-2 w-2 rounded-full ${colors.dot}`} />
              {stage.label}
            </Button>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-heading text-lg tracking-tight">Checklist — {getStageLabel(activeStage)}</h2>
          <Card className="border-border/50">
            <CardContent className="p-4 space-y-3">
              {checklist.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-[10px] font-medium text-muted-foreground mt-0.5 stage-number">
                    {index + 1}
                  </div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="font-heading text-lg tracking-tight flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-mer-gold" />
            Tips
          </h2>

          <Card className="border-mer-green/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-mer-green dark:text-mer-green-light flex items-center gap-2">
                <Check className="h-4 w-4" /> Do&apos;s
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ul className="space-y-2">
                {tips.dos.map((doItem, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <Check className="h-4 w-4 text-mer-green mt-0.5 shrink-0" />
                    <span>{doItem}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-mer-rust/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-mer-rust dark:text-mer-rust-light flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Don&apos;ts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ul className="space-y-2">
                {tips.donts.map((dontItem, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-mer-rust mt-0.5 shrink-0" />
                    <span>{dontItem}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {activeStage === "build" && (
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  AI Build Prompt Template
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(AI_BUILD_PROMPT_TEMPLATE, "build")}
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
                <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
                  {AI_BUILD_PROMPT_TEMPLATE}
                </pre>
              </CardContent>
            </Card>
          )}

          {activeStage === "seo" && (
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  SEO Prompt Template
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(SEO_PROMPT_TEMPLATE, "seo")}
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
                <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
                  {SEO_PROMPT_TEMPLATE}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}