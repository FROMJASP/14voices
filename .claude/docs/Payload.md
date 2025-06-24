TITLE: Logging In via REST API (TypeScript)
DESCRIPTION: This TypeScript example demonstrates how to perform a user login using the Payload CMS REST API. It sends a POST request with the user's email and password, and upon success, it receives the user object, authentication token, and token expiration time in the JSON response. The API also automatically sets an HTTP-only cookie.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/authentication/operations.mdx#_snippet_4

LANGUAGE: TypeScript
CODE:
```
const res = await fetch('http://localhost:3000/api/[collection-slug]/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'dev@payloadcms.com',
    password: 'this-is-not-our-password...or-is-it?',
  }),
})

const json = await res.json()

// JSON will be equal to the following:
/*
{
  user: {
    email: 'dev@payloadcms.com',
    createdAt: "2020-12-27T21:16:45.645Z",
    updatedAt: "2021-01-02T18:37:41.588Z",
    id: "5ae8f9bde69e394e717c8832"
  },
  token: '34o4345324...',
  exp: 1609619861
}
*/
```

----------------------------------------

TITLE: Installing Core Payload 3.0 Dependencies (pnpm)
DESCRIPTION: This command installs the core dependencies for a Payload 3.0 application, including Next.js, React, and essential Payload packages. It is crucial that all `@payloadcms` package versions are synchronized to avoid compatibility issues.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/migration-guide/overview.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
pnpm i next react react-dom payload @payloadcms/ui @payloadcms/next
```

----------------------------------------

TITLE: Initializing Basic Payload Configuration - TypeScript
DESCRIPTION: This snippet demonstrates the fundamental structure for initializing the Payload configuration. It imports the `buildConfig` function from the 'payload' library and exports its result as the default configuration. This file serves as the central point for defining all aspects of a Payload application, leveraging TypeScript for strong typing and IDE support.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/configuration/overview.mdx#_snippet_0

LANGUAGE: TypeScript
CODE:
```
import { buildConfig } from 'payload'

export default buildConfig({
  // Your config goes here
})
```

----------------------------------------

TITLE: Configuring Payload to Use Postgres Adapter in TypeScript
DESCRIPTION: This TypeScript code snippet demonstrates how to configure Payload to use the Postgres adapter. It imports `buildConfig` and `postgresAdapter`, then sets up the database connection using a connection string from environment variables within the `db` property of the Payload configuration.
SOURCE: https://github.com/payloadcms/payload/blob/main/packages/db-postgres/README.md#_snippet_1

LANGUAGE: typescript
CODE:
```
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  // ...rest of config
})
```

----------------------------------------

TITLE: Implementing a 'lastModifiedBy' Payload Plugin (TypeScript)
DESCRIPTION: This TypeScript snippet defines the `addLastModified` plugin for Payload CMS. It modifies the incoming Payload configuration by adding a `lastModifiedBy` relationship field to all collections. This field automatically tracks the ID and collection of the user who last modified an entry, leveraging `beforeChange` hooks and displaying in the admin sidebar as read-only.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/plugins/overview.mdx#_snippet_2

LANGUAGE: TypeScript
CODE:
```
import { Config, Plugin } from 'payload'

export const addLastModified: Plugin = (incomingConfig: Config): Config => {
  // Find all incoming auth-enabled collections
  // so we can create a lastModifiedBy relationship field
  // to all auth collections
  const authEnabledCollections = incomingConfig.collections.filter(
    (collection) => Boolean(collection.auth),
  )

  // Spread the existing config
  const config: Config = {
    ...incomingConfig,
    collections: incomingConfig.collections.map((collection) => {
      // Spread each item that we are modifying,
      // and add our new field - complete with
      // hooks and proper admin UI config
      return {
        ...collection,
        fields: [
          ...collection.fields,
          {
            name: 'lastModifiedBy',
            type: 'relationship',
            relationTo: authEnabledCollections.map(({ slug }) => slug),
            hooks: {
              beforeChange: [
                ({ req }) => ({
                  value: req?.user?.id,
                  relationTo: req?.user?.collection,
                }),
              ],
            },
            admin: {
              position: 'sidebar',
              readOnly: true
            }
          }
        ]
      }
    })
  }

  return config
}
```

----------------------------------------

TITLE: Creating a Document with Payload Local API using a Server Function (TypeScript)
DESCRIPTION: This server function demonstrates how to create a new document in a Payload collection using the Local API. It utilizes `getPayload()` to access the Payload instance and wraps the `payload.create()` operation in a `try...catch` block for robust error handling. The function expects `data` as an input, which contains the document fields, and returns the newly created document.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/local-api/server-functions.mdx#_snippet_0

LANGUAGE: TypeScript
CODE:
```
'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function createPost(data) {
  const payload = await getPayload({ config })

  try {
    const post = await payload.create({
      collection: 'posts',
      data,
    })
    return post
  n} catch (error) {
    throw new Error(`Error creating post: ${error.message}`)
  }
}
```

----------------------------------------

TITLE: Integrating Custom Features into Payload CMS Lexical Editor
DESCRIPTION: This TypeScript example demonstrates how to configure the Lexical Editor in Payload CMS by passing a `features` prop. It shows how to include default features, customize the `LinkFeature` by adding a 'rel' attribute field, customize the `UploadFeature` with a 'caption' field, and integrate custom Payload blocks like 'Banner' and 'CallToAction' using `BlocksFeature`.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/rich-text/overview.mdx#_snippet_3

LANGUAGE: typescript
CODE:
```
import {
  BlocksFeature,
  LinkFeature,
  UploadFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Banner } from '../blocks/Banner'
import { CallToAction } from '../blocks/CallToAction'

{
  editor: lexicalEditor({
    features: ({ defaultFeatures, rootFeatures }) => [
      ...defaultFeatures,
      LinkFeature({
        // Example showing how to customize the built-in fields
        // of the Link feature
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: 'rel',
            label: 'Rel Attribute',
            type: 'select',
            hasMany: true,
            options: ['noopener', 'noreferrer', 'nofollow'],
            admin: {
              description:
                'The rel attribute defines the relationship between a linked resource and the current document. This is a custom link field.',
            },
          },
        ],
      }),
      UploadFeature({
        collections: {
          uploads: {
            // Example showing how to customize the built-in fields
            // of the Upload feature
            fields: [
              {
                name: 'caption',
                type: 'richText',
                editor: lexicalEditor(),
              },
            ],
          },
        },
      }),
      // This is incredibly powerful. You can re-use your Payload blocks
      // directly in the Lexical editor as follows:
      BlocksFeature({
        blocks: [Banner, CallToAction],
      }),
    ],
  })
}
```

----------------------------------------

TITLE: Finding Paginated Documents via GET /api/{collection-slug} (TypeScript)
DESCRIPTION: This snippet demonstrates how to find paginated documents from a Payload CMS collection using a GET request. It includes a basic TypeScript code example, illustrating the structure of a typical code block found in the documentation.
SOURCE: https://github.com/payloadcms/payload/blob/main/test/lexical-mdx/tests/restExamples2.input.mdx#_snippet_0

LANGUAGE: TypeScript
CODE:
```
const a = 1
const b = 2
const c = 3
const d = 4
```

----------------------------------------

TITLE: Adding a New Custom View to Payload CMS Admin Panel (TypeScript)
DESCRIPTION: This TypeScript snippet illustrates how to add a completely new custom view to the Payload CMS Admin Panel. It defines a new entry, `myCustomView`, under `admin.components.views`, requiring both a `Component` path to the React component and a `path` property to define the URL route for the new view. This enables developers to create entirely new pages within the admin interface.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/custom-components/custom-views.mdx#_snippet_1

LANGUAGE: TypeScript
CODE:
```
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    components: {
      views: {
        myCustomView: {
          Component: '/path/to/MyCustomView#MyCustomViewComponent',
          path: '/my-custom-view',
        },
      },
    },
  },
})
```

----------------------------------------

TITLE: Fetching Data from Payload REST API (TypeScript)
DESCRIPTION: This snippet demonstrates how to make a GET request to a Payload CMS REST API endpoint using the `fetch` API in TypeScript. It retrieves data from the 'pages' collection, parses the JSON response, and logs the data to the console. This requires the Payload REST API to be mounted at `/api`.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/getting-started/concepts.mdx#_snippet_1

LANGUAGE: ts
CODE:
```
fetch('https://localhost:3000/api/pages') // highlight-line
  .then((res) => res.json())
  .then((data) => console.log(data))
```

----------------------------------------

TITLE: Development Environment with Docker Compose for Payload CMS
DESCRIPTION: This `docker-compose.yml` file defines a multi-service development environment. It includes a `payload` service for the Node.js application, a `mongo` service for the database, and an optional `postgres` service. It sets up port mappings, volume mounts for persistent data and node modules, and environment variables.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/production/deployment.mdx#_snippet_3

LANGUAGE: YAML
CODE:
```
version: '3'

services:
  payload:
    image: node:18-alpine
    ports:
      - '3000:3000'
    volumes:
      - .:/home/node/app
      - node_modules:/home/node/app/node_modules
    working_dir: /home/node/app/
    command: sh -c "corepack enable && corepack prepare pnpm@latest --activate && pnpm install && pnpm dev"
    depends_on:
      - mongo
      # - postgres
    env_file:
      - .env

  # Ensure your DATABASE_URI uses 'mongo' as the hostname ie. mongodb://mongo/my-db-name
  mongo:
    image: mongo:latest
    ports:
      - '27017:27017'
    command:
      - --storageEngine=wiredTiger
    volumes:
      - data:/data/db
    logging:
      driver: none

  # Uncomment the following to use postgres
  # postgres:
  #   restart: always
  #   image: postgres:latest
  #   volumes:
  #     - pgdata:/var/lib/postgresql/data
  #   ports:
  #     - "5432:5432"

volumes:
  data:
  # pgdata:
  node_modules:
```

----------------------------------------

TITLE: Payload CMS Collection Configuration Options Overview
DESCRIPTION: Overview of top-level configuration options available for Payload CMS collections, detailing their purpose and linking to more information.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/configuration/collections.mdx#_snippet_6

LANGUAGE: APIDOC
CODE:
```
livePreview: Enable real-time editing for instant visual feedback of your front-end application.
components: Swap in your own React components to be used within this Collection.
listSearchableFields: Specify which fields should be searched in the List search view.
pagination: Set pagination-specific options for this Collection.
baseListFilter: You can define a default base filter for this collection's List view, which will be merged into any filters that the user performs.
```

----------------------------------------

TITLE: Initializing New Payload Project (Bash)
DESCRIPTION: This command initializes a new Payload project using `create-payload-app`, generating the necessary auto-generated files. It is the recommended first step for setting up a Payload 3.0 application or acquiring required configuration files.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/migration-guide/overview.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx create-payload-app
```

----------------------------------------

TITLE: Defining Granular Update Access for Users in Payload CMS (TypeScript)
DESCRIPTION: This example demonstrates a more advanced `update` access function defined in a separate file. It allows users with the 'admin' role to update any document. For other authenticated users, it restricts updates to only their own document, by comparing the `user.id` from the request with the `id` of the document being updated. This provides fine-grained control over user update permissions.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/access-control/collections.mdx#_snippet_6

LANGUAGE: typescript
CODE:
```
import type { Access } from 'payload'

export const canUpdateUser: Access = ({ req: { user }, id }) => {
  // Allow users with a role of 'admin'
  if (user.roles && user.roles.some((role) => role === 'admin')) {
    return true
  }

  // allow any other users to update only oneself
  return user.id === id
}
```

----------------------------------------

TITLE: Configuring CORS and CSRF in Payload CMS (TypeScript)
DESCRIPTION: This configuration snippet demonstrates how to set up CORS and CSRF in `payload.config.ts` to enable cross-domain communication for relationships, uploads, and user authentication. It allows requests and cookies to be sent between the Payload server and a front-end application running on a different domain or port.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/live-preview/client.mdx#_snippet_7

LANGUAGE: TypeScript
CODE:
```
// payload.config.ts
{
  // ...
  // If your site is running on a different domain than your Payload server,
  // This will allow requests to be made between the two domains
  cors: [
    'http://localhost:3001' // Your front-end application
  ],
  // If you are protecting resources behind user authentication,
  // This will allow cookies to be sent between the two domains
  csrf: [
    'http://localhost:3001' // Your front-end application
  ]
}
```

----------------------------------------

TITLE: Manage User Authentication and Permissions with useAuth Hook
DESCRIPTION: The `useAuth` hook is crucial for managing user authentication and permissions within Payload CMS applications. It provides access to the currently logged-in `user` object and their `permissions`. Additionally, it includes methods like `logOut`, `refreshCookie`, `setToken`, and `refreshPermissions` for comprehensive user session management and dynamic permission updates.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/admin/react-hooks.mdx#_snippet_22

LANGUAGE: APIDOC
CODE:
```
useAuth Hook Properties:
  user: UserObject
    Description: The currently logged in user.
  logOut: function
    Description: A method to log out the currently logged in user.
  refreshCookie: function
    Description: A method to trigger the silent refreshing of a user's auth token.
  setToken: function(token: string)
    Description: Set the token of the user, to be decoded and used to reset the user and token in memory.
  token: string
    Description: The logged in user's token (useful for creating preview links, etc.).
  refreshPermissions: function
    Description: Load new permissions (useful when content that affects permissions has been changed).
  permissions: PermissionsObject
    Description: The permissions of the current user.
```

LANGUAGE: tsx
CODE:
```
'use client'
import { useAuth } from '@payloadcms/ui'
import type { User } from '../payload-types.ts'

const Greeting: React.FC = () => {
  const { user } = useAuth<User>()

  return <span>Hi, {user.email}!</span>
}
```

----------------------------------------

TITLE: Removing Admin Bundler Configuration in Payload CMS (TypeScript)
DESCRIPTION: This snippet demonstrates the removal of the `admin.bundler` property from `payload.config.ts`. Payload CMS no longer uses dedicated bundlers like Webpack or Vite for the Admin Panel, relying instead on Next.js. Users should uninstall `@payloadcms/bundler-webpack` and `@payloadcms/bundler-vite`.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/migration-guide/overview.mdx#_snippet_8

LANGUAGE: diff
CODE:
```
// payload.config.ts
- import { webpackBundler } from '@payloadcms/bundler-webpack'

buildConfig({
  // ...
  admin: {
    // ...
-   bundler: webpackBundler(),
  }
})
```

----------------------------------------

TITLE: Defining a Custom Banner Block and Integrating with Rich Text in Payload CMS (TypeScript)
DESCRIPTION: This TypeScript snippet defines a `BannerBlock` for Payload CMS, including its fields (`type`, `content`) and the `jsx` property for bidirectional conversion between Lexical editor state and MDX. It also demonstrates how to integrate this custom block into a `richText` field within a `Pages` collection configuration, and includes `afterRead` and `beforeChange` hooks for handling Markdown conversion and preventing its persistence.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/rich-text/converting-markdown.mdx#_snippet_3

LANGUAGE: TypeScript
CODE:
```
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'\nimport type { Block, CollectionConfig, RichTextField } from 'payload'\n\nimport {\n  BlocksFeature,\n  convertLexicalToMarkdown,\n  editorConfigFactory,\n  lexicalEditor,\n} from '@payloadcms/richtext-lexical'\n\nconst BannerBlock: Block = {\n  slug: 'Banner',\n  fields: [\n    {\n      name: 'type',\n      type: 'select',\n      defaultValue: 'info',\n      options: [\n        { label: 'Info', value: 'info' },\n        { label: 'Warning', value: 'warning' },\n        { label: 'Error', value: 'error' },\n      ],\n    },\n    {\n      name: 'content',\n      type: 'richText',\n      editor: lexicalEditor(),\n    },\n  ],\n  jsx: {\n    /**\n     * Convert from Lexical -> MDX:\n     * <Banner type="..." >child content</Banner>\n     */\n    export: ({ fields, lexicalToMarkdown }) => {\n      const props: any = {}\n      if (fields.type) {\n        props.type = fields.type\n      }\n\n      return {\n        children: lexicalToMarkdown({ editorState: fields.content }),\n        props,\n      }\n    },\n    /**\n     * Convert from MDX -> Lexical:\n     */\n    import: ({ children, markdownToLexical, props }) => {\n      return {\n        type: props?.type,\n        content: markdownToLexical({ markdown: children }),\n      }\n    },\n  },\n}\n\nconst Pages: CollectionConfig = {\n  slug: 'pages',\n  fields: [\n    {\n      name: 'nameOfYourRichTextField',\n      type: 'richText',\n      editor: lexicalEditor({\n        features: ({ defaultFeatures }) => [\n          ...defaultFeatures,\n          BlocksFeature({\n            blocks: [BannerBlock],\n          }),\n        ],\n      }),\n    },\n    {\n      name: 'markdown',\n      type: 'textarea',\n      hooks: {\n        afterRead: [\n          ({ siblingData, siblingFields }) => {\n            const data: SerializedEditorState =\n              siblingData['nameOfYourRichTextField']\n\n            if (!data) {\n              return ''\n            }\n\n            const markdown = convertLexicalToMarkdown({\n              data,\n              editorConfig: editorConfigFactory.fromField({\n                field: siblingFields.find(\n                  (field) =>\n                    'name' in field && field.name === 'nameOfYourRichTextField',\n                ) as RichTextField,\n              }),\n            })\n\n            return markdown\n          },\n        ],\n        beforeChange: [\n          ({ siblingData }) => {\n            // Ensure that the markdown field is not saved in the database\n            delete siblingData['markdown']\n            return null\n          },\n        ],\n      },\n    },\n  ],\n}
```

----------------------------------------

TITLE: Defining a Simple Payload CMS Configuration (TypeScript)
DESCRIPTION: This snippet illustrates the most basic Payload CMS configuration. It initializes Payload using `buildConfig`, sets a secret from environment variables, configures the MongoDB database adapter with a connection URL, and defines a single collection named 'pages' with a 'title' text field. This serves as a foundational example for setting up a new Payload project.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/configuration/overview.mdx#_snippet_1

LANGUAGE: TypeScript
CODE:
```
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  collections: [
    {
      slug: 'pages',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
      ],
    },
  ],
})
```

----------------------------------------

TITLE: Quickstarting Payload with create-payload-app (Bash)
DESCRIPTION: This command initializes a new Payload application using `create-payload-app`, scaffolding a new project folder and a functional Payload app. It's the fastest way to get started and requires following interactive prompts to complete the setup.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/getting-started/installation.mdx#_snippet_0

LANGUAGE: Bash
CODE:
```
npx create-payload-app
```

----------------------------------------

TITLE: Initializing Payload by Importing getPayload (TypeScript)
DESCRIPTION: This snippet illustrates how to initialize the Payload object by importing `getPayload` and providing the Payload configuration. This method is used when the `payload` object is not available via function arguments or the `req` object, allowing direct programmatic access to Payload's API.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/local-api/overview.mdx#_snippet_1

LANGUAGE: TypeScript
CODE:
```
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
```

----------------------------------------

TITLE: Creating a Minimum Payload Configuration (TypeScript)
DESCRIPTION: This snippet provides a minimal `payload.config.ts` file, demonstrating the essential configuration for a Payload CMS project. It includes importing necessary modules like `sharp` for image processing, `lexicalEditor` for rich text, `mongooseAdapter` for database connectivity, and `buildConfig` from `payload`. Key parameters include `editor`, `collections` (initially empty), `secret` (from environment variables), `db` (configured with `mongooseAdapter` and `DATABASE_URI`), and `sharp` for image manipulation. This config serves as the foundation for a Payload application.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/getting-started/installation.mdx#_snippet_7

LANGUAGE: TypeScript
CODE:
```
import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload'

export default buildConfig({
  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor(),

  // Define and configure your collections in this array
  collections: [],

  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || '',
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  sharp,
})
```

----------------------------------------

TITLE: Initializing Payload Website Template with pnpx
DESCRIPTION: This command initializes a new Payload CMS project specifically using the 'website' template. This template is recommended for new users as it provides a comprehensive example including custom Rich Text blocks, on-demand revalidation, live preview, and a Tailwind-built frontend, all integrated within a single /app folder.
SOURCE: https://github.com/payloadcms/payload/blob/main/packages/payload/README.md#_snippet_1

LANGUAGE: Shell
CODE:
```
pnpx create-payload-app@latest -t website
```

----------------------------------------

TITLE: Fetching Data with Payload Local API in React Server Component
DESCRIPTION: This snippet demonstrates how to fetch data using Payload's Local API within a React Server Component. It initializes the Payload instance with the application configuration and then uses `payload.find()` to query documents from the 'pages' collection. The `findResult` is strongly typed, providing both the documents and pagination information, which can then be mapped to render a list of pages.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/getting-started/concepts.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
import React from 'react'
import config from '@payload-config'
import { getPayload } from 'payload'

const MyServerComponent: React.FC = () => {
  const payload = await getPayload({ config })

  // The `findResult` here will be fully typed as `PaginatedDocs<Page>`,
  // where you will have the `docs` that are returned as well as
  // information about how many items are returned / are available in total / etc
  const findResult = await payload.find({ collection: 'pages' })

  return (
    <ul>
      {findResult.docs.map((page) => {
        // Render whatever here!
        // The `page` is fully typed as your Pages collection!
      })}
    </ul>
  )
}
```

----------------------------------------

TITLE: Preventing Infinite Loops in PayloadCMS Hooks with Context
DESCRIPTION: Shows how to prevent infinite loops when updating a document within an `afterChange` hook by using the `context` object. A flag (`triggerAfterChange`) is set in `context` during the update operation, ensuring the hook's logic only runs once and doesn't re-trigger itself.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/hooks/context.mdx#_snippet_2

LANGUAGE: TypeScript
CODE:
```
import type { CollectionConfig } from 'payload'

const MyCollection: CollectionConfig = {
  slug: 'slug',
  hooks: {
    afterChange: [
      async ({ context, doc, req }) => {
        // return if flag was previously set
        if (context.triggerAfterChange === false) {
          return
        }
        await req.payload.update({
          collection: contextHooksSlug,
          id: doc.id,
          data: {
            ...(await fetchCustomerData(data.customerID)),
          },
          context: {
            // set a flag to prevent from running again
            triggerAfterChange: false,
          },
        })
      },
    ],
  },
  fields: [
    /* ... */
  ],
}
```

----------------------------------------

TITLE: Using Transactions in Payload Hooks (TypeScript)
DESCRIPTION: This snippet demonstrates how to ensure a Payload `afterChange` hook participates in the main request's transaction. By passing the `req` object (which contains `req.transactionID`) to `req.payload.create`, the database operation performed within the hook will only persist if the entire parent request is successful and its transaction is committed. This ensures data consistency across related operations.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/database/transactions.mdx#_snippet_0

LANGUAGE: typescript
CODE:
```
const afterChange: CollectionAfterChangeHook = async ({ req }) => {
  // because req.transactionID is assigned from Payload and passed through,
  // my-slug will only persist if the entire request is successful
  await req.payload.create({
    req,
    collection: 'my-slug',
    data: {
      some: 'data'
    }
  })
}
```

----------------------------------------

TITLE: Calling a Payload Server Function from a React Frontend (TypeScript/React)
DESCRIPTION: This React component illustrates how to invoke a server function (`createPost`) from the client-side. It uses React's `useState` hook to display the result of the server operation. Upon a button click, the asynchronous `createPost` function is called with sample data, demonstrating the secure interaction between the frontend and backend logic facilitated by server functions.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/local-api/server-functions.mdx#_snippet_1

LANGUAGE: TypeScript
CODE:
```
'use client';

import React, { useState } from 'react';
import { createPost } from '../server/actions'; // import the server function

export const PostForm: React.FC = () => {
  const [result, setResult] = useState<string>('');

  return (
    <>
      <p>{result}</p>

      <button
        type="button"
        onClick={async () => {
          // Call the server function
          const newPost = await createPost({ title: 'Sample Post' });
          setResult('Post created: ' + newPost.title);
        }}
      >
        Create Post
      </button>
    </>
  );
};
```

----------------------------------------

TITLE: Enabling Authentication on Payload Collection (TypeScript)
DESCRIPTION: This snippet demonstrates how to enable and configure authentication for a Payload Collection using the `auth` property. It sets parameters such as `tokenExpiration` for session duration, `verify` for email verification, `maxLoginAttempts` to limit login attempts, and `lockTime` for lockout duration after failed attempts. This configuration transforms a collection into an authenticated user store.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/authentication/overview.mdx#_snippet_1

LANGUAGE: TypeScript
CODE:
```
import type { CollectionConfig } from 'payload'

export const Admins: CollectionConfig = {
  // ...
  // highlight-start
  auth: {
    tokenExpiration: 7200, // How many seconds to keep the user logged in
    verify: true, // Require email verification before being allowed to authenticate
    maxLoginAttempts: 5, // Automatically lock a user out after X amount of failed logins
    lockTime: 600 * 1000, // Time period to allow the max login attempts
    // More options are available
  },
  // highlight-end
}
```

----------------------------------------

TITLE: Configuring a Number Field in Payload CMS (TypeScript)
DESCRIPTION: This snippet demonstrates how to define a Number field within a Payload CMS Field Config. By setting the 'type' property to 'number', you enable the field to store and validate numeric data. This configuration is essential for integrating numerical inputs into your Payload collections or globals.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/fields/number.mdx#_snippet_0

LANGUAGE: TypeScript
CODE:
```
import type { Field } from 'payload'

export const MyNumberField: Field = {
  // ...
  type: 'number', // highlight-line
}
```

----------------------------------------

TITLE: Deleting a Document by ID in Payload CMS (JavaScript)
DESCRIPTION: This snippet shows how to delete a single document from a Payload CMS collection using its unique ID. It returns the deleted document and supports options for depth, locale, and access overrides.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/local-api/overview.mdx#_snippet_9

LANGUAGE: js
CODE:
```
// Result will be the now-deleted Post document.
const result = await payload.delete({
  collection: 'posts', // required
  id: '507f1f77bcf86cd799439011', // required
  depth: 2,
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  overrideLock: false, // By default, document locks are ignored. Set to false to enforce locks.
  showHiddenFields: true,
})
```

----------------------------------------

TITLE: Consolidating Admin Logout and Inactivity Routes - TypeScript
DESCRIPTION: This snippet shows how `admin.logoutRoute` and `admin.inactivityRoute` are now consolidated under a single `admin.routes` object. The routes are specified as properties within this new object, streamlining route configuration.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/migration-guide/overview.mdx#_snippet_21

LANGUAGE: TypeScript
CODE:
```
// payload.config.ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
-   logoutRoute: '/custom-logout',
+   inactivityRoute: '/custom-inactivity'
+   routes: {
+     logout: '/custom-logout',
+     inactivity: '/custom-inactivity'
+   }
  }
})
```

----------------------------------------

TITLE: Configure Root Components in Payload CMS
DESCRIPTION: This TypeScript snippet demonstrates how to access the `admin.components` property within the Payload configuration. This property serves as the primary entry point for customizing high-level Admin Panel elements, allowing developers to inject their own custom components.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/custom-components/root-components.mdx#_snippet_0

LANGUAGE: typescript
CODE:
```
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    // highlight-start
    components: {
      // ...
    },
    // highlight-end
  },
})
```

----------------------------------------

TITLE: Starting Production Server (Shell)
DESCRIPTION: These commands start the Node.js server in production mode, serving the built Payload application and Admin panel from the `.build` directory. This is used for deploying the application to a live environment.
SOURCE: https://github.com/payloadcms/payload/blob/main/examples/form-builder/README.md#_snippet_7

LANGUAGE: Shell
CODE:
```
pnpm start
```

LANGUAGE: Shell
CODE:
```
npm run start
```

----------------------------------------

TITLE: Payload List View Custom Component Injection Points API
DESCRIPTION: This API documentation outlines the available properties within `admin.components` for injecting custom components into the PayloadCMS List View. Each path specifies a different location where custom components can be rendered, allowing granular control over the List View's appearance and functionality.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/custom-components/list-view.mdx#_snippet_4

LANGUAGE: APIDOC
CODE:
```
Path: beforeList
Description: An array of custom components to inject before the list of documents in the List View.

Path: beforeListTable
Description: An array of custom components to inject before the table of documents in the List View.

Path: afterList
Description: An array of custom components to inject after the list of documents in the List View.

Path: afterListTable
Description: An array of custom components to inject after the table of documents in the List View.

Path: listMenuItems
Description: An array of components to render within a menu next to the List Controls (after the Columns and Filters options).

Path: Description
Description: A component to render a description of the Collection.
```

----------------------------------------

TITLE: Installing Dependencies and Starting Dev Server - pnpm
DESCRIPTION: This command first installs all project dependencies using `pnpm install`. After successful installation, it executes `pnpm dev` to start the development server, making the application accessible locally, typically at `http://localhost:3000`. This is the primary command for local development.
SOURCE: https://github.com/payloadcms/payload/blob/main/templates/with-vercel-mongodb/README.md#_snippet_1

LANGUAGE: Shell
CODE:
```
pnpm install && pnpm dev
```

----------------------------------------

TITLE: Authenticating REST/GraphQL Requests with Payload API Key using Fetch (TypeScript)
DESCRIPTION: This example illustrates how to authenticate REST or GraphQL API requests against a Payload instance using an API key. The API key is passed in the `Authorization` header, formatted as `${CollectionSlug} API-Key ${YOUR_API_KEY}`, allowing Payload's built-in middleware to recognize the associated user and apply proper access control.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/authentication/api-keys.mdx#_snippet_1

LANGUAGE: TypeScript
CODE:
```
import Users from '../collections/Users'

const response = await fetch('http://localhost:3000/api/pages', {
  headers: {
    Authorization: `${Users.slug} API-Key ${YOUR_API_KEY}`,
  },
})
```

----------------------------------------

TITLE: Example Payload Configuration for Type Generation
DESCRIPTION: This is a simple example of a Payload configuration defining 'users' and 'posts' collections. This configuration serves as the basis for demonstrating how Payload's type generation works, producing corresponding TypeScript interfaces for these collections.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/typescript/generating-types.mdx#_snippet_6

LANGUAGE: TypeScript
CODE:
```
import type { Config } from 'payload'

const config: Config = {
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  admin: {
    user: 'users'
  },
  collections: [
    {
      slug: 'users',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true
        }
      ]
    },
    {
      slug: 'posts',
      admin: {
        useAsTitle: 'title'
      },
      fields: [
        {
          name: 'title',
          type: 'text'
        },
        {
          name: 'author',
          type: 'relationship',
          relationTo: 'users'
        }
      ]
    }
  ]
}
```

----------------------------------------

TITLE: Defining Access Control Property in Payload Collection Config
DESCRIPTION: This snippet demonstrates how to include the `access` property within a Payload Collection Configuration. This property is the entry point for defining granular access control rules for documents within the collection, allowing specification of permissions for various operations.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/access-control/collections.mdx#_snippet_0

LANGUAGE: typescript
CODE:
```
import type { CollectionConfig } from 'payload'

export const CollectionWithAccessControl: CollectionConfig = {
  // ...
  access: {
    // highlight-line
    // ...
  }
}
```

----------------------------------------

TITLE: Processing Username with beforeValidate Hook in Payload CMS (TypeScript)
DESCRIPTION: This snippet defines a `username` field in Payload CMS with a `beforeValidate` hook. The hook processes the incoming `value` by trimming whitespace and converting it to lowercase, ensuring consistent data storage before server-side validation. This hook runs during 'create' and 'update' operations.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/hooks/fields.mdx#_snippet_2

LANGUAGE: TypeScript
CODE:
```
import type { Field } from 'payload'

const usernameField: Field = {
  name: 'username',
  type: 'text',
  hooks: {
    beforeValidate: [
      ({ value }) => {
        // Trim whitespace and convert to lowercase
        return value.trim().toLowerCase()
      },
    ],
  },
}
```

----------------------------------------

TITLE: Conditional Email Transformation with beforeChange Hook in Payload CMS (TypeScript)
DESCRIPTION: This snippet illustrates an `email` field using a `beforeChange` hook in Payload CMS. The hook checks the `operation` type, allowing for specific validation or transformation logic to be applied to the email field value only during a 'create' operation. This ensures data integrity post-validation and before the data is saved.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/hooks/fields.mdx#_snippet_3

LANGUAGE: TypeScript
CODE:
```
import type { Field } from 'payload'

const emailField: Field = {
  name: 'email',
  type: 'email',
  hooks: {
    beforeChange: [
      ({ value, operation }) => {
        if (operation === 'create') {
          // Perform additional validation or transformation for 'create' operation
        }
        return value
      },
    ],
  },
}
```

----------------------------------------

TITLE: Implementing Create Access Control for Payload Collections
DESCRIPTION: This snippet demonstrates how to implement the `create` access control function within a Payload Collection Configuration. It shows how to check if a user is authenticated (`req.user`) to determine whether they have permission to create new documents. The function returns a boolean, granting or denying access based on the user's presence.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/access-control/collections.mdx#_snippet_2

LANGUAGE: typescript
CODE:
```
import type { CollectionConfig } from 'payload'

export const CollectionWithCreateAccess: CollectionConfig = {
  // ...
  access: {
    create: ({ req: { user }, data }) => {
      return Boolean(user)
    }
  }
}
```

----------------------------------------

TITLE: Restricting Access by User Role in Server Functions - PayloadCMS - TypeScript
DESCRIPTION: An example server function `deletePost` illustrating how to implement access control based on user roles. It checks if the user is authenticated and possesses the 'admin' role before executing the post deletion, preventing unauthorized users from performing sensitive operations.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/local-api/server-functions.mdx#_snippet_18

LANGUAGE: TypeScript
CODE:
```
export async function deletePost(postId, user) {
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const payload = await getPayload({ config })
  return await payload.delete({ collection: 'posts', id: postId })
}
```

----------------------------------------

TITLE: Implementing Server-side Live Preview in Next.js Page - TSX
DESCRIPTION: This `page.tsx` example demonstrates how to integrate server-side live preview into a Next.js App Router page. It fetches page data using Payload's Local API with `draft: true` and renders the `RefreshRouteOnSave` component to enable automatic route refreshing upon document saves in the Payload Admin Panel.
SOURCE: https://github.com/payloadcms/payload/blob/main/docs/live-preview/server.mdx#_snippet_1

LANGUAGE: tsx
CODE:
```
import { RefreshRouteOnSave } from './RefreshRouteOnSave.tsx'
import { getPayload } from 'payload'
import config from '../payload.config'

export default async function Page() {
  const payload = await getPayload({ config })

  const page = await payload.findByID({
    collection: 'pages',
    id: '123',
    draft: true,
  })

  return (
    <Fragment>
      <RefreshRouteOnSave />
      <h1>{page.title}</h1>
    </Fragment>
  )
}
```