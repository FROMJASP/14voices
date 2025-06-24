# React Hook Form Documentation

React Hook Form is a performant, flexible forms library with easy-to-use validation for React applications.

## Installation

```bash
npm install react-hook-form
```

## Basic Usage

### Simple Form

```typescript
import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
  example: string
  exampleRequired: string
}

export default function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input defaultValue="test" {...register("example")} />
      
      <input {...register("exampleRequired", { required: true })} />
      {errors.exampleRequired && <span>This field is required</span>}
      
      <input type="submit" />
    </form>
  )
}
```

### Registering Inputs

```typescript
// Basic registration
<input {...register("firstName")} />

// With validation
<input {...register("firstName", { required: true, maxLength: 20 })} />
<input {...register("lastName", { pattern: /^[A-Za-z]+$/i })} />
<input type="number" {...register("age", { min: 18, max: 99 })} />

// Select
<select {...register("gender")}>
  <option value="female">female</option>
  <option value="male">male</option>
  <option value="other">other</option>
</select>
```

## Form State & Validation

### Validation Rules

```typescript
const { register, handleSubmit, formState: { errors } } = useForm()

// Required field
<input {...register("name", { required: "This field is required" })} />

// Pattern matching
<input {...register("email", { 
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Invalid email address"
  }
})} />

// Custom validation
<input {...register("username", {
  validate: value => value !== "admin" || "Nice try!"
})} />

// Async validation
<input {...register("username", {
  validate: async (value) => {
    const result = await checkUsername(value)
    return result || "Username already taken"
  }
})} />
```

### Error Display

```typescript
// Simple error display
{errors.firstName && <span>This field is required</span>}

// With error message
{errors.email && <p>{errors.email.message}</p>}

// Using ErrorMessage component
import { ErrorMessage } from '@hookform/error-message'

<ErrorMessage errors={errors} name="singleErrorInput" />
<ErrorMessage
  errors={errors}
  name="multipleErrorInput"
  render={({ messages }) =>
    messages &&
    Object.entries(messages).map(([type, message]) => (
      <p key={type}>{message}</p>
    ))
  }
/>
```

## Advanced Features

### Default Values

```typescript
// Synchronous default values
const { register, handleSubmit } = useForm({
  defaultValues: {
    firstName: "John",
    lastName: "Doe"
  }
})

// Async default values
const { register, handleSubmit } = useForm({
  defaultValues: async () => {
    const response = await fetch("/api/user")
    return await response.json()
  }
})
```

### Watching Values

```typescript
const { register, watch } = useForm()

// Watch single field
const watchShowAge = watch("showAge", false)

// Watch multiple fields
const watchFields = watch(["showAge", "age"])

// Watch all fields
const watchAllFields = watch()

// Conditional rendering
{watchShowAge && <input type="number" {...register("age")} />}
```

### Controller Component

For controlled components and UI libraries:

```typescript
import { useForm, Controller } from "react-hook-form"
import { TextField } from "@material-ui/core"
import Select from "react-select"

function App() {
  const { control, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="firstName"
        control={control}
        render={({ field }) => <TextField {...field} />}
      />
      
      <Controller
        name="iceCreamType"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={[
              { value: "chocolate", label: "Chocolate" },
              { value: "strawberry", label: "Strawberry" },
              { value: "vanilla", label: "Vanilla" }
            ]}
          />
        )}
      />
    </form>
  )
}
```

### useController Hook

```typescript
import { useForm, useController, UseControllerProps } from "react-hook-form"

function Input(props: UseControllerProps<FormValues>) {
  const { field, fieldState } = useController(props)

  return (
    <div>
      <input {...field} placeholder={props.name} />
      <p>{fieldState.isTouched && "Touched"}</p>
      <p>{fieldState.isDirty && "Dirty"}</p>
      <p>{fieldState.invalid ? "invalid" : "valid"}</p>
    </div>
  )
}

// Usage
<Input control={control} name="firstName" rules={{ required: true }} />
```

## Schema Validation

### With Zod

```bash
npm install @hookform/resolvers zod
```

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  age: z.number().min(18, { message: "Must be 18+" })
})

type Schema = z.infer<typeof schema>

const App = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Schema>({
    resolver: zodResolver(schema)
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      {errors.name && <p>{errors.name.message}</p>}
      
      <input {...register("age", { valueAsNumber: true })} type="number" />
      {errors.age && <p>{errors.age.message}</p>}
    </form>
  )
}
```

### With Yup

```bash
npm install @hookform/resolvers yup
```

```typescript
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const schema = yup.object({
  firstName: yup.string().required(),
  age: yup.number().positive().integer().required()
}).required()

const { register, handleSubmit } = useForm({
  resolver: yupResolver(schema)
})
```

## Form Context

Share form methods across deeply nested components:

```typescript
import { useForm, FormProvider, useFormContext } from "react-hook-form"

// Parent component
export default function App() {
  const methods = useForm()
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <NestedInput />
      </form>
    </FormProvider>
  )
}

// Child component
function NestedInput() {
  const { register } = useFormContext()
  return <input {...register("test")} />
}
```

## Form Actions

### setValue

```typescript
const { setValue } = useForm()

// Set single value
setValue("firstName", "John")

// Set with options
setValue("lastName", "Doe", { 
  shouldValidate: true,
  shouldDirty: true,
  shouldTouch: true
})

// Dependent fields
useEffect(() => {
  if (a && b) {
    setValue("c", `${a} ${b}`)
  }
}, [setValue, a, b])
```

### reset

```typescript
const { reset } = useForm()

// Reset to default values
reset()

// Reset with new values
reset({
  firstName: "John",
  lastName: "Doe"
})

// Partial reset
reset({
  firstName: "John"
}, {
  keepErrors: true,
  keepDirty: true
})
```

### setError

```typescript
const { setError } = useForm()

// Set field error
setError("username", {
  type: "manual",
  message: "Username already taken"
})

// Set root error
setError("root.serverError", {
  type: 400,
  message: "Server error"
})
```

## Performance Optimization

### useWatch Hook

```typescript
import { useForm, useWatch } from "react-hook-form"

// In parent component
const { control } = useForm()

// In child component
function ChildComponent({ control }) {
  const firstName = useWatch({
    control,
    name: "firstName",
    defaultValue: "default"
  })
  
  return <p>Watch: {firstName}</p>
}
```

### FormState Subscription

```typescript
// ✅ Correct - destructure needed properties
const { isDirty, isValid } = useFormState({ control })

// ❌ Wrong - subscribes to all form state changes
const formState = useFormState({ control })
```

## Server-Side Integration

### Form Component

```typescript
import { Form } from "react-hook-form"

function App() {
  const { register, control } = useForm()

  return (
    <Form
      action="/api/save"
      control={control}
      onSuccess={() => alert("Success!")}
      onError={() => alert("Error!")}
    >
      <input {...register("firstName", { required: true })} />
      <button type="submit">Submit</button>
    </Form>
  )
}
```

## TypeScript

### Type Safety

```typescript
import { useForm, SubmitHandler } from "react-hook-form"

type FormData = {
  firstName: string
  lastName: string
  age: number
}

const { register, handleSubmit } = useForm<FormData>()

const onSubmit: SubmitHandler<FormData> = (data) => {
  // data is fully typed
  console.log(data.firstName) // string
  console.log(data.age) // number
}
```

### Control Type

```typescript
import { Control, useWatch } from "react-hook-form"

interface ChildProps {
  control: Control<FormData>
}

function Child({ control }: ChildProps) {
  const firstName = useWatch({ control, name: "firstName" })
  return <div>{firstName}</div>
}
```

## Best Practices

1. **Always provide TypeScript types** for form data
2. **Use schema validation** (Zod, Yup) for complex forms
3. **Destructure formState properties** for performance
4. **Use Controller/useController** for external UI libraries
5. **Leverage FormProvider** for deeply nested forms
6. **Handle async validation** carefully to avoid race conditions
7. **Use defaultValues** to initialize form state
8. **Implement proper error handling** with ErrorMessage component
9. **Optimize re-renders** with useWatch and proper subscriptions
10. **Test forms thoroughly** with @testing-library/react

## Common Patterns

### Multi-step Form

```typescript
const [step, setStep] = useState(0)
const { register, handleSubmit, trigger } = useForm()

const next = async () => {
  const isValid = await trigger() // Validate current step
  if (isValid) setStep(step + 1)
}
```

### Conditional Fields

```typescript
const watchType = watch("type")

return (
  <>
    <select {...register("type")}>
      <option value="personal">Personal</option>
      <option value="business">Business</option>
    </select>
    
    {watchType === "business" && (
      <input {...register("companyName", { required: true })} />
    )}
  </>
)
```

### Dynamic Fields

```typescript
import { useFieldArray } from "react-hook-form"

const { fields, append, remove } = useFieldArray({
  control,
  name: "items"
})

return fields.map((field, index) => (
  <div key={field.id}>
    <input {...register(`items.${index}.name`)} />
    <button onClick={() => remove(index)}>Remove</button>
  </div>
))
```