TITLE: React Form Component with Server-Side Error Display
DESCRIPTION: This React functional component renders a sign-up form with email and password fields. It conditionally displays validation errors for each field, which are expected to be present in a `state.errors` object, typically returned from a server action. The form also disables the submit button based on a `pending` state, likely from `useFormStatus`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_5

LANGUAGE: jsx
CODE:
```
<div>
  <label htmlFor="email">Email</label>
  <input id="email" name="email" placeholder="Email" />
</div>
{state?.errors?.email && <p>{state.errors.email}</p>}

<div>
  <label htmlFor="password">Password</label>
  <input id="password" name="password" type="password" />
</div>
{state?.errors?.password && (
  <div>
    <p>Password must:</p>
    <ul>
      {state.errors.password.map((error) => (
        <li key={error}>- {error}</li>
      ))}
    </ul>
  </div>
)}
<button disabled={pending} type="submit">
  Sign Up
</button>
</form>
```

----------------------------------------

TITLE: Passing Data from Server to Client Components via Props
DESCRIPTION: This snippet demonstrates how to pass data from a Server Component to a Client Component using props. It shows a Server Component fetching post data asynchronously and then rendering a 'LikeButton' Client Component, passing the fetched 'likes' count as a prop. Props passed to Client Components must be serializable by React.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/05-server-and-client-components.mdx#_snippet_4

LANGUAGE: tsx
CODE:
```
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)

  return <LikeButton likes={post.likes} />
}
```

LANGUAGE: jsx
CODE:
```
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({ params }) {
  const post = await getPost(params.id)

  return <LikeButton likes={post.likes} />
}
```

LANGUAGE: tsx
CODE:
```
'use client'

export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

LANGUAGE: jsx
CODE:
```
'use client'

export default function LikeButton({ likes }) {
  // ...
}
```

----------------------------------------

TITLE: Implement Cached User Authentication in Data Access Layer
DESCRIPTION: This TypeScript snippet demonstrates how to implement a cached `getCurrentUser` helper function within the Data Access Layer. It uses `react`'s `cache` and `next/headers` `cookies` to securely retrieve and decrypt an authentication token, returning a `User` object. This approach centralizes user authentication, prevents sensitive data exposure to client components, and allows for efficient reuse across server components.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/data-security.mdx#_snippet_1

LANGUAGE: ts
CODE:
```
import { cache } from 'react'\nimport { cookies } from 'next/headers'\n\n// Cached helper methods makes it easy to get the same value in many places\n// without manually passing it around. This discourages passing it from Server\n// Component to Server Component which minimizes risk of passing it to a Client\n// Component.\nexport const getCurrentUser = cache(async () => {\n  const token = cookies().get('AUTH_TOKEN')\n  const decodedToken = await decryptAndValidate(token)\n  // Don't include secret tokens or private information as public fields.\n  // Use classes to avoid accidentally passing the whole object to the client.\n  return new User(decodedToken.id)\n})
```

----------------------------------------

TITLE: Revalidate fetch data after a specified time
DESCRIPTION: To revalidate data returned by a `fetch` request, use the `next.revalidate` option. This will update the data after the specified number of seconds, ensuring freshness.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/09-caching-and-revalidating.mdx#_snippet_1

LANGUAGE: tsx
CODE:
```
export default async function Page() {
  const data = await fetch('https://...', { next: { revalidate: 3600 } })
}
```

LANGUAGE: jsx
CODE:
```
export default async function Page() {
  const data = await fetch('https://...', { next: { revalidate: 3600 } })
}
```

----------------------------------------

TITLE: Retrieve User Data with Session Verification in DAL
DESCRIPTION: This snippet illustrates the `getUser` function, which fetches user data from the database as part of the Data Access Layer (DAL). It first calls `verifySession()` to ensure the user is authenticated. If the session is valid, it queries the `users` table, explicitly selecting only necessary columns (`id`, `name`, `email`) for efficiency. The function includes error handling to catch failed data fetches and returns `null` if the session is invalid or an error occurs.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_25

LANGUAGE: tsx
CODE:
```
export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId),
      // Explicitly return the columns you need rather than the whole user object
      columns: {
        id: true,
        name: true,
        email: true,
      },
    })

    const user = data[0]

    return user
  } catch (error) {
    console.log('Failed to fetch user')
    return null
  }
})
```

LANGUAGE: jsx
CODE:
```
export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId),
      // Explicitly return the columns you need rather than the whole user object
      columns: {
        id: true,
        name: true,
        email: true,
      },
    })

    const user = data[0]

    return user
  } catch (error) {
    console.log('Failed to fetch user')
    return null
  }
})
```

----------------------------------------

TITLE: Implement Incremental Static Regeneration with fetch in Next.js App Router
DESCRIPTION: Shows how to achieve Incremental Static Regeneration (ISR) in the `app` directory using the `fetch()` API with the `next: { revalidate: 60 }` option. This caches the request for 60 seconds, enabling automatic data revalidation for server components.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_29

LANGUAGE: jsx
CODE:
```
// `app` directory

async function getPosts() {
  const res = await fetch(`https://.../posts`, { next: { revalidate: 60 } })
  const data = await res.json()

  return data.posts
}

export default async function PostList() {
  const posts = await getPosts()

  return posts.map((post) => <div>{post.name}</div>)
}
```

----------------------------------------

TITLE: Wrap Third-Party Components for Next.js Server Component Compatibility
DESCRIPTION: This snippet illustrates how to create a dedicated Client Component wrapper for a third-party component that does not inherently include the 'use client' directive. By doing so, the wrapped component becomes compatible with Next.js Server Components, allowing it to be imported and used without issues related to client-only features.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/05-server-and-client-components.mdx#_snippet_10

LANGUAGE: tsx
CODE:
```
'use client'

import { Carousel } from 'acme-carousel'

export default Carousel
```

LANGUAGE: jsx
CODE:
```
'use client'

import { Carousel } from 'acme-carousel'

export default Carousel
```

----------------------------------------

TITLE: Initializing Next.js Project Interactively (CLI)
DESCRIPTION: This snippet demonstrates how to start a new Next.js project using `create-next-app` in interactive mode. It provides commands for `npx`, `yarn`, `pnpm`, and `bunx`, allowing the user to choose their preferred package manager. The interactive prompts guide the user through project setup, including project name and TypeScript configuration.
SOURCE: https://github.com/vercel/next.js/blob/canary/packages/create-next-app/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npx create-next-app@latest
# or
yarn create next-app
# or
pnpm create next-app
# or
bunx create-next-app
```

----------------------------------------

TITLE: Running Next.js Development Server
DESCRIPTION: These commands start the Next.js development server. This allows developers to run the application locally, with features like hot module replacement and live reloading, facilitating rapid development and testing.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-relay-modern/README.md#_snippet_3

LANGUAGE: bash
CODE:
```
npm run dev
```

LANGUAGE: bash
CODE:
```
yarn dev
```

LANGUAGE: bash
CODE:
```
pnpm dev
```

----------------------------------------

TITLE: Define a Dynamic Route Segment Page Component in Next.js
DESCRIPTION: This code defines a Next.js page component that utilizes a dynamic route segment, `[slug]`. The `slug` parameter is asynchronously extracted from the `params` prop and rendered, demonstrating how to create routes from dynamic data.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <div>My Post: {slug}</div>
}
```

LANGUAGE: jsx
CODE:
```
export default async function Page({ params }) {
  const { slug } = await params
  return <div>My Post: {slug}</div>
}
```

----------------------------------------

TITLE: Proxy Requests Using Next.js Middleware
DESCRIPTION: This snippet shows how to use Next.js middleware to proxy or rewrite incoming requests to a different external URL. It checks the current pathname and, if it matches a specific path, uses `NextResponse.rewrite` to redirect the request to the target URL.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/backend-for-frontend.mdx#_snippet_14

LANGUAGE: ts
CODE:
```
import { NextResponse } from 'next/server'

export function middleware(request: Request) {
  if (request.nextUrl.pathname === '/proxy-this-path') {
    const rewriteUrl = new URL('https://nextjs.org')
    return NextResponse.rewrite(rewriteUrl)
  }
}
```

LANGUAGE: js
CODE:
```
import { NextResponse } from 'next/server'

export function middleware(request) {
  if (request.nextUrl.pathname === '/proxy-this-path') {
    const rewriteUrl = new URL('https://nextjs.org')
    return NextResponse.rewrite(rewriteUrl)
  }
}
```

----------------------------------------

TITLE: Creating a Next.js Page Component
DESCRIPTION: Demonstrates how to define a page in Next.js by creating a `page` file inside the `app` directory and default exporting a React component. This component will render UI for a specific route.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/03-layouts-and-pages.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
export default function Page() {
  return <h1>Hello Next.js!</h1>
}
```

LANGUAGE: jsx
CODE:
```
export default function Page() {
  return <h1>Hello Next.js!</h1>
}
```

----------------------------------------

TITLE: Next.js Link Component for Automatic Prefetching
DESCRIPTION: This code snippet illustrates the use of the Next.js `<Link>` component for automatic route prefetching when links enter the user's viewport. It contrasts this behavior with a standard `<a>` tag, which does not perform prefetching, demonstrating how to set up basic navigation within a Next.js layout.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/04-linking-and-navigating.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav>
          {/* Prefetched when the link is hovered or enters the viewport */}
          <Link href="/blog">Blog</Link>
          {/* No prefetching */}
          <a href="/contact">Contact</a>
        </nav>
        {children}
      </body>
    </html>
  )
}
```

LANGUAGE: jsx
CODE:
```
import Link from 'next/link'

export default function Layout() {
  return (
    <html>
      <body>
        <nav>
          {/* Prefetched when the link is hovered or enters the viewport */}
          <Link href="/blog">Blog</Link>
          {/* No prefetching */}
          <a href="/contact">Contact</a>
        </nav>
        {children}
      </body>
    </html>
  )
}
```

----------------------------------------

TITLE: Performing Client-Side Redirects with Next.js Server Actions
DESCRIPTION: This example illustrates how to trigger a redirect from a Client Component using a Next.js Server Action. The Client Component uses a form to invoke a server action, which then performs the actual redirect. This pattern is useful for event-driven redirects where direct client-side `redirect` is not suitable.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/04-functions/redirect.mdx#_snippet_3

LANGUAGE: tsx
CODE:
```
'use client'

import { navigate } from './actions'

export function ClientRedirect() {
  return (
    <form action={navigate}>
      <input type="text" name="id" />
      <button>Submit</button>
    </form>
  )
}
```

LANGUAGE: jsx
CODE:
```
'use client'

import { navigate } from './actions'

export function ClientRedirect() {
  return (
    <form action={navigate}>
      <input type="text" name="id" />
      <button>Submit</button>
    </form>
  )
}
```

LANGUAGE: ts
CODE:
```
'use server'

import { redirect } from 'next/navigation'

export async function navigate(data: FormData) {
  redirect(`/posts/${data.get('id')}`)
}
```

LANGUAGE: js
CODE:
```
'use server'

import { redirect } from 'next/navigation'

export async function navigate(data) {
  redirect(`/posts/${data.get('id')}`)
}
```

----------------------------------------

TITLE: Nest Server Component within Client Component (Page)
DESCRIPTION: This example demonstrates how a parent Server Component (`Page`) can import and utilize the `Modal` Client Component. It passes another Server Component (`Cart`) as a child to the `Modal`, showcasing how server-rendered content can be seamlessly integrated into client-side UI structures.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/05-server-and-client-components.mdx#_snippet_6

LANGUAGE: tsx
CODE:
```
import Modal from './ui/modal'
import Cart from './ui/cart'

export default function Page() {
  return (
    <Modal>
      <Cart />
    </Modal>
  )
}
```

LANGUAGE: jsx
CODE:
```
import Modal from './ui/modal'
import Cart from './ui/cart'

export default function Page() {
  return (
    <Modal>
      <Cart />
    </Modal>
  )
}
```

----------------------------------------

TITLE: Starting Next.js Development Server (Bash)
DESCRIPTION: This snippet provides various command-line options to start the Next.js development server, allowing the application to be accessed locally. It lists common package managers like npm, yarn, pnpm, and bun for running the 'dev' script.
SOURCE: https://github.com/vercel/next.js/blob/canary/packages/create-next-app/templates/app/ts/README-template.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

----------------------------------------

TITLE: Managing Cookies in Next.js Server Actions
DESCRIPTION: This example illustrates how to interact with cookies within a Next.js Server Action. It shows how to retrieve a cookie's value using `cookieStore.get()`, set a new cookie with `cookieStore.set()`, and delete an existing cookie using `cookieStore.delete()`, all leveraging the `cookies` API from `next/headers`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/08-updating-data.mdx#_snippet_10

LANGUAGE: TypeScript
CODE:
```
'use server'

import { cookies } from 'next/headers'

export async function exampleAction() {
  const cookieStore = await cookies()

  // Get cookie
  cookieStore.get('name')?.value

  // Set cookie
  cookieStore.set('name', 'Delba')

  // Delete cookie
  cookieStore.delete('name')
}
```

LANGUAGE: JavaScript
CODE:
```
'use server'

import { cookies } from 'next/headers'

export async function exampleAction() {
  // Get cookie
  const cookieStore = await cookies()

  // Get cookie
  cookieStore.get('name')?.value

  // Set cookie
  cookieStore.set('name', 'Delba')

  // Delete cookie
  cookieStore.delete('name')
}
```

----------------------------------------

TITLE: Conditional Redirect with NextResponse.redirect in Next.js Middleware
DESCRIPTION: Demonstrates how to use `NextResponse.redirect` within Next.js Middleware to conditionally redirect users, for example, redirecting unauthenticated users to a login page. The middleware is configured to apply to specific paths using `config.matcher`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/redirecting.mdx#_snippet_6

LANGUAGE: ts
CODE:
```
import { NextResponse, NextRequest } from 'next/server'
import { authenticate } from 'auth-provider'

export function middleware(request: NextRequest) {
  const isAuthenticated = authenticate(request)

  // If the user is authenticated, continue as normal
  if (isAuthenticated) {
    return NextResponse.next()
  }

  // Redirect to login page if not authenticated
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: '/dashboard/:path*',
}
```

LANGUAGE: js
CODE:
```
import { NextResponse } from 'next/server'
import { authenticate } from 'auth-provider'

export function middleware(request) {
  const isAuthenticated = authenticate(request)

  // If the user is authenticated, continue as normal
  if (isAuthenticated) {
    return NextResponse.next()
  }

  // Redirect to login page if not authenticated
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: '/dashboard/:path*',
}
```

----------------------------------------

TITLE: Loading Google Analytics for All Routes in Next.js
DESCRIPTION: This snippet demonstrates how to integrate Google Analytics 4 across all pages of a Next.js application. It provides examples for both the App Router (TypeScript and JavaScript) by placing the `GoogleAnalytics` component in the root layout, and for the Pages Router by placing it in the custom `_app` file. The `gaId` prop is required to specify your Google Analytics Measurement ID.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/third-party-libraries.mdx#_snippet_7

LANGUAGE: tsx
CODE:
```
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XYZ" />
    </html>
  )
}
```

LANGUAGE: jsx
CODE:
```
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XYZ" />
    </html>
  )
}
```

LANGUAGE: jsx
CODE:
```
import { GoogleAnalytics } from '@next/third-parties/google'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <GoogleAnalytics gaId="G-XYZ" />
    </>
  )
}
```

----------------------------------------

TITLE: Next.js Client Component Definition
DESCRIPTION: This example shows a basic Next.js Client Component (`LikeButton`) identified by the `'use client'` directive at the top of the file. Client Components are essential for adding interactivity, managing state, and utilizing browser-specific APIs within your application.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/05-server-and-client-components.mdx#_snippet_1

LANGUAGE: tsx
CODE:
```
'use client'

import { useState } from 'react'

export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

LANGUAGE: jsx
CODE:
```
'use client'

import { useState } from 'react'

export default function LikeButton({ likes }) {
  // ...
}
```

----------------------------------------

TITLE: Create a Nested Layout for a Route Segment in Next.js
DESCRIPTION: This snippet illustrates how to create a nested layout for a specific route segment, such as `/blog`. By adding a `layout.tsx` or `layout.js` file inside the `app/blog` directory, this layout will automatically wrap all child pages and layouts within that segment, receiving `children` as a prop.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/03-layouts-and-pages.mdx#_snippet_4

LANGUAGE: tsx
CODE:
```
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
```

LANGUAGE: jsx
CODE:
```
export default function BlogLayout({ children }) {
  return <section>{children}</section>
}
```

----------------------------------------

TITLE: Revalidating Cache Tag in Next.js Server Action
DESCRIPTION: Demonstrates how to use `revalidateTag` within a Next.js Server Action to invalidate cached data after an operation, such as adding a new post. This example shows the typical pattern of importing `revalidateTag` from 'next/cache' and calling it with a specific tag like 'posts' to ensure data freshness.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/04-functions/revalidateTag.mdx#_snippet_1

LANGUAGE: ts
CODE:
```
'use server'

import { revalidateTag } from 'next/cache'

export default async function submit() {
  await addPost()
  revalidateTag('posts')
}
```

LANGUAGE: js
CODE:
```
'use server'

import { revalidateTag } from 'next/cache'

export default async function submit() {
  await addPost()
  revalidateTag('posts')
}
```

----------------------------------------

TITLE: Create Active Navigation Links with usePathname
DESCRIPTION: This code defines a client component, `NavLinks`, that uses the `usePathname` hook from `next/navigation` to determine the current path. It dynamically applies an 'active' class to `Link` components based on the current URL, enabling visual indication of the active navigation item. This component should be extracted into a separate client file.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/layout.mdx#_snippet_15

LANGUAGE: tsx
CODE:
```
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav>
      <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
        Home
      </Link>

      <Link
        className={`link ${pathname === '/about' ? 'active' : ''}`}
        href="/about"
      >
        About
      </Link>
    </nav>
  )
}
```

LANGUAGE: jsx
CODE:
```
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function Links() {
  const pathname = usePathname()

  return (
    <nav>
      <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
        Home
      </Link>

      <Link
        className={`link ${pathname === '/about' ? 'active' : ''}`}
        href="/about"
      >
        About
      </Link>
    </nav>
  )
}
```

----------------------------------------

TITLE: Using Next.js Layout Params Synchronously (JavaScript)
DESCRIPTION: This snippet demonstrates how to use `params` synchronously in Next.js 15 layouts for JavaScript using the `use` hook from React. This allows for a synchronous component structure while handling the asynchronous `params` prop.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/upgrading/version-15.mdx#_snippet_14

LANGUAGE: javascript
CODE:
```
// Before
export default function Layout({ children, params }) {
  const { slug } = params
}

// After
import { use } from 'react'
export default async function Layout(props) {
  const params = use(props.params)
  const slug = params.slug

}
```

----------------------------------------

TITLE: Next.js `cookies` API Reference
DESCRIPTION: Reference for the `cookies` function and its methods in Next.js, including usage constraints and behavior in Server Components, Server Actions, and Route Handlers.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/04-functions/cookies.mdx#_snippet_6

LANGUAGE: APIDOC
CODE:
```
cookies(): Promise<CookieStore>
  Description: Asynchronous function to access HTTP cookies. Returns a promise that resolves to a CookieStore object.
  Behavior:
    - Asynchronous: Must use async/await or React's `use`.
    - Dynamic API: Opts route into dynamic rendering.
    - Version 14 and earlier: Synchronous. Next.js 15 allows synchronous access for backward compatibility (deprecated).

CookieStore:
  get(name: string): Cookie | undefined
    Description: Retrieves a single cookie by its name.
    Returns: A Cookie object if found, otherwise undefined.

  getAll(name?: string): Cookie[]
    Description: Retrieves all cookies. If 'name' is specified, returns all cookies with a matching name.
    Returns: An array of Cookie objects.

  set(name: string, value: string, options?: CookieOptions): void
    Description: Sets a cookie with a name, value, and optional options.
    Constraints: Must be called in a Server Action or Route Handler. HTTP does not allow setting cookies after streaming starts.
    Example Options: { secure: boolean, httpOnly: boolean, path: string }

  set(options: CookieSetOptions): void
    Description: Sets a cookie using an object containing name, value, and other options.
    Constraints: Must be called in a Server Action or Route Handler. HTTP does not allow setting cookies after streaming starts.
    Example Options: { name: string, value: string, httpOnly: boolean, path: string }

  delete(name: string): void
    Description: Deletes a cookie by its name.
    Constraints:
      - Must be called in a Server Action or Route Handler.
      - Must belong to the same domain from which .set was called.
      - For wildcard domains, specific subdomain must be an exact match.
      - Code must be executed on the same protocol (HTTP/HTTPS) as the cookie.
```

----------------------------------------

TITLE: Implement Streaming Responses with AI SDK in Next.js Route Handlers
DESCRIPTION: Shows how to use the `@ai-sdk/openai` and `ai` libraries to stream text responses, commonly used with Large Language Models (LLMs). The `POST` handler processes incoming messages and streams the AI-generated content back to the client.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/route.mdx#_snippet_15

LANGUAGE: TypeScript
CODE:
```
import { openai } from '@ai-sdk/openai'
import { StreamingTextResponse, streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  })

  return new StreamingTextResponse(result.toAIStream())
}
```

LANGUAGE: JavaScript
CODE:
```
import { openai } from '@ai-sdk/openai'
import { StreamingTextResponse, streamText } from 'ai'

export async function POST(req) {
  const { messages } = await req.json()
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  })

  return new StreamingTextResponse(result.toAIStream())
}
```

----------------------------------------

TITLE: Validating Client Input in Next.js
DESCRIPTION: This snippet demonstrates the importance of validating client-side input, such as searchParams, to prevent vulnerabilities. It contrasts an insecure approach of directly trusting client data with a secure method that re-verifies user authorization using server-side cookies and an authentication utility.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/data-security.mdx#_snippet_12

LANGUAGE: tsx
CODE:
```
// BAD: Trusting searchParams directly
export default async function Page({ searchParams }) {
  const isAdmin = searchParams.get('isAdmin')
  if (isAdmin === 'true') {
    // Vulnerable: relies on untrusted client data
    return <AdminPanel />
  }
}

// GOOD: Re-verify every time
import { cookies } from 'next/headers'
import { verifyAdmin } from './auth'

export default async function Page() {
  const token = cookies().get('AUTH_TOKEN')
  const isAdmin = await verifyAdmin(token)

  if (isAdmin) {
    return <AdminPanel />
  }
}
```

----------------------------------------

TITLE: Running Next.js App in Development Mode (npm)
DESCRIPTION: These commands first install all project dependencies using `npm install` and then start the Next.js development server with `npm run dev`. Once running, the application will be accessible locally at `http://localhost:3000`.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-elasticsearch/README.md#_snippet_4

LANGUAGE: bash
CODE:
```
npm install
npm run dev
```

----------------------------------------

TITLE: Next.js Environment Variables Management
DESCRIPTION: Properly manage environment variables by adding `.env.*` files to `.gitignore` and prefixing only public variables with `NEXT_PUBLIC_`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/production-checklist.mdx#_snippet_21

LANGUAGE: APIDOC
CODE:
```
Next.js Environment Variables:
  Security Best Practices:
    - Add `.env.*` files to `.gitignore`.
    - Prefix public variables with `NEXT_PUBLIC_`.
```

----------------------------------------

TITLE: Asynchronous Utility Function Refactor (Next.js 15)
DESCRIPTION: This snippet demonstrates how a utility function (misnamed as `Page` in the example, but intended to be `getToken`) should be refactored to be `async` and `await` the `cookies()` Promise before accessing its properties, resolving the synchronous access error in Next.js 15.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/next-prerender-sync-headers.mdx#_snippet_2

LANGUAGE: jsx
CODE:
```
export async function Page() {
  return (await cookies()).get(token)
}
```

----------------------------------------

TITLE: Running Next.js in Development Mode with npm
DESCRIPTION: These commands first install project dependencies using `npm install` and then start the Next.js development server with `npm run dev`. This allows the application to be accessed locally, typically at `http://localhost:3000`.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/README.md#_snippet_5

LANGUAGE: bash
CODE:
```
npm install
npm run dev
```

----------------------------------------

TITLE: Installing Dependencies and Running Next.js Development Server (npm)
DESCRIPTION: These commands are used to prepare and run the Next.js application locally using npm. `npm install` fetches all project dependencies, and `npm run dev` starts the development server, making the blog accessible at `http://localhost:3000`.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/cms-contentful/README.md#_snippet_6

LANGUAGE: bash
CODE:
```
npm install
npm run dev
```

----------------------------------------

TITLE: Set a Cookie in Next.js Server Actions or Route Handlers
DESCRIPTION: Illustrates how to set a cookie using the `cookies().set(name, value, options)` method. This operation must be performed within a Server Action or Route Handler because cookie state modifications require setting response headers.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/04-functions/cookies.mdx#_snippet_5

LANGUAGE: ts
CODE:
```
'use server'

import { cookies } from 'next/headers'

export async function create(data) {
  const cookieStore = await cookies()

  cookieStore.set('name', 'lee')
  // or
  cookieStore.set('name', 'lee', { secure: true })
  // or
  cookieStore.set({
    name: 'name',
    value: 'lee',
    httpOnly: true,
    path: '/',
  })
}
```

LANGUAGE: js
CODE:
```
'use server'

import { cookies } from 'next/headers'

export async function create(data) {
  const cookieStore = await cookies()

  cookieStore.set('name', 'lee')
  // or
  cookieStore.set('name', 'lee', { secure: true })
  // or
  cookieStore.set({
    name: 'name',
    value: 'lee',
    httpOnly: true,
    path: '/',
  })
}
```

----------------------------------------

TITLE: Integrate Next.js Web Vitals with Google Analytics (gtag.js) in JavaScript
DESCRIPTION: This example shows how to send Next.js Web Vitals metrics to Google Analytics via `window.gtag`. It formats metric values as integers and includes `event_label` and `non_interaction` for accurate analytics reporting.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/analytics.mdx#_snippet_5

LANGUAGE: js
CODE:
```
useReportWebVitals((metric) => {
  // Use `window.gtag` if you initialized Google Analytics as this example:
  // https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics
  window.gtag('event', metric.name, {
    value: Math.round(
      metric.name === 'CLS' ? metric.value * 1000 : metric.value
    ), // values must be integers
    event_label: metric.id, // id unique to current page load
    non_interaction: true, // avoids affecting bounce rate.
  })
})
```

----------------------------------------

TITLE: Correctly Calling `cookies()` in Next.js Page Component
DESCRIPTION: This snippet demonstrates the correct way to call the `cookies()` function within a Next.js Page component. It highlights that `cookies()` must be accessed inside the `Page` function, which executes within the request scope, to prevent errors related to dynamic API calls made outside of a valid request context.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/next-dynamic-api-wrong-context.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:
```
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  return ...
}
```

----------------------------------------

TITLE: Revalidating A Specific URL with revalidatePath
DESCRIPTION: This example demonstrates how to revalidate a single, specific URL on the next page visit using `revalidatePath`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/04-functions/revalidatePath.mdx#_snippet_1

LANGUAGE: ts
CODE:
```
import { revalidatePath } from 'next/cache'
revalidatePath('/blog/post-1')
```

----------------------------------------

TITLE: Starting Next.js Development Server (Bash)
DESCRIPTION: This snippet provides various command-line options to start the Next.js development server. It allows developers to run the application locally for testing and development purposes, with hot-reloading enabled for immediate feedback on code changes.
SOURCE: https://github.com/vercel/next.js/blob/canary/packages/create-next-app/templates/app-tw-empty/ts/README-template.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

----------------------------------------

TITLE: Fetching Data in a Server Component - TypeScript
DESCRIPTION: This example shows how to perform server-side data fetching directly within an `async` Server Component. It fetches blog posts from an API and renders them, leveraging the ability of Server Components to use `async`/`await`.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/no-async-client-component.mdx#_snippet_1

LANGUAGE: tsx
CODE:
```
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

----------------------------------------

TITLE: Resolve Next.js Crypto API SSR Issue with React Suspense Fallback
DESCRIPTION: This solution demonstrates how to wrap a Client Component that synchronously calls a crypto API (e.g., `crypto.randomUUID()`) with a React `Suspense` boundary. By providing a `fallback` UI, Next.js can prerender a placeholder during Server-Side Rendering (SSR) and then hydrate the actual component with a unique random value once the page is requested by the user, ensuring the value is not fixed.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/next-prerender-crypto-client.mdx#_snippet_0

LANGUAGE: jsx
CODE:
```
'use client'

export default function Page() {
  const newBlogId = crypto.randomUUID()
  return <BlogAuthoringView id={newBlogId} />
}
```

LANGUAGE: jsx
CODE:
```
"use client"

import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<BlogAuthorSkeleton />}>
      <DynamicAuthoringView />
    </Suspense>
  )
}

function BlogAuthorSkeleton() {
  ...
}

function DynamicAuthoringView() {
  const newBlogId = crypto.randomUUID()
  return <BlogAuthoringView id={newBlogId} />
}
```

----------------------------------------

TITLE: APIDOC: Middleware Matcher Property
DESCRIPTION: Details on the `matcher` option within the middleware `config` object. It allows targeting specific paths for middleware execution using strings, arrays, regular expressions, and objects with detailed matching conditions.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/middleware.mdx#_snippet_6

LANGUAGE: APIDOC
CODE:
```
Matcher property:
  - Type: string | string[] | object[]
  - Purpose: Target specific paths for Middleware execution.
  - Simple usage:
    - Single path: '/about'
    - Multiple paths: ['/about', '/contact']
  - Complex usage (array of objects):
    - source: string (path or pattern)
    - regexp (optional): string (regular expression for fine-tuning)
    - locale (optional): boolean (false to ignore locale-based routing)
    - has (optional): array of objects (conditions based on presence of headers, query params, cookies)
      - type: 'header' | 'query' | 'cookie'
      - key: string
      - value: string
    - missing (optional): array of objects (conditions based on absence of headers, query params, cookies)
      - type: 'header' | 'query' | 'cookie'
      - key: string
      - value: string
  - Configured matchers rules:
    1. MUST start with '/'
    2. Can include named parameters: '/about/:path'
    3. Can have modifiers on named parameters: '/about/:path*', '/about/:path?', '/about/:path+'
    4. Can use regular expression enclosed in parenthesis: '/about/(.*)'
  - Constraints:
    - Values must be constants for static analysis at build-time.
    - '/public' is considered '/public/index' for backward compatibility.
```

----------------------------------------

TITLE: Apply Title Template with Prefix/Suffix in Next.js
DESCRIPTION: This snippet demonstrates how to use `title.template` in Next.js to add a consistent prefix or suffix to titles defined in child route segments. It shows configuration in both `layout.tsx` and `layout.js`, requiring a `title.default` when a template is used, and how a child page's title is then augmented.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/04-functions/generate-metadata.mdx#_snippet_5

LANGUAGE: tsx
CODE:
```
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Acme',
    default: 'Acme', // a default is required when creating a template
  },
}
```

LANGUAGE: jsx
CODE:
```
export const metadata = {
  title: {
    template: '%s | Acme',
    default: 'Acme', // a default is required when creating a template
  },
}
```

LANGUAGE: tsx
CODE:
```
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
}

// Output: <title>About | Acme</title>
```

LANGUAGE: jsx
CODE:
```
export const metadata = {
  title: 'About',
}

// Output: <title>About | Acme</title>
```

----------------------------------------

TITLE: Configure Various Next.js Metadata Fields
DESCRIPTION: This example illustrates how to define a variety of metadata fields in Next.js, such as `generator`, `applicationName`, `referrer`, `keywords`, `authors`, `creator`, `publisher`, and `formatDetection`. It includes the JSX configuration and the corresponding HTML `<head>` output, showcasing how these properties translate into standard meta tags and link elements.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/04-functions/generate-metadata.mdx#_snippet_8

LANGUAGE: jsx
CODE:
```
export const metadata = {
  generator: 'Next.js',
  applicationName: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: ['Next.js', 'React', 'JavaScript'],
  authors: [{ name: 'Seb' }, { name: 'Josh', url: 'https://nextjs.org' }],
  creator: 'Jiachi Liu',
  publisher: 'Sebastian Markbåge',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}
```

LANGUAGE: html
CODE:
```
<meta name="application-name" content="Next.js" />
<meta name="author" content="Seb" />
<link rel="author" href="https://nextjs.org" />
<meta name="author" content="Josh" />
<meta name="generator" content="Next.js" />
<meta name="keywords" content="Next.js,React,JavaScript" />
<meta name="referrer" content="origin-when-cross-origin" />
<meta name="color-scheme" content="dark" />
<meta name="creator" content="Jiachi Liu" />
<meta name="publisher" content="Sebastian Markbåge" />
<meta name="format-detection" content="telephone=no, address=no, email=no" />
```

----------------------------------------

TITLE: Statically Generate Dynamic Routes with generateStaticParams
DESCRIPTION: Demonstrates how to use `generateStaticParams` to fetch data and return an array of `params` to pre-render dynamic route segments like `[slug]` at build time. Also shows the corresponding `Page` component receiving the `params`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/04-functions/generate-static-params.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

LANGUAGE: jsx
CODE:
```
// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default async function Page({ params }) {
  const { slug } = await params
  // ...
}
```

----------------------------------------

TITLE: Accessing Runtime Environment Variables in App Router
DESCRIPTION: This example demonstrates how to safely access environment variables at runtime within the Next.js App Router. By using dynamic rendering features, such as importing `connection` from `next/server` or other Dynamic APIs (cookies, headers), the environment variable `process.env.MY_VALUE` is evaluated at request time on the server, allowing for different values across environments without rebuilding.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/environment-variables.mdx#_snippet_11

LANGUAGE: tsx
CODE:
```
import { connection } from 'next/server'

export default async function Component() {
  await connection()
  // cookies, headers, and other Dynamic APIs
  // will also opt into dynamic rendering, meaning
  // this env variable is evaluated at runtime
  const value = process.env.MY_VALUE
  // ...
}
```

LANGUAGE: jsx
CODE:
```
import { connection } from 'next/server'

export default async function Component() {
  await connection()
  // cookies, headers, and other Dynamic APIs
  // will also opt into dynamic rendering, meaning
  // this env variable is evaluated at runtime
  const value = process.env.MY_VALUE
  // ...
}
```

----------------------------------------

TITLE: Bootstrapping Next.js Project with TypeScript Example
DESCRIPTION: These commands demonstrate how to initialize a new Next.js application using the `create-next-app` CLI, specifically leveraging the `with-typescript` example. They create a new directory `with-typescript-app` pre-configured for TypeScript development.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-typescript/README.md#_snippet_0

LANGUAGE: Shell
CODE:
```
npx create-next-app --example with-typescript with-typescript-app
```

LANGUAGE: Shell
CODE:
```
yarn create next-app --example with-typescript with-typescript-app
```

LANGUAGE: Shell
CODE:
```
pnpm create next-app --example with-typescript with-typescript-app
```

----------------------------------------

TITLE: Creating Client Components with 'use client' Directive
DESCRIPTION: This snippet demonstrates how to declare a React component as a Client Component in Next.js by adding the 'use client' directive at the top of the file, above imports. It shows a simple interactive counter component that uses React's useState hook, highlighting the boundary between Server and Client module graphs.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/05-server-and-client-components.mdx#_snippet_2

LANGUAGE: tsx
CODE:
```
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>{count} likes</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```

LANGUAGE: jsx
CODE:
```
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>{count} likes</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```

----------------------------------------

TITLE: Integrate Client Context Provider in Server Component (RootLayout)
DESCRIPTION: This snippet shows how a Server Component, such as `RootLayout`, can import and wrap its children with a Client Component context provider like `ThemeProvider`. This pattern makes the context available to all other Client Components within the application's tree, enabling global state sharing while respecting Server Component limitations.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/05-server-and-client-components.mdx#_snippet_8

LANGUAGE: tsx
CODE:
```
import ThemeProvider from './theme-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

LANGUAGE: jsx
CODE:
```
import ThemeProvider from './theme-provider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

----------------------------------------

TITLE: Running Next.js Development Server Locally
DESCRIPTION: These commands start the Next.js development server locally using either `npm` or `yarn`. This allows developers to work on the application with hot-reloading and access it at `http://localhost:3000`.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-docker-multi-env/README.md#_snippet_6

LANGUAGE: bash
CODE:
```
npm run dev
# or
yarn dev
```

----------------------------------------

TITLE: Dynamic Segment `params` Prop Structure
DESCRIPTION: This API documentation illustrates the structure of the `params` prop for a basic dynamic route segment (`[slug]`), showing how the URL path maps to the `slug` property in the `params` object.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.mdx#_snippet_1

LANGUAGE: APIDOC
CODE:
```
Route: app/blog/[slug]/page.js
Example URL: /blog/a
params: { slug: 'a' }

Route: app/blog/[slug]/page.js
Example URL: /blog/b
params: { slug: 'b' }

Route: app/blog/[slug]/page.js
Example URL: /blog/c
params: { slug: 'c' }
```

----------------------------------------

TITLE: Starting Next.js Development Server
DESCRIPTION: These commands initiate the development server for a Next.js application using various popular package managers. Running any of these commands will start the server, typically accessible at `http://localhost:3000`, enabling live page updates during development.
SOURCE: https://github.com/vercel/next.js/blob/canary/packages/create-next-app/templates/default-tw/js/README-template.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

----------------------------------------

TITLE: Next.js Server Component Fetching Data and Using Client Component
DESCRIPTION: This example demonstrates a Next.js Server Component (`Page`) that asynchronously fetches data and passes it as props to a Client Component (`LikeButton`). It illustrates how Server Components can handle data fetching efficiently on the server while delegating interactive UI elements to Client Components.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/05-server-and-client-components.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)

  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        {/* ... */}
        <LikeButton likes={post.likes} />
      </main>
    </div>
  )
}
```

LANGUAGE: jsx
CODE:
```
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({ params }) {
  const post = await getPost(params.id)

  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        {/* ... */}
        <LikeButton likes={post.likes} />
      </main>
    </div>
  )
}
```