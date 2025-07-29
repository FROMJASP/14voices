#!/usr/bin/env bun

/**
 * FromJasp Command - Intelligent task router for Claude Code sub-agents
 *
 * This script analyzes user requests and suggests which Claude Code sub-agent
 * to use for the task. Since Claude Code handles sub-agent invocation automatically,
 * this script serves as a helper to understand request routing.
 */

interface SubAgent {
  name: string;
  description: string;
  triggers: string[];
  tools: string[];
}

const subAgents: SubAgent[] = [
  {
    name: 'product-manager',
    description: 'Transforms feature requests into actionable implementation plans',
    triggers: [
      'feature',
      'add',
      'implement',
      'integrate',
      'new',
      'functionality',
      'capability',
      'requirement',
    ],
    tools: ['context7', 'sequential-thinking', 'memory'],
  },
  {
    name: 'workflow-coordinator',
    description: 'Orchestrates UX→UI workflows for complex improvements',
    triggers: ['improve', 'enhance', 'redesign', 'better', 'easier', 'workflow'],
    tools: ['memory', 'sequential-thinking'],
  },
  {
    name: 'ui-designer',
    description: 'Implements modern UI components using component libraries',
    triggers: [
      'design',
      'create',
      'build',
      'ui',
      'component',
      'hero',
      'navbar',
      'animation',
      'modern',
      'interface',
      'visual',
      'style',
    ],
    tools: ['paceui', 'context7', 'web_fetch', 'filesystem', 'memory'],
  },
  {
    name: 'ux-designer',
    description:
      'Advocates for users by improving usability, accessibility, and pleasure in product interactions',
    triggers: [
      'ux',
      'user experience',
      'usability',
      'user flow',
      'persona',
      'journey',
      'research',
      'accessibility',
      'wireframe',
      'prototype',
      'information architecture',
    ],
    tools: ['sequential-thinking', 'memory', 'puppeteer', 'web_search', 'context7'],
  },
  {
    name: 'debugger',
    description: 'Analyzes and fixes bugs, especially UI/browser issues',
    triggers: ['fix', 'bug', 'error', 'broken', 'not working', 'debug', 'troubleshoot'],
    tools: ['puppeteer', 'sequential-thinking', 'filesystem', 'github'],
  },
  {
    name: 'database-optimizer',
    description:
      'Optimizes database queries, manages migrations, and implements advanced PostgreSQL features',
    triggers: [
      'database',
      'query',
      'migration',
      'postgres',
      'neon',
      'sql',
      'optimize',
      'index',
      'jsonb',
      'search',
    ],
    tools: ['neon', 'sequential-thinking', 'context7'],
  },
  {
    name: 'test-runner',
    description: 'QA expert for test strategy, execution, defect management, and quality metrics',
    triggers: [
      'test',
      'check',
      'verify',
      'e2e',
      'validate',
      'qa',
      'quality',
      'bug',
      'defect',
      'regression',
      'coverage',
      'test plan',
    ],
    tools: ['puppeteer', 'stripe', 'sequential-thinking', 'context7'],
  },
  {
    name: 'code-reviewer',
    description: 'Reviews code for security, best practices, and latest API usage',
    triggers: ['review', 'security', 'audit', 'validate', 'compliance', 'best practices'],
    tools: ['context7', 'sequential-thinking', 'ide', 'web_search'],
  },
  {
    name: 'deployment-engineer',
    description: 'Ensures successful Vercel deployments and diagnoses build errors',
    triggers: [
      'deploy',
      'deployment',
      'build',
      'vercel',
      'production',
      'staging',
      'rollback',
      'build error',
      'build fail',
    ],
    tools: ['context7', 'sequential-thinking', 'github', 'ide'],
  },
  {
    name: 'api-engineer',
    description: 'Designs robust APIs and implements payment processing with Stripe',
    triggers: [
      'api',
      'endpoint',
      'rest',
      'graphql',
      'webhook',
      'integration',
      'stripe',
      'payment',
      'subscription',
      'checkout',
      'auth',
      'jwt',
      'pci',
    ],
    tools: ['context7', 'sequential-thinking', 'stripe', 'web_fetch'],
  },
  {
    name: 'security-engineer',
    description:
      'Conducts security audits, penetration testing, and implements comprehensive security measures',
    triggers: [
      'security',
      'vulnerability',
      'penetration',
      'pentest',
      'owasp',
      'gdpr',
      'encryption',
      'auth',
      'hack',
      'audit',
      'threat',
      'cve',
    ],
    tools: ['context7', 'sequential-thinking', 'web_search', 'github'],
  },
  {
    name: 'performance-engineer',
    description:
      'Principal engineer defining performance strategy, capacity planning, and optimization',
    triggers: [
      'performance',
      'slow',
      'optimize',
      'speed',
      'load time',
      'core web vitals',
      'bundle',
      'cache',
      'capacity',
      'scalability',
      'load test',
      'stress test',
      'bottleneck',
    ],
    tools: ['context7', 'sequential-thinking', 'puppeteer'],
  },
];

function analyzeRequest(request: string): { agent: SubAgent | null; confidence: number } {
  const lowerRequest = request.toLowerCase();
  let bestMatch: SubAgent | null = null;
  let highestScore = 0;

  for (const agent of subAgents) {
    let score = 0;

    // Check trigger words
    for (const trigger of agent.triggers) {
      if (lowerRequest.includes(trigger)) {
        score += 10;
      }
    }

    // Bonus for multiple trigger matches
    const matchedTriggers = agent.triggers.filter((t) => lowerRequest.includes(t));
    if (matchedTriggers.length > 1) {
      score += matchedTriggers.length * 5;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = agent;
    }
  }

  const confidence = Math.min(100, (highestScore / 30) * 100);
  return { agent: bestMatch, confidence };
}

async function main() {
  const args = process.argv.slice(2);
  const request = args.join(' ');

  if (!request || request === 'help' || request === '--help') {
    console.log(`
🤖 FromJasp - Claude Code Sub-Agent Router

This command analyzes your request and suggests which sub-agent to use.
Claude Code will automatically delegate to the appropriate sub-agent.

Usage: bun fromjasp [your request]

Available Sub-Agents:
${subAgents.map((agent) => `  • ${agent.name}: ${agent.description}`).join('\n')}

Examples:
  bun fromjasp design new hero section with animated text
  bun fromjasp fix bug in admin panel where user cant click logout
  bun fromjasp test the entire checkout flow
  bun fromjasp optimize database queries for voice samples

To invoke a specific sub-agent directly in Claude:
  "Use [agent-name] to [your task]"
  Example: "Use ui-designer to create a hero section"
    `);
    process.exit(0);
  }

  console.log('\n🔍 Analyzing request...');
  console.log(`Request: "${request}"\n`);

  const { agent, confidence } = analyzeRequest(request);

  if (agent) {
    console.log(`✅ Recommended Sub-Agent: ${agent.name}`);
    console.log(`📊 Confidence: ${confidence.toFixed(0)}%`);
    console.log(`📝 Description: ${agent.description}`);
    console.log(`🔧 Required Tools: ${agent.tools.join(', ')}`);

    console.log('\n💡 How to use:');
    console.log(`1. Let Claude auto-delegate: Just describe your task naturally`);
    console.log(`2. Explicit invocation: "Use ${agent.name} to ${request}"`);

    if (confidence < 70) {
      console.log('\n⚠️  Low confidence - Claude might choose a different approach');
    }
  } else {
    console.log('❓ No specific sub-agent match found');
    console.log('💡 Claude will handle this with its general capabilities');
  }

  console.log('\n📂 Sub-agents are defined in: .claude/agents/');
  console.log('📖 Create new sub-agents with: /agents command in Claude');
}

// Run the script
main().catch((error) => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});
