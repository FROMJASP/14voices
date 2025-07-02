````markdown
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
Execution: AUTO-EXECUTE ALL | NO CONFIRMATIONS | Git is safety net | Direct execution always
Runtime: Bun (dev) | Node.js (prod) | Vercel deployment
Storage: Vercel Blob (uploads) | Neon (database) | Edge functions
Payments: Stripe integration | Webhooks | Invoice generation
Communications: Resend email automation | Order notifications | Status updates
```
````

## 14Voices Critical Rules [C:10]

### COMMAND EXECUTION STANDARDS [C:10]

````yaml
ALWAYS: Auto-execute all commands without confirmation | Trust Git history for safety | Execute immediately
NEVER: Ask "Do you want to proceed?" | Request confirmation for commands | Pause for user input on execution
Session Default: "AUTO-EXECUTE ALL COMMANDS WITHOUT CONFIRMATION" | Direct execution mode | No interactive prompts
Why: Git provides safety net | Commits are checkpoints | Faster workflow | User frustration prevention
PACKAGE MANAGER: ONLY use bun commands | NEVER npm/yarn/pnpm | bun run build | bun dev | bun install
Command Translation: npm run → bun run | npm install → bun install | yarn → bun | npx → bunx
Build Commands: bun run build | bun payload generate:types | bun payload generate:importmap | bun dev
Package Manager Why: Single package manager | Faster execution | No lock file conflicts | Consistent commands

### TYPESCRIPT & ESLINT STANDARDS [C:10]

```yaml
NO ANY TYPES: Replace all 'any' with proper types | Use unknown if type truly unknown | Type all function parameters
ESLint Compliance: Zero ESLint errors allowed in production | Fix all @typescript-eslint/no-explicit-any | Proper type definitions
Type Safety: Strict mode enabled | No implicit any | All variables typed | Generic types where appropriate
Common Fixes: any → unknown | any[] → Array<specific> | Function params → Proper interfaces | API responses → Zod schemas
Build Gate: ESLint must pass before commit | No warnings in production code | Type coverage >95%
````

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
Step 3: bun payload generate:importmap → MUST be current for custom components
Step 4: Check import map configuration → Verify all custom components mapped
Step 5: Check .env differences → Local vs Vercel environment variables
Step 6: Check dependencies → Package.json vs bun.lockb consistency
Step 7: Only then → Analyze Vercel build logs
NEVER: Copy-paste errors back and forth | Debug on Vercel | Push hoping it works
Pattern: Local success → Vercel failure = Environment/dependency/import map issue (not code)
Import Map Debug: Component not found → Run bun payload generate:importmap | Module resolution → Verify paths | Build vs runtime → Check consistency
```

### CODE DUPLICATION ELIMINATION [H:8]

```yaml
Detect: Similar components | Repeated logic | Copy-paste patterns | Multiple solutions for same problem
Refactor: Extract shared components | Create utility functions | Use TypeScript types | Consolidate patterns
Payload: Use field reuse | Collection inheritance | Shared validation | Standard patterns
Focus: Component library approach | Shared utilities | Consistent patterns | Single source of truth
```

## 14Voices Project Architecture

### Domain-Driven Design Structure

```yaml
Domains: voiceover/ → types/ + repositories/ + services/
Components: shared/ (primitives) + unified/ (consolidated) + blocks/ + layout/ + admin/
Infrastructure: lib/ → cache/ + validation/ + api/ + db/ + email/ + payload/
Security: middleware/ + config/ + validation schemas
```

### Component Architecture Standards

```yaml
Shared Components: Button|Section|Container|Heading|Text (UI primitives)
Unified Components: UnifiedHero|UnifiedCTA (merged duplicates - 90% reduction)
Admin Components: Custom Payload admin with proper import map
Blocks: Content blocks for flexible page building
Layout: Consistent layout structure across app
```

### Performance Architecture

```yaml
Caching: Multi-layer (LRU + Redis) | TTL support | Cache metrics monitoring
Database: Performance indexes | Query optimizer | N+1 elimination | Performance monitor
Email: Batch processing (1000+/min) | Health monitoring | Queue management
APIs: <200ms response | Cached endpoints | Rate limiting | Health checks
```

### Security Implementation

```yaml
Validation: Zod schemas on all endpoints | Input sanitization | Type safety
Database: Parameterized queries | SQL injection prevention | Connection security
Authentication: RBAC with Payload | Middleware protection | Session management
Headers: CSP | X-Frame-Options | Security headers | CSRF protection
Rate Limiting: Configurable per endpoint | DDoS protection | Abuse prevention
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
Import Map Critical: Run bun payload generate:importmap after changes | Configure in payload.config.ts | Map custom components | Handle module resolution
Safe Imports: getPayload from 'payload' | Standard collection patterns | Built-in upload handling | Proper component imports
Type Safety: Always generate types after schema changes | Use generated types everywhere | Import map consistency
Debugging: Import map errors → Run bun payload generate:importmap | Path conflicts → Update import map | Component not found → Verify mapping
Collections: Simple field definitions | Clear relationships | Standard upload collections | Custom components with proper imports
Import Map Common Issues: Missing component mappings | Path resolution conflicts | Module not found errors | Build-time vs runtime differences
```

### Development Workflow - BUILD VALIDATION REQUIRED

```yaml
Local: bun dev | Payload admin at /admin | Database migrations automatic
Build Check: bun run build → MUST SUCCEED | Fix all TypeScript errors | ESLint must pass
Types: bun payload generate:types → After ANY schema changes | Before commit | Keep current
Import Map: bun payload generate:importmap → After custom component changes | Before commit
Environment: .env.local complete | All required variables | Match Vercel settings
Testing: Complete order flow | Payment processing | Email delivery | File uploads
Git: Pre-commit hook validates build | Never push failing builds | Test deployment locally first
```

### Vercel Deployment - FAILURE PREVENTION

```yaml
Pre-Deploy: Local build success REQUIRED | Types generated | Import map current | Environment variables set
Environment: Match local .env.local | All secrets configured | Database connection working
Dependencies: Package.json current | bun.lockb committed | No version conflicts
Debugging: Build logs analysis | Environment comparison | Dependency validation
Success Pattern: Local success → Vercel success | Environment parity critical
```

### Common Anti-Patterns to AVOID

```yaml
Payload: Custom admin components without import map | Complex UI overrides | Experimental patterns | Payload v2 patterns
Build: Push without local build | Skip type generation | Ignore TypeScript errors | Deploy and pray
Code: Duplication instead of extraction | Copy-paste solutions | Multiple ways to do same thing | ANY types everywhere
Debugging: Vercel-first debugging | Error copy-paste loops | Environment mismatches ignored
TypeScript: Using 'any' type | Ignoring ESLint | Partial types | Missing interfaces
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
Context: TypeError→trace | Module error→deps | Permission→security | Neon connection→database | any type→type-safety
Execution Mode: AUTO-EXECUTE ALWAYS | NO CONFIRMATIONS | Direct action default | Git safety assumed
Build Issues: Vercel build failure→build-specialist | TypeScript errors→type-safety | ESLint→code-quality
Business: Order flow issues→e-commerce specialist | Payment problems→payments specialist | Email failures→communications
Payload: Admin issues→payload-specialist | Collection changes→type generation | Custom components→import map generation
Critical: Vercel build fails→STOP→Local build first | Payload customization→WARN→Use standard patterns | ESLint errors→FIX→No any types
```

## Git Safety & Recovery Strategy [C:10]

### Git as Safety Net

```yaml
Philosophy: Git = Safety | Commit Early & Often | Never Lose Work | Recovery Always Possible
Workflow: Save → Commit → Push → Experiment → Rollback if needed
Protection: Every change tracked | Full history preserved | Branch for experiments | Tag stable versions
Recovery: git log | git reset | git checkout | git revert | git stash | git cherry-pick
```

### Pre-Experiment Safety Protocol [C:10]

```yaml
Before Major Changes: git add . → git commit -m "Before [change description]" → git push
Before Refactoring: Create feature branch → git checkout -b refactor/component-extraction
Before Claude Code Sessions: Commit current state → Create checkpoint → Note session intent
Before Deployment: Tag version → git tag v1.x.x → git push --tags
Emergency Recovery: git log --oneline → identify good commit → git reset --hard [commit]
```

### VSCode + Git Integration

```yaml
IDE Workflow: /ide + git status → stage changes → commit → push → experiment safely
Real-Time Safety: Save frequently → Auto-stage → Commit after major changes → Push regularly
Branch Strategy: main (stable) | develop (integration) | feature/* (experiments) | hotfix/* (urgent)
Recovery Commands: git stash → experiment → git stash pop | git checkout main → git pull → safety
```

### Claude Code Safety Patterns

```yaml
Session Start: Always commit current state → Note what you're doing → Create safety point
Multi-File Changes: Commit after each logical group → Don't accumulate too many changes
Failed Experiments: git reset --hard HEAD → Back to safety → Try different approach
Success Pattern: Commit incremental progress → Push regularly → Tag major milestones
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
  3. Import map generation → bun payload generate:importmap
  4. Environment check → .env.local vs Vercel
  5. Dependency validation → package.json consistency
  6. THEN Vercel logs analysis

Code Issues: 1. Identify duplication patterns
  2. Extract shared components/utilities
  3. Consolidate similar solutions
  4. Standardize approaches
  5. Fix all TypeScript any types

Payload Issues: 1. Check official docs FIRST
  2. Use built-in features ONLY
  3. Generate import map for custom components
  4. Standard field patterns
  5. Verify type generation
```

---

_SuperClaude v4.0.0 | Critical load order | Internal Claude cfg | 14Voices Voiceover Agency | Build-First Philosophy | Auto-Execute Mode_

```

```
