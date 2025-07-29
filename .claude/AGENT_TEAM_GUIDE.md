# 14voices Agent Team Guide

## 🤖 Automatic Agent Usage

When you type any prompt, Claude automatically analyzes it and delegates to the appropriate specialized agents. You don't need to explicitly call agents - just describe what you want naturally!

## 👥 Your Agent Team

Each agent has a unique color and specialization:

- 🎨 **ui-designer** (Purple) - Visual design and component implementation
- 🧠 **ux-designer** (Blue) - User experience and interaction design
- 🔍 **code-reviewer** (Green) - Security and best practices validation
- 🐛 **debugger** (Red) - Bug fixing and troubleshooting
- 🗄️ **database-optimizer** (Orange) - Query optimization and schema design
- ✅ **test-runner** (Yellow) - QA strategy and test execution
- 🚀 **deployment-engineer** (Cyan) - Build and deployment management
- 🔌 **api-engineer** (Magenta) - API design and payment integration
- 🔒 **security-engineer** (Dark Red) - Security audits and compliance
- ⚡ **performance-engineer** (Lime) - Performance optimization and monitoring
- 📋 **product-manager** (Indigo) - Feature planning and requirements
- 🎯 **workflow-coordinator** (White) - Orchestrates team collaboration

## 📝 Example Prompts and Agent Activation

### Simple Requests

- "Fix the login bug" → 🐛 debugger analyzes and fixes
- "Make the hero section more modern" → 🎨 ui-designer creates new design
- "Optimize the database queries" → 🗄️ database-optimizer improves performance
- "Deploy to production" → 🚀 deployment-engineer handles deployment

### Complex Requests

- "Improve the checkout flow" →
  1. 🧠 ux-designer analyzes user journey
  2. 🎨 ui-designer implements visual improvements
  3. ⚡ performance-engineer optimizes load times
  4. ✅ test-runner validates changes

- "Add Stripe payments" →
  1. 🔌 api-engineer implements payment flow
  2. 🔒 security-engineer ensures PCI compliance
  3. 🗄️ database-optimizer designs payment schema
  4. ✅ test-runner tests all payment scenarios

- "Build a review system" →
  1. 📋 product-manager defines requirements
  2. 🧠 ux-designer creates user flows
  3. 🎨 ui-designer designs interface
  4. 🔌 api-engineer builds APIs
  5. 🗄️ database-optimizer creates schema
  6. 🔒 security-engineer validates security
  7. ✅ test-runner ensures quality

## 🔄 How It Works

1. **Natural Language Processing**: Claude understands your intent from natural language
2. **Automatic Delegation**: Appropriate agents are selected based on the task
3. **Smart Sequencing**: Agents work in the optimal order
4. **Context Management**: Each agent receives only the information they need
5. **Result Synthesis**: All agent outputs are combined into a cohesive solution

## 💡 Best Practices

### Be Specific

❌ "Fix the form"
✅ "Fix the validation error on the email field in the booking form"

### Provide Context

❌ "It's not working"
✅ "The checkout button is disabled even when all fields are filled correctly"

### State Your Goals

❌ "Change the design"
✅ "Redesign the pricing section to highlight the most popular plan"

### Trust the Process

Let the agents work together - they'll handle the complex coordination automatically!

## 🧩 Common Workflows

### Feature Development

"Add user testimonials section" triggers:

1. Product planning → UX design → UI implementation → API development → Testing

### Bug Fixing

"Users can't complete checkout" triggers:

1. Debugging → Root cause analysis → Fix implementation → Security review → Testing

### Performance Optimization

"The site is loading slowly" triggers:

1. Performance analysis → Database optimization → Frontend optimization → Caching → Testing

### Security Audit

"Review security before launch" triggers:

1. Security scan → Vulnerability assessment → PCI compliance → Penetration testing

## 🎯 Advanced Usage

### Parallel Processing

Agents can work in parallel when tasks are independent:

- UI and API development can happen simultaneously
- Testing can begin while documentation is being written

### Iterative Refinement

Agents remember previous work and can iterate:

- "Make the button more prominent" → UI designer enhances previous design
- "Add more test cases" → Test runner expands existing test suite

### Cross-Functional Collaboration

Agents automatically collaborate when needed:

- Security engineer reviews API engineer's payment implementation
- Performance engineer optimizes database optimizer's schema

## 📊 Monitoring Progress

Claude will keep you informed about:

- Which agents are working
- What they're doing
- Key decisions made
- Next steps

You'll see updates like:

```
🔌 API Engineer: Implementing Stripe webhook handling...
🔒 Security Engineer: Reviewing webhook signature verification...
✅ Test Runner: Creating test cases for payment scenarios...
```

## 🚀 Getting Started

Just describe what you want to achieve, and the agent team will automatically spring into action:

- "Create a modern landing page"
- "Fix all the TypeScript errors"
- "Implement user authentication"
- "Optimize for mobile devices"
- "Add real-time notifications"

The agents will handle the rest!

---

Remember: The more context you provide, the better the results. Your agent team is here to help you build amazing features efficiently and reliably.
