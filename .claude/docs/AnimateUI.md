TITLE: Create Class Name Utility Function (TypeScript)
DESCRIPTION: This TypeScript snippet defines a utility function `cn` that takes multiple class values, processes them using `clsx` to handle conditional classes, and then merges them using `tailwind-merge` to resolve potential conflicts between Tailwind CSS classes. It requires the `clsx` and `tailwind-merge` libraries as dependencies.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/manual.mdx#_snippet_3

LANGUAGE: typescript
CODE:
```
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

----------------------------------------

TITLE: Create Vite React Project
DESCRIPTION: Initiates the creation of a new React project using the Vite build tool via npm, prompting the user to select a template like 'React + TypeScript'.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/vite.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm create vite@latest
```

----------------------------------------

TITLE: Importing and using the shadcn/ui Switch component in React (TSX)
DESCRIPTION: This React functional component demonstrates how to import the `Switch` component from the project's UI components directory and render it within a simple div element.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/laravel.mdx#_snippet_2

LANGUAGE: tsx
CODE:
```
import { Switch } from '@/components/ui/switch';

const MyPage = () => {
  return (
    <div>
      <Switch />
    </div>
  );
};

export default MyPage;
```

----------------------------------------

TITLE: Custom CollapsibleContent for DOM Persistence (TSX)
DESCRIPTION: Provides an alternative implementation of CollapsibleContent using `motion.div` and `forceMount` to prevent removal from the DOM, addressing potential SEO issues. It includes animation based on the `isOpen` state.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/radix/collapsible.mdx#_snippet_1

LANGUAGE: tsx
CODE:
```
const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  CollapsibleContentProps
>(
  (
    {
      className,
      children,
      transition = { type: 'spring', stiffness: 150, damping: 17 },
      ...props
    },
    ref,
  ) => {
    const { isOpen } = useCollapsible();

    return (
      <CollapsiblePrimitive.Content asChild forceMount ref={ref} {...props}>
        <motion.div
          layout
          initial={false}
          animate={
            isOpen
              ? { opacity: 1, height: 'auto', overflow: 'hidden' }
              : { opacity: 0, height: 0, overflow: 'hidden' }
          }
          transition={transition}
          className={className}
        >
          {children}
        </motion.div>
      </CollapsiblePrimitive.Content>
    );
  },
);
```

----------------------------------------

TITLE: Configure vite.config.ts Aliases
DESCRIPTION: Modifies the Vite configuration file to include the React and Tailwind CSS plugins and sets up a path alias ('@') that resolves to the project's 'src' directory, aligning with the tsconfig setup.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/vite.mdx#_snippet_6

LANGUAGE: typescript
CODE:
```
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

----------------------------------------

TITLE: Add shadcn/ui Component
DESCRIPTION: Uses the shadcn/ui CLI to add a specific component, such as the 'button', to the project's component directory, making it available for use.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/vite.mdx#_snippet_8

LANGUAGE: bash
CODE:
```
npx shadcn@latest add button
```

----------------------------------------

TITLE: Configuring Path Aliases in tsconfig.json (ts)
DESCRIPTION: Updates the `tsconfig.json` file to add a `baseUrl` and `paths` configuration, allowing the use of the `@/` alias for the `./app/*` directory, which is used for importing components and styles.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/tanstack.mdx#_snippet_4

LANGUAGE: ts
CODE:
```
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "Bundler",
    "module": "ESNext",
    "target": "ES2022",
    "skipLibCheck": true,
    "strictNullChecks": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./app/*"]
    }
  }
}
```

----------------------------------------

TITLE: Initialize shadcn/ui
DESCRIPTION: Runs the shadcn/ui initialization command using npx, which interactively configures the component library setup for the project and creates the components.json file.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/vite.mdx#_snippet_7

LANGUAGE: bash
CODE:
```
npx shadcn@latest init
```

----------------------------------------

TITLE: Initialize Project Configuration - shadcn CLI (bash)
DESCRIPTION: Use the `init` command to initialize configuration and dependencies for a new project. This command installs dependencies, adds the `cn` util and configures CSS variables.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/cli.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest init
```

----------------------------------------

TITLE: Initializing shadcn/ui Project (bash)
DESCRIPTION: Runs the `shadcn` CLI initialization command to set up the project for using shadcn/ui components. This command typically creates `components.json` and modifies the main CSS file.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/tanstack.mdx#_snippet_5

LANGUAGE: bash
CODE:
```
npx shadcn@canary init
```

----------------------------------------

TITLE: Configuring PostCSS for Tailwind CSS (ts)
DESCRIPTION: Creates and configures the `postcss.config.ts` file at the project root to enable the `@tailwindcss/postcss` plugin, which processes CSS using Tailwind.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/tanstack.mdx#_snippet_1

LANGUAGE: ts
CODE:
```
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

----------------------------------------

TITLE: Creating Astro Project with Tailwind and React (Bash)
DESCRIPTION: Command to initialize a new Astro project using `create-astro`, including Tailwind CSS, React integration, installing dependencies, and initializing a Git repository.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/astro.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx create-astro@latest astro-app  --template with-tailwindcss --install --add react --git
```

----------------------------------------

TITLE: Configure Tailwind CSS Import
DESCRIPTION: Replaces the default content of the main CSS file (src/index.css) with a single line importing Tailwind CSS, enabling its utility classes throughout the project.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/vite.mdx#_snippet_2

LANGUAGE: css
CODE:
```
@import 'tailwindcss';
```

----------------------------------------

TITLE: Creating TanStack Router Project with shadcn/ui (Bash)
DESCRIPTION: Initializes a new TanStack Router project using `create-tsrouter-app`. It specifies the `file-router` template, includes Tailwind CSS, and automatically adds shadcn/ui integration.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/tanstack-router.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx create-tsrouter-app@latest my-app --template file-router --tailwind --add-ons shadcn
```

----------------------------------------

TITLE: Configure shadcn/ui components.json file
DESCRIPTION: This JSON configuration file is used by shadcn/ui to determine how components are added to your project. It specifies the component style, whether to use React Server Components (RSC), TSX, Tailwind CSS configuration (config path, CSS path, base color, CSS variables, prefix), path aliases for components and utilities, and the preferred icon library.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/manual.mdx#_snippet_4

LANGUAGE: json
CODE:
```
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

----------------------------------------

TITLE: Add Tailwind CSS Dependencies
DESCRIPTION: Installs the necessary packages for integrating Tailwind CSS into the Vite project, including the core tailwindcss library and the @tailwindcss/vite plugin.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/vite.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install tailwindcss @tailwindcss/vite
```

----------------------------------------

TITLE: Configuring Component Library with components.json
DESCRIPTION: Example `components.json` file showing configuration options for the component library. Highlights the `tsx` flag used to opt-out of TypeScript and includes settings for style, Tailwind CSS, RSC, and import aliases.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/index.mdx#_snippet_3

LANGUAGE: JSON
CODE:
```
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "rsc": false,
  "tsx": false,
  "aliases": {
    "utils": "~/lib/utils",
    "components": "~/components"
  }
}
```

----------------------------------------

TITLE: Configure tsconfig.json Path Aliases
DESCRIPTION: Configures path aliases in the TypeScript configuration file to simplify imports, mapping the '@' alias to the project root.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/manual.mdx#_snippet_1

LANGUAGE: json
CODE:
```
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

----------------------------------------

TITLE: Configure tsconfig.json Paths
DESCRIPTION: Modifies the project's main TypeScript configuration file (tsconfig.json) to add 'baseUrl' and 'paths' compiler options, enabling absolute imports using the '@' alias for the 'src' directory.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/vite.mdx#_snippet_3

LANGUAGE: ts
CODE:
```
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

----------------------------------------

TITLE: Creating a new Laravel project with React and Inertia (Bash)
DESCRIPTION: This command uses the Laravel installer to create a new project named 'my-app'. The `--react` flag configures the project to use React and Inertia.js for the frontend.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/laravel.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
laravel new my-app --react
```

----------------------------------------

TITLE: Configure tsconfig.app.json Paths
DESCRIPTION: Updates the application-specific TypeScript configuration file (tsconfig.app.json) with 'baseUrl' and 'paths' to ensure IDEs correctly resolve the '@' path alias pointing to the 'src' directory.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/vite.mdx#_snippet_4

LANGUAGE: ts
CODE:
```
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
    // ...
  }
}
```

----------------------------------------

TITLE: Adding a shadcn/ui component using npx (Bash)
DESCRIPTION: This command uses npx to execute the latest version of the shadcn/ui CLI. It adds the 'switch' component to the project, typically placing it in `resources/js/components/ui/switch.tsx`.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/laravel.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npx shadcn@latest add switch
```

----------------------------------------

TITLE: Adding a shadcn/ui Component (bash)
DESCRIPTION: Uses the `shadcn` CLI to add a specific component, like the `Button`, to the project. The CLI fetches the component code and places it in the configured components directory.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/tanstack.mdx#_snippet_6

LANGUAGE: bash
CODE:
```
npx shadcn@canary add button
```

----------------------------------------

TITLE: Adding shadcn/ui Button Component (Bash)
DESCRIPTION: Uses the `shadcn` CLI tool to add the `Button` component to the project. This command fetches the component code and integrates it into the project's component directory.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/tanstack-router.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npx shadcn@canary add button
```

----------------------------------------

TITLE: Add shadcn/ui Button Component - Bash
DESCRIPTION: Adds the `Button` component from shadcn/ui to the project, downloading the necessary code and dependencies.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/react-router.mdx#_snippet_2

LANGUAGE: bash
CODE:
```
npx shadcn@latest add button
```

----------------------------------------

TITLE: Configure Global Styles and Theme Variables (CSS)
DESCRIPTION: This CSS snippet defines global styles, imports necessary libraries (Tailwind CSS, tw-animate-css), sets up CSS variables for light and dark themes using the OKLCH color space, defines a custom dark variant, maps variables to a @theme inline, and applies base styles using @layer base. It utilizes CSS variables for flexible theming.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/manual.mdx#_snippet_2

LANGUAGE: css
CODE:
```
@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.439 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.269 0 0);
  --sidebar-ring: oklch(0.439 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

----------------------------------------

TITLE: Add Components - shadcn CLI (bash)
DESCRIPTION: Use the `add` command to add components and dependencies to your project. Specify the component name as an argument.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/cli.mdx#_snippet_2

LANGUAGE: bash
CODE:
```
npx shadcn@latest add [component]
```

----------------------------------------

TITLE: Import and Use shadcn/ui Button in Next.js Page (TSX)
DESCRIPTION: Demonstrates how to import and use the shadcn/ui Button component within a Next.js page component. It shows the import path and how to render the component with basic content.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/next.mdx#_snippet_2

LANGUAGE: tsx
CODE:
```
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
}
```

----------------------------------------

TITLE: Using a shadcn/ui Component in a Route (tsx)
DESCRIPTION: Demonstrates how to import and use a shadcn/ui component, such as the `Button`, within a TanStack Start route component (`index.tsx`).
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/tanstack.mdx#_snippet_7

LANGUAGE: tsx
CODE:
```
import { Button } from '@/components/ui/button';

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
}
```

----------------------------------------

TITLE: Using the CopyButton Component (TSX)
DESCRIPTION: This snippet demonstrates the basic usage of the `CopyButton` component, showing how to provide the content to be copied using the `content` prop.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/buttons/copy.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<CopyButton content="Hello world!" />
```

----------------------------------------

TITLE: Use shadcn/ui Button Component
DESCRIPTION: Demonstrates importing and rendering the shadcn/ui Button component within a React functional component (App.tsx), showcasing its basic usage.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/vite.mdx#_snippet_9

LANGUAGE: tsx
CODE:
```
import { Button } from '@/components/ui/button';

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <Button>Click me</Button>
    </div>
  );
}

export default App;
```

----------------------------------------

TITLE: Basic Usage Example - Popover - TSX
DESCRIPTION: Demonstrates the basic structure and usage of the Popover component in TSX, including the Popover wrapper, PopoverTrigger, and PopoverContent elements.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/base/popover.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<Popover>
  <PopoverTrigger>Open Popover</PopoverTrigger>
  <PopoverContent>Popover Content</PopoverContent>
</Popover>
```

----------------------------------------

TITLE: Basic Usage of DropdownMenu TSX
DESCRIPTION: This snippet demonstrates the fundamental structure for implementing a dropdown menu using the Animate UI components, wrapping a trigger element and menu items within the main DropdownMenu container.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/radix/dropdown-menu.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<DropdownMenu>
  <DropdownMenuTrigger>Open Dropdown Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
    <DropdownMenuItem>Item 2</DropdownMenuItem>
    <DropdownMenuItem>Item 3</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

----------------------------------------

TITLE: Importing and Using shadcn/ui Button in Astro (Astro)
DESCRIPTION: Demonstrates how to import the installed `Button` component from the configured path alias (`@/components/ui/button`) and render it within an Astro page template.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/astro.mdx#_snippet_4

LANGUAGE: astro
CODE:
```
---
import { Button } from "@/components/ui/button"
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="generator" content={Astro.generator} />
		<title>Astro + TailwindCSS</title>
	</head>

	<body>
		<div class="grid place-items-center h-screen content-center">
			<Button>Button</Button>
		</div>
	</body>
</html>
```

----------------------------------------

TITLE: Basic Base UI Tooltip Usage in TSX
DESCRIPTION: This snippet demonstrates the basic structure for implementing a tooltip using Base UI components, including the provider, trigger, and content elements.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/base/tooltip.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>Tooltip content</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

----------------------------------------

TITLE: Basic Usage of Dialog Component in TSX
DESCRIPTION: This snippet demonstrates the basic structure for using the Animate UI Dialog component in TSX. It shows how to wrap the dialog content within <DialogPanel> and include standard elements like <DialogBackdrop>, <DialogHeader>, <DialogTitle>, <DialogDescription>, and <DialogFooter>.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/headless/dialog.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<Dialog>
  <DialogBackdrop />
  <DialogPanel>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <p>Dialog Content</p>
    <DialogFooter>
      <button>Close</button>
    </DialogFooter>
  </DialogPanel>
</Dialog>
```

----------------------------------------

TITLE: Basic Accordion Usage (TSX)
DESCRIPTION: Demonstrates the basic structure and usage of the Accordion component with multiple items, triggers, and content sections.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/radix/accordion.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<Accordion type="single">
  <AccordionItem>
    <AccordionTrigger>Accordion Item 1</AccordionTrigger>
    <AccordionContent>Accordion Content 1</AccordionContent>
  </AccordionItem>
  <AccordionItem>
    <AccordionTrigger>Accordion Item 2</AccordionTrigger>
    <AccordionContent>Accordion Content 2</AccordionContent>
  </AccordionItem>
  <AccordionItem>
    <AccordionTrigger>Accordion Item 3</AccordionTrigger>
    <AccordionContent>Accordion Content 3</AccordionContent>
  </AccordionItem>
</Accordion>
```

----------------------------------------

TITLE: Basic Accordion Usage (TSX)
DESCRIPTION: Shows how to structure a simple accordion with multiple items using the provided components. Each AccordionItem contains a AccordionButton (the clickable header) and an AccordionPanel (the collapsible content).
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/headless/accordion.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<Accordion>
  <AccordionItem>
    <AccordionButton>Accordion Item 1</AccordionButton>
    <AccordionPanel>Accordion Content 1</AccordionPanel>
  </AccordionItem>
  <AccordionItem>
    <AccordionButton>Accordion Item 2</AccordionButton>
    <AccordionPanel>Accordion Content 2</AccordionPanel>
  </AccordionItem>
  <AccordionItem>
    <AccordionButton>Accordion Item 3</AccordionButton>
    <AccordionPanel>Accordion Content 3</AccordionPanel>
  </AccordionItem>
</Accordion>
```

----------------------------------------

TITLE: Basic Usage of Animate UI Tabs (TSX)
DESCRIPTION: Demonstrates the basic structure for implementing the Animate UI Tabs component, including the main container, list of triggers, and content panels.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/radix/tabs.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<Tabs>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContents>
    <TabsContent value="tab1">Tab 1 Content</TabsContent>
    <TabsContent value="tab2">Tab 2 Content</TabsContent>
  </TabsContents>
</Tabs>
```

----------------------------------------

TITLE: Basic Usage of Tabs Component in TSX
DESCRIPTION: This snippet demonstrates the basic structure for implementing the Tabs component. It shows how to define a list of triggers using TabsList and TabsTrigger, and associate them with corresponding content panels using TabsContents and TabsContent, linking them via the 'value' prop.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/components/tabs.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<Tabs>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContents>
    <TabsContent value="tab1">Content 1</TabsContent>
    <TabsContent value="tab2">Content 2</TabsContent>
  </TabsContents>
</Tabs>
```

----------------------------------------

TITLE: Using Tooltip Components in TSX
DESCRIPTION: This snippet demonstrates the basic usage of the TooltipProvider, Tooltip, TooltipTrigger, and TooltipContent components to create interactive tooltips. It shows how to wrap triggers and content within Tooltip components, all nested within a TooltipProvider.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/components/tooltip.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>Tooltip content</TooltipContent>
  </Tooltip>
  <Tooltip>
    <TooltipTrigger>And me</TooltipTrigger>
    <TooltipContent>Tooltip content</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

----------------------------------------

TITLE: Using Radix UI Radio Group in TSX
DESCRIPTION: This snippet demonstrates the basic usage of the Radix UI Radio Group component in TSX. It shows how to define a group of radio buttons using `<RadioGroup>` and individual items using `<RadioGroupItem>`, assigning a unique `value` to each item.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/radix/radio-group.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<RadioGroup>
  <RadioGroupItem value="1">Radio 1</RadioGroupItem>
  <RadioGroupItem value="2">Radio 2</RadioGroupItem>
  <RadioGroupItem value="3">Radio 3</RadioGroupItem>
</RadioGroup>
```

----------------------------------------

TITLE: Basic Tooltip Usage in TSX
DESCRIPTION: This snippet demonstrates the fundamental structure for implementing a Tooltip component using the provided components, likely based on Radix UI. It shows the necessary wrapper components: TooltipProvider, Tooltip, TooltipTrigger, and TooltipContent.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/radix/tooltip.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Tooltip Trigger</TooltipTrigger>
    <TooltipContent>Tooltip Content</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

----------------------------------------

TITLE: Using the Switch Component (TSX)
DESCRIPTION: This snippet demonstrates the most basic usage of the Switch component by simply rendering it. It shows how to include the component in a TSX file.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/radix/switch.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<Switch />
```

----------------------------------------

TITLE: Install Node Types
DESCRIPTION: Installs the @types/node package as a development dependency, providing TypeScript definitions for Node.js APIs which is often necessary for build tools like Vite.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/vite.mdx#_snippet_5

LANGUAGE: bash
CODE:
```
npm install -D @types/node
```

----------------------------------------

TITLE: Basic Popover Usage with Radix UI in TSX
DESCRIPTION: Demonstrates the basic structure for implementing a Popover component using Radix UI primitives, including the main Popover container, the trigger element, and the content area.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/radix/popover.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<Popover>
  <PopoverTrigger>Open Popover</PopoverTrigger>
  <PopoverContent>Popover Content</PopoverContent>
</Popover>
```

----------------------------------------

TITLE: Basic Usage of Collapsible Component (TSX)
DESCRIPTION: Demonstrates the basic structure and usage of the Collapsible component with its trigger and content elements.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/radix/collapsible.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<Collapsible>
  <CollapsibleTrigger>Collapsible Trigger</CollapsibleTrigger>
  <CollapsibleContent>Collapsible Content</CollapsibleContent>
</Collapsible>
```

----------------------------------------

TITLE: Basic Checkbox Usage (TSX)
DESCRIPTION: This snippet demonstrates the minimal code required to render the Checkbox component using TSX. It assumes the component has been properly imported.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/radix/checkbox.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<Checkbox />
```

----------------------------------------

TITLE: Install Dependencies with npm
DESCRIPTION: Installs the required npm packages for the project, including styling utilities, icon library, and animation library.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/manual.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install class-variance-authority clsx tailwind-merge lucide-react tw-animate-css
```

----------------------------------------

TITLE: Basic Usage of ToggleGroup in TSX
DESCRIPTION: This snippet demonstrates the basic structure for rendering a ToggleGroup component using TSX. It shows how to wrap multiple ToggleGroupItem components within the main ToggleGroup container to create a set of toggleable buttons.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/radix/toggle-group.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<ToggleGroup>
  <ToggleGroupItem>A</ToggleGroupItem>
  <ToggleGroupItem>B</ToggleGroupItem>
  <ToggleGroupItem>C</ToggleGroupItem>
</ToggleGroup>
```

----------------------------------------

TITLE: Using the IconButton Component in TSX
DESCRIPTION: Demonstrates the basic usage of the IconButton component, passing a React element (Heart) as the icon prop. This shows how to render the button with a specific icon.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/buttons/icon.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<IconButton icon={Heart} />
```

----------------------------------------

TITLE: Basic Checkbox Usage (TSX)
DESCRIPTION: This snippet demonstrates the most basic implementation of the Checkbox component in a TSX environment. It shows how to render the component with default settings, assuming it has been properly imported.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/base/checkbox.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<Checkbox />
```

----------------------------------------

TITLE: Basic Switch Usage - TSX
DESCRIPTION: Demonstrates the basic usage of the Switch component in a TSX context. This snippet shows how to render the component with its default configuration.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/base/switch.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<Switch />
```

----------------------------------------

TITLE: Basic Switch Usage (TSX)
DESCRIPTION: This snippet demonstrates the simplest way to render the Switch component using TSX. It shows the basic component tag without any additional props or configuration.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/headless/switch.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<Switch />
```

----------------------------------------

TITLE: Basic Checkbox Usage (TSX)
DESCRIPTION: This snippet demonstrates the most basic usage of the Checkbox component by simply rendering the self-closing tag. This assumes the component is imported and available in the current scope.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/headless/checkbox.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
<Checkbox />
```

----------------------------------------

TITLE: shadcn init Command Usage and Options (txt)
DESCRIPTION: Detailed usage information and available options for the `shadcn init` command, including arguments for components, and flags for skipping prompts, using defaults, forcing overwrite, specifying working directory, silencing output, using src directory, and controlling CSS variables.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/cli.mdx#_snippet_1

LANGUAGE: txt
CODE:
```
Usage: shadcn init [options] [components...]

initialize your project and install dependencies

Arguments:
  components         the components to add or a url to the component.

Options:
  -y, --yes           skip confirmation prompt. (default: true)
  -d, --defaults,     use default configuration. (default: false)
  -f, --force         force overwrite of existing configuration. (default: false)
  -c, --cwd <cwd>     the working directory. defaults to the current directory. (default: "/Users/shadcn/Desktop")
  -s, --silent        mute output. (default: false)
  --src-dir           use the src directory when creating a new project. (default: false)
  --no-src-dir        do not use the src directory when creating a new project.
  --css-variables     use css variables for theming. (default: true)
  --no-css-variables  do not use css variables for theming.
  -h, --help          display help for command
```

----------------------------------------

TITLE: Importing and Using shadcn/ui Button in TanStack Router (TSX)
DESCRIPTION: Demonstrates how to import the shadcn/ui `Button` component into a TanStack Router route file (`src/routes/index.tsx`) and render it within a React component.
SOURCE: https://github.com/animate-ui/animate-ui/blob/main/content/docs/installation/tanstack-router.mdx#_snippet_2

LANGUAGE: tsx
CODE:
```
import { createFileRoute } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
}
```