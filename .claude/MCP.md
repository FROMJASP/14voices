## Available MCP Configuration for 14Voices

```yaml
Available MCPs (Check These):
  Sequential: --seq (Complex analysis and systematic thinking)
  Magic: --magic (UI component generation)
  Playwright: --playwright (Browser automation and testing)

Not Available:
  Context7: --c7 (MCP not found in your instance)

Documentation Strategy Without Context7:
  Manual Docs: Your .claude/docs/ patterns for ALL external libraries
  WebSearch: For latest documentation when needed
  Local Knowledge: Claude's built-in knowledge for stable libraries
  Official Sources: Direct links to documentation when researching
```

## Available MCP Workflows for 14Voices

```yaml
Sequential + Magic Workflow:
  /persona:refactorer --seq --magic "Systematically analyze component duplication and generate unified components"
  /persona:architect --seq "Deep analysis of domain-driven design improvements"
  /persona:analyzer --seq "Complex debugging with step-by-step reasoning"

Magic + Playwright Workflow:
  /persona:frontend --magic --playwright "Generate audio components and test across browsers"
  /persona:qa --magic --playwright "Create test components and validate with E2E testing"

Sequential + Playwright Workflow:
  /persona:performance --seq --playwright "Analyze performance bottlenecks and test with real metrics"
  /persona:qa --seq --playwright "Systematic testing approach with browser automation"

Pure Sequential (Most Reliable):
  /persona:architect --seq "Complex architectural analysis"
  /persona:analyzer --seq "Deep debugging and root cause analysis"
  /persona:refactorer --seq "Systematic code quality improvements"
```

## Playwright Integration for 14Voices Testing

````yaml
Playwright Use Cases for Voiceover Agency:
  Audio Playback Testing: Cross-browser demo streaming | Mobile audio controls | Autoplay policies | Progress bars
  Order Flow Validation: Complete customer journey | Form submissions | File uploads | Payment processing
  Performance Monitoring: Real User Metrics (RUM) | Core Web Vitals | Audio loading times | Mobile performance
  Visual Regression: Component screenshots | Layout consistency | Admin panel UI | Mobile responsiveness
  Accessibility Testing: Screen reader compatibility | Keyboard navigation | ARIA labels | Audio controls

14Voices-Specific Playwright Workflows:
  Demo Streaming: Test audio playback across Chrome/Firefox/Safari | Validate streaming performance | Check mobile controls
  Customer Journey: Browse → Listen → Order → Pay → Confirm (full E2E validation)
  Admin Panel: Test Payload admin customizations | Validate import map components | Check workflows
  Performance: Measure demo loading times | Test cache effectiveness | Monitor Core Web Vitals
  Mobile Experience: Touch interactions | Audio on mobile Safari | Progressive web app features

Playwright + VSCode Integration:
  /ide + Playwright → Run tests in real-time | Screenshot comparisons | Performance reports | Debug visually
  Live Testing: Edit components → Run Playwright tests → See results immediately → Iterate quickly
  CI Integration: Playwright tests in GitHub Actions | Visual regression detection | Performance budgets
```# MCP.md - Model Context Protocol Ops | 14Voices Focus

## Legend
| Symbol | Meaning | | Abbrev | Meaning |
|--------|---------|---|--------|---------|
| → | leads to | | ops | operations |
| & | and/with | | UI | user interface |
| w/ | with | | impl | implementation |

## Decision Matrix

```yaml
Flag Control:
  --c7: Force Context7→docs | --seq: Force Sequential→analysis | --magic: Force Magic→UI
  --pup: Force Puppeteer→browser | --all-mcp: Enable all | --no-mcp: Disable all

User Triggers (no flags):
  "docs for X" → C7(resolve-library-id: X) → get-docs
  "how to use Y in Z" → C7(resolve-library-id: Z) → get-docs(topic: Y)
  "need button/form/component" → Magic(builder) → integrate
  "why slow/broken" → Sequential(analysis) → impl fix
  "design architecture" → Sequential(system design) → C7(patterns)

14Voices Triggers:
  "Vercel build fails" → Sequential(build analysis) → C7(Next.js/Vercel docs) → native impl
  "Payload admin issue" → C7(resolve-library-id: payload) → get-docs → Magic for PROPER custom components
  "Stripe integration" → C7(resolve-library-id: stripe) → get-docs → Sequential(security analysis)
  "Audio streaming" → Sequential(performance analysis) → C7(optimization patterns)
  "Email automation" → C7(resolve-library-id: resend) → get-docs → Sequential(workflow design)

Context Triggers (flags override):
  Import errors → C7(resolve-library-id) → verify docs
  Complex debugging → Sequential(root cause) → native impl
  UI requests → Magic(builder/refiner) → Puppeteer(test) | EXCEPT Payload admin
  Performance issues → Sequential(analysis) → optimize impl
  Build failures → Sequential(environment analysis) → C7(build tools docs)
  Code duplication → Sequential(pattern analysis) → refactoring plan
  Payment flow → C7(Stripe docs) + Sequential(security analysis) → secure impl

Research-First (shared/research-first.yml):
  External lib detected → C7 lookup REQUIRED (blocks w/o docs)
  New component → Magic search REQUIRED or existing pattern | EXCEPT Payload admin components
  API integration → WebSearch REQUIRED for official docs
  Unknown pattern → Sequential thinking + research REQUIRED
  Confidence < 90% → Impl BLOCKED until research complete
  14Voices: Payload customization → C7(built-in features) BEFORE any custom impl
  Build tools → C7(official docs) BEFORE troubleshooting
  Payment processing → C7(Stripe docs) + Sequential(security) BEFORE impl
````

## Puppeteer Integration for 14Voices Testing

```yaml
Puppeteer Use Cases for Voiceover Agency:
  Audio Playback Testing: Cross-browser demo streaming | Mobile audio controls | Autoplay policies | Progress bars
  Order Flow Validation: Complete customer journey | Form submissions | File uploads | Payment processing
  Performance Monitoring: Real User Metrics (RUM) | Core Web Vitals | Audio loading times | Mobile performance
  Visual Regression: Component screenshots | Layout consistency | Admin panel UI | Mobile responsiveness
  Accessibility Testing: Screen reader compatibility | Keyboard navigation | ARIA labels | Audio controls

14Voices-Specific Puppeteer Workflows:
  Demo Streaming: Test audio playback across devices | Validate streaming performance | Check mobile controls
  Customer Journey: Browse → Listen → Order → Pay → Confirm (full E2E validation)
  Admin Panel: Test Payload admin customizations | Validate import map components | Check workflows
  Performance: Measure demo loading times | Test cache effectiveness | Monitor Core Web Vitals
  Mobile Experience: Touch interactions | Audio on mobile Safari | Progressive web app features

Puppeteer + VSCode Integration:
  /ide + Puppeteer → Run tests in real-time | Screenshot comparisons | Performance reports | Debug visually
  Live Testing: Edit components → Run Puppeteer tests → See results immediately → Iterate quickly
  CI Integration: Puppeteer tests in GitHub Actions | Visual regression detection | Performance budgets
```

## Context7 + Puppeteer Workflows

```yaml
Advanced Testing Patterns:
  Component Testing: Magic(create component) → Puppeteer(validate functionality) → Performance(measure impact)
  Audio Optimization: Sequential(analyze performance) → Puppeteer(test real-world usage) → Optimize based on data
  Customer Experience: Design with user journey → Puppeteer(validate complete flow) → Measure conversion rates
  Cross-Browser: Puppeteer tests across Chrome/Firefox/Safari → Validate audio streaming compatibility

Puppeteer MCP Automation:
  --pup flag triggers: UI component generation → Puppeteer validation → Performance measurement → Screenshots
  E2E Workflows: Order flow changes → Puppeteer full journey test → Payment validation → Email confirmation
  Performance Testing: Code changes → Puppeteer Core Web Vitals → Cache effectiveness → Mobile performance
  Visual Testing: Component updates → Puppeteer screenshots → Visual diff → Regression detection
```

## VSCode + Context7 Workflow

```yaml
IDE-Enhanced Documentation:
  /ide + C7 resolve-library-id → get real-time docs → apply to files → test immediately
  Multi-File Updates: C7 patterns → apply across domain → validate TypeScript → test build
  Library Upgrades: C7 migration guides → systematic updates → validation → deployment

14Voices-Specific C7 Patterns:
  Payload Beta Issues: C7 resolve-library-id("payload") → get-docs(topic:"v3-migration") → apply fixes
  Next.js 15 Features: C7 resolve-library-id("next") → get-docs(topic:"app-router-15") → optimization
  React 19 Patterns: C7 resolve-library-id("react") → get-docs(topic:"concurrent-features") → implementation
  Tailwind v4 Syntax: C7 resolve-library-id("tailwindcss") → get-docs(topic:"v4-syntax") → component updates

Performance Optimization:
  C7 Session Caching: Cache docs for session | Avoid repeated fetches | Progressive loading
  Selective Fetching: Only fetch when needed | Skip stable libraries | Focus on changing APIs
  Local Patterns: Cache 14Voices-specific patterns | Business logic | Domain conventions
  Offline Support: Manual .claude/docs backup | Critical patterns cached | Never blocked
```

## 14Voices Architecture Patterns

```yaml
14Voices Architecture Patterns:
  Domain Analysis: /ide + Sequential(architecture review) + C7(DDD patterns) + multi-file updates
  Performance Optimization: /ide + Sequential(bottleneck analysis) + real-time monitoring + instant fixes
  Component Refactoring: /ide + identify duplications + extract to shared/ + update all references
  Security Hardening: /ide + vulnerability scan + apply Zod schemas + test validation
  Cache Strategy: /ide + analyze performance + optimize Redis patterns + monitor metrics

Current Architecture Integration:
  Domain Layer: /ide access to repositories/services + real-time modifications + type updates
  Component Layer: Navigate shared/unified + extract patterns + batch updates + instant validation
  Infrastructure: Edit cache/email/db layers + optimize performance + test immediately
  Security: Update middleware/validation + apply security patterns + test endpoints
  Performance: Monitor /api/cache/metrics + optimize queries + validate improvements
```

Code Quality:
Trigger: "Duplication" | "Refactoring" | "Code cleanup"
Flow: Sequential(pattern analysis) → identify extraction opportunities → native refactor
Focus: Component extraction → Utility consolidation → Pattern standardization

````

## Token Economics & 14Voices Priorities

```yaml
Budget: Native:0 | Light MCP:100-500 | Medium MCP:500-2K | Heavy MCP:2K-10K
Escalation: 1.Native first simple tasks 2.C7 lib questions 3.Sequential complex analysis 4.Combine MCPs synergy
Abort: >50% context→native | MCP timeout/error→fallback | Diminishing returns→stop MCP
Cost: Quick→C7 only | Architecture→Sequential | UI→Magic | Else→Native
UltraCompressed: --uc flag|High context|Token budget | ~70% reduction | Clarity→conciseness | Legend auto-gen

14Voices Priority Spending:
  HIGH: Build debugging (Sequential) | Payment security (C7+Sequential) | Order flow (Multi-MCP)
  MEDIUM: Audio optimization (Sequential) | Email automation (C7) | Performance analysis (Sequential+Puppeteer)
  LOW: General UI components (Magic) | Documentation (C7) | Simple configs (Native)
  BANNED: Payload admin customization (any MCP) | Speculative optimization | Non-critical features
````

## Quality Control & 14Voices Standards

```yaml
C7: ✓Relevant docs→Proceed | ⚠Partial→Try different terms | ✗No match→Sequential alternatives
Sequential: ✓Clear analysis+steps→Impl | ⚠Partial→Continue thoughts | ✗Unclear/timeout→Native+user questions
Magic: ✓Component matches→Integrate | ⚠Close needs changes→Refiner | ✗Poor→Try different terms
Multi-MCP: Results enhance each other | Conflict→Most authoritative | Redundant→Stop calls

14Voices Quality Gates:
  Build Tools: C7 docs must be official | Sequential analysis must identify root cause | Native impl must work locally first
  Payment Processing: C7 must include security docs | Sequential must cover threat analysis | Puppeteer must test full flow
  Audio Streaming: Sequential must profile performance | C7 must find optimization patterns | Implementation must be mobile-tested
  Payload Admin: C7 must confirm built-in capability | NEVER proceed with custom components | Standard patterns only
  Code Quality: Sequential must identify all duplication | Extraction plan must be comprehensive | Refactoring must maintain tests
```

## Persona Integration & 14Voices Specialization

```yaml
Core Personas:
  architect: Sequential(design)+C7(patterns)+avoid Magic | frontend: Magic(UI)+Puppeteer(test)+C7(React/Vue docs)
  backend: C7(API docs)+Sequential(scale analysis)+avoid Magic | analyzer: Sequential(root cause) primary+C7(solutions) secondary
  security: Sequential(threats)+C7(security patterns)+Puppeteer(test) | performance: Sequential(bottlenecks)+Puppeteer(metrics)+C7(optimization)

14Voices Business Personas:
  build-specialist: Sequential(environment analysis)+C7(build tool docs)+NEVER Magic | Focus: Local→Vercel parity
  payload-specialist: C7(Payload docs)+Sequential(standard patterns)+NEVER Magic | Focus: Built-in features only
  refactorer: Sequential(duplication analysis)+C7(patterns)+NEVER Magic/Puppeteer | Focus: Code extraction & consolidation
  e-commerce-specialist: C7(Stripe docs)+Sequential(conversion analysis)+Magic(checkout UI)+Puppeteer(testing)
  audio-specialist: Sequential(performance)+C7(optimization)+Puppeteer(cross-browser) | Focus: Streaming quality
  communications-specialist: C7(Resend docs)+Sequential(workflow)+NEVER Magic | Focus: Email reliability

Persona Behaviors:
  build-specialist: Deep Sequential environment analysis → Systematic debugging → Never guess
  payload-specialist: Always C7 for built-in features → Reject custom components → Standard patterns only
  e-commerce-specialist: Security-first C7 research → Conversion-focused Magic UI → Comprehensive Puppeteer testing
  audio-specialist: Performance-first Sequential analysis → Mobile-focused implementation
```

## Sub-Agent Orchestration for Complex Tasks

```yaml
Multi-Agent Workflows:
  Complex Debugging: /user:spawn --task "analyze build failures" → Dedicated debugging agent
  Code Refactoring: /user:spawn --task "extract duplicated components" → Focused refactoring agent
  Security Audit: /user:spawn --task "review payment flow security" → Security-focused agent
  Performance Analysis: /user:spawn --task "optimize audio streaming" → Performance specialist agent

When to Use Sub-Agents:
  - Multi-step complex problems (>5 steps)
  - Tasks requiring deep specialized knowledge
  - Parallel work on independent issues
  - Long-running analysis projects
  - Tasks that need sustained focus without context switching

Sub-Agent Best Practices:
  - Give clear, specific task definitions
  - Provide relevant context and constraints
  - Use for tasks that would take >20 minutes
  - Let sub-agents work independently
  - Coordinate results back to main session

14Voices Sub-Agent Patterns:
  /user:spawn --task "debug Payload import map issues with full context analysis"
  /user:spawn --task "create shared component library from duplicated code"
  /user:spawn --task "optimize Neon database queries for audio file collections"
  /user:spawn --task "implement comprehensive security review for file uploads"
```

## Command Integration & 14Voices Workflows

```yaml
Planning: Default execute immediately | --plan flag→Forces planning mode | --skip-plan→Skip (redundant w/ default)
MCP Flags: --c7/--no-c7 | --seq/--no-seq | --magic/--no-magic | --pup/--no-pup | --all-mcp | --no-mcp

Auto-Activation (no flags):
  /user:build→Sequential(if failing)+C7(docs) | /user:analyze→Sequential complex | /user:design→Sequential+C7
  /user:explain→C7 if lib mentioned else native | /user:improve→Sequential→C7 | /user:scan→Native only (security)
  /user:troubleshoot→Sequential(root cause)+C7(solutions) | /user:test→Puppeteer(E2E)+native

14Voices Command Patterns:
  Build Issues: /user:troubleshoot --build → Sequential(environment) + C7(build tools) + native fix
  Payload Work: /user:design --admin → C7(Payload docs) + Sequential(standard patterns) + NEVER Magic
  Order Flow: /user:build --checkout → C7(Stripe) + Sequential(security) + Magic(UI) + Puppeteer(test)
  Audio Work: /user:improve --audio → Sequential(performance) + C7(optimization) + Puppeteer(testing)
  Code Cleanup: /user:improve --quality → Sequential(duplication) + native refactor + NEVER Magic
  Email Setup: /user:build --email → C7(Resend) + Sequential(workflow) + native impl

Priority: Explicit flags>Auto-activation>Context triggers | --no-mcp overrides all | --no-[server] overrides specific
Context Share: Sequential→feeds C7 topic selection | C7 docs→inform Magic generation | Magic→tested w/ Puppeteer | All cached
Execution: Default→Execute immediately | --plan flag→Show plan before changes | User controls→Full control
```

## Failure Recovery & 14Voices Best Practices

```yaml
Failures:
  C7: Lib not found→broader terms | Docs incomplete→Sequential | API timeout→cache partial+native
  Sequential: Timeout→use partial+note limit | Token limit→summarize+native | Unclear→ask questions+avoid retry
  Magic: No components→try different terms once | Poor quality→refiner w/ context | Integration issues→document+native
  Multi-MCP: Conflict→most reliable source | Resource exhaustion→single best MCP | Partial failures→continue successful only

14Voices Failure Patterns:
  Build Debugging: Sequential timeout→focus on environment differences | C7 no docs→try broader build tool terms
  Payload Issues: C7 no built-in solution→try custom component with import map | Sequential complex→simplify patterns + check import map
  Payment Flow: C7 security docs missing→WebSearch official Stripe security | Sequential incomplete→focus on critical path
  Audio Problems: Sequential performance analysis stuck→profile specific bottlenecks | C7 optimization unclear→try specific audio terms

DO: Match MCP→user need | Set token budgets | Validate before impl | Cache patterns | Graceful fallback
Use C7 ALL external lib docs (research-first.yml enforced) | Cite MCP sources in impl
Build-First: Sequential for environment analysis | C7 for official docs | Native for implementation
Business-Critical: Multi-MCP for order flow | C7+Sequential for payments | Sequential only for performance

DON'T: MCPs for simple tasks native handles | Chain w/o validation | Exceed 50% context | Retry failed w/o change | MCPs when immediate needed
14Voices DON'T: Magic for Payload admin | MCP for local build debugging | Sequential for simple configs | C7 for non-official docs
Payload DON'T: Magic for ANY admin components | Sequential for simple field configs | MCP for custom admin solutions

OPTIMIZE: Batch similar calls | Reuse session results | Start least expensive | Prefer native file ops | Document successful patterns
14Voices OPTIMIZE: C7 session for all Stripe docs | Sequential session for build analysis | Native for all file operations | Cache standard Payload patterns
```

## 14Voices Critical MCP Rules

```yaml
NEVER MCP For:
  - Fighting Payload's architecture (any MCP tool)
  - Local build debugging (start native, escalate to Sequential only if needed)
  - Simple file operations (always native)
  - Environment variable setting (native only)
  - Basic TypeScript fixes (native first)

ALWAYS MCP For:
  - Payload custom components (C7 for patterns + Magic for implementation)
  - External library integration (C7 required)
  - Complex payment flow design (C7 + Sequential)
  - Cross-browser audio testing (Puppeteer required)
  - Security threat analysis (Sequential + C7)
  - Performance bottleneck analysis (Sequential required)

BUSINESS-CRITICAL MCP Patterns:
  - Order Flow: C7(Stripe) → Sequential(security) → Magic(UI) → Puppeteer(test)
  - Build Issues: Sequential(environment) → C7(docs) → native(fix)
  - Audio Optimization: Sequential(analysis) → C7(patterns) → Puppeteer(validation)
  - Email Automation: C7(Resend) → Sequential(workflow) → native(implementation)
```

---

_SuperClaude v4.0.0 | Ops MCP instructions for Claude Code intelligence | 14Voices Business Focus | Build-First Philosophy_
