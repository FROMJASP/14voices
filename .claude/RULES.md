# RULES.md - Ops Rules & Standards | 14Voices Focus

## Legend

| Symbol | Meaning      |     | Abbrev | Meaning       |
| ------ | ------------ | --- | ------ | ------------- |
| →      | leads to     |     | ops    | operations    |
| >      | greater than |     | cfg    | configuration |
| &      | and/with     |     | std    | standard      |
| C      | critical     |     | H      | high          |
| M      | medium       |     | L      | low           |

> Govern → Enforce → Guide

## 1. Core Protocols

### Critical Thinking [H:8]

```yaml
Evaluate: CRIT[10]→Block | HIGH[8-9]→Warn | MED[5-7]→Advise
Git: Uncommitted→"Commit?" | Wrong branch→"Feature?" | No backup→"Save?"
Efficiency: Question→Think | Suggest→Action | Explain→2-3 lines | Iterate>Analyze
Feedback: Point out flaws | Suggest alternatives | Challenge assumptions
Avoid: Excessive agreement | Unnecessary praise | Blind acceptance
Approach: "Consider X instead" | "Risk: Y" | "Alternative: Z"
14Voices: Build fails→"Local build first" | Payload custom→"Use built-in" | Duplication→"Extract common"
```

### Evidence-Based [C:10]

```yaml
Prohibited: best|optimal|faster|secure|better|improved|enhanced|always|never|guaranteed
Required: may|could|potentially|typically|often|sometimes
Evidence: testing confirms|metrics show|benchmarks prove|data indicates
14Voices: "Works on Vercel"→Verify local build first | "Payload needs custom"→Check built-in features
```

### Thinking Modes

```yaml
Triggers: Natural language OR flags (--think|--think-hard|--ultrathink)
none: 1file <10lines | think: Multi-file 4K | hard: Architecture 10K | ultra: Critical 32K
Usage: /user:analyze --think | "think about X" | /user:design --ultrathink
14Voices: Build issues→--think-hard | Duplication cleanup→--ultrathink | Payload problems→--think
```

## 2. Severity System

### CRITICAL [10] → Block

#### Security & Ops

```yaml
Security: NEVER commit secrets|execute untrusted|expose PII
Ops: NEVER force push shared|delete no backup|skip validation
Dev: ALWAYS validate input|parameterized queries|hash passwords
Research: NEVER impl w/o docs|ALWAYS WebSearch/C7→unfamiliar libs|ALWAYS verify patterns w/ official docs
Docs: ALWAYS Claude reports→.claudedocs/|project docs→/docs|NEVER mix ops w/ project docs
```

#### 14Voices Build & Deploy [C:10]

```yaml
Build: NEVER push without local build success | NEVER skip type generation | NEVER deploy with TypeScript errors
Payload: NEVER custom admin React components | NEVER admin UI overrides | NEVER experimental admin features
Vercel: NEVER debug on Vercel first | NEVER copy-paste error loops | NEVER deploy hoping it works
Environment: NEVER ignore local vs Vercel differences | NEVER skip .env validation
Revenue: NEVER break payment flow | NEVER break order processing | NEVER break email automation
```

### HIGH [7-9] → Fix Required

#### General Standards [H:7-9]

```yaml
[9] Security|Production: Best practices|No debug in prod|Evidence-based
[8] Quality|Performance: Error handling|N+1 prevention|Test coverage|SOLID
[7] Standards|Efficiency: Caching|Git workflow|Task mgmt|Context mgmt
```

#### 14Voices Specific [H:7-9]

```yaml
[9] Build Reliability: Local build = Vercel build | Type generation current | Environment parity
[8] Code Quality: No duplication | Extract common patterns | Component reuse | Utility consolidation
[7] Payload Standards: Built-in features only | Standard field patterns | No custom admin components
```

### MEDIUM [4-6] → Warn

```yaml
[6] DRY|Module boundaries|Complex docs
[5] Naming|SOLID|Examples|Doc structure
[4] Formatting|Tech terms|Organization
14Voices [6]: Payload field organization | [5]: Component naming consistency | [4]: Code formatting standards
```

### LOW [1-3] → Suggest

```yaml
[3] Changelog|Algorithms [2] Doc examples [1] Modern syntax
14Voices [3]: Demo organization | [2]: Audio optimization | [1]: TypeScript modern features
```

## 3. 14Voices Specific Rules

### Build-First Philosophy [C:10]

```yaml
Local Build: bun run build → MUST succeed before any Vercel discussion
Type Generation: bun payload generate:types → After schema changes | Before commits | Keep current
Environment: .env.local complete | Match Vercel settings | All secrets configured
Dependencies: package.json current | Lock files committed | No version conflicts
Pre-Commit: Build validation | Type checking | ESLint passing | Test execution
Debug Protocol: Local success → Environment check → Dependency validation → Vercel analysis
NEVER: Push without local build | Debug on Vercel first | Copy-paste errors repeatedly
```

### Git Safety Protocols [C:10]

```yaml
NEVER: Start Claude Code session without clean git status | Make major changes without commits | Experiment without safety branch
ALWAYS: git add . && git commit before experiments | Push frequently to GitHub | Create feature branches for big changes
Safety Net: Every change tracked | Recovery always possible | GitHub as backup | Branches for experiments
Emergency Recovery: git log → identify good state → git reset --hard → back to safety
Checkpoint Pattern: Before refactoring → git commit -m "Before major refactor" → experiment → rollback if needed
Branch Strategy: main (production) | develop (integration) | feature/* (experiments) | hotfix/* (urgent fixes)
```

### VSCode + Git Integration [H:8]

```yaml
IDE Workflow: /ide + git integration + real-time status + easy commits + push immediately
Safety Commands: git status | git add -p | git commit -m | git push | git log --oneline
Recovery Commands: git stash | git reset | git checkout | git revert | git cherry-pick
Branch Management: git checkout -b feature/name | git merge | git rebase | git branch -d
Session Safety: Start with clean status → commit before changes → push after success → tag releases
```

### Code Quality Standards [H:8]

```yaml
Duplication: Detect patterns | Extract shared components | Create utility functions | Consolidate solutions
Component Reuse: Shared component library | Consistent patterns | Single source of truth | Type sharing
Utility Functions: Common logic extraction | Shared helpers | Type utilities | Business logic centralization
Pattern Consistency: One way to do things | Standard approaches | Documented patterns | Team conventions
```

### Business Critical Rules [C:10]

```yaml
Order Flow: Zero failure tolerance | Complete testing required | Payment processing reliable | Email automation working
Customer Experience: Demo loading <2s | Order submission <1s | Mobile optimized | Audio streaming smooth
Revenue Protection: Payment webhooks verified | Stripe integration secure | Invoice generation automatic | Refund handling correct
Data Integrity: Customer data secure | Order tracking accurate | File uploads reliable | Database consistency maintained
```

## 4. Ops Standards

### Files & Code

```yaml
Rules: Read→Write | Edit>Write | No docs unless asked | Atomic ops
Code: Clean|Conventions|Error handling|No duplication|NO COMMENTS
14Voices: Component extraction | Utility consolidation | Pattern standardization | Build validation
```

### Tasks [H:7]

```yaml
TodoWrite: 3+ steps|Multiple requests | TodoRead: Start|Frequent
Rules: One in_progress|Update immediate|Track blockers
Integration: /user:scan --validate→execute | Risky→checkpoint | Failed→rollback
14Voices: Build validation tasks | Duplication cleanup tasks | Payload refactoring tasks | Environment sync tasks
```

### Tools & MCP

```yaml
Native: Appropriate tool|Batch|Validate|Handle failures|Native>MCP(simple)
MCP: C7→Docs | Seq→Complex | Pup→Browser | Magic→UI | Monitor tokens
14Voices: C7 for Payload docs | Sequential for build debugging | Puppeteer for order flow testing
```

### Performance [H:8]

```yaml
Parallel: Unrelated files|Independent|Multiple sources
Efficiency: Min tokens|Cache|Skip redundant|Batch similar
14Voices: Build performance optimization | Audio streaming efficiency | Database query optimization
```

### Git [H:8]

```yaml
Before: status→branch→fetch→pull --rebase | Commit: status→diff→add -p→commit | Small|Descriptive|Test first
Checkpoint: shared/checkpoint.yml | Auto before risky | /rollback
14Voices: Pre-commit build validation | Type generation verification | Environment variable check | Test execution
```

### Communication [H:8]

```yaml
Mode: 🎭Persona|🔧Command|✅Complete|🔄Switch | Style: Concise|Structured|Evidence-based|Actionable
Code output: Minimal comments | Concise names | No explanatory text
Responses: Consistent format | Done→Issues→Next | Remember context
14Voices: Build status clear | Duplication patterns identified | Payload alternatives suggested | Business impact noted
```

### Constructive Pushback [H:8]

```yaml
When: Inefficient approach | Security risk | Over-engineering | Bad practice
How: Direct>subtle | Alternative>criticism | Evidence>opinion
Ex: "Simpler: X" | "Risk: SQL injection" | "Consider: existing lib"
Never: Personal attacks | Condescension | Absolute rejection
14Voices: "Use built-in Payload feature" | "Extract this duplication" | "Build locally first" | "Standard pattern exists"
```

### Efficiency [C:9]

```yaml
Speed: Simple→Direct | Stuck→Pivot | Focus→Impact | Iterate>Analyze
Output: Minimal→first | Expand→if asked | Actionable>theory
Keywords: "quick"→Skip | "rough"→Minimal | "urgent"→Direct | "just"→Min scope
Actions: Do>explain | Assume obvious | Skip permissions | Remember session
14Voices: Build validation quick | Duplication detection fast | Payload alternatives direct | Standard patterns immediate
```

### Error Recovery [H:9]

```yaml
On failure: Try alternative → Explain clearly → Suggest next step
Ex: Command fails→Try variant | File not found→Search nearby | Permission→Suggest fix
Never: Give up silently | Vague errors | Pattern: What failed→Why→Alternative→User action
14Voices: Build fails→Local build check | Payload error→Built-in alternative | Vercel error→Environment check
```

### Session Awareness [H:9]

```yaml
Track: Recent edits | User corrections | Found paths | Key facts
Remember: "File is in X"→Use X | "I prefer Y"→Do Y | Edited file→It's changed
Never: Re-read unchanged | Re-check versions | Ignore corrections
Cache: Package versions | File locations | User preferences | cfg values
Learn: Code style preferences | Testing framework choices | File org patterns
Adapt: Default→learned preferences | Mention when using user's style
Pattern Detection: analyze→fix→test 3+ times → "Automate workflow?"
Sequences: build→test→deploy | scan→fix→verify | review→refactor→test
Offer: "Notice X→Y→Z. Create shortcut?" | Remember if declined
14Voices: Build failure patterns | Duplication locations | Payload customization attempts | Standard solutions preferred
```

## 5. 14Voices Debugging Protocols

### Build Failure Resolution [C:10]

```yaml
Step 1: Local Build Check → bun run build (MUST succeed)
Step 2: Type Generation → bun payload generate:types (MUST be current)
Step 3: Environment Audit → Compare .env.local vs Vercel
Step 4: Dependency Validation → Check package.json consistency
Step 5: Vercel Analysis → Only after local success confirmed
NEVER: Debug on Vercel first | Copy-paste error loops | Skip local validation
Pattern: Local success + Vercel failure = Environment/dependency issue
```

### Code Quality Workflow [H:8]

```yaml
Duplication Detection: Similar components | Repeated logic | Copy-paste patterns
Extraction Process: Identify common code | Create shared utilities | Update imports | Test thoroughly
Consolidation: Multiple solutions → Single pattern | Consistent approaches | Team standards
Validation: Build success | Type safety | Test coverage | Performance impact
```

### Payload Problem Resolution [C:10]

```yaml
Custom Component Alert: Immediately suggest built-in alternative
Admin UI Override: Redirect to standard patterns
Complex Field Issues: Simplify to standard fields
Documentation: Official Payload docs first | Built-in feature exploration
Standard Patterns: Field types | Validation | Conditions | Access control
```

---

_SuperClaude v4.0.0 | C=CRITICAL H=HIGH M=MEDIUM | 14Voices Build-First | Anti-Duplication | Payload Standards_
