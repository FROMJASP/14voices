TITLE: Configuring Web Crawler Access Rules in robots.txt for Chatwoot
DESCRIPTION: This robots.txt configuration instructs all web crawlers to avoid indexing the /widget path while allowing access to the rest of the site. The file follows the standard robots.txt protocol for controlling web crawler behavior.
SOURCE: https://github.com/chatwoot/chatwoot/blob/develop/public/robots.txt#2025-04-23_snippet_0

LANGUAGE: robots.txt
CODE:

```
User-agent: *
Disallow: /widget
```

---

TITLE: Markdown Summary Template
DESCRIPTION: Template structure for formatting chat summaries with markdown syntax, including key sections for customer intent, conversation summary, action items, and follow-up items
SOURCE: https://github.com/chatwoot/chatwoot/blob/develop/enterprise/lib/enterprise/integrations/openai_prompts/summary.txt#2025-04-23_snippet_0

LANGUAGE: markdown
CODE:

```
**Customer Intent**\n\n**Conversation Summary**\n\n**Action Items**\n\n**Follow-up Items**
```

---

TITLE: Supported Chatwoot Versions Table in Markdown
DESCRIPTION: A markdown table showing which versions of Chatwoot are supported for security vulnerability reporting. Only the latest version is supported, while older versions are not.
SOURCE: https://github.com/chatwoot/chatwoot/blob/develop/SECURITY.md#2025-04-23_snippet_0

LANGUAGE: markdown
CODE:

```
| Version | Supported        |
| ------- | --------------   |
| latest   | ️✅               |
| <latest   | ❌               |
```
