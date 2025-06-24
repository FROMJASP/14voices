TITLE: Replacing AiSuggestion Resolver Function Entirely (TSX)
DESCRIPTION: This snippet demonstrates how to completely override the default `resolver` function for `AiSuggestion` in Tiptap. It grants total control over suggestion generation and their exact positioning, requiring custom logic to compute positions based on editor content and LLM output. This approach is recommended for advanced use cases.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/suggestion/custom-llms.mdx#_snippet_5

LANGUAGE: tsx
CODE:
```
AiSuggestion.configure({
  async resolver({ defaultResolver, ...options }) {
    const suggestions = await customResolver(options)
    return suggestions
  }
})
```

----------------------------------------

TITLE: Export Tiptap Editor Content as JSON
DESCRIPTION: This snippet demonstrates how to retrieve the current content of the Tiptap editor as a JSON object, which is suitable for database storage or API transmission.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/guides/output-json-html.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```
const json = editor.getJSON()
```

----------------------------------------

TITLE: Initialize Tiptap Editor in Vanilla JavaScript
DESCRIPTION: This JavaScript code initializes a new Tiptap Editor instance. It imports Editor and StarterKit, then creates an editor attached to the .element class, pre-loading it with basic content and common extensions.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/getting-started/install/vanilla-javascript.mdx#_snippet_2

LANGUAGE: js
CODE:
```
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  element: document.querySelector('.element'),
  extensions: [StarterKit],
  content: '<p>Hello World!</p>'
})
```

----------------------------------------

TITLE: Registering Tiptap AI Command with Custom Backend Completion
DESCRIPTION: This example demonstrates how to register a new Tiptap editor command, `aiCustomTextCommand`, using the `Ai.extend` method. It shows how to use `runAiTextCommand` to trigger a custom command resolution, which then calls a custom backend API for text completion. The `aiCompletionResolver` is configured to fetch a random quote from a dummy API.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/generation/custom-llms.mdx#_snippet_3

LANGUAGE: js
CODE:
```
// …
import { Ai, runAiTextCommand } from '@tiptap-pro/extension-ai-advanced'
// …

// Declare typings if TypeScript is used:
//
// declare module '@tiptap/core' {
//   interface Commands<ReturnType> {
//     ai: {
//       aiCustomTextCommand: () => ReturnType,
//     }
//   }
// }

const AiExtended = Ai.extend({
  addCommands() {
    return {
      ...this.parent?.(),

      aiCustomTextCommand:
        (options = {}) =>
        (props) => {
          // Do whatever you want; e.g. get the selected text and pass it to the specific command resolution
          return runAiTextCommand(props, 'customCommand', options)
        },
    }
  },
})

// … this is where you initialize your Tiptap editor instance and register the extended extension

const editor = new Editor{
  extensions: [
    /* … add other extension */
    AiExtended.configure({
      /* … add configuration here (appId, token etc.) */
      onError(error, context) {
        // handle error
      },
      aiCompletionResolver: async ({
        action,
        text,
        textOptions,
        extensionOptions,
        defaultResolver,
        editor,
      }) => {
        if (action === 'customCommand') {
          const response = await fetch('https://dummyjson.com/quotes/random')
          const json = await response.json()

          if (!response.ok) {
            throw new Error(`${response.status} ${json?.message}`)
          }

          return json?.quote
        }

        return defaultResolver({
          editor,
          action,
          text,
          textOptions,
          extensionOptions,
          defaultResolver,
        })
      },
    }),
  ],
  content: ''
}

// … use this to run your new command:
// editor.chain().focus().aiCustomTextCommand().run()
```

----------------------------------------

TITLE: Configure Tiptap Editor with element, extensions, and content
DESCRIPTION: To configure the Tiptap editor, pass an object with settings to the `Editor` class. This example demonstrates binding Tiptap to a DOM element, registering basic extensions (Document, Paragraph, Text), setting initial content, enabling autofocus, making the editor editable, and preventing default CSS injection.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/getting-started/configure.mdx#_snippet_0

LANGUAGE: js
CODE:
```
import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

new Editor({
  // bind Tiptap to the `.element`
  element: document.querySelector('.element'),
  // register extensions
  extensions: [Document, Paragraph, Text],
  // set the initial content
  content: '<p>Example Text</p>',
  // place the cursor in the editor after initialization
  autofocus: true,
  // make the text editable (default is true)
  editable: true,
  // prevent loading the default CSS (which isn't much anyway)
  injectCSS: false,
})
```

----------------------------------------

TITLE: Install Tiptap Document Extension
DESCRIPTION: Installs the @tiptap/extension-document package using npm, making it available for use in your project. This extension is a required dependency for any Tiptap editor setup.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/nodes/document.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install @tiptap/extension-document
```

----------------------------------------

TITLE: Install Tiptap Dependencies for Vue 3
DESCRIPTION: Install the core Tiptap packages required for Vue 3 integration: `@tiptap/vue-3` for Vue bindings, `@tiptap/pm` for ProseMirror, and `@tiptap/starter-kit` for essential extensions.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/getting-started/install/vue3.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install @tiptap/vue-3 @tiptap/pm @tiptap/starter-kit
```

----------------------------------------

TITLE: Stream Rich Text AI Responses into Tiptap Editor
DESCRIPTION: This code demonstrates how to use the `aiTextPrompt` chainable method in Tiptap to stream an AI-generated response directly into the editor. By setting `format: 'rich-text'`, the AI's output will automatically apply rich text formatting such as bold, italic, and lists, enhancing the content's presentation.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/generation/text-generation/format.mdx#_snippet_0

LANGUAGE: TypeScript
CODE:
```
// Steams the response as rich text into the editor
editor
  .chain()
  .aiTextPrompt({
    text: 'Write a list of popular programming languages',
    stream: true,
    format: 'rich-text'
  })
  .run()
```

----------------------------------------

TITLE: Toggle Mark Command Examples in JavaScript
DESCRIPTION: This snippet demonstrates various ways to use the `toggleMark` command in Tiptap. It shows how to toggle a simple mark, apply attributes like color, and utilize the `extendEmptyMarkRange` option for more control over mark removal.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/api/commands/nodes-and-marks/toggle-mark.mdx#_snippet_0

LANGUAGE: js
CODE:
```
// toggles a bold mark
editor.commands.toggleMark('bold')

// toggles bold mark with a color attribute
editor.commands.toggleMark('bold', { color: 'red' })

// toggles a bold mark with a color attribute and removes the mark across the current selection
editor.commands.toggleMark('bold', { color: 'red' }, { extendEmptyMarkRange: true })
```

----------------------------------------

TITLE: Integrate Tiptap with Vue 3 using Options API
DESCRIPTION: This Vue component (`Tiptap.vue`) demonstrates how to set up Tiptap using the Options API. It initializes the editor in `mounted` and destroys it in `beforeUnmount`, rendering the editor content via `EditorContent`.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/getting-started/install/vue3.mdx#_snippet_2

LANGUAGE: Vue
CODE:
```
<template>
  <editor-content :editor="editor" />
</template>

<script>
  import { Editor, EditorContent } from '@tiptap/vue-3'
  import StarterKit from '@tiptap/starter-kit'

  export default {
    components: {
      EditorContent,
    },

    data() {
      return {
        editor: null,
      }
    },

    mounted() {
      this.editor = new Editor({
        content: "<p>I'm running Tiptap with Vue.js. 🎉</p>",
        extensions: [StarterKit],
      })
    },

    beforeUnmount() {
      this.editor.destroy()
    },
  }
</script>
```

----------------------------------------

TITLE: Tiptap Nodes and Marks Commands Reference
DESCRIPTION: A comprehensive list of commands available in Tiptap for manipulating nodes and marks, detailing their purpose and functionality within the editor.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/api/commands/nodes-and-marks/index.mdx#_snippet_0

LANGUAGE: APIDOC
CODE:
```
clearNodes: Clears all nodes while adhering to the editor's schema.
createParagraphNear: Creates a new paragraph node near the current selection.
deleteNode: Deletes the selected node.
extendMarkRange: Expands the current selection to encompass the specified mark.
exitCode: Exits the current code block and continues editing in a new default block.
joinBackward: Joins two nodes backwards from the current selection.
joinForward: Joins two nodes forwards from the current selection.
lift: Lifts a node up into its parent node.
liftEmptyBlock: Lifts the currently selected empty textblock.
newlineInCode: Inserts a new line in the current code block.
resetAttributes: Resets specified attributes of a node to its default values.
setMark: Adds a new mark at the current selection.
setNode: Replaces a given range with a specified node.
splitBlock: Splits the current node into two nodes at the current selection.
toggleMark: Toggles a specific mark on and off at the current selection.
toggleNode: Toggles a node with another node.
toggleWrap: Wraps the current node with a new node or removes a wrapping node.
undoInputRule: Undoes the most recent input rule that was triggered.
unsetAllMarks: Removes all marks from the current selection.
unsetMark: Removes a specific mark from the current selection.
updateAttributes: Sets attributes of a node or mark to new values.
```

----------------------------------------

TITLE: Stream Content into Editor using `getWritableStream` API in TypeScript
DESCRIPTION: This example shows an alternative way to stream content directly into the editor using a `WritableStream` object. It pipes the response body content from a URL directly into the editor's writable stream.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/generation/text-generation/stream.mdx#_snippet_2

LANGUAGE: typescript
CODE:
```
editor.commands.streamContent({ from: 0, to: 10 }, async ({ getWritableStream }) => {
  const response = await fetch('https://example.com/stream')
  // This will pipe the response body content directly into the editor
  await response.body?.pipeTo(getWritableStream())
})
```

----------------------------------------

TITLE: Isolate Tiptap Editor in a Separate React Component
DESCRIPTION: Demonstrates the recommended approach for integrating Tiptap in a React application by encapsulating the editor and its dependencies within a dedicated component. This practice prevents unnecessary re-renders of the entire application when only the editor state changes, significantly improving performance.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/guides/performance.mdx#_snippet_0

LANGUAGE: jsx
CODE:
```
import { EditorContent, useEditor } from '@tiptap/react'

const TiptapEditor = () => {
  const editor = useEditor({
    extensions,
    content,
  })

  return (
    <>
      <EditorContent editor={editor} />
      {/* Other components that depend on the editor instance */}
      <MenuComponent editor={editor} />
    </>
  )
}

export default TiptapEditor
```

----------------------------------------

TITLE: Override Tiptap AI Completion Resolver for 'rephrase' Action
DESCRIPTION: Example demonstrating how to configure the Tiptap AI extension to use a custom backend for the 'rephrase' action, while routing all other actions to the default Tiptap AI service. It shows how to define `aiCompletionResolver` to conditionally fetch data from a custom endpoint.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/generation/custom-llms.mdx#_snippet_2

LANGUAGE: javascript
CODE:
```
// ...
import Ai from '@tiptap-pro/extension-ai-advanced'
// ...

Ai.configure({
  appId: 'APP_ID_HERE',
  token: 'TOKEN_HERE',
  // ...
  onError(error, context) {
    // handle error
  },
  // Define the resolver function for completions (attention: streaming and image have to be defined separately!)
  aiCompletionResolver: async ({
    editor,
    action,
    text,
    textOptions,
    extensionOptions,
    defaultResolver,
  }) => {
    // Check against action, text, whatever you like
    // Decide to use custom endpoint
    if (action === 'rephrase') {
      const response = await fetch('https://dummyjson.com/quotes/random')
      const json = await response.json()

      if (!response.ok) {
        throw new Error(`${response.status} ${json?.message}`)
      }

      return json?.quote
    }

    // Everything else is routed to the Tiptap AI service
    return defaultResolver({
      editor,
      action,
      text,
      textOptions,
      extensionOptions,
      defaultResolver,
    })
  },
})
```

----------------------------------------

TITLE: Define Lifecycle Event Listeners in a Tiptap Custom Extension
DESCRIPTION: This snippet illustrates how to create a custom Tiptap extension and attach various lifecycle event listeners. It covers hooks for editor initialization, content updates, selection changes, focus/blur events, transactions, destruction, and content errors, enabling developers to react to different editor states.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/api/events.mdx#_snippet_4

LANGUAGE: JavaScript
CODE:
```
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  onBeforeCreate({ editor }) {
    // Before the view is created.
  },
  onCreate({ editor }) {
    // The editor is ready.
  },
  onUpdate({ editor }) {
    // The content has changed.
  },
  onSelectionUpdate({ editor }) {
    // The selection has changed.
  },
  onTransaction({ editor, transaction }) {
    // The editor state has changed.
  },
  onFocus({ editor, event }) {
    // The editor is focused.
  },
  onBlur({ editor, event }) {
    // The editor isn’t focused anymore.
  },
  onDestroy() {
    // The editor is being destroyed.
  },
  onContentError({ editor, error, disableCollaboration }) {
    // The editor content does not match the schema.
  }
})
```

----------------------------------------

TITLE: Check Active Node or Mark in Tiptap Editor with isActive()
DESCRIPTION: The `isActive()` method determines if the currently selected node or mark is active. It can check for a specific node/mark by name, or for attributes regardless of the node/mark type. This is useful for UI state management, such as highlighting active formatting buttons.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/api/editor.mdx#_snippet_20

LANGUAGE: APIDOC
CODE:
```
isActive(name: string | null, attributes: Record<string, any>): boolean
  name: string | null - Name of the node or mark
  attributes: Record<string, any> - Attributes of the node or mark
```

LANGUAGE: js
CODE:
```
// Check if it’s a heading
editor.isActive('heading')
// Check if it’s a heading with a specific attribute value
editor.isActive('heading', { level: 2 })
// Check if it has a specific attribute value, doesn’t care what node/mark it is
editor.isActive({ textAlign: 'justify' })
```

----------------------------------------

TITLE: Configuring Tiptap AI for Custom Backend Streaming
DESCRIPTION: This example illustrates how to configure the Tiptap AI extension to use a custom backend in streaming mode. It focuses on defining the `aiStreamResolver` function, which is responsible for making a POST request to a streamed backend endpoint and returning a `ReadableStream<Uint8Array>` as the response body. It also notes the requirement for `aiCompletionResolver` if both streaming and non-streaming modes are desired.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/generation/custom-llms.mdx#_snippet_4

LANGUAGE: js
CODE:
```
// ...
import Ai from '@tiptap-pro/extension-ai-advanced'
// ...

Ai.configure({
  appId: 'APP_ID_HERE',
  token: 'TOKEN_HERE',
  // ...
  onError(error, context) {
    // handle error
  },
  // Define the resolver function for streams
  aiStreamResolver: async ({ action, text, textOptions }) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        ...textOptions,
        text
      })
    }

    const response = await fetch(`<YOUR_STREAMED_BACKEND_ENDPOINT>`, fetchOptions)

    if (!response.ok) {
      const json = await response.json()
      throw new Error(`${json?.error} ${json?.message}`)
    }

    return response.body
  }
})
```

----------------------------------------

TITLE: Install Tiptap Core and StarterKit via npm
DESCRIPTION: This code provides the npm command necessary to install the fundamental Tiptap packages: `@tiptap/core` for the editor's core functionality and `@tiptap/starter-kit` which bundles common extensions. These are essential dependencies for any Tiptap project setup.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/guides/migrate-from-tinymce.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install @tiptap/core @tiptap/starter-kit
```

----------------------------------------

TITLE: Listen for Tiptap Editor Content Changes
DESCRIPTION: This example illustrates how to use the `onUpdate` event to continuously monitor and react to changes in the Tiptap editor's content, enabling real-time storage or API calls.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/guides/output-json-html.mdx#_snippet_5

LANGUAGE: javascript
CODE:
```
const editor = new Editor({
  // intial content
  content: `<p>Example Content</p>`,

  // triggered on every change
  onUpdate: ({ editor }) => {
    const json = editor.getJSON()
    // send the content to an API here
  }
})
```

----------------------------------------

TITLE: Displaying Popover for Tiptap AI Suggestions in React
DESCRIPTION: Illustrates how to create and render a custom popover for selected AI suggestions within a Tiptap editor using React. It leverages `getCustomSuggestionDecoration` to insert a Prosemirror widget and `ReactDOM.createPortal` to render React components into the editor's DOM.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/suggestion/features/display-suggestions.mdx#_snippet_6

LANGUAGE: tsx
CODE:
```
// First, define a hook to store the HTML element where the popover will be rendered
const [popoverElement, setPopoverElement] = useState<HTMLElement | null>(null)

AiSuggestion.configure({
  getCustomSuggestionDecoration({ suggestion, isSelected, getDefaultDecorations }) {
    const decorations = getDefaultDecorations()

    // Then, create a Prosemirror decoration that contains the HTML element
    if (isSelected) {
      decorations.push(
        Decoration.widget(suggestion.deleteRange.to, () => {
          const element = document.createElement('span')

          setPopoverElement(element)
          return element
        }),
      )
    }
    return decorations
  },
})

const selectedSuggestion = editor.extensionStorage.aiSuggestion.getSelectedSuggestion()
if (popoverElement && selectedSuggestion) {
  // Then, add the content to the custom element. In this example, we use React Portals to render the popover inside the editor.
  ReactDOM.createPortal(<Popover suggestion={selectedSuggestion} />, popoverElement)
}
```

----------------------------------------

TITLE: TiptapCollabProvider Configuration Options
DESCRIPTION: This section details the available configuration parameters for the `TiptapCollabProvider`. These settings allow for customization of connection behavior, authentication, document handling, and debugging. It includes options for both cloud and on-premises deployments, and advanced features like connection preservation and cross-tab synchronization.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/collaboration/provider/integration.mdx#_snippet_2

LANGUAGE: APIDOC
CODE:
```
TiptapCollabProvider Configuration Parameters:
  appId: string
    Default: '' (empty)
    Description: App ID for Collaboration Cloud setups
  baseUrl: string
    Default: '' (empty)
    Description: URL for connecting to on-premises servers. Used as an alternative to `appId` for on-prem setups
  name: string
    Default: '' (empty)
    Description: The document's name
  token: string | Function | Promise
    Default: '' (empty)
    Description: Authentication token for secure connections. Supports strings, functions, and Promises
  document: Y.Doc
    Default: new Y.Doc()
    Description: The Yjs document instance. Defaults to a new document if none is provided
  user: string | null
    Default: null
    Description: User ID or name for attributing changes to the document.
  connect: boolean
    Default: true
    Description: Connects to the server after initialization
  preserveConnection: boolean
    Default: true
    Description: Keeps the WebSocket connection open after closing the provider
  broadcast: boolean
    Default: true
    Description: Enables document syncing across browser tabs
  forceSyncInterval: boolean | number
    Default: false
    Description: Forces server sync at regular intervals, in milliseconds
  quiet: boolean
    Default: false
    Description: Suppresses warning outputs
  WebSocketPolyfill: WebSocket | any
    Default: WebSocket
    Description: WebSocket implementation for Node.js environments. Use `ws` or another implementation
```

----------------------------------------

TITLE: Install Tiptap Core and Starter Kit
DESCRIPTION: Instructions to install the necessary Tiptap packages using npm. This includes the core Tiptap library and the StarterKit, which bundles common extensions.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/guides/migrate-from-draftjs.mdx#_snippet_2

LANGUAGE: bash
CODE:
```
npm install @tiptap/core @tiptap/starter-kit
```

----------------------------------------

TITLE: Configuring AiAgentToolkit with Custom Tools in TypeScript
DESCRIPTION: This snippet demonstrates how to initialize the `AiAgentToolkit` by combining the `toolsStarterKit` with a custom tool, `customSearchTool`. It shows how to extend the AI Agent's capabilities by adding new text-editing tools to its constructor.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/agent/custom-llms.mdx#_snippet_4

LANGUAGE: TypeScript
CODE:
```
import { AiAgentToolkit, toolsStarterKit } from '@tiptap-pro/extension-ai-agent-server'

const toolkit = new AiAgentToolkit({
  // The tools starter kit contains all the built-in tools
  ...toolsStarterKit(),
  // Add, for example, a tool to search the editor's content
  customSearchTool()
})
```

----------------------------------------

TITLE: Customizing Document Chunking for Tiptap AI Agent (TypeScript)
DESCRIPTION: This configuration demonstrates how to control document chunking by setting `chunkSize` (maximum characters per chunk) and providing a custom `chunkHtml` function to define how HTML content is split into an array of strings.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/agent/configure.mdx#_snippet_5

LANGUAGE: TypeScript
CODE:
```
const provider = new AiAgentProvider({
  chunkSize: 2000,
  chunkHtml: ({ html, chunkSize }) => {
    // Custom logic to split HTML into chunks
    // Must return an array of HTML strings
    return customSplitFunction(html, chunkSize)
  },
  // ... Other options
})
```

----------------------------------------

TITLE: Dynamically Update Tiptap AI Suggestion Rules
DESCRIPTION: This TypeScript example shows how to update the AI Suggestion rules after the Tiptap editor has been loaded. The `editor.commmands.setAiSuggestionRules` command is used to replace the existing rules with a new array of rule objects.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/suggestion/features/define-rules.mdx#_snippet_1

LANGUAGE: TypeScript
CODE:
```
const newRules = [
  {
    "id": "2",
    "title": "Grammar Check",
    "prompt": "Identify and correct any grammar mistakes",
    "color": "#FFA500",
    "backgroundColor": "FFF5E6"
  }
]

editor.commmands.setAiSuggestionRules(newRules)
```

----------------------------------------

TITLE: Use Tiptap StarterKit for common extensions
DESCRIPTION: Tiptap provides a `StarterKit` bundle that includes many of the most common extensions. This snippet shows the basic usage of the `StarterKit` by simply importing and adding it to the editor's extensions array.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/getting-started/configure.mdx#_snippet_3

LANGUAGE: js
CODE:
```
import StarterKit from '@tiptap/starter-kit'

new Editor({
  extensions: [StarterKit],
})
```

----------------------------------------

TITLE: Export Tiptap Editor Content as HTML
DESCRIPTION: This snippet demonstrates how to retrieve the current content of the Tiptap editor as an HTML string, useful for rendering in emails or other web contexts.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/guides/output-json-html.mdx#_snippet_2

LANGUAGE: javascript
CODE:
```
const html = editor.getHTML()
```

----------------------------------------

TITLE: React Hook for reactive threads
DESCRIPTION: This React hook, `useThreads`, demonstrates how to integrate Tiptap's thread watching into a React component. It uses `useState` to manage the thread list and `useEffect` to subscribe to thread updates via `provider.watchThreads` when the component mounts and unsubscribe via `provider.unwatchThreads` when it unmounts, ensuring the thread list remains reactive.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/comments/core-concepts/manage-threads.mdx#_snippet_4

LANGUAGE: jsx
CODE:
```
const useThreads = (provider) => {
  const [threads, setThreads] = useState([])

  useEffect(() => {
    if (!provider) {
      return () => null
    }

    const getThreads = () => {
      setThreads(provider.getThreads())
    }

    getThreads()

    provider.watchThreads(getThreads)

    return () => {
      provider.unwatchThreads(getThreads)
    }
  }, [provider])

  return threads
}
```

----------------------------------------

TITLE: Install Tiptap Editor Core and StarterKit with npm
DESCRIPTION: This command installs the essential npm packages for setting up the Tiptap Editor: @tiptap/core (the editor itself), @tiptap/pm (ProseMirror library), and @tiptap/starter-kit (common extensions).
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/getting-started/install/vanilla-javascript.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install @tiptap/core @tiptap/pm @tiptap/starter-kit
```

----------------------------------------

TITLE: Check if Chained Tiptap Commands Can Be Executed
DESCRIPTION: Illustrates how to combine `.can()` with `.chain()` to dry-run a sequence of Tiptap commands. This allows checking if an entire chain of operations, like `toggleBold()` and `toggleItalic()`, can be successfully applied before actual execution.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/api/commands/index.mdx#_snippet_7

LANGUAGE: js
CODE:
```
editor.can().chain().toggleBold().toggleItalic().run()
```

----------------------------------------

TITLE: Initialize Tiptap Editor with StarterKit
DESCRIPTION: Demonstrates how to import and pass the StarterKit extension to a new Tiptap editor instance, enabling all included extensions at once for basic editor setup.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/functionality/starterkit.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

const editor = new Editor({
  content: '<p>Example Text</p>',
  extensions: [StarterKit],
})
```

----------------------------------------

TITLE: Generate Tiptap JSON from HTML string
DESCRIPTION: The `generateJSON` function converts an HTML string into a Prosemirror JSON document. It takes the HTML string and a list of Tiptap extensions as arguments. Similar to `generateHTML`, there are `@tiptap/core` (browser-only) and `@tiptap/html` (server/browser) versions, allowing for optimized bundle sizes based on the deployment environment.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/api/utilities/html.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```
/* IN BROWSER ONLY - See below for server-side compatible package */
import { generateJSON } from '@tiptap/core'

// Generate JSON from HTML
generateJSON(`<p>On the browser only</p>`, [
  Document,
  Paragraph,
  Text,
  Bold,
  // other extensions …
])
// { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'On the browser only' }] }] }
```

LANGUAGE: javascript
CODE:
```
/* ON SERVER OR BROWSER - See above for browser only compatible package (ships less JS) */
import { generateJSON } from '@tiptap/html'

// Generate JSON from HTML
generateJSON(`<p>On the server, or the browser</p>`, [
  Document,
  Paragraph,
  Text,
  Bold,
  // other extensions …
])
// { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'On the server, or the browser' }] }] }
```

----------------------------------------

TITLE: Initialize Tiptap Editor with an HTML Element (JavaScript)
DESCRIPTION: This code demonstrates how to initialize a Tiptap editor instance and bind it to a specific HTML element using `document.querySelector('.element')`. It imports `Editor` and `StarterKit`.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/api/editor.mdx#_snippet_0

LANGUAGE: js
CODE:
```
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  element: document.querySelector('.element'),
  extensions: [StarterKit],
})
```

----------------------------------------

TITLE: Using Tiptap's insertContent Command in JavaScript
DESCRIPTION: Demonstrates various ways to insert content into the Tiptap editor using the `insertContent` command, including plain text, HTML, HTML with `parseOptions`, single JSON nodes, and multiple JSON nodes.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/api/commands/content/insert-content.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```
// Plain text
editor.commands.insertContent('Example Text')

// HTML
editor.commands.insertContent('<h1>Example Text</h1>')

// HTML with trim white space
editor.commands.insertContent('<h1>Example Text</h1>', {
  parseOptions: {
    preserveWhitespace: false,
  },
})

// JSON/Nodes
editor.commands.insertContent({
  type: 'heading',
  attrs: {
    level: 1,
  },
  content: [
    {
      type: 'text',
      text: 'Example Text',
    },
  ],
})

// Multiple nodes at once
editor.commands.insertContent([
  {
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text: 'First paragraph',
      },
    ],
  },
  {
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text: 'Second paragraph',
      },
    ],
  },
])
```

----------------------------------------

TITLE: Define Custom Tiptap Extension Event Listeners
DESCRIPTION: This snippet illustrates how to integrate various lifecycle event listeners directly into a custom Tiptap extension. It provides examples for `onCreate`, `onUpdate`, `onSelectionUpdate`, `onTransaction`, `onFocus`, `onBlur`, and `onDestroy` events, allowing for custom logic execution at different stages of the editor's lifecycle.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/extensions/custom-extensions/extend-existing.mdx#_snippet_22

LANGUAGE: js
CODE:
```
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  onCreate() {
    // The editor is ready.
  },
  onUpdate() {
    // The content has changed.
  },
  onSelectionUpdate({ editor }) {
    // The selection has changed.
  },
  onTransaction({ transaction }) {
    // The editor state has changed.
  },
  onFocus({ event }) {
    // The editor is focused.
  },
  onBlur({ event }) {
    // The editor isn’t focused anymore.
  },
  onDestroy() {
    // The editor is being destroyed.
  },
})
```

----------------------------------------

TITLE: Restore Tiptap Editor Content from HTML
DESCRIPTION: These examples show how to initialize a new Tiptap editor or update an existing one by providing content as an HTML string.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/guides/output-json-html.mdx#_snippet_3

LANGUAGE: javascript
CODE:
```
new Editor({
  content: `<p>Example Text</p>`
})
```

LANGUAGE: javascript
CODE:
```
editor.commands.setContent(`<p>Example Text</p>`)
```

----------------------------------------

TITLE: Install Tiptap core and StarterKit
DESCRIPTION: This command installs the necessary Tiptap core package and the StarterKit, which bundles common extensions, using npm. These are the foundational dependencies for setting up a Tiptap editor.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/guides/migrate-from-slate.mdx#_snippet_2

LANGUAGE: bash
CODE:
```
npm install @tiptap/core @tiptap/starter-kit
```

----------------------------------------

TITLE: Disable specific extensions in Tiptap StarterKit
DESCRIPTION: To exclude certain extensions from the `StarterKit`, set their configuration property to `false`. This example demonstrates disabling the `Undo/Redo History` extension, which is particularly useful when using Tiptap's `Collaboration` extension to prevent conflicts.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/editor/getting-started/configure.mdx#_snippet_5

LANGUAGE: js
CODE:
```
import StarterKit from '@tiptap/starter-kit'

new Editor({
  extensions: [
    StarterKit.configure({
      history: false,
    }),
  ],
})
```

----------------------------------------

TITLE: Implement Custom Toolbar in Tiptap React Editor
DESCRIPTION: This example contrasts a Slate toolbar with its Tiptap React equivalent. It illustrates how to create interactive buttons for text formatting (bold, italic, underline) by leveraging Tiptap's command chain (`editor.chain().focus().toggleX().run()`) and `isActive` checks for styling.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/guides/migrate-from-slate.mdx#_snippet_6

LANGUAGE: tsx
CODE:
```
// Slate toolbar (before)
const Toolbar = () => {
  const editor = useSlate()

  return (
    <div>
      <Button
        active={isMarkActive(editor, 'bold')}
        onMouseDown={(event) => {
          event.preventDefault()
          toggleMark(editor, 'bold')
        }}
      >
        Bold
      </Button>
    </div>
  )
}

// Tiptap equivalent (React example)
function Toolbar({ editor }) {
  if (!editor) return null

  return (
    <div className="toolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'active' : ''}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'active' : ''}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'active' : ''}
      >
        Underline
      </button>
    </div>
  )
}
```

----------------------------------------

TITLE: Create an Inline Toolbar with Tiptap BubbleMenu in React
DESCRIPTION: This React component demonstrates how to use Tiptap's `BubbleMenu` to create a context-sensitive inline toolbar that appears when text is selected. It includes basic formatting options like bold and italic, mimicking Editor.js's inline toolbar behavior.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/guides/migrate-from-editorjs.mdx#_snippet_6

LANGUAGE: tsx
CODE:
```
import { BubbleMenu } from '@tiptap/react'

function MyEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
  })

  return (
    <>
      <EditorContent editor={editor} />
      <BubbleMenu editor={editor}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'active' : ''}
        >
          Italic
        </button>
      </BubbleMenu>
    </>
  )
}
```

----------------------------------------

TITLE: Implementing Tiptap BubbleMenu for a Quill-like Toolbar
DESCRIPTION: This snippet demonstrates how to replicate Quill's bubble theme using Tiptap's BubbleMenu component. It shows how to initialize an editor, integrate the BubbleMenu, and add basic formatting buttons (Bold, Italic, Link) that interact with the editor's chain commands.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/guides/migrate-from-quill.mdx#_snippet_7

LANGUAGE: tsx
CODE:
```
import { BubbleMenu, useEditor } from '@tiptap/react'

function MyEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
  })

  return (
    <>
      <EditorContent editor={editor} />
      <BubbleMenu editor={editor}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'active' : ''}
        >
          Italic
        </button>
        <button
          onClick={() => {
            const url = window.prompt('URL')
            if (url) {
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
            }
          }}
          className={editor.isActive('link') ? 'active' : ''}
        >
          Link
        </button>
      </BubbleMenu>
    </>
  )
}
```

----------------------------------------

TITLE: Creating an Inline Toolbar with Tiptap BubbleMenu
DESCRIPTION: This snippet illustrates how to implement an inline toolbar in Tiptap using the BubbleMenu component from @tiptap/react. The BubbleMenu automatically appears when text is selected, providing contextual formatting options like bold, italic, and underline, similar to Draft.js's inline styling.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/guides/migrate-from-draftjs.mdx#_snippet_7

LANGUAGE: tsx
CODE:
```
import { BubbleMenu } from '@tiptap/react'

function MyEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
  })

  return (
    <>
      <EditorContent editor={editor} />
      <BubbleMenu editor={editor}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'active' : ''}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'active' : ''}
        >
          Underline
        </button>
      </BubbleMenu>
    </>
  )
}
```

----------------------------------------

TITLE: Implementing Custom Chunking Logic for Tiptap AI Agent (TSX)
DESCRIPTION: This snippet illustrates how to provide a custom `chunkHtml` function to the Tiptap AI Agent Provider. This function allows developers to define their own logic for splitting HTML content into chunks, overriding the default mechanism and enabling more granular control over how the document is processed.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/agent/features/reading-the-document.mdx#_snippet_1

LANGUAGE: tsx
CODE:
```
const provider = new AiAgentProvider({
  // ...other options
  chunkSize: 1000,
  chunkHtml: ({ html, chunkSize }) => {
    // Custom logic to split HTML into chunks
    // Must return an array of HTML strings
    return customSplitFunction(html, chunkSize)
  }
})
```

----------------------------------------

TITLE: Managing AI Agent Chat Messages in Tiptap (TSX)
DESCRIPTION: This snippet demonstrates the methods available for modifying the AI Agent's conversation history. It includes `addUserMessage` for inserting a single user message, `addMessages` for adding an array of various message types, and `setMessages` for completely replacing the existing conversation.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/content-ai/capabilities/agent/features/state-management.mdx#_snippet_4

LANGUAGE: tsx
CODE:
```
// Inserts a user message
provider.addUserMessage('Write a short story')

// Inserts different types of messages in the conversation
provider.addMessages([
  {
    type: 'ai',
    text: 'How can I help you?'
  }
])

// Replaces the conversation entirely
provider.setMessages([])
```

----------------------------------------

TITLE: Tiptap compareVersions with onCompare for Custom Diff Handling
DESCRIPTION: Demonstrates how to use the `onCompare` option with `compareVersions` to gain more control over the diffing result. This example shows how to filter diffs to display only changes made by a specific user.
SOURCE: https://github.com/ueberdosis/tiptap-docs/blob/main/src/content/collaboration/documents/snapshot-compare.mdx#_snippet_11

LANGUAGE: typescript
CODE:
```
editor.chain().compareVersions({
  fromVersion: 1,
  toVersion: 3,
  onCompare: (ctx) => {
    if (ctx.error) {
      // handle errors that occurred in the diffing process
      console.error(ctx.error)
      return
    }

    // filter the diffs to display only the changes made by a specific user
    const diffsToDisplay = ctx.diffSet.filter((diff) => diff.attribution.userId === 'user-1')

    editor.commands.showDiff(ctx.tr, { diffs: diffsToDisplay })
  },
})
```