export type ProjectStage =
  | "idea"
  | "research"
  | "domain"
  | "setup"
  | "build"
  | "seo"
  | "deploy"
  | "monetize"
  | "monitor"

export const STAGES: { key: ProjectStage; label: string; icon: string }[] = [
  { key: "idea", label: "Idea", icon: "Lightbulb" },
  { key: "research", label: "Research", icon: "Search" },
  { key: "domain", label: "Domain", icon: "Globe" },
  { key: "setup", label: "Setup", icon: "Settings" },
  { key: "build", label: "Build", icon: "Code" },
  { key: "seo", label: "SEO", icon: "FileText" },
  { key: "deploy", label: "Deploy", icon: "Rocket" },
  { key: "monetize", label: "Monetize", icon: "DollarSign" },
  { key: "monitor", label: "Monitor", icon: "Activity" },
]

export type TaskStatus = "todo" | "in_progress" | "done" | "blocked"

export interface Project {
  id: string
  name: string
  domain: string
  mainKeyword: string
  stage: ProjectStage
  status: "active" | "paused" | "completed"
  competitorUrls: string[]
  supportingKeywords: string[]
  faqQuestions: string[]
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  projectId: string
  stage: ProjectStage
  title: string
  description: string
  status: TaskStatus
  sortOrder: number
  notes: string
  links: string[]
  checklistItems: ChecklistItem[]
  createdAt: string
  updatedAt: string
}

export interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

export interface Financial {
  id: string
  projectId: string
  type: "cost" | "revenue"
  category: "domain" | "hosting" | "api" | "adsense" | "other"
  amount: number
  currency: "INR" | "USD"
  date: string
  source: string
  notes: string
  createdAt: string
}

export interface AnalyticsEntry {
  id: string
  projectId: string
  date: string
  source: "GA" | "SC" | "ADSENSE"
  pageViews: number | null
  users: number | null
  clicks: number | null
  impressions: number | null
  position: number | null
  revenue: number | null
  country: string | null
}

export interface DomainResearch {
  id: string
  projectId: string
  domainName: string
  available: boolean
  purchased: boolean
  purchaseDate: string | null
  registrar: string | null
  cost: number | null
  currency: "INR" | "USD" | null
  expiryDate: string | null
  notes: string
}

export const STAGE_CHECKLISTS: Record<ProjectStage, string[]> = {
  idea: [
    "Identify a personal or observed problem",
    "Search Google for existing solutions",
    "Analyze 3-5 competitor websites and note gaps",
    "Validate that the problem is small (less competition)",
    "Check if competitors have poor UI/UX you can improve",
  ],
  research: [
    "Use Ahrefs Keyword Generator to validate keyword",
    "Check search volume (aim for 500+ monthly US)",
    "Collect 10-20 supporting keywords",
    "Collect FAQ questions from Ahrefs Questions tab",
    "Check Google 'People Also Ask' for more questions",
    "Note: target US audience for higher CPM",
    "Validate keyword is not too competitive",
  ],
  domain: [
    "Search instantdomainsearch.com with main keyword",
    "Only consider .com domains",
    "Ensure main keyword is IN the domain name",
    "Try keyword + 'online', 'free', 'real' prefixes/suffixes",
    "Avoid long domain names",
    "DON'T buy until code is complete",
    "Purchase via Namecheap/GoDaddy (after code works)",
  ],
  setup: [
    "Install Git",
    "Install VS Code",
    "Install Node.js",
    "Get free AI coding tool (Cursor/Claude Code/Gemini CLI)",
    "Create project folder named after domain",
    "Initialize Astro JS project",
    "Add Vercel design.md",
    "Add Web Design Guidelines skill",
    "Add Tailwind v4 docs skill",
    "Add Astro JS MCP server",
  ],
  build: [
    "Write AI prompt with competitor links + requirements",
    "Run prompt in AI agent",
    "Test locally (npm run dev)",
    "Fix bugs iteratively (clear session per issue)",
    "Add dark mode with toggle",
    "Make mobile responsive (test with DevTools)",
    "Add device/auto-calibration feature",
    "Ensure multi-page (not SPA) for SEO",
    "Create favicon with Logofa.st",
    "Generate all favicon sizes with Real Favicon Generator",
    "Add favicon files to public/ directory",
    "Add favicon HTML to project",
  ],
  seo: [
    "Write 600+ words of content around main keyword",
    "Include all supporting keywords naturally",
    "Add FAQ section with structured data (Schema.org)",
    "Add meta tags, Open Graph, title, description",
    "Run SEO prompt through AI agent",
    "Verify all headings include keywords",
    "Add alt text to all images",
    "Create sitemap.xml",
    "Create robots.txt",
  ],
  deploy: [
    "Deploy to Cloudflare (free, fast CDN)",
    "Connect purchased domain",
    "Submit to Google Search Console",
    "Submit to Bing Webmaster Tools",
    "Add Google Analytics tracking code",
    "Test website speed with PageSpeed Insights",
    "Verify HTTPS and SSL certificate",
  ],
  monetize: [
    "Apply for Google AdSense",
    "Follow AdSense approval guidelines",
    "Add AdSense code to website",
    "Add Privacy Policy page",
    "Add Terms of Service page",
    "Add About page",
    "Add Contact page",
    "Track earnings monthly",
  ],
  monitor: [
    "Check Search Console for rankings",
    "Check Analytics for traffic",
    "Check AdSense for revenue",
    "Add new features based on user feedback",
    "Fix bugs reported by users",
    "Improve SEO based on Search Console data",
    "Wait 4-6 months for ranking results",
    "Consider building complementary tools",
  ],
}

export const STAGE_TIPS: Record<ProjectStage, { dos: string[]; donts: string[] }> = {
  idea: {
    dos: [
      "Find problems you personally experience",
      "Look for small, specific problems (less competition)",
      "Check if existing solutions have poor UI/UX",
      "Focus on tools that don't require paid APIs",
    ],
    donts: [
      "Don't jump to big, complex problems",
      "Don't build something that needs expensive APIs",
      "Don't skip competitor research",
    ],
  },
  research: {
    dos: [
      "Use Ahrefs Keyword Generator for free keyword data",
      "Target US audience for higher CPM rates",
      "Collect LSI/supporting keywords for better ranking",
      "Use 'People Also Ask' for FAQ content",
    ],
    donts: [
      "Don't skip keyword validation",
      "Don't include invalid/irrelevant keywords",
      "Don't target keywords with zero search volume",
    ],
  },
  domain: {
    dos: [
      "Only buy .com domains (best for SEO)",
      "Include your main keyword in the domain",
      "Buy from Namecheap or GoDaddy",
      "Wait until code is complete before buying",
    ],
    donts: [
      "Don't buy domains before finishing the website",
      "Don't use .net, .org, .io for this purpose",
      "Don't choose long domain names",
      "Don't skip checking domain availability first",
    ],
  },
  setup: {
    dos: [
      "Use Astro JS (most SEO-friendly framework)",
      "Add Vercel design.md for better AI output",
      "Add Web Design Guidelines skill",
      "Add Tailwind v4 docs skill",
      "Use Astro JS MCP server for latest docs",
    ],
    donts: [
      "Don't use Next.js for SEO-focused microtools",
      "Don't skip the skills/MCP setup steps",
      "Don't code manually — use AI agents",
    ],
  },
  build: {
    dos: [
      "Use Claude Code / Cursor / Gemini CLI for coding",
      "Clear session with /clear between tasks",
      "Test on mobile (most users will be on mobile)",
      "Add dark mode (users expect it)",
      "Make it multi-page (NOT SPA) for SEO",
      "Add favicon for branding",
    ],
    donts: [
      "Don't build single-page apps for SEO sites",
      "Don't skip mobile responsiveness",
      "Don't skip favicon creation",
      "Don't use free domains — buy a .com",
    ],
  },
  seo: {
    dos: [
      "Write 600+ words of keyword-rich content",
      "Use structured data (Schema.org) for FAQs",
      "Include all supporting keywords naturally",
      "Add proper meta tags and Open Graph tags",
      "Create sitemap.xml and robots.txt",
    ],
    donts: [
      "Don't keyword-stuff your content",
      "Don't skip structured data",
      "Don't forget alt text on images",
    ],
  },
  deploy: {
    dos: [
      "Use Cloudflare for free, fast hosting",
      "Submit to both Google and Bing search consoles",
      "Add Google Analytics from day one",
      "Test website speed before going live",
    ],
    donts: [
      "Don't pay for hosting (Cloudflare is free)",
      "Don't skip search console submissions",
      "Don't forget HTTPS/SSL setup",
    ],
  },
  monetize: {
    dos: [
      "Apply for AdSense after getting some traffic",
      "Add Privacy Policy, Terms, About, Contact pages",
      "Follow AdSense guidelines strictly",
      "Track earnings monthly per project",
    ],
    donts: [
      "Don't apply for AdSense too early",
      "Don't click your own ads",
      "Don't skip the required policy pages",
    ],
  },
  monitor: {
    dos: [
      "Check Search Console weekly",
      "Wait 4-6 months for ranking results",
      "Iterate based on data, not feelings",
      "Build complementary tools for internal linking",
    ],
    donts: [
      "Don't expect instant results",
      "Don't abandon projects before 6 months",
      "Don't ignore user feedback",
    ],
  },
}

export const FINANCIAL_CATEGORIES = [
  { value: "domain", label: "Domain" },
  { value: "hosting", label: "Hosting" },
  { value: "api", label: "API Costs" },
  { value: "adsense", label: "AdSense Revenue" },
  { value: "other", label: "Other" },
] as const

export const SEO_PROMPT_TEMPLATE = `You are an expert SEO content writer. Write SEO-optimized content for a microtool website.

Main Keyword: {{MAIN_KEYWORD}}
Supporting Keywords: {{SUPPORTING_KEYWORDS}}

Requirements:
1. Write at least 600 words of natural, helpful content
2. Include the main keyword in the title, H1, and at least 2-3 H2 headings
3. Naturally incorporate supporting keywords throughout the content
4. Include an introduction that explains what the tool does
5. Include a "How to Use" section
6. Include a "Why Use Our Tool" section
7. Add proper meta title (under 60 chars) and meta description (under 160 chars)
8. Use proper heading hierarchy (H1, H2, H3)
9. Make content user-focused, not keyword-stuffed
10. Include internal linking suggestions

Format the output as:
---
META_TITLE: [your meta title]
META_DESCRIPTION: [your meta description]
---
[Your content here]
`

export const AI_BUILD_PROMPT_TEMPLATE = `I want to build a microtool website called {{DOMAIN}}.

Website Purpose: {{DESCRIPTION}}
Main Keyword: {{MAIN_KEYWORD}}

Competitor Websites:
{{COMPETITOR_URLS}}

Requirements:
1. Build using Astro JS with Tailwind CSS
2. Make it SEO-friendly (multi-page, NOT SPA)
3. Make it mobile responsive
4. Add dark mode with toggle (keyboard shortcut: D)
5. Include proper meta tags, Open Graph tags
6. Add structured data (Schema.org)
7. Make it better than the competitor websites listed above
8. Add keyboard shortcuts for key features
9. Auto-calibration feature for device detection
10. Clean, modern UI following Vercel design guidelines

The website should be a complete, production-ready tool that solves the user's problem better than the competitors.
`