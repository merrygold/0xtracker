"use client"

import { useState } from "react"
import { STAGES, STAGE_CHECKLISTS, STAGE_TIPS, type ProjectStage } from "@/lib/types"
import { getStageColor, getStageLabel, getStageDotColor } from "@/lib/helpers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Check, AlertTriangle, Lightbulb, ExternalLink } from "lucide-react"
import { SEO_PROMPT_TEMPLATE, AI_BUILD_PROMPT_TEMPLATE } from "@/lib/types"

export default function ReferencePage() {
  const [activeStage, setActiveStage] = useState<ProjectStage>("idea")
  const checklist = STAGE_CHECKLISTS[activeStage]
  const tips = STAGE_TIPS[activeStage]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reference Guide</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Complete checklists, tips, and prompts for building microtool websites
        </p>
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
          <h2 className="text-lg font-semibold">Checklist — {getStageLabel(activeStage)}</h2>
          <Card>
            <CardContent className="p-4 space-y-3">
              {checklist.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Tips
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

          {activeStage === "build" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">AI Build Prompt Template</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
                  {AI_BUILD_PROMPT_TEMPLATE}
                </pre>
              </CardContent>
            </Card>
          )}

          {activeStage === "seo" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">SEO Prompt Template</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
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