TITLE: Binding Components to Zustand Store
DESCRIPTION: This example shows how to consume state from a Zustand store within React components. Components use the store hook to select specific state slices (e.g., `bears` or `increasePopulation`) and re-render only when those selected slices change. No providers are needed, simplifying integration and reducing boilerplate.
SOURCE: https://github.com/pmndrs/zustand/blob/main/README.md#_snippet_2

LANGUAGE: JSX
CODE:
```
function BearCounter() {
  const bears = useBearStore((state) => state.bears)
  return <h1>{bears} around here ...</h1>
}

function Controls() {
  const increasePopulation = useBearStore((state) => state.increasePopulation)
  return <button onClick={increasePopulation}>one up</button>
}
```

----------------------------------------

TITLE: Creating a Basic Zustand Store (JavaScript)
DESCRIPTION: This snippet demonstrates the fundamental way to create a Zustand store. The `create` function takes a `stateCreatorFn` and returns a React Hook, `useSomeStore`, which can be used to access and modify the store's state.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/apis/create.md#_snippet_0

LANGUAGE: js
CODE:
```
const useSomeStore = create(stateCreatorFn)
```

----------------------------------------

TITLE: Basic Store Creation with createStore (JavaScript)
DESCRIPTION: This snippet demonstrates the fundamental way to create a vanilla store using `createStore` in Zustand. It takes a `stateCreatorFn` as an argument, which is a function that defines the initial state and actions of the store.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/apis/create-store.md#_snippet_0

LANGUAGE: js
CODE:
```
const someStore = createStore(stateCreatorFn)
```

----------------------------------------

TITLE: Colocating Store Actions in Zustand (JavaScript)
DESCRIPTION: This snippet demonstrates the recommended pattern for colocating store actions directly within a Zustand store. Actions like `updateX` and `updateY` are defined as methods that use the `set` function to update the store's state, ensuring updates are correctly merged and listeners are notified. This approach simplifies state management by keeping related state and actions together.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/guides/flux-inspired-practice.md#_snippet_0

LANGUAGE: javascript
CODE:
```
const useBoundStore = create((set) => ({
  storeSliceA: ...,
  storeSliceB: ...,
  storeSliceC: ...,
  updateX: () => set(...),
  updateY: () => set(...),
}))
```

----------------------------------------

TITLE: Creating a Zustand Store in JavaScript
DESCRIPTION: This JavaScript snippet illustrates how to create a new Zustand store using the `create` function. The store defines initial state (`bears`) and actions (`increasePopulation`, `removeAllBears`, `updateBears`) that modify the state. The `set` function is used to merge updates into the store's state.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/getting-started/introduction.md#_snippet_1

LANGUAGE: js
CODE:
```
import { create } from 'zustand'

const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}))
```

----------------------------------------

TITLE: Complete Example of Scoped Zustand Store in React
DESCRIPTION: This comprehensive snippet provides the full implementation for using a scoped (non-global) Zustand store within a React application. It includes the store definition, context and provider setup, a custom hook for store access, the component utilizing the store, and the main application component demonstrating multiple independent instances. It requires `react` and `zustand`.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/hooks/use-store.md#_snippet_16

LANGUAGE: tsx
CODE:
```
import { type ReactNode, useState, createContext, useContext } from 'react'
import { createStore, useStore } from 'zustand'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const createPositionStore = () => {
  return createStore<PositionStore>()((set) => ({
    position: { x: 0, y: 0 },
    setPosition: (position) => set({ position }),
  }))
}

const PositionStoreContext = createContext<ReturnType<
  typeof createPositionStore
> | null>(null)

function PositionStoreProvider({ children }: { children: ReactNode }) {
  const [positionStore] = useState(createPositionStore)

  return (
    <PositionStoreContext.Provider value={positionStore}>
      {children}
    </PositionStoreContext.Provider>
  )
}

function usePositionStore<U>(selector: (state: PositionStore) => U) {
  const store = useContext(PositionStoreContext)

  if (store === null) {
    throw new Error(
      'usePositionStore must be used within PositionStoreProvider',
    )
  }

  return useStore(store, selector)
}

function MovingDot({ color }: { color: string }) {
  const position = usePositionStore((state) => state.position)
  const setPosition = usePositionStore((state) => state.setPosition)

  return (
    <div
      onPointerMove={(e) => {
        setPosition({
          x:
            e.clientX > e.currentTarget.clientWidth
              ? e.clientX - e.currentTarget.clientWidth
              : e.clientX,
          y: e.clientY,
        })
      }}
      style={{
        position: 'relative',
        width: '50vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: color,
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <div style={{ display: 'flex' }}>
      <PositionStoreProvider>
        <MovingDot color="red" />
      </PositionStoreProvider>
      <PositionStoreProvider>
        <MovingDot color="blue" />
      </PositionStoreProvider>
    </div>
  )
}
```

----------------------------------------

TITLE: Updating Nested State in Zustand with Immer Middleware
DESCRIPTION: This example shows how to update a nested `person` object in a Zustand store using the `immer` middleware. By wrapping the state creator with `immer`, direct mutation of the `state.person` object within the `set` callback becomes possible, simplifying immutable updates and reducing boilerplate. It sets up a Zustand store with `immer`, defines state and actions, and includes event handlers for updating person details from HTML inputs, rendering the changes to the DOM.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/middlewares/immer.md#_snippet_5

LANGUAGE: ts
CODE:
```
import { createStore } from 'zustand/vanilla'
import { immer } from 'zustand/middleware/immer'

type PersonStoreState = {
  person: { firstName: string; lastName: string; email: string }
}

type PersonStoreActions = {
  setPerson: (
    nextPerson: (
      person: PersonStoreState['person'],
    ) => PersonStoreState['person'] | PersonStoreState['person'],
  ) => void
}

type PersonStore = PersonStoreState & PersonStoreActions

const personStore = createStore<PersonStore>()(
  immer((set) => ({
    person: {
      firstName: 'Barbara',
      lastName: 'Hepworth',
      email: 'bhepworth@sculpture.com',
    },
    setPerson: (nextPerson) =>
      set((state) => {
        state.person =
          typeof nextPerson === 'function'
            ? nextPerson(state.person)
            : nextPerson
      }),
  })),
)

const $firstNameInput = document.getElementById(
  'first-name',
) as HTMLInputElement
const $lastNameInput = document.getElementById('last-name') as HTMLInputElement
const $emailInput = document.getElementById('email') as HTMLInputElement
const $result = document.getElementById('result') as HTMLDivElement

function handleFirstNameChange(event: Event) {
  personStore.getState().setPerson((person) => {
    person.firstName = (event.target as any).value
  })
}

function handleLastNameChange(event: Event) {
  personStore.getState().setPerson((person) => {
    person.lastName = (event.target as any).value
  })
}

function handleEmailChange(event: Event) {
  personStore.getState().setPerson((person) => {
    person.email = (event.target as any).value
  })
}

$firstNameInput.addEventListener('input', handleFirstNameChange)
$lastNameInput.addEventListener('input', handleLastNameChange)
$emailInput.addEventListener('input', handleEmailChange)

const render: Parameters<typeof personStore.subscribe>[0] = (state) => {
  $firstNameInput.value = state.person.firstName
  $lastNameInput.value = state.person.lastName
  $emailInput.value = state.person.email

  $result.innerHTML = `${state.person.firstName} ${state.person.lastName} (${state.person.email})`
}

render(personStore.getInitialState(), personStore.getInitialState())

personStore.subscribe(render)
```

----------------------------------------

TITLE: Updating Deeply Nested State with Immer in Zustand (TypeScript)
DESCRIPTION: This example shows how to integrate Immer with Zustand to simplify updates for deeply nested state. Immer allows for writing seemingly mutable update logic, which it then translates into immutable updates behind the scenes, significantly reducing boilerplate.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/guides/updating-state.md#_snippet_3

LANGUAGE: ts
CODE:
```
  immerInc: () =>
    set(produce((state: State) => { ++state.deep.nested.obj.count })),
```

----------------------------------------

TITLE: Complete Dynamic Global Counter Store Example with Zustand and React
DESCRIPTION: This comprehensive example demonstrates the full implementation of dynamic global counter stores using Zustand and React. It includes the definition of counter store types, a factory function for creating new store instances, a mechanism for managing and retrieving these dynamic stores by key, and a React `App` component with tabs that each manage an independent counter, illustrating isolated state management.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/hooks/use-store.md#_snippet_10

LANGUAGE: TSX
CODE:
```
import { useState } from 'react'
import { createStore, useStore } from 'zustand'

type CounterState = {
  count: number
}

type CounterActions = { increment: () => void }

type CounterStore = CounterState & CounterActions

const createCounterStore = () => {
  return createStore<CounterStore>()((set) => ({
    count: 0,
    increment: () => {
      set((state) => ({ count: state.count + 1 }))
    },
  }))
}

const defaultCounterStores = new Map<
  string,
  ReturnType<typeof createCounterStore>
>()

const createCounterStoreFactory = (
  counterStores: typeof defaultCounterStores,
) => {
  return (counterStoreKey: string) => {
    if (!counterStores.has(counterStoreKey)) {
      counterStores.set(counterStoreKey, createCounterStore())
    }
    return counterStores.get(counterStoreKey)!
  }
}

const getOrCreateCounterStoreByKey =
  createCounterStoreFactory(defaultCounterStores)

export default function App() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const counterState = useStore(
    getOrCreateCounterStoreByKey(`tab-${currentTabIndex}`),
  )

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid salmon',
          paddingBottom: 4,
        }}
      >
        <button
          type="button"
          style={{
            border: '1px solid salmon',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={() => setCurrentTabIndex(0)}
        >
          Tab 1
        </button>
        <button
          type="button"
          style={{
            border: '1px solid salmon',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={() => setCurrentTabIndex(1)}
        >
          Tab 2
        </button>
        <button
          type="button"
          style={{
            border: '1px solid salmon',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={() => setCurrentTabIndex(2)}
        >
          Tab 3
        </button>
      </div>
      <div style={{ padding: 4 }}>
        Content of Tab {currentTabIndex + 1}
        <br /> <br />
        <button type="button" onClick={() => counterState.increment()}>
          Count: {counterState.count}
        </button>
      </div>
    </div>
  )
}
```

----------------------------------------

TITLE: Defining Colocated Actions in Zustand Store (JavaScript)
DESCRIPTION: This snippet demonstrates the recommended approach of defining actions directly within the Zustand store's `create` function. Actions like `inc` and `setText` are part of the store's state object, allowing for a self-contained and encapsulated store. It shows how to update state using the `set` function provided by Zustand.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/guides/practice-with-no-store-actions.md#_snippet_0

LANGUAGE: JavaScript
CODE:
```
export const useBoundStore = create((set) => ({
  count: 0,
  text: 'hello',
  inc: () => set((state) => ({ count: state.count + 1 })),
  setText: (text) => set({ text })
}))
```

----------------------------------------

TITLE: Corrected Form State Update in Zustand (TSX)
DESCRIPTION: This snippet presents the corrected implementation of the form component, demonstrating how to properly update the `person` object in the Zustand store. Each `onChange` handler now uses the spread operator to create a new `person` object with the updated field, ensuring immutability and correct UI re-renders.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/apis/create-with-equality-fn.md#_snippet_11

LANGUAGE: tsx
CODE:
```
import { type ChangeEvent } from 'react'
import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/vanilla/shallow'

type PersonStoreState = {
  person: { firstName: string; lastName: string; email: string }
}

type PersonStoreActions = {
  setPerson: (nextPerson: PersonStoreState['person']) => void
}

type PersonStore = PersonStoreState & PersonStoreActions

const usePersonStore = createWithEqualityFn<PersonStore>()(
  (set) => ({
    person: {
      firstName: 'Barbara',
      lastName: 'Hepworth',
      email: 'bhepworth@sculpture.com',
    },
    setPerson: (nextPerson) => set({ person: nextPerson }),
  }),
  shallow,
)

export default function Form() {
  const person = usePersonStore((state) => state.person)
  const setPerson = usePersonStore((state) => state.setPerson)

  function handleFirstNameChange(e: ChangeEvent<HTMLInputElement>) {
    setPerson({ ...person, firstName: e.target.value })
  }

  function handleLastNameChange(e: ChangeEvent<HTMLInputElement>) {
    setPerson({ ...person, lastName: e.target.value })
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setPerson({ ...person, email: e.target.value })
  }

  return (
    <>
      <label style={{ display: 'block' }}>
        First name:
        <input value={person.firstName} onChange={handleFirstNameChange} />
      </label>
      <label style={{ display: 'block' }}>
        Last name:
        <input value={person.lastName} onChange={handleLastNameChange} />
      </label>
      <label style={{ display: 'block' }}>
        Email:
        <input value={person.email} onChange={handleEmailChange} />
      </label>
      <p>
        {person.firstName} {person.lastName} ({person.email})
      </p>
    </>
  )
}
```

----------------------------------------

TITLE: Initializing Zustand Store in Provider (TSX)
DESCRIPTION: This updated `CounterStoreProvider` now calls `initCounterStore()` when creating the store instance. This ensures that the store is initialized with a dynamic initial state, which is crucial for server-side rendering (SSR) in Next.js to prevent hydration errors by providing consistent state on both server and client.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/guides/nextjs.md#_snippet_4

LANGUAGE: tsx
CODE:
```

```

----------------------------------------

TITLE: Incorrect State Mutation in Zustand Form (Problematic)
DESCRIPTION: This example illustrates a common pitfall where direct mutation of the `person` object (e.g., `person.firstName = e.target.value`) prevents React from re-rendering the component. Zustand's `set` function expects a new state object, not a mutated reference, leading to UI not updating.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/apis/create.md#_snippet_8

LANGUAGE: tsx
CODE:
```
import { create } from 'zustand'

type PersonStoreState = {
  firstName: string
  lastName: string
  email: string
}

type PersonStoreActions = {
  setPerson: (nextPerson: Partial<PersonStoreState>) => void
}

type PersonStore = PersonStoreState & PersonStoreActions

const usePersonStore = create<PersonStore>()((set) => ({
  firstName: 'Barbara',
  lastName: 'Hepworth',
  email: 'bhepworth@sculpture.com',
  setPerson: (nextPerson) => set(nextPerson),
}))

export default function Form() {
  const person = usePersonStore((state) => state)
  const setPerson = usePersonStore((state) => state.setPerson)

  function handleFirstNameChange(e: ChangeEvent<HTMLInputElement>) {
    person.firstName = e.target.value
  }

  function handleLastNameChange(e: ChangeEvent<HTMLInputElement>) {
    person.lastName = e.target.value
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    person.email = e.target.value
  }

  return (
    <>
      <label style={{ display: 'block' }}>
        First name:
        <input value={person.firstName} onChange={handleFirstNameChange} />
      </label>
      <label style={{ display: 'block' }}>
        Last name:
        <input value={person.lastName} onChange={handleLastNameChange} />
      </label>
      <label style={{ display: 'block' }}>
        Email:
        <input value={person.email} onChange={handleEmailChange} />
      </label>
      <p>
        {person.firstName} {person.lastName} ({person.email})
      </p>
    </>
  )
}
```

----------------------------------------

TITLE: Basic useStore Hook Usage in JavaScript
DESCRIPTION: This snippet demonstrates the fundamental syntax for using the `useStore` hook to access state from a vanilla Zustand store within a React component. It shows how to pass the store instance and an optional selector function to extract specific data.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/hooks/use-store.md#_snippet_0

LANGUAGE: JavaScript
CODE:
```
const someState = useStore(store, selectorFn)
```

----------------------------------------

TITLE: Installing Zustand via npm
DESCRIPTION: This command installs the Zustand state management library into your project using npm. It's the first step to integrate Zustand into a JavaScript or TypeScript application, providing access to its core functionalities.
SOURCE: https://github.com/pmndrs/zustand/blob/main/README.md#_snippet_0

LANGUAGE: Bash
CODE:
```
npm install zustand
```

----------------------------------------

TITLE: Complete Dynamic Tabbed Counter Application (TSX)
DESCRIPTION: Presents the complete, integrated code for the dynamic tabbed counter application. It combines all previous snippets, including Zustand store creation, store instance management, and the React `App` component, showcasing a fully functional example of managing independent global stores per tab.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/hooks/use-store-with-equality-fn.md#_snippet_10

LANGUAGE: tsx
CODE:
```
import { useState } from 'react'
import { createStore } from 'zustand'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

type CounterState = {
  count: number
}

type CounterActions = { increment: () => void }

type CounterStore = CounterState & CounterActions

const createCounterStore = () => {
  return createStore<CounterStore>()((set) => ({
    count: 0,
    increment: () => {
      set((state) => ({ count: state.count + 1 }))
    },
  }))
}

const defaultCounterStores = new Map<
  string,
  ReturnType<typeof createCounterStore>
>()

const createCounterStoreFactory = (
  counterStores: typeof defaultCounterStores,
) => {
  return (counterStoreKey: string) => {
    if (!counterStores.has(counterStoreKey)) {
      counterStores.set(counterStoreKey, createCounterStore())
    }
    return counterStores.get(counterStoreKey)!
  }
}

const getOrCreateCounterStoreByKey =
  createCounterStoreFactory(defaultCounterStores)

export default function App() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const counterState = useStoreWithEqualityFn(
    getOrCreateCounterStoreByKey(`tab-${currentTabIndex}`),
    (state) => state,
    shallow,
  )

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid salmon',
          paddingBottom: 4,
        }}
      >
        <button
          type="button"
          style={{
            border: '1px solid salmon',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={() => setCurrentTabIndex(0)}
        >
          Tab 1
        </button>
        <button
          type="button"
          style={{
            border: '1px salmon',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={() => setCurrentTabIndex(1)}
        >
          Tab 2
        </button>
        <button
          type="button"
          style={{
            border: '1px solid salmon',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
          onClick={() => setCurrentTabIndex(2)}
        >
          Tab 3
        </button>
      </div>
      <div style={{ padding: 4 }}>
        Content of Tab {currentTabIndex + 1}
        <br /> <br />
        <button type="button" onClick={() => counterState.increment()}>
          Count: {counterState.count}
        </button>
      </div>
    </div>
  )
}
```

----------------------------------------

TITLE: Binding Zustand Store to React Components with JSX
DESCRIPTION: This JSX snippet demonstrates how to consume the Zustand store within React functional components. The `useStore` hook is used to select specific parts of the state (`bears`) or actions (`increasePopulation`), ensuring that components only re-render when their selected state changes. This allows for direct state access without the need for React Context Providers.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/getting-started/introduction.md#_snippet_2

LANGUAGE: jsx
CODE:
```
function BearCounter() {
  const bears = useStore((state) => state.bears)
  return <h1>{bears} bears around here...</h1>
}

function Controls() {
  const increasePopulation = useStore((state) => state.increasePopulation)
  return <button onClick={increasePopulation}>one up</button>
}
```

----------------------------------------

TITLE: Preventing Rerenders with useShallow in Zustand
DESCRIPTION: This snippet refactors the `BearNames` component to use `useShallow` from `zustand/react/shallow`. By wrapping the selector with `useShallow`, the component only rerenders if the shallow equality of the selected value changes, preventing unnecessary updates.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/guides/prevent-rerenders-with-use-shallow.md#_snippet_2

LANGUAGE: JavaScript
CODE:
```
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

const useMeals = create(() => ({
  papaBear: 'large porridge-pot',
  mamaBear: 'middle-size porridge pot',
  littleBear: 'A little, small, wee pot',
}))

export const BearNames = () => {
  const names = useMeals(useShallow((state) => Object.keys(state)))

  return <div>{names.join(', ')}</div>
}
```

----------------------------------------

TITLE: Custom Hook with Equality Function for Zustand Store (TSX)
DESCRIPTION: Enhances the `useBearContext` hook to optionally accept an `equalityFn` parameter. This allows consumers to provide a custom comparison function for optimizing re-renders when selecting state, leveraging `useStoreWithEqualityFn` from Zustand.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/guides/initialize-state-with-props.md#_snippet_7

LANGUAGE: tsx
CODE:
```
import { useContext } from 'react'
import { useStoreWithEqualityFn } from 'zustand/traditional'

function useBearContext<T>(
  selector: (state: BearState) => T,
  equalityFn?: (left: T, right: T) => boolean,
): T {
  const store = useContext(BearContext)
  if (!store) throw new Error('Missing BearContext.Provider in the tree')
  return useStoreWithEqualityFn(store, selector, equalityFn)
}
```

----------------------------------------

TITLE: Implementing Redux-like Reducers with Zustand (TypeScript)
DESCRIPTION: This example illustrates how to integrate Redux-style reducers into a Zustand store. It defines a `reducer` function that handles state transitions based on dispatched actions (`type`, `by`). A `dispatch` function is then added to the store, which uses `set` to apply the reducer's output to the state, mimicking a Redux-like update flow. This pattern is useful for developers familiar with Redux's action/reducer paradigm.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/guides/flux-inspired-practice.md#_snippet_1

LANGUAGE: typescript
CODE:
```
const types = { increase: 'INCREASE', decrease: 'DECREASE' }

const reducer = (state, { type, by = 1 }) => {
  switch (type) {
    case types.increase:
      return { grumpiness: state.grumpiness + by }
    case types.decrease:
      return { grumpiness: state.grumpiness - by }
  }
}

const useGrumpyStore = create((set) => ({
  grumpiness: 0,
  dispatch: (args) => set((state) => reducer(state, args)),
}))

const dispatch = useGrumpyStore((state) => state.dispatch)
dispatch({ type: types.increase, by: 2 })
```

----------------------------------------

TITLE: Correct Immutable State Updates in Zustand with Spread
DESCRIPTION: This comprehensive TypeScript snippet illustrates the best practice for updating nested state immutably in Zustand. It uses the spread operator (`...`) to copy the existing `person` object and then overrides the specific field (`firstName`, `lastName`, or `email`) that has changed, ensuring that a new state object is created and passed to `setPerson`, which correctly triggers UI updates.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/apis/create-store.md#_snippet_16

LANGUAGE: typescript
CODE:
```
import { createStore } from 'zustand/vanilla'

type PersonStoreState = {
  person: { firstName: string; lastName: string; email: string }
}

type PersonStoreActions = {
  setPerson: (nextPerson: PersonStoreState['person']) => void
}

type PersonStore = PersonStoreState & PersonStoreActions

const personStore = createStore<PersonStore>()((set) => ({
  person: {
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  },
  setPerson: (person) => set({ person }),
}))

const $firstNameInput = document.getElementById(
  'first-name',
) as HTMLInputElement
const $lastNameInput = document.getElementById('last-name') as HTMLInputElement
const $emailInput = document.getElementById('email') as HTMLInputElement
const $result = document.getElementById('result') as HTMLDivElement

function handleFirstNameChange(event: Event) {
  personStore.getState().setPerson({
    ...personStore.getState().person,
    firstName: (event.target as any).value,
  })
}

function handleLastNameChange(event: Event) {
  personStore.getState().setPerson({
    ...personStore.getState().person,
    lastName: (event.target as any).value,
  })
}

function handleEmailChange(event: Event) {
  personStore.getState().setPerson({
    ...personStore.getState().person,
    email: (event.target as any).value,
  })
}

$firstNameInput.addEventListener('input', handleFirstNameChange)
$lastNameInput.addEventListener('input', handleLastNameChange)
$emailInput.addEventListener('input', handleEmailChange)

const render: Parameters<typeof personStore.subscribe>[0] = (state) => {
  $firstNameInput.value = state.person.firstName
  $lastNameInput.value = state.person.lastName
  $emailInput.value = state.person.email

  $result.innerHTML = `${state.person.firstName} ${state.person.lastName} (${state.person.email})`
}

render(personStore.getInitialState(), personStore.getInitialState())

personStore.subscribe(render)
```

----------------------------------------

TITLE: Complete Zustand Versioned State Persistence with Migration
DESCRIPTION: Presents the full TypeScript code for managing Zustand state with versioning and migrations. It includes the initial state simulation, the `createStore` call with `persist` middleware configured for `version: 1` and the `migrate` function, along with the mouse tracking and rendering logic, showcasing a robust state management solution.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/middlewares/persist.md#_snippet_22

LANGUAGE: TypeScript
CODE:
```
import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'

// For tutorial purposes only
if (!localStorage.getItem('position-storage')) {
  localStorage.setItem(
    'position-storage',
    JSON.stringify({
      state: { x: 100, y: 100 },
      version: 0,
    }),
  )
}

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()(
  persist(
    (set) => ({
      position: { x: 0, y: 0 }, // version 0: just x: 0, y: 0
      setPosition: (position) => set({ position }),
    }),
    {
      name: 'position-storage',
      version: 1,
      migrate: (persisted: any, version) => {
        if (version === 0) {
          persisted.position = { x: persisted.x, y: persisted.y }
          delete persisted.x
          delete persisted.y
        }

        return persisted
      },
    },
  ),
)

const $dotContainer = document.getElementById('dot-container') as HTMLDivElement
const $dot = document.getElementById('dot') as HTMLDivElement

$dotContainer.addEventListener('pointermove', (event) => {
  positionStore.getState().setPosition({
    x: event.clientX,
    y: event.clientY,
  })
})

const render: Parameters<typeof positionStore.subscribe>[0] = (state) => {
  $dot.style.transform = `translate(${state.position.x}px, ${state.position.y}px)`
}

render(positionStore.getState(), positionStore.getState())

positionStore.subscribe(render)
```

----------------------------------------

TITLE: Custom Hook for Next.js Hydration (TypeScript)
DESCRIPTION: Provides a custom React hook, `useStore`, designed to mitigate hydration mismatches in Next.js applications when using Zustand's `persist` middleware. It uses `useState` and `useEffect` to ensure the component waits for client-side hydration before rendering state-dependent UI, preventing SSR-related errors.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md#_snippet_20

LANGUAGE: TypeScript
CODE:
```
// useStore.ts
import { useState, useEffect } from 'react'

const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F,
) => {
  const result = store(callback) as F
  const [data, setData] = useState<F>()

  useEffect(() => {
    setData(result)
  }, [result])

  return data
}

export default useStore
```

----------------------------------------

TITLE: Migrating Zustand Persisted State Versions
DESCRIPTION: This example demonstrates how to use the `version` and `migrate` options to handle breaking changes in your store's schema. It defines a migration logic that renames 'oldField' to 'newField' when upgrading from version 0 to version 1, ensuring backward compatibility for persisted data.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md#_snippet_7

LANGUAGE: TypeScript
CODE:
```
export const useBoundStore = create(
  persist(
    (set, get) => ({
      newField: 0, // let's say this field was named otherwise in version 0
    }),
    {
      // ...
      version: 1, // a migration will be triggered if the version in the storage mismatches this one
      migrate: (persistedState, version) => {
        if (version === 0) {
          // if the stored value is in version 0, we rename the field to the new name
          persistedState.newField = persistedState.oldField
          delete persistedState.oldField
        }

        return persistedState
      },
    },
  ),
)
```

----------------------------------------

TITLE: Selecting Multiple State Slices with useShallow
DESCRIPTION: This snippet illustrates how to select multiple state slices into a single object or array using `useShallow` from `zustand/react/shallow`. `useShallow` prevents unnecessary re-renders by performing a shallow comparison of the selector's output, ensuring the component only updates if the selected values themselves change.
SOURCE: https://github.com/pmndrs/zustand/blob/main/README.md#_snippet_5

LANGUAGE: JSX
CODE:
```
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

const useBearStore = create((set) => ({
  nuts: 0,
  honey: 0,
  treats: {},
  // ...
}))

// Object pick, re-renders the component when either state.nuts or state.honey change
const { nuts, honey } = useBearStore(
  useShallow((state) => ({ nuts: state.nuts, honey: state.honey })),
)

// Array pick, re-renders the component when either state.nuts or state.honey change
const [nuts, honey] = useBearStore(
  useShallow((state) => [state.nuts, state.honey]),
)

// Mapped picks, re-renders the component when state.treats changes in order, count or keys
const treats = useBearStore(useShallow((state) => Object.keys(state.treats)))
```

----------------------------------------

TITLE: Resetting Multiple Zustand Stores Simultaneously (TypeScript)
DESCRIPTION: This snippet provides a pattern for resetting multiple Zustand stores at once. It wraps the 'zustand' 'create' function to register a reset function for each store, allowing a single 'resetAllStores' call to revert all registered stores to their initial states. This is useful for global state resets.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/guides/how-to-reset-state.md#_snippet_1

LANGUAGE: ts
CODE:
```
import type { StateCreator } from 'zustand'
import { create: actualCreate } from 'zustand'

const storeResetFns = new Set<() => void>()

const resetAllStores = () => {
  storeResetFns.forEach((resetFn) => {
    resetFn()
  })
}

export const create = (<T>() => {
  return (stateCreator: StateCreator<T>) => {
    const store = actualCreate(stateCreator)
    const initialState = store.getInitialState()
    storeResetFns.add(() => {
      store.setState(initialState, true)
    })
    return store
  }
}) as typeof actualCreate
```

----------------------------------------

TITLE: Defining Zustand Store with `combine` Middleware
DESCRIPTION: This snippet demonstrates using the `combine` middleware from `zustand/middleware` to define a Zustand store. `combine` infers the state type automatically, eliminating the need for explicit type annotation with `create<T>()(...)`. It merges an initial state object with a function that defines actions, providing a convenient way to structure the store.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#_snippet_5

LANGUAGE: TypeScript
CODE:
```
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

const useBearStore = create(
  combine({ bears: 0 }, (set) => ({
    increase: (by: number) => set((state) => ({ bears: state.bears + by })),
  })),
)
```

----------------------------------------

TITLE: Implementing Async Actions in Zustand
DESCRIPTION: This snippet shows how to perform asynchronous operations within Zustand actions. The `set` function can be called once the async operation (e.g., a `fetch` request) completes, updating the store's state with the fetched data. Zustand inherently supports async actions without special middleware.
SOURCE: https://github.com/pmndrs/zustand/blob/main/README.md#_snippet_8

LANGUAGE: JSX
CODE:
```
const useFishStore = create((set) => ({
  fishies: {},
  fetch: async (pond) => {
    const response = await fetch(pond)
    set({ fishies: await response.json() })
  },
}))
```

----------------------------------------

TITLE: Implementing Context-Based Counter Store in React with Zustand
DESCRIPTION: This comprehensive snippet establishes a React Context for the Zustand counter store. It includes `createCounterStore` to instantiate a store, `CounterStoreProvider` to make the store available via context, and `useCounterStoreContext` to consume the store within components, ensuring proper error handling if used outside the provider.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/guides/testing.md#_snippet_21

LANGUAGE: tsx
CODE:
```
// contexts/use-counter-store-context.tsx
import { type ReactNode, createContext, useContext, useRef } from 'react'
import { createStore } from 'zustand'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

import {
  type CounterStore,
  counterStoreCreator,
} from '../shared/counter-store-creator'

export const createCounterStore = () => {
  return createStore<CounterStore>(counterStoreCreator)
}

export type CounterStoreApi = ReturnType<typeof createCounterStore>

export const CounterStoreContext = createContext<CounterStoreApi | undefined>(
  undefined,
)

export interface CounterStoreProviderProps {
  children: ReactNode
}

export const CounterStoreProvider = ({
  children,
}: CounterStoreProviderProps) => {
  const counterStoreRef = useRef<CounterStoreApi>(null)
  if (!counterStoreRef.current) {
    counterStoreRef.current = createCounterStore()
  }

  return (
    <CounterStoreContext.Provider value={counterStoreRef.current}>
      {children}
    </CounterStoreContext.Provider>
  )
}

export type UseCounterStoreContextSelector<T> = (store: CounterStore) => T

export const useCounterStoreContext = <T,>(
  selector: UseCounterStoreContextSelector<T>,
): T => {
  const counterStoreContext = useContext(CounterStoreContext)

  if (counterStoreContext === undefined) {
    throw new Error(
      'useCounterStoreContext must be used within CounterStoreProvider',
    )
  }

  return useStoreWithEqualityFn(counterStoreContext, selector, shallow)
}
```

----------------------------------------

TITLE: Updating Deeply Nested State with optics-ts in Zustand (TypeScript)
DESCRIPTION: This snippet demonstrates using the `optics-ts` library to update deeply nested state in Zustand. It provides a functional, type-safe way to target and modify specific properties within complex objects without relying on proxies or mutable syntax.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/guides/updating-state.md#_snippet_4

LANGUAGE: ts
CODE:
```
  opticsInc: () =>
    set(O.modify(O.optic<State>().path("deep.nested.obj.count"))((c) => c + 1)),
```

----------------------------------------

TITLE: Defining Zustand Store with Explicit TypeScript State
DESCRIPTION: This snippet demonstrates the basic way to define a Zustand store using TypeScript. It explicitly annotates the state type `BearState` with `create<BearState>()(...)` to ensure proper type inference, which is necessary due to TypeScript's invariance issues with the `create` function's generic type. The store includes a `bears` number and an `increase` function.
SOURCE: https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#_snippet_0

LANGUAGE: TypeScript
CODE:
```
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))
```

----------------------------------------

TITLE: Creating a Basic Zustand Store
DESCRIPTION: This snippet demonstrates how to create a basic Zustand store using the `create` function. The store is defined as a hook that manages `bears` state and provides actions to `increasePopulation` and `removeAllBears`. State updates are handled immutably via the `set` function, which merges state by default.
SOURCE: https://github.com/pmndrs/zustand/blob/main/README.md#_snippet_1

LANGUAGE: JSX
CODE:
```
import { create } from 'zustand'

const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 })
}))
```