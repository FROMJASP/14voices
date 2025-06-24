TITLE: Installing Lucide React Library
DESCRIPTION: Provides the commands to install the `lucide-react` library using various package managers: pnpm, yarn, npm, and bun. This is the first step to integrating the library into a React project.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-react.md#_snippet_0

LANGUAGE: sh
CODE:
```
pnpm install lucide-react
```

LANGUAGE: sh
CODE:
```
yarn add lucide-react
```

LANGUAGE: sh
CODE:
```
npm install lucide-react
```

LANGUAGE: sh
CODE:
```
bun add lucide-react
```

----------------------------------------

TITLE: Installing Lucide with Package Managers (Shell)
DESCRIPTION: Provides commands to install the Lucide icon library using popular JavaScript package managers: pnpm, yarn, npm, and bun. Choose the command corresponding to your project's package manager.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide.md#_snippet_0

LANGUAGE: sh
CODE:
```
pnpm install lucide
```

LANGUAGE: sh
CODE:
```
yarn add lucide
```

LANGUAGE: sh
CODE:
```
npm install lucide
```

LANGUAGE: sh
CODE:
```
bun add lucide
```

----------------------------------------

TITLE: Installing Lucide via Package Managers
DESCRIPTION: Commands to install the lucide icon library using different JavaScript package managers like pnpm, npm, yarn, and bun.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/packages/lucide/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
pnpm add lucide
```

LANGUAGE: Shell
CODE:
```
npm install lucide
```

LANGUAGE: Shell
CODE:
```
yarn add lucide
```

LANGUAGE: Shell
CODE:
```
bun add lucide
```

----------------------------------------

TITLE: Installing Lucide Vue 3
DESCRIPTION: Install the lucide-vue-next package using different package managers (pnpm, npm, yarn, or bun) to add the icon library to your Vue 3 project.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/packages/lucide-vue-next/README.md#_snippet_0

LANGUAGE: sh
CODE:
```
pnpm add lucide-vue-next
```

LANGUAGE: sh
CODE:
```
npm install lucide-vue-next
```

LANGUAGE: sh
CODE:
```
yarn add lucide-vue-next
```

LANGUAGE: sh
CODE:
```
bun add lucide-vue-next
```

----------------------------------------

TITLE: Basic Usage of Lucide React Component
DESCRIPTION: Demonstrates how to import a specific icon component (e.g., `Camera`) from `lucide-react` and render it within a React functional component. Shows how to pass basic props like `color` and `size`.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-react.md#_snippet_1

LANGUAGE: jsx
CODE:
```
import { Camera } from 'lucide-react';

// Usage
const App = () => {
  return <Camera color="red" size={48} />;
};

export default App;
```

----------------------------------------

TITLE: Handling Accessibility for Icon Buttons (TSX)
DESCRIPTION: Demonstrates different approaches to providing accessible labels for icon buttons in React/TSX. It shows incorrect methods (no label, label on icon) and the preferred method using a visually hidden span element alongside the icon within the button.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/advanced/accessibility.md#_snippet_1

LANGUAGE: tsx
CODE:
```
// Don't do this
<button class="btn-icon">
  <House/>
</button>

// Don't do this either
<button class="btn-icon">
  <House aria-label="Home icon"/>
</button>

// This works but might not be the best solution, see below
<button aria-label="Go to home" class="btn-icon">
  <House/>
</button>

// Do this instead
<button class="btn-icon">
  <House/>
  <span class="visually-hidden">Go to home</span>
</button>
```

----------------------------------------

TITLE: Installing Lucide Preact
DESCRIPTION: Provides commands to install the lucide-preact package using different package managers (pnpm, yarn, npm, bun). This is the first step to integrate Lucide icons into a Preact project.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-preact.md#_snippet_0

LANGUAGE: sh
CODE:
```
pnpm install lucide-preact
```

LANGUAGE: sh
CODE:
```
yarn add lucide-preact
```

LANGUAGE: sh
CODE:
```
npm install lucide-preact
```

LANGUAGE: sh
CODE:
```
bun add lucide-preact
```

----------------------------------------

TITLE: Installing Lucide Solid
DESCRIPTION: These commands demonstrate how to install the lucide-solid package using different Node.js package managers. Choose the command corresponding to the package manager used in your project.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/packages/lucide-solid/README.md#_snippet_0

LANGUAGE: sh
CODE:
```
pnpm add lucide-solid
```

LANGUAGE: sh
CODE:
```
npm install lucide-solid
```

LANGUAGE: sh
CODE:
```
yarn add lucide-solid
```

LANGUAGE: sh
CODE:
```
bun add lucide-solid
```

----------------------------------------

TITLE: Installing Lucide Solid
DESCRIPTION: Provides commands for installing the `lucide-solid` package using various package managers (pnpm, yarn, npm, bun). This package is required to use Lucide icons in a Solid.js project.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-solid.md#_snippet_0

LANGUAGE: sh
CODE:
```
pnpm install lucide-solid
```

LANGUAGE: sh
CODE:
```
yarn add lucide-solid
```

LANGUAGE: sh
CODE:
```
npm install lucide-solid
```

LANGUAGE: sh
CODE:
```
bun add lucide-solid
```

----------------------------------------

TITLE: Basic Lucide Solid Icon Usage (Direct Import)
DESCRIPTION: Demonstrates importing a specific icon component directly from `lucide-solid` and rendering it within a Solid.js component. Shows how to pass basic props like `color` and `size`.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-solid.md#_snippet_1

LANGUAGE: jsx
CODE:
```
import { Camera } from 'lucide-solid';

// Usage
const App = () => {
  return <Camera color="red" size={48} />;
};

export default App;
```

----------------------------------------

TITLE: Installing Lucide Angular
DESCRIPTION: Instructions on how to add the `lucide-angular` package to an Angular project using different package managers.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-angular.md#_snippet_0

LANGUAGE: sh
CODE:
```
pnpm install lucide-angular
```

LANGUAGE: sh
CODE:
```
yarn add lucide-angular
```

LANGUAGE: sh
CODE:
```
npm install lucide-angular
```

LANGUAGE: sh
CODE:
```
bun add lucide-angular
```

----------------------------------------

TITLE: Using Individual Lucide Icons in Vue 3
DESCRIPTION: Example demonstrating how to import and use a specific lucide icon component in a Vue 3 setup script, passing standard lucide props like color and size.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-vue-next.md#_snippet_1

LANGUAGE: vue
CODE:
```
<script setup>
import { Camera } from 'lucide-vue-next';
</script>

<template>
  <Camera
    color="red"
    :size="32"
  />
</template>
```

----------------------------------------

TITLE: Handling Icon Accessibility Labels in TSX Buttons
DESCRIPTION: Illustrates the correct way to handle accessibility labels for icons used within buttons. It shows that adding an `aria-label` directly to the icon component is unnecessary and potentially harmful for screen readers when the button already has descriptive text content. The recommended approach is to simply include the icon without an explicit label.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/advanced/accessibility.md#_snippet_0

LANGUAGE: tsx
CODE:
```
// Don't do this
<button>
  <Plus aria-label="Plus icon"/>
  Add document
</button>

// Do this, just leave it
<button>
  <Plus/>
  Add document
</button>
```

----------------------------------------

TITLE: Install Lucide Svelte with pnpm
DESCRIPTION: Installs the lucide-svelte package using the pnpm package manager.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/packages/svelte/README.md#_snippet_0

LANGUAGE: sh
CODE:
```
pnpm add @lucide/svelte
```

----------------------------------------

TITLE: Using Individual Lucide Preact Icons
DESCRIPTION: Demonstrates how to import a specific icon component (e.g., Camera) from 'lucide-preact' and render it within a Preact component. Shows how to pass basic props like color and size to customize the icon's appearance.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-preact.md#_snippet_1

LANGUAGE: jsx
CODE:
```
import { Camera } from 'lucide-preact';

// Usage
const App = () => {
  return <Camera color="red" size={48} />;
};

export default App;
```

----------------------------------------

TITLE: Basic Lucide Icon Usage in Svelte
DESCRIPTION: Demonstrates the default way to import and use a Lucide icon component in a Svelte application. The icon is imported by name from `@lucide/svelte` and rendered as a component.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-svelte.md#_snippet_1

LANGUAGE: svelte
CODE:
```
<script>
  import { Skull } from '@lucide/svelte';
</script>

<Skull />
```

----------------------------------------

TITLE: Using Lucide Astro Default Import
DESCRIPTION: Demonstrates the basic usage of importing and rendering a Lucide icon component in an Astro file using the default import path.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-astro.md#_snippet_1

LANGUAGE: astro
CODE:
```
---
import { Skull } from '@lucide/astro';
---

<Skull />
```

----------------------------------------

TITLE: Importing and Using a Lucide Icon in React Native
DESCRIPTION: Demonstrates how to import a specific icon component (e.g., `Camera`) and render it within a React Native component, passing basic props like `color` and `size` to customize its appearance.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-react-native.md#_snippet_1

LANGUAGE: jsx
CODE:
```
import { Camera } from 'lucide-react-native';

// Usage
const App = () => {
  return <Camera color="red" size={48} />;
};

export default App;
```

----------------------------------------

TITLE: Installing Lucide for Flutter
DESCRIPTION: Add the Lucide icons package to a Flutter project using the pub package manager.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/installation.md#_snippet_0

LANGUAGE: bash
CODE:
```
flutter pub add lucide_icons
```

----------------------------------------

TITLE: Installing Lucide React Native Package
DESCRIPTION: Commands to install the `lucide-react-native` package using various JavaScript package managers.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/packages/lucide-react-native/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
pnpm add lucide-react-native
```

LANGUAGE: Shell
CODE:
```
npm install lucide-react-native
```

LANGUAGE: Shell
CODE:
```
yarn add lucide-react-native
```

LANGUAGE: Shell
CODE:
```
bun add lucide-react-native
```

----------------------------------------

TITLE: Installing Lucide Vue Package
DESCRIPTION: Provides commands to install the lucide-vue package using different JavaScript package managers: pnpm, yarn, npm, and bun.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-vue.md#_snippet_0

LANGUAGE: sh
CODE:
```
pnpm install lucide-vue
```

LANGUAGE: sh
CODE:
```
yarn add lucide-vue
```

LANGUAGE: sh
CODE:
```
npm install lucide-vue
```

LANGUAGE: sh
CODE:
```
bun add lucide-vue
```

----------------------------------------

TITLE: Install Lucide Angular with npm
DESCRIPTION: Installs the lucide-angular package using the npm package manager. This command adds the package as a dependency to your project.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/packages/lucide-angular/README.md#_snippet_1

LANGUAGE: sh
CODE:
```
npm install lucide-angular
```

----------------------------------------

TITLE: Install Lucide Angular with bun
DESCRIPTION: Installs the lucide-angular package using the bun package manager. This command adds the package as a dependency to your project.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/packages/lucide-angular/README.md#_snippet_3

LANGUAGE: sh
CODE:
```
bun add lucide-angular
```

----------------------------------------

TITLE: Importing Specific Lucide Icons with ES Modules (JavaScript)
DESCRIPTION: The recommended approach for using Lucide with ES Modules to enable tree-shaking. This snippet shows how to import only the required icon components (Menu, ArrowRight, Globe) and pass them to the createIcons function, reducing bundle size.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide.md#_snippet_5

LANGUAGE: js
CODE:
```
import { createIcons, Menu, ArrowRight, Globe } from 'lucide';

createIcons({
  icons: {
    Menu,
    ArrowRight,
    Globe
  }
});
```

----------------------------------------

TITLE: Install Lucide Angular with pnpm
DESCRIPTION: Installs the lucide-angular package using the pnpm package manager. This command adds the package as a dependency to your project.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/packages/lucide-angular/README.md#_snippet_0

LANGUAGE: sh
CODE:
```
pnpm add lucide-angular
```

----------------------------------------

TITLE: Install lucide-static Package (Shell)
DESCRIPTION: These commands demonstrate how to add the `lucide-static` package as a project dependency using different popular JavaScript package managers: pnpm, npm, yarn, and bun.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/packages/lucide-static/README.md#_snippet_0

LANGUAGE: sh
CODE:
```
pnpm add lucide-static
```

LANGUAGE: sh
CODE:
```
npm install lucide-static
```

LANGUAGE: sh
CODE:
```
yarn add lucide-static
```

LANGUAGE: sh
CODE:
```
bun add lucide-static
```

----------------------------------------

TITLE: Install Lucide Angular with yarn
DESCRIPTION: Installs the lucide-angular package using the yarn package manager. This command adds the package as a dependency to your project.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/packages/lucide-angular/README.md#_snippet_2

LANGUAGE: sh
CODE:
```
yarn add lucide-angular
```

----------------------------------------

TITLE: Install Lucide Svelte with yarn
DESCRIPTION: Installs the lucide-svelte package using the yarn package manager.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/packages/svelte/README.md#_snippet_2

LANGUAGE: sh
CODE:
```
yarn add @lucide/svelte
```

----------------------------------------

TITLE: Passing Props to Icons
DESCRIPTION: Shows how to pass input properties like `size`, `color`, and `strokeWidth` to customize the appearance of an icon component in the template.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-angular.md#_snippet_5

LANGUAGE: html
CODE:
```
<i-lucide name="house" [size]="48" color="red" [strokeWidth]="1"></i-lucide>
```

----------------------------------------

TITLE: Passing Props to Lucide Icons in Svelte
DESCRIPTION: Shows how to customize a Lucide icon's appearance by passing standard props like `color` directly to the Svelte component.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-svelte.md#_snippet_2

LANGUAGE: svelte
CODE:
```
<script>
  import { Camera } from '@lucide/svelte';
</script>

<Camera color="#ff3e98" />
```

----------------------------------------

TITLE: Using Icons in Templates (Standalone)
DESCRIPTION: Provides examples of different component tags (`lucide-angular`, `lucide-icon`, `i-lucide`, `span-lucide`) to render icons in Angular templates when using the standalone approach, referencing the imported icon component.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-angular.md#_snippet_4

LANGUAGE: html
CODE:
```
<lucide-angular [img]="FileIcon" class="my-icon"></lucide-angular>
<lucide-icon [img]="FileIcon" class="my-icon"></lucide-icon>
<i-lucide [img]="FileIcon" class="my-icon"></i-lucide>
<span-lucide [img]="FileIcon" class="my-icon"></span-lucide>
```

----------------------------------------

TITLE: Using Tailwind CSS sr-only for Icon Buttons (HTML)
DESCRIPTION: Demonstrates how to make an icon button accessible using standard HTML and Tailwind CSS's `sr-only` utility class. The icon is hidden from screen readers using `aria-hidden="true"`, and the accessible text is provided in a span with the `sr-only` class.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/advanced/accessibility.md#_snippet_4

LANGUAGE: html
CODE:
```
<div>
  <i data-lucide="phone" aria-hidden="true"></i>
  <span class="sr-only">Phone number</span>
</div>
```

----------------------------------------

TITLE: Importing LucideAngularModule (Module)
DESCRIPTION: Shows how to import the module and select specific icons for use within a standard Angular module.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-angular.md#_snippet_1

LANGUAGE: typescript
CODE:
```
import { LucideAngularModule, File, House, Menu, UserCheck } from 'lucide-angular';

@NgModule({
  imports: [
    LucideAngularModule.pick({File, House, Menu, UserCheck})
  ]
})
export class AppModule { }
```

----------------------------------------

TITLE: Dynamically Rendering Lucide Astro Icons with Types
DESCRIPTION: Demonstrates using TypeScript types provided by the package to dynamically render different icons based on data, useful for menus or lists.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-astro.md#_snippet_5

LANGUAGE: astro
CODE:
```
---
import { House, Library, Cog, type Icon as IconType } from '@lucide/astro';

type MenuItem = {
  name: string;
  href: string;
  icon: typeof IconType;
};

const menuItems: MenuItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: House,
  },
  {
    name: 'Blog',
    href: '/blog',
    icon: Library,
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: Cog,
  },
];
---

{
  menuItems.map((item) => (
    <a href={item.href}>
      <item.icon />
      <span>{item.name}</span>
    </a>
  ))
}
```

----------------------------------------

TITLE: Using Bootstrap Visually Hidden for Icon Buttons (HTML)
DESCRIPTION: Illustrates how to make an icon button accessible using standard HTML and Bootstrap's `visually-hidden` utility class. The icon is hidden from screen readers using `aria-hidden="true"`, and the accessible text is provided in a span with the `visually-hidden` class.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/advanced/accessibility.md#_snippet_3

LANGUAGE: html
CODE:
```
<div>
  <i data-lucide="phone" aria-hidden="true"></i>
  <span class="visually-hidden">Phone number</span>
</div>
```

----------------------------------------

TITLE: Basic Lucide Usage with unpkg (HTML/JS)
DESCRIPTION: A complete example showing how to include Lucide via unpkg CDN and use the data-lucide attribute on <i> tags. The lucide.createIcons() function is called to replace these tags with SVG icons.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide.md#_snippet_2

LANGUAGE: html
CODE:
```
<!DOCTYPE html>
<body>
  <i data-lucide="volume-2" class="my-class"></i>
  <i data-lucide="x"></i>
  <i data-lucide="menu"></i>

  <script src="https://unpkg.com/lucide@latest"></script>
  <script>
    lucide.createIcons();
  </script>
</body>
```

----------------------------------------

TITLE: Applying SVG Props to Lucide Icons in React Native
DESCRIPTION: Shows how to pass standard SVG attributes, such as `fill`, directly as props to a Lucide icon component to customize its appearance beyond basic `color` and `size`.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-react-native.md#_snippet_2

LANGUAGE: jsx
CODE:
```
// Usage
const App = () => {
  return <Camera fill="red" />;
};
```

----------------------------------------

TITLE: Using Icons in Templates (Module)
DESCRIPTION: Provides examples of different component tags (`lucide-angular`, `lucide-icon`, `i-lucide`, `span-lucide`) to render icons in Angular templates when using the module approach.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-angular.md#_snippet_3

LANGUAGE: html
CODE:
```
<lucide-angular name="file" class="my-icon"></lucide-angular>
<lucide-icon name="house" class="my-icon"></lucide-icon>
<i-lucide name="menu" class="my-icon"></i-lucide>
<span-lucide name="user-check" class="my-icon"></span-lucide>
```

----------------------------------------

TITLE: Using Lucide DynamicIcon Component
DESCRIPTION: Demonstrates how to use the `DynamicIcon` component for rendering icons dynamically based on their name string. This component is useful for scenarios where icon names are not known at build time, such as from a CMS. It accepts the same props as regular icon components, plus a required `name` prop.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-react.md#_snippet_4

LANGUAGE: jsx
CODE:
```
import { DynamicIcon } from 'lucide-react/dynamic';

const App = () => (
  <DynamicIcon name="camera" color="red" size={48} />
);
```

----------------------------------------

TITLE: Applying Basic Props to Lucide Astro Icon
DESCRIPTION: Shows how to pass standard Lucide props like 'color' to customize the appearance of an icon component directly.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-astro.md#_snippet_2

LANGUAGE: astro
CODE:
```
---
import { Camera } from '@lucide/astro';
---

<Camera color="#ff3e98" />
```

----------------------------------------

TITLE: Applying SVG Attributes as Props to Lucide Icons
DESCRIPTION: Shows how to pass standard SVG presentation attributes, such as 'fill', directly as props to a Lucide icon component to style the underlying SVG element.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-vue.md#_snippet_2

LANGUAGE: vue
CODE:
```
<template>
  <Camera fill="red" />
</template>
```

----------------------------------------

TITLE: Including Lucide via CDN
DESCRIPTION: HTML script tags to include the lucide library directly from a Content Delivery Network (CDN), providing options for development and production versions.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/packages/lucide/README.md#_snippet_1

LANGUAGE: HTML
CODE:
```
<!-- Development version -->
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
```

LANGUAGE: HTML
CODE:
```
<!-- Production version -->
<script src="https://unpkg.com/lucide@latest"></script>
```

----------------------------------------

TITLE: Applying Absolute Stroke Width (CSS)
DESCRIPTION: Shows how to use the `vector-effect: non-scaling-stroke` CSS property on icon children to maintain a consistent stroke width regardless of icon size.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/advanced/global-styling.md#_snippet_2

LANGUAGE: CSS
CODE:
```
.lucide > * {
  vector-effect: non-scaling-stroke;
}
```

----------------------------------------

TITLE: Styling Lucide Icons with CSS
DESCRIPTION: Demonstrates how to target all Lucide icons using the `.lucide` class and apply common CSS properties like color, size (width/height), and stroke width.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/advanced/global-styling.md#_snippet_1

LANGUAGE: CSS
CODE:
```
.lucide {
  color: blue; /* Changes icon color */
  width: 32px; /* Changes icon width */
  height: 32px; /* Changes icon height */
  stroke-width: 3; /* Changes icon stroke width */
}
```

----------------------------------------

TITLE: Applying SVG Props to Lucide React Icon
DESCRIPTION: Illustrates how to customize the appearance of a Lucide React icon component by passing standard SVG presentation attributes as props, such as `size` and `fill`.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-react.md#_snippet_2

LANGUAGE: jsx
CODE:
```
// Usage
const App = () => {
  return <Camera size={48} fill="red" />;
};
```

----------------------------------------

TITLE: Using Lucide Icon Types with svelte:component
DESCRIPTION: Provides TypeScript examples for dynamically loading icons using the `svelte:component` directive, demonstrating type definitions for both Svelte 5 and Svelte 4.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-svelte.md#_snippet_5

LANGUAGE: svelte
CODE:
```
<script lang="ts">
  import { Home, Library, Cog, type Icon as IconType } from '@lucide/svelte';

  type MenuItem = {
    name: string;
    href: string;
    icon: typeof IconType;
  };

  const menuItems: MenuItem[] = [
    {
      name: 'Home',
      href: '/',
      icon: Home
    },
    {
      name: 'Blog',
      href: '/blog',
      icon: Library
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: Cog
    }
  ];
</script>

{#each menuItems as item}
  {@const Icon = item.icon}
  <a href={item.href}>
    <Icon />
    <span>{item.name}</span>
  </a>
{/each}
```

LANGUAGE: svelte
CODE:
```
<script lang="ts">
  import { Home, Library, Cog, type Icon } from '@lucide/svelte';
  import type { ComponentType } from 'svelte';

  type MenuItem = {
    name: string;
    href: string;
    icon: ComponentType<Icon>;
  };

  const menuItems: MenuItem[] = [
    {
      name: 'Home',
      href: '/',
      icon: Home
    },
    {
      name: 'Blog',
      href: '/blog',
      icon: Library
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: Cog
    }
  ];
</script>

{#each menuItems as item}
  {@const Icon = item.icon}
  <a href={item.href}>
    <Icon />
    <span>{item.name}</span>
  </a>
{/each}

```

----------------------------------------

TITLE: Applying SVG Attributes to Lucide Icons
DESCRIPTION: Example showing how to pass standard SVG presentation attributes directly as props to a lucide icon component for styling.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-vue-next.md#_snippet_2

LANGUAGE: vue
CODE:
```
<template>
  <Camera fill="red" />
</template>
```

----------------------------------------

TITLE: Typing Lucide Icons in Svelte with JSDoc
DESCRIPTION: Demonstrates how to use JSDoc to define types for objects containing Lucide icon components, showing the difference in typing the icon property for Svelte 5 and Svelte 4, and then iterating through a list of these typed objects to render icons.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-svelte.md#_snippet_6

LANGUAGE: Svelte 5
CODE:
```
<script>
  import { Home, Library, Cog } from '@lucide/svelte';

  /**
   * @typedef {Object} MenuItem
   * @property {string} name
   * @property {string} href
   * @property {typeof import('@lucide/svelte').Icon} icon
   */

  /** @type {MenuItem[]} */
  const menuItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home
    },
    {
      name: 'Blog',
      href: '/blog',
      icon: Library
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: Cog
    }
  ];
</script>

{#each menuItems as item}
  {@const Icon = item.icon}
  <a href={item.href}>
    <Icon />
    <span>{item.name}</span>
  </a>
{/each}
```

LANGUAGE: Svelte 4
CODE:
```
<script>
  import { Home, Library, Cog } from '@lucide/svelte';

  /**
   * @typedef {Object} MenuItem
   * @property {string} name
   * @property {string} href
   * @property {import('svelte').ComponentType<import('@lucide/svelte').Icon>} icon
   */

  /** @type {MenuItem[]} */
  const menuItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
    },
    {
      name: 'Blog',
      href: '/blog',
      icon: Library,
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: Cog,
    }
  ];
</script>

{#each menuItems as item}
  {@const Icon = item.icon}
  <a href={item.href}>
    <Icon />
    <span>{item.name}</span>
  </a>
{/each}
```

----------------------------------------

TITLE: Importing LucideAngularModule (Standalone)
DESCRIPTION: Demonstrates how to import and use `LucideAngularModule` within an Angular standalone component.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-angular.md#_snippet_2

LANGUAGE: typescript
CODE:
```
import { Component } from '@angular/core';
import { LucideAngularModule, FileIcon } from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [LucideAngularModule]
})
export class AppComponent {
  readonly FileIcon = FileIcon;
}
```

----------------------------------------

TITLE: Applying SVG Props to Lucide Solid Icons
DESCRIPTION: Illustrates how to apply standard SVG presentation attributes as props directly to a Lucide icon component to customize its appearance beyond basic color and size.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-solid.md#_snippet_3

LANGUAGE: jsx
CODE:
```
// Usage
const App = () => {
  return <Camera fill="red" stroke-linejoin="bevel" />;
};
```

----------------------------------------

TITLE: Styling Icons with CSS
DESCRIPTION: Demonstrates how to use a CSS class applied to the icon component to style the internal SVG element.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-angular.md#_snippet_6

LANGUAGE: css
CODE:
```
svg.my-icon {
    width: 12px;
    height: 12px;
    stroke-width: 3;
}
```

----------------------------------------

TITLE: Using the Generic Icon Component
DESCRIPTION: Example showing how to use the custom generic Icon component created in the previous snippet, passing the icon name as a prop.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-vue-next.md#_snippet_5

LANGUAGE: vue
CODE:
```
<template>
  <div id="app">
    <Icon name="Airplay" />
  </div>
</template>
```

----------------------------------------

TITLE: Using the Generic Lucide Icon Component in Vue
DESCRIPTION: Demonstrates how to use the previously defined generic icon component, passing the desired icon name ('Airplay') via the 'name' prop.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-vue.md#_snippet_4

LANGUAGE: vue
CODE:
```
<template>
  <div id="app">
    <Icon name="Airplay" />
  </div>
</template>
```

----------------------------------------

TITLE: Applying SVG Attributes to Lucide Preact Icons
DESCRIPTION: Shows how to pass standard SVG presentation attributes directly as props to a Lucide icon component to customize its appearance. Notes that attributes like stroke-linejoin should be in kebab-case in Preact.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-preact.md#_snippet_2

LANGUAGE: jsx
CODE:
```
// Usage
const App = () => {
  return <Camera fill="red" stroke-linejoin="bevel" />;
};
```

----------------------------------------

TITLE: Importing Icons with Aliased Names (lucide-react)
DESCRIPTION: Demonstrates how the same icon (`House`) can be imported using its default name, suffixed name (`HouseIcon`), or prefixed name (`LucideHouse`) from the `lucide-react` package, illustrating the concept of aliased names.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/advanced/aliased-names.md#_snippet_0

LANGUAGE: TSX
CODE:
```
// These are all the same icon
import {
  House,
  HouseIcon,
  LucideHouse,
} from "lucide-react";
```

----------------------------------------

TITLE: Using the Icon Component for Lucide Lab Icons in React Native
DESCRIPTION: Explains how to use the generic `Icon` component provided by `lucide-react-native` to render icons from the `@lucide/lab` collection by passing the specific icon node as the `iconNode` prop.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-react-native.md#_snippet_3

LANGUAGE: jsx
CODE:
```
import { Icon } from 'lucide-react-native';
import { coconut } from '@lucide/lab';

const App = () => (
  <Icon iconNode={coconut} />
);
```

----------------------------------------

TITLE: Applying SVG Attributes as Props in Lucide Astro
DESCRIPTION: Shows how to pass standard SVG presentation attributes like 'fill' as props directly to the icon component to customize the rendered SVG element.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-astro.md#_snippet_4

LANGUAGE: astro
CODE:
```
---
import { Phone } from '@lucide/astro';
---

<Phone fill="#333" />
```

----------------------------------------

TITLE: Applying SVG Attributes to Lucide Icons in Svelte
DESCRIPTION: Explains how to apply standard SVG presentation attributes, such as `fill`, directly as props to the Lucide icon component to customize its rendering.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-svelte.md#_snippet_4

LANGUAGE: svelte
CODE:
```
<script>
  import { Phone } from '@lucide/svelte';
</script>

<Phone fill="#333" />
```

----------------------------------------

TITLE: Creating a Lucide Icon Element Manually (JavaScript)
DESCRIPTION: Demonstrates how to use the createElement function to generate an SVG icon as an HTML element directly from an imported icon component (Menu). The resulting element can then be appended to the DOM.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide.md#_snippet_7

LANGUAGE: js
CODE:
```
import { createElement, Menu } from 'lucide';

const menuIcon = createElement(Menu); // Returns HTMLElement (svg)

// Append HTMLElement in the DOM
const myApp = document.getElementById('app');
myApp.appendChild(menuIcon);
```

----------------------------------------

TITLE: Using Radix UI AccessibleIcon for Icon Buttons (TSX)
DESCRIPTION: Shows how to use Radix UI's `AccessibleIcon` component to wrap an icon and provide an accessible label. This component handles the necessary accessibility attributes internally. Requires installing `@radix-ui/react-accessible-icon`.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/advanced/accessibility.md#_snippet_2

LANGUAGE: tsx
CODE:
```
import { ArrowRightIcon } from 'lucide-react';
import { AccessibleIcon } from '@radix-ui/react-accessible-icon';

<AccessibleIcon label="Next item">
  <ArrowRightIcon />
</AccessibleIcon>
```

----------------------------------------

TITLE: Configuring createIcons with Additional Options (JavaScript)
DESCRIPTION: Shows how to pass an options object to the createIcons function to customize the generated SVG icons. Options include adding CSS classes, setting stroke width, stroke color, and changing the attribute used for the icon name (nameAttr).
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide.md#_snippet_6

LANGUAGE: js
CODE:
```
import { createIcons } from 'lucide';

createIcons({
  attrs: {
    class: ['my-custom-class', 'icon'],
    'stroke-width': 1,
    stroke: '#333'
  },
  nameAttr: 'data-lucide' // attribute for the icon name.
});
```

----------------------------------------

TITLE: Using Lucide Lab Icons in Svelte
DESCRIPTION: Shows how to import specific icons from the `@lucide/lab` package and render them using the generic `Icon` component provided by `@lucide/svelte`, demonstrating how to pass standard Lucide props like `color`.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-svelte.md#_snippet_7

LANGUAGE: svelte
CODE:
```
<script>
import { Icon } from '@lucide/svelte';
import { pear, sausage } from '@lucide/lab';
</script>

<Icon iconNode={pear} />
<Icon iconNode={sausage} color="red"/>
```

----------------------------------------

TITLE: Using the Generic Lucide Astro Icon Component
DESCRIPTION: Shows how to use the 'Icon' component with an 'iconNode' from '@lucide/lab' or custom sources to render icons not included in the main Lucide library.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-astro.md#_snippet_6

LANGUAGE: astro
CODE:
```
---
import { Icon } from '@lucide/astro';
import { burger, sausage } from '@lucide/lab';
---

<Icon iconNode={burger} />
<Icon iconNode={sausage} color="red"/>
```

----------------------------------------

TITLE: Alternative Lucide Solid Icon Import (From Icons Directory)
DESCRIPTION: Shows an alternative import method for icons by importing directly from the `lucide-solid/icons` directory. This method can help resolve performance issues with dev servers like Vite.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-solid.md#_snippet_2

LANGUAGE: jsx
CODE:
```
import Camera from 'lucide-solid/icons/camera';

// Usage
const App = () => {
  return <Camera color="red" size={48} />;
};

export default App;
```

----------------------------------------

TITLE: Import lucide-static Icons in Node.js
DESCRIPTION: Shows how to import individual Lucide icons as strings within a Node.js environment using the require syntax. Icon names are provided in camelCase.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-static.md#_snippet_6

LANGUAGE: js
CODE:
```
const { messageSquare } = require('lucide-static/lib');
```

----------------------------------------

TITLE: Importing Lucide Astro Icon Directly
DESCRIPTION: Illustrates importing an icon component directly from the '@lucide/astro/icons' directory for potentially faster build and load times by bypassing the main index.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-astro.md#_snippet_3

LANGUAGE: astro
CODE:
```
---
import CircleAlert from '@lucide/astro/icons/circle-alert';
---

<CircleAlert color="#ff3e98" />
```

----------------------------------------

TITLE: Use lucide-static via CDN
DESCRIPTION: Examples demonstrating how to include Lucide icons directly from a CDN, either as a single SVG image file or by linking to the icon font stylesheet and font file.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-static.md#_snippet_1

LANGUAGE: html
CODE:
```
<!-- SVG file for a single icon -->
<img src="https://unpkg.com/lucide-static@latest/icons/house.svg" />
```

LANGUAGE: css
CODE:
```
<!-- Icon font -->
<style>
  @font-face {
    font-family: 'LucideIcons';
    src: url(https://unpkg.com/lucide-static@latest/font/Lucide.ttf) format('truetype');
  }
</style>
```

----------------------------------------

TITLE: Creating a Lucide Icon Element with Attributes (JavaScript)
DESCRIPTION: Shows how to use the createElement function with an options object to generate an SVG icon with custom attributes, such as CSS classes, stroke width, and stroke color. The resulting element is an HTMLElement (SVG) ready to be appended to the DOM.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide.md#_snippet_8

LANGUAGE: js
CODE:
```
import { createElement, Menu } from 'lucide';

const menuIcon = createElement(Menu, {
  class: ['my-custom-class', 'icon'],
  'stroke-width': 1,
  stroke: '#333'
}); // Returns HTMLElement (svg)

// Append HTMLElement in the DOM
const myApp = document.getElementById('app');
myApp.appendChild(menuIcon);
```

----------------------------------------

TITLE: Importing Lucide Icons Directly in Svelte
DESCRIPTION: Illustrates how to import icons directly from the `@lucide/svelte/icons` directory for potentially faster build and load times.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-svelte.md#_snippet_3

LANGUAGE: svelte
CODE:
```
<script>
  import CircleAlert from '@lucide/svelte/icons/circle-alert';
</script>

<CircleAlert color="#ff3e98" />
```

----------------------------------------

TITLE: Including Lucide via CDN (HTML)
DESCRIPTION: Demonstrates how to include the Lucide icon library directly in an HTML file using Content Delivery Network (CDN) links. Includes both development and production versions.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide.md#_snippet_1

LANGUAGE: html
CODE:
```
<!-- Development version -->
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

<!-- Production version -->
<script src="https://unpkg.com/lucide@latest"></script>
```

----------------------------------------

TITLE: Install Lucide Svelte with npm
DESCRIPTION: Installs the lucide-svelte package using the npm package manager.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/packages/svelte/README.md#_snippet_1

LANGUAGE: sh
CODE:
```
npm install @lucide/svelte
```

----------------------------------------

TITLE: Using the Custom Generic Lucide Astro Icon Component
DESCRIPTION: Demonstrates how to use the previously defined generic 'LucideIcon.astro' component by passing the desired icon name as a string prop.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-astro.md#_snippet_8

LANGUAGE: astro
CODE:
```
---
import LucideIcon from './LucideIcon.astro';
---

<LucideIcon name="Menu" />
```

----------------------------------------

TITLE: Using the Generic Lucide Icon Component in Svelte
DESCRIPTION: A simple example demonstrating how to import and use the generic `LucideIcon` component created in the previous snippet, passing the desired icon name as a prop.
SOURCE: https://github.com/lucide-icons/lucide/blob/main/docs/guide/packages/lucide-svelte.md#_snippet_9

LANGUAGE: svelte
CODE:
```
<script>
  import LucideIcon from './LucideIcon';
</script>

<LucideIcon name="Menu" />
```