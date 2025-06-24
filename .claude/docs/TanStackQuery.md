# TanStack Query Documentation

TanStack Query (formerly React Query) is a powerful asynchronous state management library for TS/JS, React, Solid, Vue, Svelte and Angular.

## Core Concepts

### 1. Query Basics

The `useQuery` hook is the primary way to fetch data:

```tsx
import { useQuery } from '@tanstack/react-query'

function App() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodoList
  })
  
  if (isLoading) return 'Loading...'
  if (error) return 'An error occurred: ' + error.message
  
  return <div>{data}</div>
}
```

### 2. Query Keys

Query keys uniquely identify queries and can include variables:

```tsx
// Simple key
useQuery({ queryKey: ['todos'], queryFn: fetchTodos })

// With variables
useQuery({ queryKey: ['todo', todoId], queryFn: () => fetchTodoById(todoId) })

// With objects
useQuery({ queryKey: ['todos', { type: 'done' }], queryFn: fetchDoneTodos })
```

### 3. Mutations

Use `useMutation` for data modifications:

```tsx
const mutation = useMutation({
  mutationFn: (newTodo) => axios.post('/todos', newTodo),
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})

// Trigger mutation
mutation.mutate({ id: new Date(), title: 'Do Laundry' })
```

### 4. Query Client Setup

Initialize QueryClient and provide it to your app:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  )
}
```

## Advanced Features

### Optimistic Updates

Update the UI immediately while the mutation is in progress:

```tsx
useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    // Cancel queries
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    
    // Snapshot previous value
    const previousTodos = queryClient.getQueryData(['todos'])
    
    // Optimistically update
    queryClient.setQueryData(['todos'], old => [...old, newTodo])
    
    // Return context for rollback
    return { previousTodos }
  },
  onError: (err, newTodo, context) => {
    // Rollback on error
    queryClient.setQueryData(['todos'], context.previousTodos)
  },
  onSettled: () => {
    // Always refetch
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

### Dependent Queries

Execute queries based on other query results:

```tsx
const { data: user } = useQuery({
  queryKey: ['user', email],
  queryFn: getUserByEmail,
})

const { data: projects } = useQuery({
  queryKey: ['projects', user?.id],
  queryFn: getProjectsByUser,
  enabled: !!user?.id, // Only run when user ID exists
})
```

### Infinite Queries

For paginated data:

```tsx
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: ({ pageParam }) => fetchProjects(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
})
```

### Prefetching

Fetch data before it's needed:

```tsx
// Prefetch
await queryClient.prefetchQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
})

// The data is now in cache and useQuery will return it immediately
const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos })
```

### Query Invalidation

Mark queries as stale to trigger refetches:

```tsx
// Invalidate all queries
queryClient.invalidateQueries()

// Invalidate specific queries
queryClient.invalidateQueries({ queryKey: ['todos'] })

// Invalidate with exact match
queryClient.invalidateQueries({ 
  queryKey: ['todos', { type: 'done' }],
  exact: true 
})
```

## Framework-Specific Usage

### Angular

Use injection-based API:

```typescript
import { injectQuery, injectMutation } from '@tanstack/angular-query-experimental'

export class TodosComponent {
  query = injectQuery(() => ({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  }))
  
  mutation = injectMutation(() => ({
    mutationFn: addTodo,
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  }))
}
```

### Vue

Use composition API:

```vue
<script setup>
import { useQuery, useMutation } from '@tanstack/vue-query'

const { data, isLoading } = useQuery({
  queryKey: ['todos'],
  queryFn: getTodos,
})

const mutation = useMutation({
  mutationFn: postTodo,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
</script>
```

### Solid

Works with Suspense and ErrorBoundary:

```tsx
import { useQuery } from '@tanstack/solid-query'

function App() {
  const query = useQuery(() => ({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    throwOnError: true, // For ErrorBoundary
  }))
  
  return (
    <ErrorBoundary fallback={<div>Error!</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <div>{query.data}</div>
      </Suspense>
    </ErrorBoundary>
  )
}
```

## Best Practices

1. **Always include dependencies in query keys** - All variables used in queryFn should be in the queryKey
2. **Use queryOptions helper** for reusable query configurations
3. **Set appropriate staleTime** to reduce unnecessary refetches
4. **Handle loading and error states** in your UI
5. **Use optimistic updates** for better UX in mutations
6. **Prefetch data** when you can predict user actions
7. **Invalidate queries** after mutations that affect related data

## Common Patterns

### Reusable Query Options

```tsx
function todoQueryOptions(id: number) {
  return queryOptions({
    queryKey: ['todo', id],
    queryFn: () => fetchTodo(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Use anywhere
useQuery(todoQueryOptions(1))
queryClient.prefetchQuery(todoQueryOptions(2))
queryClient.setQueryData(todoQueryOptions(3).queryKey, newData)
```

### Select Transform

Transform data without causing re-renders:

```tsx
const todoCount = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  select: (data) => data.length, // Only re-render when length changes
})
```

### Background Refetching

Show stale data while refetching:

```tsx
const { data, isFetching } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 0, // Always stale
})

return (
  <div>
    {data && <TodoList todos={data} />}
    {isFetching && <Spinner />}
  </div>
)
```