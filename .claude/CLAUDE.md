<!-- ⚠️ CRITICAL: This file MUST be read at the start of EVERY conversation -->
<!-- Contains: Agent system, MCPs, workflows, and project standards -->
<!-- ALWAYS propose the appropriate agent for the task type -->

# ⚠️ MANDATORY READING - DO NOT SKIP

# CLAUDE.md - FROMJASP Configuration

This file contains:

- **Automatic agent delegation system** (MUST use for all tasks)
- Project-specific workflows and standards
- Available tools and when to use them
- Component sources and duplicate prevention

**CRITICAL**: For ANY task, check the "🤖 Automatic Agent System" section below and propose the appropriate agent FIRST.

> **Note**: This file covers automation and workflows. For critical do's/don'ts, security rules, and Sentry configuration, see [RULES.md](./RULES.md)

## Quick Context

- **Stack**: Next.js 15.0.3, React 19, TypeScript 5, Payload CMS v3 beta, Neon PostgreSQL
- **Hosting**: Vercel Edge Functions
- **Payments**: Stripe
- **Email**: Resend
- **Storage**: Vercel Blob
- **Package Manager**: BUN ONLY (never npm/yarn/pnpm)

## 🤖 Automatic Agent System

Claude automatically analyzes your requests and delegates to specialized agents. No special commands needed - just describe what you want naturally!

### Available Agents

Each agent has specialized capabilities:

- 🎨 **ui-designer** - Visual design and component implementation
- 🧠 **ux-designer** - User experience and interaction design
- 🔍 **code-reviewer** - Security and best practices validation
- 🐛 **debugger** - Bug fixing and troubleshooting
- 🗄️ **database-optimizer** - Query optimization and schema design
- ✅ **test-runner** - QA strategy and test execution
- 🚀 **deployment-engineer** - Build and deployment management
- 🔌 **api-engineer** - API design and payment integration
- 🔒 **security-engineer** - Security audits and compliance
- ⚡ **performance-engineer** - Performance optimization
- 📋 **product-manager** - Feature planning and requirements
- 🎯 **workflow-coordinator** - Orchestrates team collaboration

### How Agents Work

1. **Natural Language Processing**: Claude understands your intent
2. **Automatic Delegation**: Appropriate agents are selected
3. **Smart Sequencing**: Agents work in optimal order
4. **Context Management**: Each agent gets relevant information
5. **Result Synthesis**: Outputs combined into cohesive solution

### Example Requests → Agent Activation

**Simple Requests:**

- "Fix the login bug" → 🐛 debugger
- "Make the hero section modern" → 🎨 ui-designer
- "Optimize database queries" → 🗄️ database-optimizer
- "Deploy to production" → 🚀 deployment-engineer

**Complex Requests:**

- "Improve checkout flow" → 🧠 ux-designer → 🎨 ui-designer → ⚡ performance-engineer → ✅ test-runner
- "Add Stripe payments" → 🔌 api-engineer → 🔒 security-engineer → 🗄️ database-optimizer → ✅ test-runner
- "Build review system" → 📋 product-manager → 🧠 ux-designer → 🎨 ui-designer → 🔌 api-engineer

## Available MCPs

```yaml
filesystem: File operations, refactoring
sequential-thinking: Complex problem solving, analysis
context7: Documentation lookup, best practices
github: Git operations
stripe: Payment processing
neon: Database operations
puppeteer: Browser testing, E2E tests
magicui: UI component generation (legacy - use sparingly)
memory: Pattern tracking, learning
```

## Agent MCP Selection Logic

Agents automatically use the right MCPs based on task:

- **UI/Design**: paceui + context7 + web_fetch + filesystem + memory
- **Debugging**: puppeteer + sequential-thinking + filesystem + github
- **Database**: neon + sequential-thinking
- **Payments**: stripe + context7
- **Complex Problems**: sequential-thinking + memory
- **Testing**: puppeteer + stripe (for payments)
- **Refactoring**: filesystem + sequential-thinking + memory

## Component Sources

```yaml
PaceUI:
  - Type: MCP (built-in)
  - Best for: Text animations, cursors, buttons
  - Components: reveal-text, scramble-text, liquid-cursor, spring-button

Animate UI:
  - Source: https://github.com/animate-ui/animate-ui
  - Best for: Page transitions, motion effects
  - Method: Fetch with context7 or web_fetch

React Bits:
  - Source: https://github.com/DavidHDev/react-bits
  - Site: https://reactbits.dev/
  - Best for: Patterns, compound components, best practices

21st.dev:
  - Source: https://21st.dev/home
  - Best for: Inspiration, modern examples
  - Method: web_search, analyze, implement
```

## Component Duplicate Prevention

Before creating ANY component, the system:

1. Scans existing components in src/components
2. Analyzes similar functionality
3. Shows findings before proceeding

### Future Enhancement: Component Registry

A registry system could be implemented at `/docs/components/registry.json` to track:

- Component sources (which GitHub repo they came from)
- Dependencies (GSAP, Framer Motion, etc.)
- Creation dates and types
- Animation libraries used

## Core Development Commands

```bash
# Development
bun dev                    # Start dev server
bun run build             # Build project
bun test                  # Run tests

# Payload CMS
bun payload generate:types      # After schema changes
bun payload generate:importmap  # For custom components

# Helper Scripts
bun scripts/fromjasp.ts "your request"  # Preview which agent would handle a task
```

## Payload Custom Components (v3)

When custom components are needed:

1. **Create Component** following Payload patterns:

```tsx
// src/components/admin/CustomField.tsx
import { useField } from '@payloadcms/ui';

export const CustomField: React.FC = () => {
  const { value, setValue } = useField();
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
};
```

2. **Generate Import Map**:

```bash
bun payload generate:importmap
```

3. **Use in Collection**:

```ts
{
  name: 'customField',
  type: 'text',
  admin: {
    components: {
      Field: '/components/admin/CustomField#CustomField'
    }
  }
}
```

4. **After ANY Component Changes**:

- Run `bun payload generate:importmap`
- Run `bun payload generate:types`
- Restart dev server

## Performance Targets

- API responses: <200ms
- Database queries: <50ms
- Demo loading: <2s
- Build time: <60s

## Build & Deploy

1. **Always** run `bun run build` locally first
2. Generate types after Payload schema changes
3. Verify `.env.local` matches Vercel environment
4. Never debug on Vercel first

## Code Standards

- NO `any` types - use proper TypeScript
- Extract duplicated code immediately
- Follow existing component patterns
- Use Payload built-in features (avoid custom admin UI)
- Always check for existing components before creating new ones
- Add source attribution in comments and commits

## Admin Tours (Shepherd.js)

```bash
# Tour System using Shepherd.js (replaced Driver.js)
- Tours are collection-specific (voiceovers, pages, bookings, etc.)
- First-time tour shows automatically for new users
- Manual tour trigger via "Rondleiding" button in admin

# Tour Implementation
- Components: AdminToursShepherd.tsx, TourStylesShepherd.tsx
- Tours defined per collection in AdminToursShepherd.tsx
- Lazy loaded to avoid build issues
- Custom styling with modal overlay

# Adding/Modifying Tours
1. Edit tours object in AdminToursShepherd.tsx
2. Use attachTo for element highlighting
3. Dutch labels for all tour content
4. Test with localStorage.removeItem('14voices_tour_completed')
```

## Auto-Behaviors

For EVERY request:

1. Check for existing solutions using filesystem and memory MCPs
2. Consider security implications
3. Ensure TypeScript types (no any)
4. Extract duplicated code
5. Follow project standards
6. Update documentation if needed
7. Track component sources in registry

## Component Attribution

When implementing components from GitHub:

1. Add source URL in component comments
2. Update registry with source information
3. Include attribution in commit message
4. Track version/commit hash for updates

This ensures proper credit and makes updates easier.

## Memory Patterns

The memory MCP remembers:

- Previously created components and their sources
- Common fixes applied
- User preferences (e.g., prefers PaceUI for text animations)
- Performance optimizations made
- Which GitHub components have been used

## Security & Best Practices

- All user inputs are sanitized
- Stripe always in test mode first
- Database migrations are reversible
- No sensitive data in commits
- Components are accessibility tested
- Performance monitored on every build

> **Important**: For detailed security rules, performance requirements, and Sentry configuration, refer to [RULES.md](./RULES.md)

---

_Always use bun | Build locally first | Extract duplications | No any types | Check existing components first_

# important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context or otherwise consider it in your response unless it is highly relevant to your task. Most of the time, it is not relevant.
