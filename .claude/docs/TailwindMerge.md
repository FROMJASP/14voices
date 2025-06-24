TITLE: Merging Internal and External Tailwind Classes with twMerge in React
DESCRIPTION: This example illustrates the primary use case of `twMerge` from `tailwind-merge`: merging a component's default Tailwind CSS classes with an externally provided `className` prop. `twMerge` resolves conflicting classes, ensuring the correct styles are applied. It's suitable when a component needs to accept external styling while maintaining its internal defaults.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/when-and-how-to-use-it.md#_snippet_1

LANGUAGE: jsx
CODE:
```
import { twMerge } from 'tailwind-merge'

function MyComponent({ forceHover, disabled, isMuted, className }) {
    return (
        <div
            className={twMerge(
                TYPOGRAPHY_STYLES_LABEL_SMALL,
                'grid w-max gap-2',
                forceHover ? 'bg-gray-200' : ['bg-white', !disabled && 'hover:bg-gray-200'],
                isMuted && 'text-gray-600',
                className,
            )}
        >
            {/* More code… */}
        </div>
    )
}
```

----------------------------------------

TITLE: Defining `twMerge` Function Signature in TypeScript
DESCRIPTION: This snippet defines the TypeScript signature for the `twMerge` function, which is the primary utility for merging Tailwind CSS classes while resolving conflicts. It accepts a variadic array of class lists, which can include strings, undefined, null, false, or 0, and returns a single merged string. This function is suitable for projects using the default Tailwind configuration.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/api-reference.md#_snippet_0

LANGUAGE: TypeScript
CODE:
```
function twMerge(
    ...classLists: Array<string | undefined | null | false | 0 | typeof classLists>
): string
```

----------------------------------------

TITLE: Merging Tailwind CSS Classes with twMerge in TypeScript
DESCRIPTION: This snippet demonstrates how to import and use the `twMerge` function from the `tailwind-merge` library to combine multiple Tailwind CSS class strings. It resolves conflicting classes, prioritizing the later ones, and outputs a merged string of unique and resolved classes. The example shows merging padding, background color, and hover classes.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/README.md#_snippet_0

LANGUAGE: TypeScript
CODE:
```
import { twMerge } from 'tailwind-merge'

twMerge('px-2 py-1 bg-red hover:bg-dark-red', 'p-3 bg-[#B91C1C]')
// → 'hover:bg-dark-red p-3 bg-[#B91C1C]'
```

----------------------------------------

TITLE: Merging Tailwind CSS Classes with twMerge (TypeScript)
DESCRIPTION: This snippet demonstrates the basic usage of the `twMerge` function from the 'tailwind-merge' library. It takes multiple Tailwind CSS class strings as arguments, resolves any conflicting classes (e.g., `px-2` vs `p-3`, `bg-red` vs `bg-[#B91C1C]`), and returns a single, merged string with the correct precedence applied. The example shows how `p-3` overrides `px-2 py-1` and `bg-[#B91C1C]` overrides `bg-red`, while `hover:bg-dark-red` is preserved.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/README.md#_snippet_0

LANGUAGE: TypeScript
CODE:
```
import { twMerge } from 'tailwind-merge'

twMerge('px-2 py-1 bg-red hover:bg-dark-red', 'p-3 bg-[#B91C1C]')
// → 'hover:bg-dark-red p-3 bg-[#B91C1C]'
```

----------------------------------------

TITLE: Using `twJoin` for Conditional Class Names in TypeScript
DESCRIPTION: This example demonstrates how to use the `twJoin` function to conditionally combine Tailwind CSS class names. It shows how boolean flags (`hasBackground`, `hasLargeText`, `hasLargeSpacing`) can control the inclusion of specific classes or arrays of classes, including nested conditional logic. This function is optimized for performance and bundle size when only conditional joining (without conflict resolution) is needed.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/api-reference.md#_snippet_2

LANGUAGE: TypeScript
CODE:
```
twJoin(
    'border border-red-500',
    hasBackground && 'bg-red-100',
    hasLargeText && 'text-lg',
    hasLargeSpacing && ['p-2', hasLargeText ? 'leading-8' : 'leading-7'],
)
```

----------------------------------------

TITLE: Resolving Tailwind CSS Class Conflicts with tailwind-merge in React JSX
DESCRIPTION: This snippet demonstrates how 'tailwind-merge' resolves class conflicts by intelligently merging Tailwind CSS classes. By wrapping the base classes and the 'props.className' with 'twMerge()', conflicting utility classes like 'px-2', 'py-1', and 'p-3' are correctly resolved, allowing 'p-3' to override the padding.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/what-is-it-for.md#_snippet_1

LANGUAGE: jsx
CODE:
```
function MyGenericInput(props) {
    // ↓ Now `props.className` can override conflicting classes
    const className = twMerge('border rounded px-2 py-1', props.className)
    return <input {...props} className={className} />
}
```

----------------------------------------

TITLE: Installing tailwind-merge with Package Managers
DESCRIPTION: This snippet provides common commands for installing the `tailwind-merge` package using popular Node.js package managers. It demonstrates how to add `tailwind-merge` as a project dependency, which is the initial step required before using its functionalities. The commands are compatible with npm, yarn, pnpm, and bun.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/configuration.md#_snippet_0

LANGUAGE: sh
CODE:
```
npm add tailwind-merge
yarn add tailwind-merge
pnpm add tailwind-merge
bun add tailwind-merge
```

----------------------------------------

TITLE: Resolving Conflicts: Last Class Wins (TypeScript)
DESCRIPTION: Demonstrates how tailwind-merge resolves conflicts where the last class in the string takes precedence. This is the default conflict resolution behavior for utility classes.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/features.md#_snippet_0

LANGUAGE: TypeScript
CODE:
```
twMerge('p-5 p-2 p-4') // → 'p-4'
```

----------------------------------------

TITLE: Supporting Multiple Arguments for Composition (TypeScript)
DESCRIPTION: Shows how twMerge can accept multiple string arguments, concatenating them into a single class string. This feature simplifies composing class names from various sources, similar to clsx or classnames.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/features.md#_snippet_11

LANGUAGE: TypeScript
CODE:
```
twMerge('some-class', 'another-class yet-another-class', 'so-many-classes')
// → 'some-class another-class yet-another-class so-many-classes'
```

----------------------------------------

TITLE: Demonstrating Tailwind CSS Class Conflict in React JSX
DESCRIPTION: This snippet illustrates a common issue in component-based UIs using Tailwind CSS where extending a component's 'className' property leads to class conflicts. The 'p-3' class from 'MyOneOffInput' fails to override 'px-2' and 'py-1' from 'MyGenericInput' due to the CSS cascade, requiring manual removal of conflicting classes.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/what-is-it-for.md#_snippet_0

LANGUAGE: jsx
CODE:
```
// React components with JSX syntax used in this example

function MyGenericInput(props) {
    const className = `border rounded px-2 py-1 ${props.className || ''}`
    return <input {...props} className={className} />
}

function MyOneOffInput(props) {
    return (
        <MyGenericInput
            {...props}
            className="p-3" // ← Only want to change some padding
        />
    )
}
```

----------------------------------------

TITLE: Supporting Conditional Classes for Composition (TypeScript)
DESCRIPTION: Demonstrates twMerge's ability to handle conditional class arguments, including undefined, null, false, and 0. It filters out falsy values, allowing for dynamic class composition based on conditions.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/features.md#_snippet_12

LANGUAGE: TypeScript
CODE:
```
twMerge('some-class', undefined, null, false, 0) // → 'some-class'
twMerge('my-class', false && 'not-this', null && 'also-not-this', true && 'but-this')
// → 'my-class but-this'
```

----------------------------------------

TITLE: Extending Tailwind Merge with Custom Configuration (TypeScript)
DESCRIPTION: This example demonstrates how to use `extendTailwindMerge` to create a custom `twMerge` function. It defines custom `AdditionalClassGroupIds` and provides a `configExtension` object to override and extend default Tailwind Merge settings, including cache size, prefix, theme scales, class groups (with string and function validators), and conflicting class groups.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/api-reference.md#_snippet_7

LANGUAGE: TypeScript
CODE:
```
type AdditionalClassGroupIds = 'aspect-w' | 'aspect-h' | 'aspect-reset'
type AdditionalThemeGroupIds = never

const twMerge = extendTailwindMerge<AdditionalClassGroupIds, AdditionalThemeGroupIds>({
    // ↓ Optional cache size
    //   Here we're disabling the cache
    cacheSize: 0,
    // ↓ Optional prefix from TaiLwind config
    prefix: 'tw',

    // ↓ Optional config overrides
    //   Only elements from the second level onwards are overridden
    override: {
        // ↓ Theme scales to override
        theme: {
            colors: ['black', 'white', 'yellow-500']
        },
        // ↓ Class groups to override
        classGroups: {
            // ↓ The `shadow` key here is the class group ID
            //      ↓ Creates group of classes which have conflicting styles
            //        Classes here: shadow-100, shadow-200, shadow-300, shadow-400, shadow-500
            shadow: [{ shadow: ['100', '200', '300', '400', '500'] }]
        },
        // ↓ Conflicts across different groups to override
        conflictingClassGroups: {
            // ↓ ID of class group which creates a conflict with…
            //           ↓ …classes from groups with these IDs
            //   Here we remove the default conflict between the font-size and leading class
            //   groups.
            'font-size': []
        },
        // ↓ Conflicts between the postfix modifier of a group and a different class group to
        //   override
        conflictingClassGroupModifiers: {
            // You probably won't need this, but it follows the same shape as
            // `conflictingClassGroups`.
        },
        // ↓ Modifiers whose order among multiple modifiers should be preserved because their
        //   order changes which element gets targeted. Overrides default value.
        orderSensitiveModifiers: ['before']
    },

    // ↓ Optional config extensions
    //   Follows same shape as the `override` object.
    extend: {
        // ↓ Theme scales to extend or create
        theme: {
            spacing: ['sm', 'md', 'lg']
        },
        // ↓ Class groups to extend or create
        classGroups: {
            // ↓ The `animate` key here is the class group ID
            //       ↓ Adds class animate-shimmer to existing group with ID `animate` or creates
            //         new class group if it doesn't exist.
            animate: ['animate-shimmer'],
            // ↓ Functions can also be used to match classes
            //   They take the class part value as argument and return a boolean defining whether
            //   it is a match.
            //   Here we accept all string classes starting with `aspec-w-` followed by a number.
            'aspect-w': [{ 'aspect-w': [(value) => Boolean(value) && !isNaN(value)] }],
            'aspect-h': [{ 'aspect-h': [(value) => Boolean(value) && !isNaN(value)] }],
            'aspect-reset': ['aspect-none'],
            // ↓ You can also use validators exported by tailwind-merge
            'prose-size': [{ prose: ['base', validators.isTshirtSize] }]
        },
        // ↓ Conflicts across different groups to extend or create
        conflictingClassGroups: {
            // ↓ ID of class group which creates a conflict with…
            //              ↓ …classes from groups with these IDs
            //   In this case `twMerge('aspect-w-5 aspect-none') → 'aspect-none'`
        }
    }
})
```

----------------------------------------

TITLE: Supporting Arrays and Nested Arrays in tailwind-merge (TypeScript)
DESCRIPTION: This snippet demonstrates how `twMerge` handles arrays and nested arrays, including `undefined` and `false` values. It shows that `twMerge` correctly processes these inputs, merging valid class names while ignoring falsy values, resulting in a clean string of combined classes.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/features.md#_snippet_13

LANGUAGE: typescript
CODE:
```
twMerge('some-class', [undefined, ['another-class', false]], ['third-class'])
// → 'some-class another-class third-class'
twMerge('hi', true && ['hello', ['hey', false]], false && ['bye'])
// → 'hi hello hey'
```

----------------------------------------

TITLE: Extending tailwind-merge Configuration with extendTailwindMerge (TypeScript)
DESCRIPTION: This snippet demonstrates how to extend the default `tailwind-merge` configuration using `extendTailwindMerge`. It shows how to add custom theme scales, define new class groups, and specify conflicting class groups and modifiers. The generic type arguments `'foo' | 'bar' | 'baz'` are used to define new class group IDs.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/configuration.md#_snippet_10

LANGUAGE: TypeScript
CODE:
```
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge<'foo' | 'bar' | 'baz'>({
    // ↓ Override elements from the default config
    //   It has the same shape as the `extend` object, so we're going to skip it here.
    override: {},
    // ↓ Extend values from the default config
    extend: {
        // ↓ Add values to existing theme scale or create a new one
        theme: {
            spacing: ['sm', 'md', 'lg']
        },
        // ↓ Add values to existing class groups or define new ones
        classGroups: {
            foo: ['foo', 'foo-2', { 'bar-baz': ['', '1', '2'] }],
            bar: [{ qux: ['auto', (value) => Number(value) >= 1000] }],
            baz: ['baz-sm', 'baz-md', 'baz-lg']
        },
        // ↓ Here you can define additional conflicts across class groups
        conflictingClassGroups: {
            foo: ['bar']
        },
        // ↓ Define conflicts between postfix modifiers and class groups
        conflictingClassGroupModifiers: {
            baz: ['bar']
        },
        // ↓ Define order-sensitive modifiers
        orderSensitiveModifiers: ['my-order-sensitive-modifier']
    }
})
```

----------------------------------------

TITLE: Defining `twJoin` Function Signature in TypeScript
DESCRIPTION: This snippet defines the TypeScript signature for the `twJoin` function, designed to conditionally join className strings without resolving conflicts. Similar to `twMerge`, it accepts a variadic array of class lists, including various falsy values, and returns a combined string. It's a lightweight alternative to `clsx` or `classnames` for conditional class application.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/api-reference.md#_snippet_1

LANGUAGE: TypeScript
CODE:
```
function twJoin(
    ...classLists: Array<string | undefined | null | false | 0 | typeof classLists>
): string
```

----------------------------------------

TITLE: Extending Tailwind Merge with Custom Theme Scales and Class Groups in TypeScript
DESCRIPTION: This example demonstrates how to use `fromTheme` in conjunction with `extendTailwindMerge` to define custom theme scales and integrate them into new class groups. It shows how to declare additional class and theme group IDs using TypeScript types and then configure `tailwind-merge` to recognize and process custom theme values like 'my-scale' within defined class groups such as 'my-group' and 'my-group-x'.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/api-reference.md#_snippet_5

LANGUAGE: TypeScript
CODE:
```
type AdditionalClassGroupIds = 'my-group' | 'my-group-x'
type AdditionalThemeGroupIds = 'my-scale'

extendTailwindMerge<AdditionalClassGroupIds, AdditionalThemeGroupIds>({
    extend: {
        theme: {
            'my-scale': ['foo', 'bar'],
        },
        classGroups: {
            'my-group': [
                {
                    'my-group': [
                        fromTheme<AdditionalThemeGroupIds>('my-scale'),
                        fromTheme('spacing'),
                    ],
                },
            ],
            'my-group-x': [{ 'my-group-x': [fromTheme<AdditionalThemeGroupIds>('my-scale')] }],
        },
    },
})
```

----------------------------------------

TITLE: Joining Internal Tailwind Classes with twJoin in React
DESCRIPTION: This snippet demonstrates using `twJoin` from `tailwind-merge` to combine internal Tailwind CSS classes within a React component. `twJoin` is preferred for internal classes as it only joins strings without conflict resolution, leading to better performance and easier reasoning about applied styles. It takes multiple arguments, which can be strings, arrays, or conditional expressions, to dynamically construct the `className` string.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/when-and-how-to-use-it.md#_snippet_0

LANGUAGE: jsx
CODE:
```
import { twJoin } from 'tailwind-merge'

function MyComponent({ forceHover, disabled, isMuted }) {
    return (
        <div
            className={twJoin(
                TYPOGRAPHY_STYLES_LABEL_SMALL,
                'grid w-max gap-2',
                forceHover ? 'bg-gray-200' : ['bg-white', !disabled && 'hover:bg-gray-200'],
                isMuted && 'text-gray-600',
            )}
        >
            {/* More code… */}
        </div>
    )
}
```

----------------------------------------

TITLE: Supporting Modifiers and Stacked Modifiers (TypeScript)
DESCRIPTION: Demonstrates how tailwind-merge handles utility classes with standard and stacked modifiers (e.g., hover:, focus:). It correctly resolves conflicts, ensuring the last specified class with the same modifiers wins.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/features.md#_snippet_3

LANGUAGE: TypeScript
CODE:
```
twMerge('p-2 hover:p-4') // → 'p-2 hover:p-4'
twMerge('hover:p-2 hover:p-4') // → 'hover:p-4'
twMerge('hover:focus:p-2 focus:hover:p-4') // → 'focus:hover:p-4'
```

----------------------------------------

TITLE: Creating Custom tailwind-merge Function with createTailwindMerge (TypeScript)
DESCRIPTION: This snippet demonstrates how to create a completely custom `twMerge` function using `createTailwindMerge`. It takes a callback that returns a configuration object, allowing granular control over cache size, theme, class groups, and conflict resolution. It's recommended to call `createTailwindMerge` only once and store the result in a top-level variable for performance.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/configuration.md#_snippet_13

LANGUAGE: TypeScript
CODE:
```
import { createTailwindMerge } from 'tailwind-merge'

const twMerge = createTailwindMerge(() => ({
    cacheSize: 500,
    theme: {},
    classGroups: {
        foo: ['foo', 'foo-2', { 'bar-baz': ['', '1', '2'] }],
        bar: [{ qux: ['auto', (value) => Number(value) >= 1000] }],
        baz: ['baz-sm', 'baz-md', 'baz-lg'],
    },
    conflictingClassGroups: {
        foo: ['bar'],
    },
    conflictingClassGroupModifiers: {
        baz: ['bar'],
    },
    orderSensitiveModifiers: [],
}))
```

----------------------------------------

TITLE: Reusing Tailwind Classes in React Components without @apply - JSX
DESCRIPTION: Provides a recommended alternative to `@apply` for reusing Tailwind classes in React components. It shows how to store a collection of Tailwind class names in a JavaScript string variable (`BTN_PRIMARY_CLASSNAMES`) and then use `twMerge` to combine them with other props, ensuring proper conflict resolution without modifying `tailwind-merge`'s config.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/recipes.md#_snippet_3

LANGUAGE: JSX
CODE:
```
// React components with JSX syntax used in this example

import { twMerge } from 'tailwind-merge'

const BTN_PRIMARY_CLASSNAMES = 'py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700'

function ButtonPrimary(props) {
    return <button {...props} className={twMerge(BTN_PRIMARY_CLASSNAMES, props.className)} />
}
```

----------------------------------------

TITLE: Merging Classes within a Group (TypeScript)
DESCRIPTION: This example demonstrates how 'tailwind-merge' resolves conflicts when multiple classes from the same group are passed. It shows that only the last class ('relative') is retained, as it overrides the preceding ones.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/configuration.md#_snippet_3

LANGUAGE: TypeScript
CODE:
```
twMerge('static sticky relative') // → 'relative'
```

----------------------------------------

TITLE: Allowing Class Refinements (TypeScript)
DESCRIPTION: Illustrates how tailwind-merge allows class refinements, where more specific utility classes (e.g., px-5 for horizontal padding) can coexist with broader ones (e.g., p-3 for all-around padding) without conflict, as long as they don't directly overlap in their effect.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/features.md#_snippet_1

LANGUAGE: TypeScript
CODE:
```
twMerge('p-3 px-5') // → 'p-3 px-5'
twMerge('inset-x-4 right-4') // → 'inset-x-4 right-4'
```

----------------------------------------

TITLE: Defining a Basic Position Class Group (TypeScript)
DESCRIPTION: This snippet illustrates a simple class group defined as an array of Tailwind classes. All classes within this group modify the same CSS property, and 'tailwind-merge' will keep only the last one encountered in a merge operation.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/configuration.md#_snippet_2

LANGUAGE: TypeScript
CODE:
```
const positionClassGroup = ['static', 'fixed', 'absolute', 'relative', 'sticky']
```

----------------------------------------

TITLE: Defining extendTailwindMerge Function Signatures (TypeScript)
DESCRIPTION: This snippet defines the overloaded function signatures for `extendTailwindMerge`. The first overload accepts a `configExtension` object to merge with the default configuration, while both overloads allow passing functions to further transform the config. Generic type parameters `AdditionalClassGroupIds` and `AdditionalThemeGroupIds` enable type-safe definition of custom class and theme group IDs.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/api-reference.md#_snippet_6

LANGUAGE: TypeScript
CODE:
```
function extendTailwindMerge<
    AdditionalClassGroupIds extends string = never,
    AdditionalThemeGroupIds extends string = never,
>(
    configExtension: ConfigExtension<
        DefaultClassGroupIds | AdditionalClassGroupIds,
        DefaultThemeGroupIds | AdditionalThemeGroupIds
    >,
    ...createConfig: ((config: GenericConfig) => GenericConfig)[]
): TailwindMerge
function extendTailwindMerge<
    AdditionalClassGroupIds extends string = never,
    AdditionalThemeGroupIds extends string = never,
>(...createConfig: ((config: GenericConfig) => GenericConfig)[]): TailwindMerge
```

----------------------------------------

TITLE: Extending Tailwind Merge Theme with Custom Inset Shadow in TypeScript
DESCRIPTION: This TypeScript snippet demonstrates how to extend the `tailwind-merge` configuration using `extendTailwindMerge` to include custom theme keys. It specifically adds a `'deep'` value to the `'inset-shadow'` theme scale, allowing `tailwind-merge` to recognize and process classes related to a custom CSS variable like `--inset-shadow-deep`. This change is enabled by Tailwind CSS v4's updated theme variable namespaces.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/changelog/v2-to-v3-migration.md#_snippet_0

LANGUAGE: ts
CODE:
```
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
    extend: {
        theme: {
            'inset-shadow': ['deep'],
        },
    },
})
```

----------------------------------------

TITLE: Defining a Class Group with a Validator Function (TypeScript)
DESCRIPTION: This example demonstrates using a validator function ('isArbitraryValue') within a class group to handle arbitrary values. The function receives only the class part after the prefix (e.g., 'fill-'), allowing flexible validation for dynamic class names.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/configuration.md#_snippet_5

LANGUAGE: TypeScript
CODE:
```
const isArbitraryValue = (classPart: string) => /^[.+]$/.test(classPart)
const fillClassGroup = [{ fill: ['current', isArbitraryValue] }]
```

----------------------------------------

TITLE: Defining the tailwind-merge Configuration Object
DESCRIPTION: This TypeScript snippet illustrates the comprehensive structure of the `tailwind-merge` configuration object. It defines various properties such as `cacheSize` for performance, `prefix` for custom Tailwind prefixes, and detailed sections for `theme`, `classGroups`, `conflictingClassGroups`, `conflictingClassGroupModifiers`, and `orderSensitiveModifiers` to handle custom Tailwind CSS setups. This configuration allows users to fine-tune `twMerge` behavior to correctly merge classes when deviating from default Tailwind CSS settings.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/configuration.md#_snippet_1

LANGUAGE: ts
CODE:
```
const tailwindMergeConfig = {
    // ↓ Set how many values should be stored in cache.
    cacheSize: 500,
    // ↓ Optional prefix from Tailwind config
    prefix: 'tw',
    theme: {
        // Theme scales are defined here
    },
    classGroups: {
        // Class groups are defined here
    },
    conflictingClassGroups: {
        // Conflicts between class groups are defined here
    },
    conflictingClassGroupModifiers: {
        // Conflicts between postfix modifier of a class group and another class group are defined here
    },
    orderSensitiveModifiers: [
        // Modifiers whose order among multiple modifiers should be preserved because their order
        // changes which element gets targeted.
    ],
}
```

----------------------------------------

TITLE: Example Usage of Tailwind Merge Validators (TypeScript)
DESCRIPTION: This snippet demonstrates how to use a validator, specifically `validators.isNumber`, within a `classGroup` definition for padding. This approach is used when creating custom `tailwind-merge` configurations, allowing developers to define specific rules for how utility classes are grouped and merged based on their values.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/api-reference.md#_snippet_16

LANGUAGE: TypeScript
CODE:
```
const paddingClassGroup = [{ p: [validators.isNumber] }]

```

----------------------------------------

TITLE: Adding Custom Class and Theme Group IDs with TypeScript Generics
DESCRIPTION: This snippet illustrates how to define and use additional class group and theme group IDs with `extendTailwindMerge` in TypeScript. It uses generic arguments to explicitly declare new IDs, ensuring strict type checking and auto-completion for custom configurations. The example highlights how undefined IDs will result in type errors.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/configuration.md#_snippet_11

LANGUAGE: TypeScript
CODE:
```
import { extendTailwindMerge } from 'tailwind-merge'

type AdditionalClassGroupIDs = 'class-a' | 'class-b'
type AdditionalThemeGroupIDs = 'theme-c' | 'theme-d'

const twMerge = extendTailwindMerge<
    // ↓ Add additional class group IDs as the first generic argument
    AdditionalClassGroupIDs,
    // ↓ Optionally, you can add additional theme group IDs as the second generic argument
    AdditionalThemeGroupIDs
>({
    extend: {
        theme: {
          // ↓ Works because we defined 'theme-c' as additional theme group ID
          'theme-c': [],
          // ↓ Works because we defined 'theme-d' as additional theme group ID
          'theme-d': []
        },
        classGroups: {
            // ↓ Works because it's part of the default additional class group IDs
            shadow: [],
            // ↓ Works because we defined 'class-a' as additional class group ID
            'class-a': [],
            // ↓ Works because we defined 'class-b' as additional class group ID
            'class-b': [],
            // ↓ Type […] is not assignable to type […].
            //   Object literal may only specify known properties, and ''not-defined'' does not exist in type […]. ts(2322)
            'not-defined': []
        }
    }
})
```

----------------------------------------

TITLE: Wrapping twMerge to Modify Inputs/Outputs - JavaScript
DESCRIPTION: Demonstrates how to wrap the `twMerge` function to preprocess its inputs or post-process its outputs. This allows for custom logic, such as adapting `twMerge` to accept argument types similar to `clsx` or `classnames`, by modifying the `inputs` array before passing it to the original `twMerge` function.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/recipes.md#_snippet_4

LANGUAGE: JavaScript
CODE:
```
import { twMerge as twMergeOriginal } from 'tailwind-merge'

function twMerge(...inputs) {
    const modifiedInputs = modifyInputs(inputs)
    return twMergeOriginal(modifiedInputs)
}
```

----------------------------------------

TITLE: Extending Tailwind-Merge Theme with Custom Text Size (TypeScript)
DESCRIPTION: This snippet shows how to configure tailwind-merge to recognize custom theme values, specifically a 'text' size named 'huge-af'. It uses 'extendTailwindMerge' to add 'huge-af' to the 'text' theme key, ensuring that classes like 'text-huge-af' are correctly merged. This is necessary when custom variables are added to the Tailwind CSS theme.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/configuration.md#_snippet_9

LANGUAGE: TypeScript
CODE:
```
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
    extend: {
        theme: {
            // ↓ `text` is the key of the namespace `--text-*`
            //      ↓ `huge-af` is the variable name in the namespace
            text: ['huge-af']
        }
    }
})
```

----------------------------------------

TITLE: Configuring tailwind-merge for Custom Tailwind Theme Scales (extend.theme) - JavaScript
DESCRIPTION: Explains how to extend `tailwind-merge`'s theme configuration to include custom shadow scales (e.g., `shadow-100`, `shadow-200`) defined in Tailwind CSS. This is achieved by using `extendTailwindMerge` and specifying the custom values in the `theme.shadow` object, suitable when the custom scale extends an existing Tailwind theme scale.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/recipes.md#_snippet_0

LANGUAGE: JavaScript
CODE:
```
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
    extend: {
        theme: {
            // We only need to define the custom scale values without the `shadow-` prefix when adding them to the theme object
            shadow: ['100', '200', '300']
        }
    }
})
```

----------------------------------------

TITLE: Configuring tailwind-merge for Custom Tailwind Class Groups (extend.classGroups) - JavaScript
DESCRIPTION: Demonstrates how to add custom shadow classes to `tailwind-merge`'s configuration using `extendTailwindMerge` and the `classGroups` property. This approach is necessary when the custom theme scale is not natively supported by `tailwind-merge` or when defining full class names like `shadow-100` directly.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/recipes.md#_snippet_1

LANGUAGE: JavaScript
CODE:
```
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            // In class groups we always need to define the entire class name like `shadow-100`, `shadow-200` and `shadow-300`
            // `{ shadow: ['100', '200', '300'] }` is a short-hand syntax for `'shadow-100', 'shadow-200', 'shadow-300'`
            shadow: [{ shadow: ['100', '200', '300'] }]
        }
    }
})
```

----------------------------------------

TITLE: Preserving Non-Tailwind Classes (TypeScript)
DESCRIPTION: Demonstrates that tailwind-merge intelligently preserves classes that are not recognized as Tailwind CSS utilities. These non-Tailwind classes are included in the output string without modification, alongside the resolved Tailwind classes.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/features.md#_snippet_9

LANGUAGE: TypeScript
CODE:
```
twMerge('p-5 p-2 my-non-tailwind-class p-4') // → 'my-non-tailwind-class p-4'
```

----------------------------------------

TITLE: Supporting Arbitrary Values (TypeScript)
DESCRIPTION: Illustrates tailwind-merge's compatibility with Tailwind CSS arbitrary values, where custom values are enclosed in square brackets. It correctly resolves conflicts among classes using arbitrary values, prioritizing the last one.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/features.md#_snippet_4

LANGUAGE: TypeScript
CODE:
```
twMerge('bg-black bg-(--my-color) bg-[color:var(--mystery-var)]')
// → 'bg-[color:var(--mystery-var)]'
twMerge('grid-cols-[1fr,auto] grid-cols-2') // → 'grid-cols-2'
```

----------------------------------------

TITLE: Using Arrays as Arguments in twMerge (JavaScript)
DESCRIPTION: This snippet demonstrates the new capability of `twMerge` to accept arbitrarily nested arrays as arguments. This feature is particularly useful for handling conditional class merging, allowing for more flexible and readable class string construction. The `join` function, also exported by `tailwind-merge`, handles the merging logic.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/changelog/v1-changelog.md#_snippet_0

LANGUAGE: JavaScript
CODE:
```
twMerge('…', someBool && ['…', anotherBool && '…'])
```

----------------------------------------

TITLE: Supporting Arbitrary Variants (TypeScript)
DESCRIPTION: Demonstrates tailwind-merge's support for arbitrary variants, which allow custom CSS selectors as modifiers. It resolves conflicts between arbitrary variants but, similar to arbitrary properties, does not resolve conflicts with predefined modifiers for bundle size reasons.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/features.md#_snippet_6

LANGUAGE: TypeScript
CODE:
```
twMerge('[&:nth-child(3)]:py-0 [&:nth-child(3)]:py-4') // → '[&:nth-child(3)]:py-4'
twMerge('dark:hover:[&:nth-child(3)]:py-0 hover:dark:[&:nth-child(3)]:py-4')
// → 'hover:dark:[&:nth-child(3)]:py-4'

// Don't do this!
twMerge('[&:focus]:ring focus:ring-4') // → '[&:focus]:ring focus:ring-4'
```

----------------------------------------

TITLE: Creating Tailwind Merge with Custom Configuration (TypeScript)
DESCRIPTION: Illustrates how to use `createTailwindMerge` to define a custom configuration from scratch or by extending the default configuration. The callback function is executed on the first call to `twMerge`, allowing for dynamic configuration.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/api-reference.md#_snippet_11

LANGUAGE: ts
CODE:
```
// ↓ Callback passed to `createTailwindMerge` is called when
//   `twMerge` gets called the first time.
const twMerge = createTailwindMerge(() => {
    const defaultConfig = getDefaultConfig()

    return {
        cacheSize: 0,
        classGroups: {
            ...defaultConfig.classGroups,
            foo: ['foo', 'foo-2', { 'bar-baz': ['', '1', '2'] }],
            bar: [{ qux: ['auto', (value) => Number(value) >= 1000] }],
            baz: ['baz-sm', 'baz-md', 'baz-lg']
        },
        conflictingClassGroups: {
            ...defaultConfig.conflictingClassGroups,
            foo: ['bar']
        },
        conflictingClassGroupModifiers: {
            ...defaultConfig.conflictingClassGroupModifiers,
            baz: ['bar']
        },
        orderSensitiveModifiers: [...defaultConfig.orderSensitiveModifiers, 'before']
    }
})
```

----------------------------------------

TITLE: Creating Tailwind Merge with Multiple Config Functions (TypeScript)
DESCRIPTION: Shows how to chain multiple `createConfig` functions with `createTailwindMerge` to combine configurations from different sources, such as default settings, plugins, and custom extensions. Each subsequent function receives the config from the previous one.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/api-reference.md#_snippet_12

LANGUAGE: ts
CODE:
```
const twMerge = createTailwindMerge(getDefaultConfig, withSomePlugin, (config) => ({
    // ↓ Config returned by `withSomePlugin`
    ...config,
    classGroups: {
        ...config.classGroups,
        mySpecialClassGroup: [{ special: ['1', '2'] }]
    }
}))
```

----------------------------------------

TITLE: Supporting Custom Colors (TypeScript)
DESCRIPTION: Illustrates tailwind-merge's built-in support for custom color definitions. It correctly identifies and resolves conflicts between custom color classes, applying the last specified custom color.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/features.md#_snippet_10

LANGUAGE: TypeScript
CODE:
```
twMerge('text-red text-secret-sauce') // → 'text-secret-sauce'
```

----------------------------------------

TITLE: Merging Tailwind Merge Configurations (TypeScript)
DESCRIPTION: Provides an example of using `mergeConfigs` within `createTailwindMerge` to override existing class groups, add values to existing groups, and introduce new class groups. It demonstrates how to use TypeScript generics for type safety when specifying class group IDs.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/api-reference.md#_snippet_14

LANGUAGE: ts
CODE:
```
const twMerge = createTailwindMerge(getDefaultConfig, (config) =>
    mergeConfigs<'shadow' | 'animate' | 'prose'>(config, {
        override: {
            classGroups: {
                // ↓ Overriding existing class group
                shadow: [{ shadow: ['100', '200', '300', '400', '500'] }]
            }
        },
        extend: {
            classGroups: {
                // ↓ Adding value to existing class group
                animate: ['animate-shimmer'],
                // ↓ Adding new class group
                prose: [{ prose: ['', validators.isTshirtSize] }]
            }
        }
    })
)
```

----------------------------------------

TITLE: Supporting Arbitrary Properties (TypeScript)
DESCRIPTION: Shows how tailwind-merge handles arbitrary CSS properties defined directly in square brackets. It resolves conflicts between identical arbitrary properties but notes that it does not resolve conflicts with matching Tailwind classes due to bundle size considerations.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/features.md#_snippet_5

LANGUAGE: TypeScript
CODE:
```
twMerge('[mask-type:luminance] [mask-type:alpha]') // → '[mask-type:alpha]'
twMerge('[--scroll-offset:56px] lg:[--scroll-offset:44px]')
// → '[--scroll-offset:56px] lg:[--scroll-offset:44px]'

// Don't do this!
twMerge('[padding:1rem] p-8') // → '[padding:1rem] p-8'
```

----------------------------------------

TITLE: Resolving Non-Trivial Conflicts (TypeScript)
DESCRIPTION: Shows tailwind-merge's ability to resolve complex or non-obvious conflicts between utility classes that affect the same CSS properties, ensuring the correct class is applied based on its internal rules.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/features.md#_snippet_2

LANGUAGE: TypeScript
CODE:
```
twMerge('inset-x-px -inset-1') // → '-inset-1'
twMerge('bottom-auto inset-y-6') // → 'inset-y-6'
twMerge('inline block') // → 'block'
```

----------------------------------------

TITLE: Supporting Postfix Modifiers (TypeScript)
DESCRIPTION: Shows tailwind-merge's ability to process and resolve conflicts involving postfix modifiers, such as line-height values appended to font-size classes (e.g., text-lg/7). The last conflicting class with a postfix modifier wins.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/features.md#_snippet_8

LANGUAGE: TypeScript
CODE:
```
twMerge('text-sm leading-6 text-lg/7') // → 'text-lg/7'
```

----------------------------------------

TITLE: Wrapping twMerge with ClassNameValue - TypeScript
DESCRIPTION: Illustrates how to wrap the `twMerge` function using the `ClassNameValue` type for its arguments. This example demonstrates creating a custom function `myWrappedTwMerge` that accepts the same flexible arguments as `twMerge`, allowing for pre-processing or additional logic.
SOURCE: https://github.com/dcastil/tailwind-merge/blob/main/docs/api-reference.md#_snippet_21

LANGUAGE: TypeScript
CODE:
```
function myWrappedTwMerge(...args: ClassNameValue[]) {
    doSomething()
    return twMerge(...args)
}
```