TITLE: Basic Command Menu Implementation in React
DESCRIPTION: A simple implementation of the Command menu component with input, list, and grouped items. Shows the basic structure with groups, items, and separators.
SOURCE: https://github.com/pacocoursey/cmdk/blob/main/README.md#2025-04-12_snippet_1

LANGUAGE: tsx
CODE:
```
import { Command } from 'cmdk'

const CommandMenu = () => {
  return (
    <Command label="Command Menu">
      <Command.Input />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group heading="Letters">
          <Command.Item>a</Command.Item>
          <Command.Item>b</Command.Item>
          <Command.Separator />
          <Command.Item>c</Command.Item>
        </Command.Group>

        <Command.Item>Apple</Command.Item>
      </Command.List>
    </Command>
  )
}
```

----------------------------------------

TITLE: Dialog-Based Command Menu with Keyboard Shortcut
DESCRIPTION: Implementation of a command menu in a dialog that toggles visibility when ⌘K is pressed. Uses useEffect to add a global keyboard shortcut listener.
SOURCE: https://github.com/pacocoursey/cmdk/blob/main/README.md#2025-04-12_snippet_2

LANGUAGE: tsx
CODE:
```
import { Command } from 'cmdk'

const CommandMenu = () => {
  const [open, setOpen] = React.useState(false)

  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu">
      <Command.Input />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group heading="Letters">
          <Command.Item>a</Command.Item>
          <Command.Item>b</Command.Item>
          <Command.Separator />
          <Command.Item>c</Command.Item>
        </Command.Group>

        <Command.Item>Apple</Command.Item>
      </Command.List>
    </Command.Dialog>
  )
}
```

----------------------------------------

TITLE: Preferred Approach: Component-Based Item Rendering
DESCRIPTION: The preferred approach using compound components where each item is rendered as a dedicated component. This enables a more natural React composition model.
SOURCE: https://github.com/pacocoursey/cmdk/blob/main/ARCHITECTURE.md#2025-04-12_snippet_2

LANGUAGE: tsx
CODE:
```
// Yes
<Item>My item</Item>
```

----------------------------------------

TITLE: Implementing Nested Navigation Pages in Command Menu
DESCRIPTION: Advanced example implementing nested navigation with "pages" in a command menu, allowing users to navigate deeper into hierarchical options.
SOURCE: https://github.com/pacocoursey/cmdk/blob/main/README.md#2025-04-12_snippet_18

LANGUAGE: tsx
CODE:
```
const ref = React.useRef(null)
const [open, setOpen] = React.useState(false)
const [search, setSearch] = React.useState('')
const [pages, setPages] = React.useState([])
const page = pages[pages.length - 1]

return (
  <Command
    onKeyDown={(e) => {
      // Escape goes to previous page
      // Backspace goes to previous page when search is empty
      if (e.key === 'Escape' || (e.key === 'Backspace' && !search)) {
        e.preventDefault()
        setPages((pages) => pages.slice(0, -1))
      }
    }}
  >
    <Command.Input value={search} onValueChange={setSearch} />
    <Command.List>
      {!page && (
        <>
          <Command.Item onSelect={() => setPages([...pages, 'projects'])}>Search projects…</Command.Item>
          <Command.Item onSelect={() => setPages([...pages, 'teams'])}>Join a team…</Command.Item>
        </>
      )}

      {page === 'projects' && (
        <>
          <Command.Item>Project A</Command.Item>
          <Command.Item>Project B</Command.Item>
        </>
      )}

      {page === 'teams' && (
        <>
          <Command.Item>Team 1</Command.Item>
          <Command.Item>Team 2</Command.Item>
        </>
      )}
    </Command.List>
  </Command>
)
```

----------------------------------------

TITLE: Implementing Async Loading in React Command Menu
DESCRIPTION: Demonstrates how to load and display items asynchronously in the command menu with loading state handling.
SOURCE: https://github.com/pacocoursey/cmdk/blob/main/README.md#2025-04-12_snippet_20

LANGUAGE: tsx
CODE:
```
const [loading, setLoading] = React.useState(false)
const [items, setItems] = React.useState([])

React.useEffect(() => {
  async function getItems() {
    setLoading(true)
    const res = await api.get('/dictionary')
    setItems(res)
    setLoading(false)
  }

  getItems()
}, [])

return (
  <Command>
    <Command.Input />
    <Command.List>
      {loading && <Command.Loading>Fetching words…</Command.Loading>}
      {items.map((item) => {
        return (
          <Command.Item key={`word-${item}`} value={item}>
            {item}
          </Command.Item>
        )
      })}
    </Command.List>
  </Command>
)
```

----------------------------------------

TITLE: Controlled Command Component with Value State
DESCRIPTION: Example of using the Command component in a controlled manner with value and onValueChange props to manage the selected value state.
SOURCE: https://github.com/pacocoursey/cmdk/blob/main/README.md#2025-04-12_snippet_3

LANGUAGE: tsx
CODE:
```
const [value, setValue] = React.useState('apple')

return (
  <Command value={value} onValueChange={setValue}>
    <Command.Input />
    <Command.List>
      <Command.Item>Orange</Command.Item>
      <Command.Item>Apple</Command.Item>
    </Command.List>
  </Command>
)
```

----------------------------------------

TITLE: Custom Filter Function Implementation
DESCRIPTION: Demonstrates how to provide a custom filter function to the Command component for controlling the search behavior.
SOURCE: https://github.com/pacocoursey/cmdk/blob/main/README.md#2025-04-12_snippet_4

LANGUAGE: tsx
CODE:
```
<Command
  filter={(value, search) => {
    if (value.includes(search)) return 1
    return 0
  }}
/>
```

----------------------------------------

TITLE: Advanced Filter Function with Keywords Support
DESCRIPTION: Shows how to use a more advanced filter function that considers keywords as aliases for items, affecting their search ranking.
SOURCE: https://github.com/pacocoursey/cmdk/blob/main/README.md#2025-04-12_snippet_5

LANGUAGE: tsx
CODE:
```
<Command
  filter={(value, search, keywords) => {
    const extendValue = value + ' ' + keywords.join(' ')
    if (extendValue.includes(search)) return 1
    return 0
  }}
/>
```

----------------------------------------

TITLE: Command Item with Custom Keywords for Filtering
DESCRIPTION: Example of adding keywords to a Command.Item to help with filtering, providing additional search terms beyond the visible text.
SOURCE: https://github.com/pacocoursey/cmdk/blob/main/README.md#2025-04-12_snippet_14

LANGUAGE: tsx
CODE:
```
<Command.Item keywords={['fruit', 'apple']}>Apple</Command.Item>
```

----------------------------------------

TITLE: Grouping Command Items with Headings
DESCRIPTION: Example of grouping Command.Item components with a heading using the Command.Group component.
SOURCE: https://github.com/pacocoursey/cmdk/blob/main/README.md#2025-04-12_snippet_15

LANGUAGE: tsx
CODE:
```
<Command.Group heading="Fruit">
  <Command.Item>Apple</Command.Item>
</Command.Group>
```

----------------------------------------

TITLE: Handling Loading State in Command Menu
DESCRIPTION: Example of showing a loading indicator during asynchronous data fetching operations using the Command.Loading component.
SOURCE: https://github.com/pacocoursey/cmdk/blob/main/README.md#2025-04-12_snippet_16

LANGUAGE: tsx
CODE:
```
const [loading, setLoading] = React.useState(false)

return <Command.List>{loading && <Command.Loading>Hang on…</Command.Loading>}</Command.List>
```

----------------------------------------

TITLE: Using useCommandState for Advanced Empty State
DESCRIPTION: Example of using the useCommandState hook to access internal command state for creating a more detailed empty state that includes the search query.
SOURCE: https://github.com/pacocoursey/cmdk/blob/main/README.md#2025-04-12_snippet_17

LANGUAGE: tsx
CODE:
```
const search = useCommandState((state) => state.search)
return <Command.Empty>No results found for "{search}".</Command.Empty>
```

----------------------------------------

TITLE: Implementing Conditional Sub-Items in React Command Menu
DESCRIPTION: Shows how to conditionally render nested command menu items based on search state using a custom SubItem component.
SOURCE: https://github.com/pacocoursey/cmdk/blob/main/README.md#2025-04-12_snippet_19

LANGUAGE: tsx
CODE:
```
const SubItem = (props) => {
  const search = useCommandState((state) => state.search)
  if (!search) return null
  return <Command.Item {...props} />
}

return (
  <Command>
    <Command.Input />
    <Command.List>
      <Command.Item>Change theme…</Command.Item>
      <SubItem>Change theme to dark</SubItem>
      <SubItem>Change theme to light</SubItem>
    </Command.List>
  </Command>
)
```

----------------------------------------

TITLE: Preferred Approach: Full Component Composition
DESCRIPTION: The ideal implementation that enables full component composition, allowing for both component references and static items to be combined freely.
SOURCE: https://github.com/pacocoursey/cmdk/blob/main/ARCHITECTURE.md#2025-04-12_snippet_3

LANGUAGE: tsx
CODE:
```
// YES
<>
  <BlogItems />
  {staticItems}
</>
```

----------------------------------------

TITLE: ⌘K Implementation: DOM-based Filtering
DESCRIPTION: Illustrates how ⌘K keeps all items in the React tree but selectively renders them to the DOM. This approach enables the compound component pattern while still supporting filtering.
SOURCE: https://github.com/pacocoursey/cmdk/blob/main/ARCHITECTURE.md#2025-04-12_snippet_6

LANGUAGE: tsx
CODE:
```
<List>
  {/* returns `null`, no DOM created */}
  <Item>A</Item>
  <Item>B</Item>
</List>
```

----------------------------------------

TITLE: Enabling Loop Navigation in Command Menu
DESCRIPTION: Shows how to enable loop navigation where arrow keys wrap around from the last item back to the first item in the list.
SOURCE: https://github.com/pacocoursey/cmdk/blob/main/README.md#2025-04-12_snippet_7

LANGUAGE: tsx
CODE:
```
<Command loop />
```

----------------------------------------

TITLE: Controlled Dialog Component with Open State
DESCRIPTION: Example of using the Command.Dialog component in a controlled manner with open and onOpenChange props.
SOURCE: https://github.com/pacocoursey/cmdk/blob/main/README.md#2025-04-12_snippet_8

LANGUAGE: tsx
CODE:
```
const [open, setOpen] = React.useState(false)

return (
  <Command.Dialog open={open} onOpenChange={setOpen}>
    ...
  </Command.Dialog>
)
```

----------------------------------------

TITLE: Controlled Input Component with Value State
DESCRIPTION: Example of using the Command.Input component in a controlled manner with value and onValueChange props.
SOURCE: https://github.com/pacocoursey/cmdk/blob/main/README.md#2025-04-12_snippet_10

LANGUAGE: tsx
CODE:
```
const [search, setSearch] = React.useState('')

return <Command.Input value={search} onValueChange={setSearch} />
```

----------------------------------------

TITLE: Command Item with onSelect Handler
DESCRIPTION: Example of using a Command.Item component with an onSelect handler to capture selection events. The value is implicitly derived from item text content.
SOURCE: https://github.com/pacocoursey/cmdk/blob/main/README.md#2025-04-12_snippet_13

LANGUAGE: tsx
CODE:
```
<Command.Item
  onSelect={(value) => console.log('Selected', value)}
  // Value is implicity "apple" because of the provided text content
>
  Apple
</Command.Item>
```