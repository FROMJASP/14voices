TITLE: Create Custom asChild Prop with Radix UI Slot for Single Child
DESCRIPTION: Illustrates how to implement a custom `asChild` prop for a component. When `asChild` is true, `Slot.Root` is used to merge props onto a single child; otherwise, a standard HTML element is rendered.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/utilities/slot.mdx#_snippet_2

LANGUAGE: jsx
CODE:
```
// your-button.jsx
import * as React from "react";
import { Slot } from "radix-ui";

function Button({ asChild, ...props }) {
	const Comp = asChild ? Slot.Root : "button";
	return <Comp {...props} />;
}
```

----------------------------------------

TITLE: Implementation of Radix UI Select and SelectItem Components
DESCRIPTION: This code provides the full implementation for the custom `Select` and `SelectItem` components. It utilizes `radix-ui` primitives and React's `forwardRef` to create accessible and customizable UI elements, including handling triggers, portals, content, and item indicators.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/components/select.mdx#_snippet_34

LANGUAGE: jsx
CODE:
```
// your-select.jsx
import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon
} from "@radix-ui/react-icons";

export const Select = React.forwardRef(
	({ children, ...props }, forwardedRef) => {
		return (
			<SelectPrimitive.Root {...props}>
				<SelectPrimitive.Trigger ref={forwardedRef}>
					<SelectPrimitive.Value />
					<SelectPrimitive.Icon>
						<ChevronDownIcon />
					</SelectPrimitive.Icon>
				</SelectPrimitive.Trigger>
				<SelectPrimitive.Portal>
					<SelectPrimitive.Content>
						<SelectPrimitive.ScrollUpButton>
							<ChevronUpIcon />
						</SelectPrimitive.ScrollUpButton>
						<SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
						<SelectPrimitive.ScrollDownButton>
							<ChevronDownIcon />
						</SelectPrimitive.ScrollDownButton>
					</SelectPrimitive.Content>
				</SelectPrimitive.Portal>
			</SelectPrimitive.Root>
		);
	}
);

export const SelectItem = React.forwardRef(
	({ children, ...props }, forwardedRef) => {
		return (
			<SelectPrimitive.Item {...props} ref={forwardedRef}>
				<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
				<SelectPrimitive.ItemIndicator>
					<CheckIcon />
				</SelectPrimitive.ItemIndicator>
			</SelectPrimitive.Item>
		);
	}
);
```

----------------------------------------

TITLE: Label Radix UI Select Component for Accessibility
DESCRIPTION: This snippet illustrates two recommended approaches for associating a visual and accessible label with the Radix UI Select component using the `Label` primitive. It shows how to either wrap the `Select.Root` or link the label to the `Select.Trigger` using `htmlFor` and `id` attributes for improved accessibility.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/components/select.mdx#_snippet_32

LANGUAGE: jsx
CODE:
```
import { Select, Label } from "radix-ui";

export default () => (
	<>
		<Label>
			Country
			<Select.Root>…</Select.Root>
		</Label>

		{/* or */}

		<Label htmlFor="country">Country</Label>
		<Select.Root>
			<Select.Trigger id="country">…</Select.Trigger>
			<Select.Portal>
				<Select.Content>…</Select.Content>
			</Select.Portal>
		</Select.Root>
	</>
```

----------------------------------------

TITLE: Install Radix Themes Package
DESCRIPTION: Install the core Radix Themes package using common package managers like npm, yarn, or pnpm. This is the foundational step to integrate the component library into your project.
SOURCE: https://github.com/radix-ui/website/blob/main/data/themes/docs/overview/getting-started.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install @radix-ui/themes
```

LANGUAGE: bash
CODE:
```
yarn add @radix-ui/themes
```

LANGUAGE: bash
CODE:
```
pnpm add @radix-ui/themes
```

----------------------------------------

TITLE: Install Radix Primitives
DESCRIPTION: Install Radix Primitives from your command line using npm.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/overview/getting-started.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install radix-ui@latest
```

----------------------------------------

TITLE: Applying Mutable Aliases for Light/Dark Mode Theming in CSS and JS
DESCRIPTION: This snippet provides practical examples of implementing mutable aliases for light and dark mode theming. It demonstrates how to define base color variables and then remap them for a dark theme using CSS custom properties and JavaScript with styled-components, ensuring components like panels and shadows adjust correctly based on the active theme.
SOURCE: https://github.com/radix-ui/website/blob/main/data/colors/docs/overview/aliasing.mdx#_snippet_4

LANGUAGE: css
CODE:
```
/*
 * Note: Importing from the CDN in production is not recommended.
 * It's intended for prototyping only.
 */
@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/slate.css";
@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/slate-alpha.css";
@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/white-alpha.css";
@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/black-alpha.css";

:root {
	--panel: white;
	--panel-contrast: var(--black-a9);
	--shadow: var(--slate-a3);
	--overlay: var(--black-a8);
}

.dark {
	/* Remap your colors for dark mode */
	--panel: var(--slate-2);
	--panel-contrast: var(--white-a9);
	--shadow: black;
	--overlay: var(--black-a11);
}
```

LANGUAGE: js
CODE:
```
import styled, { ThemeProvider } from "styled-components";
import {
	slate,
	slateA,
	whiteA,
	blackA
} from "@radix-ui/colors";

const theme = {
	...slate,
	...slateA,
	...whiteA,
	...blackA,

	panel: "white",
	panelContrast: black.blackA11,
	shadow: slate.slateA3,
	overlay: slate.blackA8,
};

const darkTheme = {
	...slateDark,
	...slateDarkA,
	...whiteA,
	...blackA,

	// Remap your colors for dark mode
	panel: slate.slate2,
	panelContrast: whiteA.whiteA9,
	shadow: "black",
	overlay: blackA.blackA11,
}

<ThemeProvider theme={darkTheme}>
	// your app
</ThemeProvider>
```

----------------------------------------

TITLE: Overriding Radix Themes Accent Color with a Custom Brand Color in CSS
DESCRIPTION: Radix Themes colors can be customized by overriding their corresponding CSS variables. To replace a specific color with a custom brand color, remap the relevant token, typically step 9 of the scale used as your theme accent (e.g., `--indigo-9`). Ensure your custom CSS is applied after Radix Themes styles to take precedence.
SOURCE: https://github.com/radix-ui/website/blob/main/data/themes/docs/theme/color.mdx#_snippet_12

LANGUAGE: css
CODE:
```
.radix-themes {
	--my-brand-color: #3052f6;
	--indigo-9: var(--my-brand-color);
	--indigo-a9: var(--my-brand-color);
}
```

----------------------------------------

TITLE: Basic Theme Configuration in React
DESCRIPTION: Demonstrates how to wrap a component tree with the `Theme` component to apply global theme configurations to all its children. This example shows a simple feedback form with themed elements like `Card`, `TextArea`, `Switch`, and `Button`.
SOURCE: https://github.com/radix-ui/website/blob/main/data/themes/docs/components/theme.mdx#_snippet_1

LANGUAGE: jsx
CODE:
```
<Box maxWidth="400px">
	<Card size="2">
		<Flex direction="column" gap="3">
			<Grid gap="1">
				<Text as="div" weight="bold" size="2" mb="1">
					Feedback
				</Text>
				<TextArea placeholder="Write your feedback…" />
			</Grid>
			<Flex asChild justify="between">
				<label>
					<Text color="gray" size="2">
						Attach screenshot?
					</Text>
					<Switch size="1" defaultChecked />
				</label>
			</Flex>
			<Grid columns="2" gap="2">
				<Button variant="surface">Back</Button>
				<Button>Send</Button>
			</Grid>
		</Flex>
	</Card>
</Box>
```

----------------------------------------

TITLE: Install Radix UI Tabs Component
DESCRIPTION: Instructions to install the Radix UI Tabs component from your command line using npm.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/components/tabs.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-tabs
```

----------------------------------------

TITLE: Wrap Application with Radix Themes Provider
DESCRIPTION: Integrate the `Theme` component by wrapping your application's root component within it, typically inside the `body` tag. This component acts as a provider for Radix Themes' styling and context.
SOURCE: https://github.com/radix-ui/website/blob/main/data/themes/docs/overview/getting-started.mdx#_snippet_2

LANGUAGE: jsx
CODE:
```
import { Theme } from "@radix-ui/themes";

export default function () {
	return (
		<html>
			<body>
				<Theme>
					<MyApp />
				</Theme>
			</body>
		</html>
	);
}
```

----------------------------------------

TITLE: Basic Usage of Radix Themes UI Components
DESCRIPTION: Demonstrates how to import and use fundamental Radix Themes components like `Flex`, `Text`, and `Button`. This example illustrates creating a simple column layout with text and a button.
SOURCE: https://github.com/radix-ui/website/blob/main/data/themes/docs/overview/getting-started.mdx#_snippet_3

LANGUAGE: jsx
CODE:
```
import { Flex, Text, Button } from "@radix-ui/themes";

export default function MyApp() {
	return (
		<Flex direction="column" gap="2">
			<Text>Hello from Radix Themes :)</Text>
			<Button>Let's go</Button>
		</Flex>
	);
}
```

----------------------------------------

TITLE: Install Radix UI Collapsible Component
DESCRIPTION: Instructions to install the Radix UI Collapsible component from the command line using npm.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/components/collapsible.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-collapsible
```

----------------------------------------

TITLE: Install Radix UI Form Component
DESCRIPTION: Install the Radix UI Form component from your command line using npm.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/components/form.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-form
```

----------------------------------------

TITLE: Install Radix UI Radio Group Component
DESCRIPTION: Instructions to install the Radix UI Radio Group component from the command line using npm.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/components/radio-group.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-radio-group
```

----------------------------------------

TITLE: Rename Radix UI Color Scales
DESCRIPTION: This code snippet demonstrates how to rename Radix UI color scales to custom, more intuitive, or brand-specific names. It provides examples for both CSS (using custom properties and CDN imports for prototyping) and JavaScript (using module imports). The CSS example renames `--slate` to `--gray`, `--sky` to `--blue`, `--grass` to `--green`, `--violet` to `--blurple`, and `--crimson` to `--caribbean-sunset`. The JavaScript example achieves the same by mapping imported color objects to new property names within a theme object.
SOURCE: https://github.com/radix-ui/website/blob/main/data/colors/docs/overview/aliasing.mdx#_snippet_5

LANGUAGE: css
CODE:
```
/*
 * Note: Importing from the CDN in production is not recommended.
 * It's intended for prototyping only.
 */
@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/slate.css";
@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/sky.css";
@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/grass.css";
@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/violet.css";
@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/crimson.css";

:root {
	--gray-1: var(--slate-1);
	--gray-2: var(--slate-2);

	--blue-1: var(--sky-1);
	--blue-2: var(--sky-2);

	--green-1: var(--grass-1);
	--green-2: var(--grass-2);

	--blurple-1: var(--violet-1);
	--blurple-2: var(--violet-2);

	--caribbean-sunset-1: var(--crimson-1);
	--caribbean-sunset-2: var(--crimson-2);
}
```

LANGUAGE: js
CODE:
```
import {
	slate,
	sky,
	grass,
	violet,
	crimson
} from "@radix-ui/colors";

const theme = {
	gray1: slate.slate1,
	gray2: slate.slate2,

	blue1: sky.sky1,
	blue2: sky.sky2,

	green1: grass.grass1,
	green2: grass.grass2,

	blurple1: violet.violet1,
	blurple2: violet.violet2,

	caribbeanSunset1: crimson.crimson1,
	caribbeanSunset2: crimson.crimson2,
};
```

----------------------------------------

TITLE: Radix UI Context Menu Anatomy (JSX)
DESCRIPTION: Demonstrates the basic structure and composition of the Radix UI Context Menu component using its various parts like Root, Trigger, Portal, Content, Label, Item, Group, CheckboxItem, RadioGroup, Sub, SubTrigger, SubContent, and Separator.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/components/context-menu.mdx#_snippet_1

LANGUAGE: jsx
CODE:
```
import { ContextMenu } from "radix-ui";

export default () => (
	<ContextMenu.Root>
		<ContextMenu.Trigger />

		<ContextMenu.Portal>
			<ContextMenu.Content>
				<ContextMenu.Label />
				<ContextMenu.Item />

				<ContextMenu.Group>
					<ContextMenu.Item />
				</ContextMenu.Group>

				<ContextMenu.CheckboxItem>
					<ContextMenu.ItemIndicator />
				</ContextMenu.CheckboxItem>

				<ContextMenu.RadioGroup>
					<ContextMenu.RadioItem>
						<ContextMenu.ItemIndicator />
					</ContextMenu.RadioItem>
				</ContextMenu.RadioGroup>

				<ContextMenu.Sub>
					<ContextMenu.SubTrigger />
					<ContextMenu.Portal>
						<ContextMenu.SubContent />
					</ContextMenu.Portal>
				</ContextMenu.Sub>

				<ContextMenu.Separator />
			</ContextMenu.Content>
		</ContextMenu.Portal>
	</ContextMenu.Root>
);
```

----------------------------------------

TITLE: Install Radix UI Visually Hidden Component
DESCRIPTION: Installs the `@radix-ui/react-visually-hidden` package using npm, making the component available for use in your project.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/utilities/visually-hidden.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-visually-hidden
```

----------------------------------------

TITLE: Import and Structure Radix Popover Parts (JSX)
DESCRIPTION: Imports the necessary Popover components from Radix UI and structures them into a basic functional component, demonstrating the root, trigger, portal, content, and arrow elements for a simple Popover.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/overview/getting-started.mdx#_snippet_1

LANGUAGE: jsx
CODE:
```
// index.jsx
import * as React from "react";
import { Popover } from "radix-ui";

const PopoverDemo = () => (
	<Popover.Root>
		<Popover.Trigger>More info</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content>
				Some more info…
				<Popover.Arrow />
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
);

export default PopoverDemo;
```

----------------------------------------

TITLE: Accessing Radix UI Theme Shadow Tokens in CSS
DESCRIPTION: This CSS snippet demonstrates how to access the predefined shadow tokens using CSS variables. Each token corresponds to a specific shadow style and is typically used for different component types, such as inset shadows, classic panels, smaller overlays, and larger overlays, ensuring consistency with the theme.
SOURCE: https://github.com/radix-ui/website/blob/main/data/themes/docs/theme/shadows.mdx#_snippet_0

LANGUAGE: css
CODE:
```
/* Inset shadow */
var(--shadow-1);

/* Shadows for variant="classic" panels, like Card */
var(--shadow-2);
var(--shadow-3);

/* Shadows for smaller overlay panels, like Hover Card and Popover */
var(--shadow-4);
var(--shadow-5);

/* Shadows for larger overlay panels, like Dialog */
var(--shadow-6);
```

----------------------------------------

TITLE: Ensuring Custom Components Spread Props for Radix asChild
DESCRIPTION: Explains the requirement for custom React components used with `asChild` to spread all received props onto their underlying DOM node. This ensures Radix can pass necessary props and event handlers for functionality and accessibility, recommending this as a general good practice for leaf components.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/guides/composition.mdx#_snippet_1

LANGUAGE: jsx
CODE:
```
// before
const MyButton = () => <button />;

// after
const MyButton = (props) => <button {...props} />;
```

----------------------------------------

TITLE: Basic Tooltip Usage with Radix UI
DESCRIPTION: This JSX snippet demonstrates how to implement a basic Tooltip component using Radix UI. It wraps an IconButton with a Tooltip, providing contextual information 'Add to library' when hovered or focused. This setup is common for enhancing user interfaces with helpful hints.
SOURCE: https://github.com/radix-ui/website/blob/main/data/themes/docs/components/tooltip.mdx#_snippet_0

LANGUAGE: jsx
CODE:
```
<Tooltip content="Add to library">
	<IconButton radius="full">
		<PlusIcon />
	</IconButton>
</Tooltip>
```

----------------------------------------

TITLE: Composing Radix Tooltip Trigger with an Anchor Tag using asChild
DESCRIPTION: Demonstrates how to change the default `Tooltip.Trigger` element type from a `button` to an `a` tag by setting `asChild` to `true`. This allows Radix's functionality to be applied to a custom link element, while emphasizing the developer's responsibility for accessibility.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/guides/composition.mdx#_snippet_0

LANGUAGE: jsx
CODE:
```
import * as React from "react";
import { Tooltip } from "radix-ui";

export default () => (
	<Tooltip.Root>
		<Tooltip.Trigger asChild>
			<a href="https://www.radix-ui.com/">Radix UI</a>
		</Tooltip.Trigger>
		<Tooltip.Portal>…</Tooltip.Portal>
	</Tooltip.Root>
);
```

----------------------------------------

TITLE: Applying Radix Themes Box Props to Custom Elements with asChild
DESCRIPTION: This JSX example demonstrates how to use Radix Themes' Box component with the 'asChild' prop to apply layout properties, such as margin, to a custom HTML element. It illustrates a common scenario where custom CSS import order can unintentionally override Radix Themes' utility props.
SOURCE: https://github.com/radix-ui/website/blob/main/data/themes/docs/overview/styling.mdx#_snippet_3

LANGUAGE: jsx
CODE:
```
import "@radix-ui/themes/styles.css";
import "./my-styles.css";

function MyApp() {
	return (
		<Theme>
			<Box asChild m="5">
				<p className="my-paragraph">My custom paragraph</p>
			</Box>
		</Theme>
	);
}
```

----------------------------------------

TITLE: Map Multiple Semantic Aliases to a Single Color Scale
DESCRIPTION: Illustrates how to assign multiple semantic aliases (e.g., accent and info both to blue, success and valid both to green) to the same underlying color scale. This addresses scenarios where a single color might represent different semantic meanings (e.g., yellow for both warning and pending).
SOURCE: https://github.com/radix-ui/website/blob/main/data/colors/docs/overview/aliasing.mdx#_snippet_1

LANGUAGE: css
CODE:
```
/*
 * Note: Importing from the CDN in production is not recommended.
 * It's intended for prototyping only.
 */
@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/blue.css";
@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/green.css";
@import "https://cdn.jsdelivr.net/npm/@radix-ui/colors@latest/yellow.css";

:root {
	--accent-1: var(--blue-1);
	--accent-2: var(--blue-2);
	--info-1: var(--blue-1);
	--info-2: var(--blue-2);

	--success-1: var(--green-1);
	--success-2: var(--green-2);
	--valid-1: var(--green-1);
	--valid-2: var(--green-2);

	--warning-1: var(--yellow-1);
	--warning-2: var(--yellow-2);
	--pending-1: var(--yellow-1);
	--pending-2: var(--yellow-2);
}
```

LANGUAGE: js
CODE:
```
import {
	blue,
	green,
	yellow
} from "@radix-ui/colors";

const theme = {
	...blue,
	...green,
	...yellow,

	accent1: blue.blue1,
	accent2: blue.blue2,
	info1: blue.blue1,
	info2: blue.blue2,

	success1: green.green1,
	success2: green.green2,
	valid1: green.green1,
	valid2: green.green2,

	warning1: yellow.yellow1,
	warning2: yellow.yellow2,
	pending1: yellow.yellow1,
	pending2: yellow.yellow2,
};
```

----------------------------------------

TITLE: Control Vertical Spacing with `trim` on Heading and Text
DESCRIPTION: Illustrates how `trim` can be applied to `Heading` and `Text` components within a `Box` to fine-tune vertical spacing, making components appear more balanced. It shows `trim="start"` for `Heading` and `trim="end"` for `Text`.
SOURCE: https://github.com/radix-ui/website/blob/main/data/themes/docs/components/text.mdx#_snippet_9

LANGUAGE: jsx
CODE:
```
<Flex direction="column" gap="3">
	<Box
		style={{
			background: "var(--gray-a2)",
			border: "1px dashed var(--gray-a7)",
		}}
		p="4"
	>
		<Heading mb="1" size="3">
			Without trim
		</Heading>
		<Text>
			The goal of typography is to relate font size, line height, and line width
			in a proportional way that maximizes beauty and makes reading easier and
			more pleasant.
		</Text>
	</Box>

	<Box
		p="4"
		style={{
			background: "var(--gray-a2)",
			border: "1px dashed var(--gray-a7)",
		}}
	>
		<Heading mb="1" size="3" trim="start">
			With trim
		</Heading>
		<Text trim="end">
			The goal of typography is to relate font size, line height, and line width
			in a proportional way that maximizes beauty and makes reading easier and
			more pleasant.
		</Text>
	</Box>
</Flex>
```

----------------------------------------

TITLE: Basic Usage of Radix UI Select Component
DESCRIPTION: This snippet demonstrates how to import and use the custom `Select` component along with `SelectItem` children in a React application. It shows how to set a default selected value for the component.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/components/select.mdx#_snippet_33

LANGUAGE: jsx
CODE:
```
import { Select, SelectItem } from "./your-select";

export default () => (
	<Select defaultValue="2">
		<SelectItem value="1">Item 1</SelectItem>
		<SelectItem value="2">Item 2</SelectItem>
		<SelectItem value="3">Item 3</SelectItem>
	</Select>
);
```

----------------------------------------

TITLE: Basic Radix UI Tabs Component Usage
DESCRIPTION: Demonstrates the fundamental structure of the Radix UI Tabs component, including `Tabs.Root`, `Tabs.List`, `Tabs.Trigger`, and `Tabs.Content` to display different sections of information. The `defaultValue` prop sets the initially active tab.
SOURCE: https://github.com/radix-ui/website/blob/main/data/themes/docs/components/tabs.mdx#_snippet_0

LANGUAGE: jsx
CODE:
```
<Tabs.Root defaultValue="account">
	<Tabs.List>
		<Tabs.Trigger value="account">Account</Tabs.Trigger>
		<Tabs.Trigger value="documents">Documents</Tabs.Trigger>
		<Tabs.Trigger value="settings">Settings</Tabs.Trigger>
	</Tabs.List>

	<Box pt="3">
		<Tabs.Content value="account">
			<Text size="2">Make changes to your account.</Text>
		</Tabs.Content>

		<Tabs.Content value="documents">
			<Text size="2">Access and update your documents.</Text>
		</Tabs.Content>

		<Tabs.Content value="settings">
			<Text size="2">Edit your profile or update contact information.</Text>
		</Tabs.Content>
	</Box>
</Tabs.Root>
```

----------------------------------------

TITLE: Basic Grid Layout with Fixed Columns and Rows
DESCRIPTION: Demonstrates a basic Radix UI Grid component with 3 columns, 2 rows of 64px height, and a gap of 3 units between items. It uses `DecorativeBox` components as children to visualize the grid cells.
SOURCE: https://github.com/radix-ui/website/blob/main/data/themes/docs/components/grid.mdx#_snippet_0

LANGUAGE: jsx
CODE:
```
<Grid columns="3" gap="3" rows="repeat(2, 64px)" width="auto">
	<DecorativeBox />
	<DecorativeBox />
	<DecorativeBox />
	<DecorativeBox />
	<DecorativeBox />
	<DecorativeBox />
</Grid>
```

----------------------------------------

TITLE: Basic Flex Layout Example with Radix UI
DESCRIPTION: Demonstrates a simple flex container using the Radix UI `Flex` component with a `gap` prop to space out multiple `Box` children. This snippet illustrates how to quickly create a row of elements with consistent spacing.
SOURCE: https://github.com/radix-ui/website/blob/main/data/themes/docs/components/flex.mdx#_snippet_0

LANGUAGE: jsx
CODE:
```
<Flex gap="3">
	<Box width="64px" height="64px">
		<DecorativeBox />
	</Box>
	<Box width="64px" height="64px">
		<DecorativeBox />
	</Box>
	<Box width="64px" height="64px">
		<DecorativeBox />
	</Box>
	<Box width="64px" height="64px">
		<DecorativeBox />
	</Box>
	<Box width="64px" height="64px">
		<DecorativeBox />
	</Box>
</Flex>
```

----------------------------------------

TITLE: Extending a Radix primitive React component
DESCRIPTION: Extending a primitive is done the same way you extend any React component. This example shows how to create a custom `AccordionItem` component by forwarding refs and props from the base Radix primitive.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/guides/styling.mdx#_snippet_4

LANGUAGE: tsx
CODE:
```
import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";

const AccordionItem = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>((props, forwardedRef) => (
	<AccordionPrimitive.Item {...props} ref={forwardedRef} />
));
AccordionItem.displayName = "AccordionItem";
```

----------------------------------------

TITLE: Integrating Radix UI NavigationMenu with Client-Side Routing (Next.js)
DESCRIPTION: This example illustrates how to compose Radix UI's `NavigationMenu.Link` with a client-side routing package's `Link` component, such as Next.js, to ensure accessibility and consistent keyboard control. It includes a custom `Link` wrapper and basic CSS for active link styling.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/components/navigation-menu.mdx#_snippet_18

LANGUAGE: jsx
CODE:
```
// index.jsx
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { NavigationMenu } from "radix-ui";
import "./styles.css";

const Link = ({ href, ...props }) => {
	const pathname = usePathname();
	const isActive = href === pathname;

	return (
		<NavigationMenu.Link asChild active={isActive}>
			<NextLink href={href} className="NavigationMenuLink" {...props} />
		</NavigationMenu.Link>
	);
};

export default () => (
	<NavigationMenu.Root>
		<NavigationMenu.List>
			<NavigationMenu.Item>
				<Link href="/">Home</Link>
			</NavigationMenu.Item>
			<NavigationMenu.Item>
				<Link href="/about">About</Link>
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu.Root>
);
```

LANGUAGE: css
CODE:
```
/* styles.css */
.NavigationMenuLink {
	text-decoration: none;
}
.NavigationMenuLink[data-active] {
	text-decoration: "underline";
}
```

----------------------------------------

TITLE: Radix UI Slider Custom API Implementation
DESCRIPTION: Provides the implementation details for a custom Radix UI Slider component, abstracting the primitive parts from `radix-ui` into a reusable `Slider` component.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/components/slider.mdx#_snippet_12

LANGUAGE: jsx
CODE:
```
// your-slider.jsx
import { Slider as SliderPrimitive } from "radix-ui";

export const Slider = React.forwardRef((props, forwardedRef) => {
	const value = props.value || props.defaultValue;

	return (
		<SliderPrimitive.Slider {...props} ref={forwardedRef}>
			<SliderPrimitive.Track>
				<SliderPrimitive.Range />
			</SliderPrimitive.Track>
			{value.map((_, i) => (
				<SliderPrimitive.Thumb key={i} />
			))}
		</SliderPrimitive.Slider>
	);
});
```

----------------------------------------

TITLE: Forwarding Refs in Custom Components for Radix asChild
DESCRIPTION: Illustrates how custom React components integrated with `asChild` must forward refs using `React.forwardRef`. This allows Radix to attach refs for purposes like measuring component size, ensuring proper integration and recommending this as a general good practice for leaf components.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/guides/composition.mdx#_snippet_2

LANGUAGE: jsx
CODE:
```
// before
const MyButton = (props) => <button {...props} />;

// after
const MyButton = React.forwardRef((props, forwardedRef) => (
	<button {...props} ref={forwardedRef} />
));
```

----------------------------------------

TITLE: Control Select Trigger Value with Radix UI
DESCRIPTION: This snippet demonstrates how to programmatically control the value displayed in the Radix UI Select trigger using the `value` and `onValueChange` props. It also shows how to render custom content within `Select.Value` for greater flexibility, while emphasizing accessibility considerations.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/components/select.mdx#_snippet_29

LANGUAGE: jsx
CODE:
```
const countries = { france: "🇫🇷", "united-kingdom": "🇬🇧", spain: "🇪🇸" };

export default () => {
	const [value, setValue] = React.useState("france");
	return (
		<Select.Root value={value} onValueChange={setValue}>
			<Select.Trigger>
				<Select.Value aria-label={value}>
					{countries[value]}
				</Select.Value>
				<Select.Icon />
			</Select.Trigger>
			<Select.Portal>
			<Select.Content>
				<Select.Viewport>
					<Select.Item value="france">
						<Select.ItemText>France</Select.ItemText>
						<Select.ItemIndicator>…</Select.ItemIndicator>
					</Select.Item>
					<Select.Item value="united-kingdom">
						<Select.ItemText>United Kingdom</Select.ItemText>
						<Select.ItemIndicator>…</Select.ItemIndicator>
					</Select.Item>
					<Select.Item value="spain">
						<Select.ItemText>Spain</Select.ItemText>
						<Select.ItemIndicator>…</Select.ItemIndicator>
					</Select.Item>
				</Select.Viewport>
			</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
};
```

----------------------------------------

TITLE: Customize Font Families with CSS Variables
DESCRIPTION: Shows how to remap Radix Themes' `font-family` CSS tokens to apply custom fonts across different components like default text, headings, code, strong, emphasis, and quotes. This requires applying custom CSS after Radix Themes styles.
SOURCE: https://github.com/radix-ui/website/blob/main/data/themes/docs/theme/typography.mdx#_snippet_4

LANGUAGE: css
CODE:
```
.radix-themes {
	--default-font-family:  /* Your custom default font */ --heading-font-family:
		/* Your custom font for <Heading> components */ --code-font-family:
		/* Your custom font for <Code> components */ --strong-font-family:
		/* Your custom font for <Strong> components */ --em-font-family:
		/* Your custom font for <Em> components */ --quote-font-family:
		/* Your custom font for <Quote> components */;
}
```

----------------------------------------

TITLE: Basic Radix UI Popover Anatomy
DESCRIPTION: Demonstrates the basic structure and required parts for a Radix UI Popover component, showing how to import and assemble its elements.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/components/popover.mdx#_snippet_1

LANGUAGE: jsx
CODE:
```
import { Popover } from "radix-ui";

export default () => (
	<Popover.Root>
		<Popover.Trigger />
		<Popover.Anchor />
		<Popover.Portal>
			<Popover.Content>
				<Popover.Close />
				<Popover.Arrow />
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
);
```

----------------------------------------

TITLE: Basic Callout Component Usage (JSX)
DESCRIPTION: Demonstrates the fundamental structure of a Callout component, comprising a root, an icon, and text. This snippet shows how to display a simple informational message, indicating a requirement for admin privileges.
SOURCE: https://github.com/radix-ui/website/blob/main/data/themes/docs/components/callout.mdx#_snippet_0

LANGUAGE: jsx
CODE:
```
<Callout.Root>
	<Callout.Icon>
		<InfoCircledIcon />
	</Callout.Icon>
	<Callout.Text>
		You will need admin privileges to install and access this application.
	</Callout.Text>
</Callout.Root>
```

----------------------------------------

TITLE: Install Radix Colors with npm, yarn, or pnpm
DESCRIPTION: Install Radix Colors from your terminal using common JavaScript package managers. The current stable version is `3.0.0`.
SOURCE: https://github.com/radix-ui/website/blob/main/data/colors/docs/overview/installation.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
# with npm
npm install @radix-ui/colors
# with yarn
yarn add @radix-ui/colors
# with pnpm
pnpm add @radix-ui/colors
```

----------------------------------------

TITLE: Install and Import Radix UI Core Package
DESCRIPTION: Instructions for installing the main `radix-ui` package and importing its components. This is the simplest and recommended way to get started, preventing version conflicts and enabling tree-shaking.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/overview/introduction.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install radix-ui
```

LANGUAGE: tsx
CODE:
```
import { Dialog, DropdownMenu, Tooltip } from "radix-ui";
```

----------------------------------------

TITLE: Usage Example for Custom Radix UI DropdownMenu Component
DESCRIPTION: This example demonstrates how to use a custom `DropdownMenu` component that abstracts primitive Radix UI parts. It shows the basic structure for integrating various dropdown elements like triggers, content, items, and groups into an application, simplifying the developer experience.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/components/dropdown-menu.mdx#_snippet_34

LANGUAGE: jsx
CODE:
```
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
	DropdownMenuGroup,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
} from "./your-dropdown-menu";

export default () => (
	<DropdownMenu>
		<DropdownMenuTrigger>DropdownMenu trigger</DropdownMenuTrigger>
		<DropdownMenuContent>
			<DropdownMenuItem>Item</DropdownMenuItem>
			<DropdownMenuLabel>Label</DropdownMenuLabel>
			<DropdownMenuGroup>Group</DropdownMenuGroup>
			<DropdownMenuCheckboxItem>CheckboxItem</DropdownMenuCheckboxItem>
			<DropdownMenuSeparator>Separator</DropdownMenuSeparator>
			<DropdownMenuRadioGroup>
				<DropdownMenuRadioItem>RadioItem</DropdownMenuRadioItem>
				<DropdownMenuRadioItem>RadioItem</DropdownMenuRadioItem>
			</DropdownMenuRadioGroup>
		</DropdownMenuContent>
	</DropdownMenu>
);
```

----------------------------------------

TITLE: Implement Server-Side Validation in Radix UI Forms
DESCRIPTION: This example demonstrates how to integrate server-side validation into a Radix UI form. It shows how to manage server errors using `useState`, submit form data, catch server-side validation errors, and display them using `Form.Message` with `forceMatch` or without a `match` prop. It also illustrates marking fields as invalid with `serverInvalid` and clearing errors with `onClearServerErrors`.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/components/form.mdx#_snippet_17

LANGUAGE: jsx
CODE:
```
import * as React from "react";
import { Form } from "radix-ui";

function Page() {
	const [serverErrors, setServerErrors] = React.useState({
		email: false,
		password: false,
	});

	return (
		<Form.Root
			// `onSubmit` only triggered if it passes client-side validation
			onSubmit={(event) => {
				const data = Object.fromEntries(new FormData(event.currentTarget));

				// Submit form data and catch errors in the response
				submitForm(data)
					.then(() => {})
					/**
					 * Map errors from your server response into a structure you'd like to work with.
					 * In this case resulting in this object: `{ email: false, password: true }`
					 */
					.catch((errors) => __setServerErrors__(mapServerErrors(errors)));

				// prevent default form submission
				event.preventDefault();
			}}
			onClearServerErrors={() =>
				__setServerErrors__({ email: false, password: false })
			}
		>
			<Form.Field name="email" __serverInvalid__={serverErrors.email}>
				<Form.Label>Email address</Form.Label>
				<Form.Control type="email" required />
				<Form.Message match="valueMissing">
					Please enter your email.
				</Form.Message>
				<Form.Message match="typeMismatch" __forceMatch__={serverErrors.email}>
					Please provide a valid email.
				</Form.Message>
			</Form.Field>

			<Form.Field name="password" __serverInvalid__={serverErrors.password}>
				<Form.Label>Password</Form.Label>
				<Form.Control type="password" required />
				<Form.Message match="valueMissing">
					Please enter a password.
				</Form.Message>
				{serverErrors.password && (
					<Form.Message>
						Please provide a valid password. It should contain at least 1 number
						and 1 special character.
					</Form.Message>
				)}
			</Form.Field>

			<Form.Submit>Submit</Form.Submit>
		</Form.Root>
	);
}
```

----------------------------------------

TITLE: Clear Individual Server Errors on User Input in Radix UI Forms
DESCRIPTION: This snippet illustrates how to clear a specific server error for a form field as soon as the user starts editing it. It uses the `onChange` prop on `Form.Control` to update the server error state, providing immediate feedback and a better user experience.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/components/form.mdx#_snippet_18

LANGUAGE: jsx
CODE:
```
<Form.Field name="email" serverInvalid={serverErrors.email}>
	<Form.Label>Email address</Form.Label>
	<Form.Control
		type="email"
		__onChange__={() => setServerErrors((prev) => ({ ...prev, email: false }))}
	/>
	<Form.Message match="valueMissing">Please enter your email.</Form.Message>
	<Form.Message match="typeMismatch" forceMatch={serverErrors.email}>
		Please provide a valid email.
	</Form.Message>
</Form.Field>
```

----------------------------------------

TITLE: Apply Themed Colors to Text in Radix UI
DESCRIPTION: Demonstrates how to use the `color` prop on `Text` components to apply various themed colors from the Radix UI palette, ensuring sufficient contrast for accessibility.
SOURCE: https://github.com/radix-ui/website/blob/main/data/themes/docs/components/text.mdx#_snippet_13

LANGUAGE: jsx
CODE:
```
<Flex direction="column">
	<Text color="indigo">The quick brown fox jumps over the lazy dog.</Text>
	<Text color="cyan">The quick brown fox jumps over the lazy dog.</Text>
	<Text color="orange">The quick brown fox jumps over the lazy dog.</Text>
	<Text color="crimson">The quick brown fox jumps over the lazy dog.</Text>
</Flex>
```

----------------------------------------

TITLE: Render Complex Content in Radix UI Select Items
DESCRIPTION: This snippet illustrates the flexibility of Radix UI Select, allowing custom and complex content within `Select.Item` components. It shows how to embed an image and text, and use `Select.ItemText` and `Select.ItemIndicator` for structured content.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/components/select.mdx#_snippet_28

LANGUAGE: jsx
CODE:
```
import { Select } from "radix-ui";

export default () => (
	<Select.Root>
		<Select.Trigger>…</Select.Trigger>
		<Select.Portal>
			<Select.Content>
				<Select.Viewport>
					<Select.Item>
						<Select.ItemText>
							<img src="…" />
							Adolfo Hess
						</Select.ItemText>
						<Select.ItemIndicator>…</Select.ItemIndicator>
					</Select.Item>
					<Select.Item>…</Select.Item>
					<Select.Item>…</Select.Item>
				</Select.Viewport>
			</Select.Content>
		</Select.Portal>
	</Select.Root>
);
```

----------------------------------------

TITLE: Create Scrollable Dialog Overlay with Radix UI
DESCRIPTION: Illustrates how to create a scrollable dialog overlay by moving the content inside the overlay, allowing for overflow and custom styling using both JSX and CSS.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/components/dialog.mdx#_snippet_12

LANGUAGE: jsx
CODE:
```
// index.jsx
import { Dialog } from "radix-ui";
import "./styles.css";

export default () => {
	return (
		<Dialog.Root>
			<Dialog.Trigger />
			<Dialog.Portal>
				<Dialog.Overlay className="DialogOverlay">
					<Dialog.Content className="DialogContent">...</Dialog.Content>
				</Dialog.Overlay>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
```

LANGUAGE: css
CODE:
```
/* styles.css */
.DialogOverlay {
	background: rgba(0 0 0 / 0.5);
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: grid;
	place-items: center;
	overflow-y: auto;
}

.DialogContent {
	min-width: 300px;
	background: white;
	padding: 30px;
	border-radius: 4px;
}
```

----------------------------------------

TITLE: Importing and Basic Usage of VisuallyHidden Root
DESCRIPTION: Demonstrates how to import the `VisuallyHidden` component from `radix-ui` and render its `Root` primitive. This sets up the basic structure for visually hidden content.
SOURCE: https://github.com/radix-ui/website/blob/main/data/primitives/docs/utilities/visually-hidden.mdx#_snippet_1

LANGUAGE: jsx
CODE:
```
import { VisuallyHidden } from "radix-ui";

export default () => <VisuallyHidden.Root />;
```