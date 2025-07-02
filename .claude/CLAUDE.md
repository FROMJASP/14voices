# CLAUDE.md - SuperClaude Cfg + 14Voices Voiceover Agency

## Legend

| Symbol | Meaning      |     | Abbrev | Meaning       |
| ------ | ------------ | --- | ------ | ------------- |
| →      | leads to     |     | cfg    | configuration |
| &      | and/with     |     | docs   | documentation |
| >      | greater than |     | ops    | operations    |

@RULES.md
@MCP.md
@PERSONAS.md

## Core Cfg

```yaml
Philosophy: Code>docs | Simple→complex | Security first | Customer experience paramount | AVOID PAYLOAD UI CUSTOMIZATION
Communication: Concise format | Symbols: →|&:» | Bullets>prose
Workflow: TodoRead()→TodoWrite(3+)→Execute | Update immediate
Stack: Next.js 15.3.4|React 19|TS + Payload CMS v3 beta|Neon PostgreSQL + Vercel|Stripe|Resend|Git|ESLint|Tailwind
Commands: /user:<command> [flags] | /task:<action> | Ex: /user:build --init
Runtime: Bun (dev) | Node.js (prod) | Vercel deployment
Storage: Vercel Blob (uploads) | Neon (database) | Edge functions
Payments: Stripe integration | Webhooks | Invoice generation
Communications: Resend email automation | Order notifications | Status updates
```

## 14Voices Critical Rules [C:10]

### PAYLOAD CUSTOMIZATION STANDARDS [C:10]

```yaml
REQUIRED: Follow Payload patterns | Use their TypeScript types | Leverage Payload utilities | Proper component structure
ENCOURAGED: Custom field components | Dashboard widgets | List/Edit views | Business-specific admin UX
AVOID: Fighting Payload architecture | Ignoring TypeScript | Parallel systems | Copy-paste without understanding
Best Practices: Use Payload hooks | Extend their components | Follow their examples | Proper error handling
Why Good Customization Works: Better admin UX | Business-specific workflows | Proper integration | Maintainable code
Why Bad Customization Fails: Architecture fights | Type issues | Duplication | Build complexity
```

### BUILD-BEFORE-PUSH ENFORCEMENT [C:10]

```yaml
Required: bun run build → SUCCESS → bun payload generate:types → git push
Never: Push without local build success | Skip type generation | Deploy with TypeScript errors
Auto-Check: Pre-commit hook | Build validation | Type checking | ESLint passing
Vercel: Preview builds must succeed | Check build logs immediately | Never merge failing builds
Debug Pattern: Build fails → Fix locally → Test → Push | NEVER copy-paste Vercel errors 10x times
```

### VERCEL BUILD FAILURE PROTOCOL [C:10]

```yaml
Step 1: bun run build locally → MUST succeed before investigating Vercel
Step 2: bun payload generate:types → MUST be current
Step 3: Check import map configuration → Verify all custom components mapped
Step 4: Check .env differences → Local vs Vercel environment variables
Step 5: Check dependencies → Package.json vs yarn.lock/package-lock.json
Step 6: Only then → Analyze Vercel build logs
NEVER: Copy-paste errors back and forth | Debug on Vercel | Push hoping it works
Pattern: Local success → Vercel failure = Environment/dependency/import map issue (not code)
Import Map Debug: Component not found → Check import map | Module resolution → Verify paths | Build vs runtime → Check consistency
```

### CODE DUPLICATION ELIMINATION [H:8]

```yaml
Detect: Similar components | Repeated logic | Copy-paste patterns | Multiple solutions for same problem
Refactor: Extract shared components | Create utility functions | Use TypeScript types | Consolidate patterns
Payload: Use field reuse | Collection inheritance | Shared validation | Standard patterns
Focus: Component library approach | Shared utilities | Consistent patterns | Single source of truth
```

## 14Voices Business Logic

### Core Customer Journey

```yaml
Discovery: Browse demos → Filter by voice type/language/style
Selection: Listen to samples → Compare voices → Select talent
Ordering: Upload script → Fill requirements form → Review order
Payment: Stripe checkout → Webhook confirmation → Order processing
Fulfillment: Auto-invoice via Resend → Order management in Payload → Delivery coordination
Management: Admin tracking → Customer communication → Quality control
```

### Critical Business Flows [C:10]

```yaml
Order Flow: Demo→Form→Upload→Payment→Confirmation→Invoice | Zero failures allowed
Payment Security: Stripe webhooks verified | PCI compliance | Secure file handling
Email Automation: Order confirmation | Payment success | Invoice delivery | Status updates
File Management: Script uploads secure | Demo streaming optimized | Delivery tracking
Build Reliability: Local build success = Vercel build success | No environment surprises
```

### Database & Storage Architecture

```yaml
Database: Neon PostgreSQL | Connection pooling auto | Migrations via Payload | Order data critical
Storage: Vercel Blob for uploads | Local filesystem (dev only) | Demo files optimized streaming
Collections: Talents|Demos|Orders|Scripts|Invoices|Customers|VoiceTypes|Languages|Projects
Business Models: Order workflow | Payment tracking | Customer management | Talent assignments
Auto-fill: Orders → "[Customer] - [Project] - [Date]" | Invoices → Auto-generated from orders
File Types: MP3/WAV demos | PDF/DOC/TXT scripts | Generated PDF invoices
Payload Approach: STANDARD FIELDS ONLY | No custom components | Use built-in features | Admin.description for help
```

### Payload v3 Beta - SAFE PATTERNS WITH IMPORT MAP

```yaml
DO: Use standard fields | Built-in validation | Conditions | Access control | Admin.description | Proper import map config
CUSTOM COMPONENTS: Follow Payload patterns | Configure import map correctly | Use proper module resolution | TypeScript integration
Import Map Critical: Configure in payload.config.ts | Map custom components | Handle module resolution | Avoid path conflicts
Safe Imports: getPayload from 'payload' | Standard collection patterns | Built-in upload handling | Proper component imports
Type Safety: Always generate types after schema changes | Use generated types everywhere | Import map consistency
Debugging: Import map errors → Check module resolution | Path conflicts → Update import map | Component not found → Verify mapping
Collections: Simple field definitions | Clear relationships | Standard upload collections | Custom components with proper imports
Import Map Common Issues: Missing component mappings | Path resolution conflicts | Module not found errors | Build-time vs runtime differences
```

### Development Workflow - BUILD VALIDATION REQUIRED

```yaml
Local: bun dev | Payload admin at /admin | Database migrations automatic
Build Check: bun run build → MUST SUCCEED | Fix all TypeScript errors | ESLint must pass
Types: bun payload generate:types → After ANY schema changes | Before commit | Keep current
Environment: .env.local complete | All required variables | Match Vercel settings
Testing: Complete order flow | Payment processing | Email delivery | File uploads
Git: Pre-commit hook validates build | Never push failing builds | Test deployment locally first
```

### Vercel Deployment - FAILURE PREVENTION

```yaml
Pre-Deploy: Local build success REQUIRED | Types generated | Environment variables set
Environment: Match local .env.local | All secrets configured | Database connection working
Dependencies: Package.json current | Lock files committed | No version conflicts
Debugging: Build logs analysis | Environment comparison | Dependency validation
Success Pattern: Local success → Vercel success | Environment parity critical
```

### Common Anti-Patterns to AVOID

```yaml
Payload: Custom admin components | Complex UI overrides | Experimental patterns | Payload v2 patterns
Build: Push without local build | Skip type generation | Ignore TypeScript errors | Deploy and pray
Code: Duplication instead of extraction | Copy-paste solutions | Multiple ways to do same thing
Debugging: Vercel-first debugging | Error copy-paste loops | Environment mismatches ignored
```

## Thinking Modes

```yaml
Activation: Natural language OR command flags
Flags: --think | --think-hard | --ultrathink
none: Single file|Basic | think: Multi-file|Standard
think hard: Architecture|Complex | ultrathink: Redesign|Critical
Examples: /user:analyze --code --think | /user:design --api --ultrathink
Build Focus: Local validation first | Environment parity | Deployment reliability
```

## Auto-Activation

```yaml
Files: *.tsx→frontend | *.sql→data | Docker→devops | *.test→qa | stripe.ts→payments | resend.ts→email
Keywords: bug|error→debugger | optimize→performance | secure→security | payment→payments | email→communications
Context: TypeError→trace | Module error→deps | Permission→security | Neon connection→database
Build Issues: Vercel build failure→build-specialist | TypeScript errors→type-safety | ESLint→code-quality
Business: Order flow issues→e-commerce specialist | Payment problems→payments specialist | Email failures→communications
Payload: Admin issues→payload-specialist | Collection changes→type generation | Custom components→REFACTOR WARNING
Critical: Vercel build fails→STOP→Local build first | Payload customization→WARN→Use standard patterns
```

## Task Management & Sub-Agent Orchestration

```yaml
Mode: Automatic | No user prompts | Seamless activation
Detection: ≥8 complexity points→auto-create | 5-7→brief notify | <5→normal
Triggers: "build|create|implement" + "system|feature" + complexity flags
Flow: requirement→analyze→create→breakdown→implement | Background operation
Recovery: Auto-resume active tasks | Context preservation | Git integration
Build Priority: Local build success before any deployment discussion
Code Quality: Duplication detection automatic | Refactoring suggestions | Pattern consolidation

Sub-Agent Patterns for 14Voices:
Complex Debugging: /user:spawn --task "debug Payload import map and loading issues"
Major Refactoring: /user:spawn --task "extract audio player components into shared library"
Security Auditing: /user:spawn --task "comprehensive security review of file upload flow"
Performance Optimization: /user:spawn --task "optimize Neon queries and audio streaming"
Build System: /user:spawn --task "create bulletproof Vercel deployment pipeline"

When to Use Sub-Agents:
- Multiple independent issues (loading bug + code cleanup + build fixes)
- Complex multi-step problems requiring sustained focus
- Specialized domain expertise needed (Payload + Neon + Vercel + Audio)
- Parallel work streams for faster resolution
- Tasks requiring >20 minutes of focused analysis

Sub-Agent Coordination:
Main Session: Orchestrates multiple agents | Integrates findings | Maintains project context
Specialized Agents: Deep domain focus | Independent problem solving | Detailed analysis
Result Integration: Findings combined | Solutions coordinated | Implementation planned
```

## Performance

```yaml
Ops: Parallel>sequential | Batch similar | One in-progress
Database: Neon auto-scaling | Connection pooling | Query optimization | Order data fast
Storage: Vercel Blob CDN | Audio streaming optimization | Demo loading speed critical
Caching: Next.js ISR | Route cache | Component cache | Demo files cached
Build Performance: Local build speed | Type generation efficiency | Development feedback loops
Customer Experience: Demo loading <2s | Order submission <1s | Email delivery <30s
```

## Debugging Workflow Optimization

```yaml
Build Failures: 1. Local build FIRST → bun run build
  2. Type generation → bun payload generate:types
  3. Environment check → .env.local vs Vercel
  4. Dependency validation → package.json consistency
  5. THEN Vercel logs analysis

Code Issues: 1. Identify duplication patterns
  2. Extract shared components/utilities
  3. Consolidate similar solutions
  4. Standardize approaches

Payload Issues: 1. Check official docs FIRST
  2. Use built-in features ONLY
  3. Avoid custom admin components
  4. Standard field patterns
```

---

_SuperClaude v4.0.0 | Critical load order | Internal Claude cfg | 14Voices Voiceover Agency | Build-First Philosophy_
