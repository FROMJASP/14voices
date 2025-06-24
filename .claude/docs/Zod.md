# Zod Documentation

Zod is a TypeScript-first schema declaration and validation library. It's designed to be as developer-friendly as possible, with a focus on static type inference.

## Installation

```bash
npm install zod       # npm
yarn add zod          # yarn
bun add zod           # bun
pnpm add zod          # pnpm
deno add npm:zod      # deno
```

## Basic Usage

### Define a Schema

```typescript
import { z } from "zod";

const User = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
});

// Extract the inferred type
type User = z.infer<typeof User>;
// { name: string; age: number; email: string }
```

### Parsing Data

```typescript
// .parse() - throws ZodError on failure
const data = User.parse({ name: "John", age: 30, email: "john@example.com" });

// .safeParse() - returns result object
const result = User.safeParse(input);
if (result.success) {
  console.log(result.data);
} else {
  console.log(result.error);
}

// Async parsing (for async transforms/refinements)
await User.parseAsync(input);
await User.safeParseAsync(input);
```

## Primitive Types

```typescript
// Primitives
z.string();
z.number();
z.bigint();
z.boolean();
z.date();
z.symbol();

// Empty types
z.undefined();
z.null();
z.void(); // accepts undefined

// Catch-all types
z.any();
z.unknown();

// Never type
z.never();
```

## String Validations

```typescript
// Length validations
z.string().min(5);
z.string().max(10);
z.string().length(5);

// Format validations
z.string().email();
z.string().url();
z.string().uuid();
z.string().regex(/^\d+$/);
z.string().startsWith("https://");
z.string().endsWith(".com");
z.string().includes("@");

// Transformations
z.string().trim();
z.string().toLowerCase();
z.string().toUpperCase();

// Special formats
z.string().datetime(); // ISO 8601
z.string().date(); // YYYY-MM-DD
z.string().time(); // HH:mm:ss
z.string().duration(); // ISO 8601 duration
z.string().ip(); // IPv4 or IPv6
z.string().base64();
```

## Number Validations

```typescript
// Range checks
z.number().gt(5);        // greater than
z.number().gte(5);       // greater than or equal (alias: .min())
z.number().lt(5);        // less than
z.number().lte(5);       // less than or equal (alias: .max())

// Type checks
z.number().int();        // must be integer
z.number().positive();   // > 0
z.number().nonnegative(); // >= 0
z.number().negative();   // < 0
z.number().nonpositive(); // <= 0

// Special checks
z.number().multipleOf(5); // divisible by 5
z.number().finite();     // not Infinity or -Infinity
z.number().safe();       // between MIN_SAFE_INTEGER and MAX_SAFE_INTEGER
```

## Object Schemas

```typescript
// Basic object
const Person = z.object({
  name: z.string(),
  age: z.number(),
});

// Optional properties
const User = z.object({
  name: z.string(),
  age: z.number().optional(),
});

// Methods
const DogWithBreed = Dog.extend({ breed: z.string() });
const PartialDog = Dog.partial(); // all properties optional
const RequiredDog = Dog.required(); // all properties required
const PickedDog = Dog.pick({ name: true }); // only name
const OmittedDog = Dog.omit({ age: true }); // all except age

// Strict mode (no unknown keys)
const StrictPerson = Person.strict();

// Passthrough (allow unknown keys)
const PassthroughPerson = Person.passthrough();

// Strip (remove unknown keys - default)
const StrippedPerson = Person.strip();
```

## Arrays and Tuples

```typescript
// Arrays
const StringArray = z.array(z.string());
const NumberArray = z.string().array(); // shorthand

// Array methods
z.array(z.string()).min(1);
z.array(z.string()).max(10);
z.array(z.string()).length(5);
z.array(z.string()).nonempty();

// Tuples
const Tuple = z.tuple([z.string(), z.number(), z.boolean()]);
// [string, number, boolean]

// Variadic tuples
const VariadicTuple = z.tuple([z.string()]).rest(z.number());
// [string, ...number[]]
```

## Unions and Discriminated Unions

```typescript
// Basic union
const StringOrNumber = z.union([z.string(), z.number()]);
// or shorthand
const StringOrNumber2 = z.string().or(z.number());

// Discriminated union
const MyResult = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success"), data: z.string() }),
  z.object({ status: z.literal("failed"), error: z.string() }),
]);
```

## Modifiers

```typescript
// Optional
const OptionalString = z.string().optional(); // string | undefined

// Nullable
const NullableString = z.string().nullable(); // string | null

// Nullish
const NullishString = z.string().nullish(); // string | null | undefined

// Default values
const StringWithDefault = z.string().default("default value");
const NumberWithDefault = z.number().default(() => Math.random());

// Catch errors
const CatchString = z.string().catch("fallback");
```

## Transformations

```typescript
// Basic transform
const StringToNumber = z.string().transform((val) => val.length);

// Async transform
const IdToUser = z.string().transform(async (id) => {
  return await getUserById(id);
});

// Chaining with pipe
const StringToLength = z.string().pipe(z.transform((val) => val.length));
```

## Refinements

```typescript
// Basic refinement
const LongString = z.string().refine((val) => val.length > 10, {
  message: "String must be more than 10 characters",
});

// Custom path for errors
const PasswordForm = z
  .object({
    password: z.string(),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"], // error on confirm field
  });

// Async refinement
const UniqueUsername = z.string().refine(async (username) => {
  return await checkUsernameAvailable(username);
}, "Username already taken");
```

## Error Handling

### Parsing Errors

```typescript
try {
  schema.parse(data);
} catch (err) {
  if (err instanceof z.ZodError) {
    console.log(err.issues);
    // Array of validation issues
  }
}
```

### Error Formatting

```typescript
const result = schema.safeParse(data);
if (!result.success) {
  // Pretty print errors
  console.log(z.prettifyError(result.error));
  
  // Flatten errors
  const flattened = z.flattenError(result.error);
  // { formErrors: string[], fieldErrors: { [key]: string[] } }
}
```

### Custom Error Messages

```typescript
// In schema definition
z.string({
  required_error: "Name is required",
  invalid_type_error: "Name must be a string",
});

// In validation methods
z.string().min(5, { message: "Must be 5 or more characters" });
z.string().max(10, { error: "Must be 10 or fewer characters" });
```

## Advanced Types

### Recursive Types

```typescript
const Category = z.object({
  name: z.string(),
  get subcategories() {
    return z.array(Category);
  },
});

type Category = z.infer<typeof Category>;
// { name: string; subcategories: Category[] }
```

### Mutually Recursive Types

```typescript
const User = z.object({
  email: z.email(),
  get posts() {
    return z.array(Post);
  },
});

const Post = z.object({
  title: z.string(),
  get author() {
    return User;
  },
});
```

### Function Schemas

```typescript
const MyFunction = z.function()
  .args(z.string(), z.number())
  .returns(z.boolean());

type MyFunction = z.infer<typeof MyFunction>;
// (arg0: string, arg1: number) => boolean
```

## TypeScript Integration

### Type Inference

```typescript
const Schema = z.object({
  name: z.string(),
  age: z.number(),
});

// Infer the type
type Schema = z.infer<typeof Schema>;

// Input vs Output types (for transforms)
type Input = z.input<typeof TransformSchema>;
type Output = z.output<typeof TransformSchema>; // same as z.infer
```

### Type Guards

```typescript
const schema = z.string();

function processValue(value: unknown) {
  if (schema.safeParse(value).success) {
    // value is typed as string here
    console.log(value.toUpperCase());
  }
}
```

## Best Practices

1. **Enable TypeScript strict mode**
   ```json
   {
     "compilerOptions": {
       "strict": true
     }
   }
   ```

2. **Use `.safeParse()` over `.parse()` when handling user input**

3. **Define schemas close to where they're used**

4. **Reuse schemas through composition**
   ```typescript
   const BaseUser = z.object({ id: z.string(), name: z.string() });
   const AdminUser = BaseUser.extend({ role: z.literal("admin") });
   ```

5. **Use discriminated unions for complex conditional types**

6. **Provide custom error messages for better UX**

7. **Use transforms for data normalization**

8. **Keep schemas as the source of truth for types**

## Common Patterns

### Form Validation

```typescript
const FormSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  age: z.number().min(18).optional(),
  agreeToTerms: z.literal(true),
});

// With React Hook Form
import { zodResolver } from "@hookform/resolvers/zod";
const { register, handleSubmit } = useForm({
  resolver: zodResolver(FormSchema),
});
```

### API Response Validation

```typescript
const ApiResponse = z.object({
  data: z.array(UserSchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
  }),
});

async function fetchUsers() {
  const response = await fetch("/api/users");
  const json = await response.json();
  return ApiResponse.parse(json);
}
```

### Environment Variables

```typescript
const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.string().transform(Number).pipe(z.number().positive()),
  DATABASE_URL: z.string().url(),
});

const env = EnvSchema.parse(process.env);
```