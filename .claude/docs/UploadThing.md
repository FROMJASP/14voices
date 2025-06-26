TITLE: UploadThing `f` Function Method Chaining Example (TypeScript)
DESCRIPTION: Demonstrates how to use the `f` function to define an upload route and chain various methods like `input`, `middleware`, `onUploadError`, and `onUploadComplete` for handling different stages of the upload process.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/file-routes/page.mdx#_snippet_3

LANGUAGE: ts
CODE:
```
import { z } from "zod";

f(["image"])
  .input(z.object({ foo: z.string() }))
  .middleware(async ({ req, input }) => {
    input;
    // ^? { foo: string }
    return {};
  })
  .onUploadError(({ error, fileKey }) => {})
  .onUploadComplete(async (opts) => {});
```

----------------------------------------

TITLE: Define UploadThing FileRouter in TypeScript
DESCRIPTION: This TypeScript snippet demonstrates how to create a `FileRouter` using `createUploadthing` for a server-side application. It defines an `imageUploader` route with specific file type, size, and count limits, including middleware for authentication and an `onUploadComplete` callback to handle post-upload logic.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/getting-started/tanstack-start/page.mdx#_snippet_2

LANGUAGE: ts
CODE:
```
import { createUploadthing, UploadThingError } from "uploadthing/server";
import type { FileRouter } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
```

----------------------------------------

TITLE: Update UploadThing Server Configuration for Token
DESCRIPTION: UploadThing v7 moves presigned URL generation to your server, eliminating the need for extra API calls. This change consolidates `uploadthingSecret` and `uploadthingAppId` into a single `token` environment variable or configuration property, which is a base64 encoded JSON object containing app ID, region, and API key.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/v7/page.mdx#_snippet_0

LANGUAGE: typescript
CODE:
```
import { createRouteHandler } from "uploadthing/server";

createRouteHandler({
  router,
  config: {
    uploadthingSecret: "", // [!code --]
    uploadthingAppId: "", // [!code --]
    token: "", // [!code ++]
  },
});
```

----------------------------------------

TITLE: Define UploadThing FileRouter in Express
DESCRIPTION: Illustrates how to create a `FileRouter` using `createUploadthing` to define upload endpoints. This example sets up a minimalistic 'imageUploader' route, specifying permitted types, maximum file size, and an `onUploadComplete` callback for post-upload processing.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/backend-adapters/express/page.mdx#_snippet_2

LANGUAGE: ts
CODE:
```
import { createUploadthing, type FileRouter } from "uploadthing/express";

const f = createUploadthing();

export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete((data) => {
    console.log("upload completed", data);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
```

----------------------------------------

TITLE: Define UploadThing FileRouter
DESCRIPTION: Example of defining a minimalistic `FileRouter` with a single `imageUploader` route, specifying permitted file types, maximum file size, file count, and an `onUploadComplete` callback.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/backend-adapters/fetch/page.mdx#_snippet_2

LANGUAGE: ts
CODE:
```
import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete((data) => {
    console.log("upload completed", data);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
```

----------------------------------------

TITLE: Define UploadThing FileRouter for H3
DESCRIPTION: Creates a `FileRouter` using `createUploadthing` specifically for H3. This example defines an `imageUploader` route, specifying permitted file types, maximum file size, and file count, along with an `onUploadComplete` callback for post-upload processing.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/backend-adapters/h3/page.mdx#_snippet_2

LANGUAGE: ts
CODE:
```
import { createUploadthing, type FileRouter } from "uploadthing/h3";

const f = createUploadthing();

export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete((data) => {
    console.log("upload completed", data);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
```

----------------------------------------

TITLE: Create SvelteKit API route for UploadThing
DESCRIPTION: Example of setting up a SvelteKit API route (`+server.ts`) to handle UploadThing requests. It uses `createRouteHandler` to expose the defined FileRouter.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/getting-started/svelte/page.mdx#_snippet_3

LANGUAGE: ts
CODE:
```
import { env } from "$env/dynamic/private";
import { ourFileRouter } from "$lib/server/uploadthing";

import { createRouteHandler } from "uploadthing/server";

const handlers = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: env.UPLOADTHING_TOKEN,
  },
});

export { handlers as GET, handlers as POST };
```

----------------------------------------

TITLE: Configure UploadThing SDK Environment Variable
DESCRIPTION: This snippet demonstrates adding the `UPLOADTHING_TOKEN` environment variable. This token is crucial for the UploadThing SDK to authenticate and interact with the UploadThing service. Ensure you replace `...` with your actual secret key from the UploadThing dashboard.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/getting-started/pagedir/page.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
UPLOADTHING_TOKEN=... # A token for interacting with the SDK
```

----------------------------------------

TITLE: Configure UploadThing Token in .env
DESCRIPTION: Add the `UPLOADTHING_TOKEN` environment variable to your `.env` file. This token is essential for the UploadThing SDK to interact with your application.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/getting-started/appdir/page.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
UPLOADTHING_TOKEN=... # A token for interacting with the SDK
```

----------------------------------------

TITLE: Protecting UploadThing Routes with Middleware for Authentication and Rate Limiting
DESCRIPTION: This TypeScript code demonstrates how to secure UploadThing file routes using the `.middleware()` function. It includes two examples: `publicRoute` which applies rate limiting using a `RateLimit` instance, and `privateRoute` which enforces user authentication by checking the session. If authentication or rate limit checks fail, an `UploadThingError` is thrown to terminate the upload flow and send a client-friendly error message.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/concepts/auth-security/page.mdx#_snippet_0

LANGUAGE: typescript
CODE:
```
import { auth } from "auth";

import { createUploadthing, UploadThingError } from "uploadthing/server";

import { RateLimit } from "~/lib/ratelimit";

const ratelimiter = new RateLimit({
  /** rules */
});

export const uploadRouter = {
  publicRoute: f({ image: {} })
    .middleware(async ({ req }) => {
      const limit = await ratelimiter.verify(req);
      if (!limit.ok) {
        throw new UploadThingError("Rate limit exceeded");
      }

      return {};
    })
    .onUploadComplete(() => {
      /** ... */
    }),

  privateRoute: f({ image: {} })
    .middleware(async ({ req }) => {
      const session = await auth(req);
      if (!session) {
        throw new UploadThingError("You need to be logged in to upload files");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(() => {
      /** ... */
    })
};
```

----------------------------------------

TITLE: Define Client-Side Metadata Schema in Uploadthing File Route
DESCRIPTION: This TypeScript snippet demonstrates how to define a schema for client-side metadata using `z.object` within an Uploadthing file route. The `input` is then accessible and typed within the `middleware` and `onUploadComplete` callbacks, allowing server-side validation and processing of client-provided data.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/packages/react/CHANGELOG.md#_snippet_9

LANGUAGE: ts
CODE:
```
  withInput: f(["image"])
    .input(
      z.object({
        foo: z.string(),
      }),
    )
    .middleware((opts) => {
      console.log("input", opts.input);
      // input is typed as { foo: string }
      return {};
    })
    .onUploadComplete((data) => {
      console.log("upload completed", data);
    }),
```

----------------------------------------

TITLE: Add UploadThing environment variable
DESCRIPTION: Sets the `UPLOADTHING_TOKEN` environment variable, which is crucial for the UploadThing SDK to interact with the service. Ensure you obtain this token from your UploadThing dashboard.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/backend-adapters/h3/page.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
UPLOADTHING_TOKEN=... # A token for interacting with the SDK
```

----------------------------------------

TITLE: Configure UploadThing Environment Variable
DESCRIPTION: Guidance on setting up the `UPLOADTHING_TOKEN` environment variable. This token is crucial for authenticating interactions with the UploadThing SDK and should be obtained from your UploadThing dashboard.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/getting-started/solid/page.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
UPLOADTHING_TOKEN=... # A token for interacting with the SDK
```

----------------------------------------

TITLE: Configure UploadThing Environment Variable
DESCRIPTION: This snippet shows how to set the `UPLOADTHING_TOKEN` environment variable. This token is crucial for authenticating and interacting with the UploadThing SDK, enabling secure file uploads.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/getting-started/tanstack-start/page.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
UPLOADTHING_TOKEN=... # A token for interacting with the SDK
```

----------------------------------------

TITLE: UploadThing onUploadComplete Callback API
DESCRIPTION: Documentation for the `onUploadComplete` callback, the final step in the upload chain, used for persisting uploaded file data. Explains how metadata from `middleware` and file information are accessible, and how JSON serializable data can be returned to the client.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/file-routes/page.mdx#_snippet_8

LANGUAGE: APIDOC
CODE:
```
onUploadComplete(params: object): JSONSerializableData | void
  params:
    metadata: Generic - The metadata that was returned from the middleware function.
    file: UploadedFileData - An object with info for the file that was uploaded, such as the name, key, size, url etc.
```

----------------------------------------

TITLE: Configuring `UploadButton` with Event Handlers
DESCRIPTION: Provides a complete TypeScript React component demonstrating the `UploadButton`'s integration with an `OurFileRouter`. It showcases how to define an `endpoint` and implement various callback functions: `onClientUploadComplete` for post-upload actions, `onUploadError` for error handling, `onBeforeUploadBegin` for file preprocessing, and `onUploadBegin` for initial upload notifications.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/api-reference/react/page.mdx#_snippet_8

LANGUAGE: tsx
CODE:
```
import { UploadButton } from "@uploadthing/react";

import { OurFileRouter } from "./api/uploadthing/core";

export const OurUploadButton = () => (
  <UploadButton<OurFileRouter>
    endpoint="imageUploader"
    onClientUploadComplete={(res) => {
      // Do something with the response
      console.log("Files: ", res);
      alert("Upload Completed");
    }}
    onUploadError={(error: Error) => {
      // Do something with the error.
      alert(`ERROR! ${error.message}`);
    }}
    onBeforeUploadBegin={(files) => {
      // Preprocess files before uploading (e.g. rename them)
      return files.map(
        (f) => new File([f], "renamed-" + f.name, { type: f.type }),
      );
    }}
    onUploadBegin={(name) => {
      // Do something once upload begins
      console.log("Uploading: ", name);
    }}
  />
);
```

----------------------------------------

TITLE: Define UploadThing File Routes with various configurations
DESCRIPTION: This code snippet demonstrates how to define an `uploadRouter` using `createUploadthing` to create different file routes. Each route specifies allowed file types, maximum file sizes, and file counts. It also shows the use of middleware for authentication and `onUploadComplete` callbacks for post-upload processing, including an example of awaiting server data.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/file-routes/page.mdx#_snippet_0

LANGUAGE: ts
CODE:
```
import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
  // Example "profile picture upload" route - these can be named whatever you want!
  profilePicture: f(["image"])
    .middleware(({ req }) => auth(req))
    .onUploadComplete((data) => console.log("file", data)),

  // This route takes an attached image OR video
  messageAttachment: f(["image", "video"])
    .middleware(({ req }) => auth(req))
    .onUploadComplete((data) => console.log("file", data)),

  // Takes exactly ONE image up to 2MB
  strictImageAttachment: f({
    image: { maxFileSize: "2MB", maxFileCount: 1, minFileCount: 1 },
  })
    .middleware(({ req }) => auth(req))
    .onUploadComplete((data) => console.log("file", data)),

  // Takes up to 4 2mb images and/or 1 256mb video
  mediaPost: f({
    image: { maxFileSize: "2MB", maxFileCount: 4 },
    video: { maxFileSize: "256MB", maxFileCount: 1 },
  })
    .middleware(({ req }) => auth(req))
    .onUploadComplete((data) => console.log("file", data)),

  // Takes up to 4 2mb images, and the client will not resolve
  // the upload until the `onUploadComplete` resolved.
  withAwaitedServerData: f(
    { image: { maxFileSize: "2MB", maxFileCount: 4 } },
    { awaitServerData: true },
  )
    .middleware(({ req }) => auth(req))
    .onUploadComplete((data) => {
      return { foo: "bar" as const };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
```

----------------------------------------

TITLE: React Custom File Uploader with Uploadthing
DESCRIPTION: This TypeScript React component demonstrates a simple custom dropzone for file uploads. It integrates `useDropzone` for drag-and-drop functionality and `useUploadThing` to manage the upload process to a specified endpoint, including handling upload completion, errors, and beginning events. Users can select files via drag-and-drop or file input, and then initiate the upload with a button click.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/api-reference/react/page.mdx#_snippet_17

LANGUAGE: tsx
CODE:
```
import { useDropzone } from "@uploadthing/react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";

import { useUploadThing } from "~/utils/uploadthing";
import { useState, useCallback } from "react";

export function MultiUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { startUpload, routeConfig } = useUploadThing("myUploadEndpoint", {
    onClientUploadComplete: () => {
      alert("uploaded successfully!");
    },
    onUploadError: () => {
      alert("error occurred while uploading");
    },
    onUploadBegin: ({ file }) => {
      console.log("upload has begun for", file);
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ),
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div>
        {files.length > 0 && (
          <button onClick={() => startUpload(files)}>
            Upload {files.length} files
          </button>
        )}
      </div>
      Drop files here!
    </div>
  );
}
```

----------------------------------------

TITLE: Input Schema Validation for UploadThing
DESCRIPTION: Details on how to validate client-side input using various schema validators (Zod, Effect/Schema, Valibot, ArkType) before upload. Emphasizes the requirement for JSON serializable types and server-side validation.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/file-routes/page.mdx#_snippet_4

LANGUAGE: APIDOC
CODE:
```
input(schema: SchemaValidator): void
  schema: A schema validator (Zod, Effect/Schema, Standard Schema) to validate client input.
    Limitations:
      - Top-level schema must be Schema.Schema for Effect/Schema.
      - Must not be wrapped (e.g., optional<Schema.Schema>).
      - Input type must only contain JSON serializable types.
```

----------------------------------------

TITLE: Exposing UploadThing Router with createRouteHandler
DESCRIPTION: Demonstrates how to integrate and expose the UploadThing router using `createRouteHandler` across various JavaScript/TypeScript frameworks and environments, including Next.js App Router, Next.js Pages Directory, SolidJS, Express, Fastify, H3, and Remix. Each example shows the specific import path and usage for the respective framework.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/api-reference/server/page.mdx#_snippet_1

LANGUAGE: ts
CODE:
```
import { createRouteHandler } from "uploadthing/next";
import { uploadRouter } from "~/server/uploadthing.ts";

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
  // config: { ... },
});
```

LANGUAGE: ts
CODE:
```
import { createRouteHandler } from "uploadthing/next-legacy";
import { uploadRouter } from "~/server/uploadthing.ts";

export default createRouteHandler({
  router: uploadRouter,
  // config: { ... },
});
```

LANGUAGE: ts
CODE:
```
import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "~/server/uploadthing.ts";

export const handlers = createRouteHandler({
  router: uploadRouter,
  // config: { ... },
});
export { handlers as GET, handlers as POST };
```

LANGUAGE: ts
CODE:
```
import express from "express";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "~/server/uploadthing.ts";

const app = express();

app.use("/api/uploadthing", createRouteHandler({
  router: uploadRouter,
  // config: { ... },
}));
```

LANGUAGE: ts
CODE:
```
import Fastify from "fastify";
import { createRouteHandler } from "uploadthing/fastify";
import { uploadRouter } from "~/server/uploadthing.ts";

const fastify = Fastify();

fastify.register(createRouteHandler({
  router: uploadRouter,
  // config: { ... },
}));
```

LANGUAGE: ts
CODE:
```
import { createApp, createRouter } from "h3";
import { createRouteHandler } from "uploadthing/h3";
import { uploadRouter } from "~/server/uploadthing.ts";

const app = createApp();
const router = createRouter();

router.use("/api/uploadthing", createRouteHandler({
  router: uploadRouter,
  // config: { ... },
}));
app.use(router.handler);
```

LANGUAGE: tsx
CODE:
```
import { createRouteHandler } from "uploadthing/remix";
import { uploadRouter } from "~/server/uploadthing.ts";

export const { loader, action } = createRouteHandler({
  router: uploadRouter,
  // config: { ... },
});
```

----------------------------------------

TITLE: Generate Typed UploadThing React Components
DESCRIPTION: This TypeScript snippet generates type-safe `UploadButton` and `UploadDropzone` React components using `generateUploadButton` and `generateUploadDropzone`. These components are strongly typed with `OurFileRouter` for seamless integration into a Next.js application.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/getting-started/appdir/page.mdx#_snippet_4

LANGUAGE: ts
CODE:
```
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "~/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
```

----------------------------------------

TITLE: Generate Client-Side UploadThing React Components
DESCRIPTION: This TypeScript snippet generates client-side React components, `UploadButton` and `UploadDropzone`, using utilities from `@uploadthing/react`. These components are typed with `OurFileRouter` to ensure type safety and provide a user interface for initiating file uploads in your Next.js application.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/getting-started/pagedir/page.mdx#_snippet_4

LANGUAGE: ts
CODE:
```
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "~/server/uploadthing";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
```

----------------------------------------

TITLE: Define UploadThing FileRouter in Remix (app/routes/api.uploadthing.ts)
DESCRIPTION: This comprehensive snippet demonstrates the creation of a `FileRouter` using `createUploadthing` in a Remix application. It defines an `imageUploader` route, specifying allowed file types, maximum size, and includes a `middleware` for server-side authentication and an `onUploadComplete` callback for post-upload processing.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/getting-started/remix/page.mdx#_snippet_2

LANGUAGE: tsx
CODE:
```
import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno

import { createUploadthing, type FileRouter } from "uploadthing/remix";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (args: ActionFunctionArgs) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ event }) => {
      // This code runs on your server before upload
      const user = await auth(event);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
```

----------------------------------------

TITLE: Define Uploadthing File Route with Input Validation
DESCRIPTION: Demonstrates how to configure an Uploadthing file route to accept and validate client-side input using Zod. The input is typed and available within the middleware and `onUploadComplete` callbacks, allowing server-side processing and optional forwarding.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/packages/solid/CHANGELOG.md#_snippet_4

LANGUAGE: ts
CODE:
```
withInput: f(["image"])
      .input(
        z.object({
          foo: z.string(),
        }),
      )
      .middleware((opts) => {
        console.log("input", opts.input);
        // input is typed as { foo: string }
        return {};
      })
      .onUploadComplete((data) => {
        console.log("upload completed", data);
      }),
```

----------------------------------------

TITLE: Define UploadThing FileRouter for Image Uploads
DESCRIPTION: This TypeScript snippet defines a server-side FileRouter named 'imageUploader' using `createUploadthing`. It configures image uploads with specific size and count limits, includes a middleware for authentication, and an `onUploadComplete` callback to process uploaded files and return data to the client.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/getting-started/expo/page.mdx#_snippet_2

LANGUAGE: ts
CODE:
```
import { createUploadthing, UploadThingError } from "uploadthing/server";
import type { FileRouter } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(({ file, metadata }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;
export type UploadRouter = typeof uploadRouter;
```

----------------------------------------

TITLE: Define UploadThing FileRouter in Astro (src/server/uploadthing.ts)
DESCRIPTION: Create a FileRouter to define upload endpoints, specifying permitted file types, maximum sizes, and optional middleware for authentication. The `onUploadComplete` callback handles server-side logic after a successful upload.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/getting-started/astro/page.mdx#_snippet_2

LANGUAGE: ts
CODE:
```
import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
```

----------------------------------------

TITLE: Create UploadThing Instance for Server Bindings
DESCRIPTION: The `createUploadthing` helper function initializes an UploadThing instance. It's crucial to import it from the correct package (`uploadthing/next`, `uploadthing/next-legacy`, `uploadthing/server`, `uploadthing/express`, `uploadthing/fastify`, `uploadthing/h3`) to ensure proper typing for middleware functions, especially for request and response objects.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/api-reference/server/page.mdx#_snippet_0

LANGUAGE: TypeScript
CODE:
```
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();
export const uploadRouter = {  };

// ...
f({  })
  .middleware(({ req }) => {
    //           ^? req: NextRequest
    return {}
  })
```

LANGUAGE: TypeScript
CODE:
```
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

const f = createUploadthing();
export const uploadRouter = { ... };

// ...
f({ ... })
  .middleware(({ req, res }) => {
    //           ^? req: NextApiRequest, res: NextApiResponse
  })
```

LANGUAGE: TypeScript
CODE:
```
import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();
export const uploadRouter = { ... };

// ...
f({ ... })
  .middleware(({ req }) => {
    //           ^? req: Request
  })
```

LANGUAGE: TypeScript
CODE:
```
import { createUploadthing, type FileRouter } from "uploadthing/express";

const f = createUploadthing();
export const uploadRouter = { ... };

// ...
f({ ... })
  .middleware(({ req, res }) => {
    //           ^? req: ExpressRequest, res: ExpressResponse
  })
```

LANGUAGE: TypeScript
CODE:
```
import { createUploadthing, type FileRouter } from "uploadthing/fastify";

const f = createUploadthing();
export const uploadRouter = { ... };

// ...
f({ ... })
  .middleware(({ req, res }) => {
    //           ^? req: FastifyRequest, res: FastifyReply
  })
```

LANGUAGE: TypeScript
CODE:
```
import { createUploadthing, type FileRouter } from "uploadthing/h3";

const f = createUploadthing();
export const uploadRouter = { ... };

// ...
f({ ... })
  .middleware(({ event }) => {
    //           ^? event: H3Event
  })
```

----------------------------------------

TITLE: Fixing Invalid Signing Secret Error with Node.js Crypto Module
DESCRIPTION: Addresses the 'Invalid Signing Secret' error, which often arises from an outdated Node.js version lacking the global 'crypto' module. This snippet provides a TypeScript workaround to define the 'crypto' module globally, or suggests updating Node.js to version 20 or higher.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/faq/page.mdx#_snippet_4

LANGUAGE: TypeScript
CODE:
```
import crypto from "node:crypto";

globalThis.crypto = crypto;
```

----------------------------------------

TITLE: Using UploadButton Component (V1) in React
DESCRIPTION: Demonstrates how to use the `UploadButton` component from `@uploadthing/react` for file uploads. It shows how to configure the endpoint and handle various upload lifecycle events like `onNewFileDropped`, `onClientStartedUpload`, and `onClientFinishedUpload`.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/packages/react/README.md#_snippet_0

LANGUAGE: tsx
CODE:
```
// Name is temp
import { UploadButton } from "@uploadthing/react";

import type { FileRouter } from "./someUploadRouter";

export const SomePage = () => {
  return (
    <UploadButton<FileRouter>
      endpoint="someTypesafeEndpoint"
      onNewFileDropped={(file) => {
        console.log("new file added by user", file);
      }}
      onClientStartedUpload={(file) => {
        console.log("new file added by user", file);
      }}
      onClientFinishedUpload={(file) => {
        console.log(file);
      }}
    />
  );
};

```

----------------------------------------

TITLE: Using Uploadthing FileRouter for Image Uploads in React Native
DESCRIPTION: This snippet demonstrates how to use the `useImageUploader` hook from `~/utils/uploadthing` to handle image uploads in a React Native application. It configures callbacks for upload completion and errors, and includes logic for requesting image library permissions and opening settings if permissions are denied. The `openImagePicker` function is called with an `input` matching the FileRouter schema and a `source` (library or camera).
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/getting-started/expo/page.mdx#_snippet_5

LANGUAGE: TypeScript
CODE:
```
import { openSettings } from "expo-linking";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { useImageUploader } from "~/utils/uploadthing";

export default function Home() {
  const { openImagePicker, isUploading } = useImageUploader("imageUploader", {
    /**
     * Any props here are forwarded to the underlying `useUploadThing` hook.
     * Refer to the React API reference for more info.
     */
    onClientUploadComplete: () => Alert.alert("Upload Completed"),
    onUploadError: (error) => Alert.alert("Upload Error", error.message),
  });

  return (
    <View>
      <Pressable
        style={styles.button}
        onPress={() => {
          openImagePicker({
            input, // Matches the input schema from the FileRouter endpoint
            source: "library", // or "camera"
            onInsufficientPermissions: () => {
              Alert.alert(
                "No Permissions",
                "You need to grant permission to your Photos to use this",
                [
                  { text: "Dismiss" },
                  { text: "Open Settings", onPress: openSettings }
                ]
              );
            }
          })
        }}
      >
        <Text>Select Image</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: { ... }
});
```

----------------------------------------

TITLE: Define UploadThing FileRouter for Fastify
DESCRIPTION: Creates a `FileRouter` using `createUploadthing` from `uploadthing/fastify`. This example defines an `imageUploader` route, specifying allowed file types (image), maximum file size (4MB), maximum file count (1), and an `onUploadComplete` callback to process the uploaded file data.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/backend-adapters/fastify/page.mdx#_snippet_2

LANGUAGE: ts
CODE:
```
import { createUploadthing, type FileRouter } from "uploadthing/fastify";

const f = createUploadthing();

export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete((data) => {
    console.log("upload completed", data);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
```

----------------------------------------

TITLE: Define UploadThing FileRouter for Image Uploads
DESCRIPTION: Example of creating a `FileRouter` in `src/server/uploadthing.ts` with a single `imageUploader` route. This route defines permitted file types, maximum size, and includes middleware for authentication and an `onUploadComplete` callback for server-side processing after a successful upload.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/getting-started/solid/page.mdx#_snippet_2

LANGUAGE: ts
CODE:
```
import { createUploadthing, UploadThingError } from "uploadthing/server";
import type { FileRouter } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
```

----------------------------------------

TITLE: Generate UploadThing React Helpers (useUploadThing, uploadFiles)
DESCRIPTION: The `generateReactHelpers` function generates the `useUploadThing` hook and `uploadFiles` functions, enabling interaction with UploadThing in custom components. It accepts your File Router as a generic type for full type safety.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/api-reference/react/page.mdx#_snippet_5

LANGUAGE: tsx
CODE:
```
import { generateReactHelpers } from "@uploadthing/react";

import type { OurFileRouter } from "~/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
```

----------------------------------------

TITLE: Using UploadDropzone with Callbacks in TypeScript React
DESCRIPTION: This TypeScript React code snippet demonstrates how to integrate the `UploadDropzone` component from `@uploadthing/react` into an application. It shows how to specify an endpoint and implement various callback functions such as `onClientUploadComplete` for handling successful uploads, `onUploadError` for error management, `onUploadBegin` for actions at the start of an upload, and `onDrop` for processing accepted files.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/api-reference/react/page.mdx#_snippet_10

LANGUAGE: tsx
CODE:
```
import { UploadDropzone } from "@uploadthing/react";

import { OurFileRouter } from "./api/uploadthing/core";

export const OurUploadDropzone = () => (
  <UploadDropzone<OurFileRouter>
    endpoint="withoutMdwr"
    onClientUploadComplete={(res) => {
      // Do something with the response
      console.log("Files: ", res);
      alert("Upload Completed");
    }}
    onUploadError={(error: Error) => {
      alert(`ERROR! ${error.message}`);
    }}
    onUploadBegin={(name) => {
      // Do something once upload begins
      console.log("Uploading: ", name);
    }}
    onDrop={(acceptedFiles) => {
      // Do something with the accepted files
      console.log("Accepted files: ", acceptedFiles);
    }}
  />
);
```

----------------------------------------

TITLE: Generate Typed React Native Hooks for UploadThing
DESCRIPTION: This TypeScript/TSX snippet uses `generateReactNativeHelpers` from `@uploadthing/expo` to create typed hooks (`useImageUploader`, `useDocumentUploader`). These hooks facilitate client-side interaction with native file pickers in Expo, leveraging the defined `UploadRouter` and specifying the server URL for communication.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/getting-started/expo/page.mdx#_snippet_4

LANGUAGE: tsx
CODE:
```
import { generateReactNativeHelpers } from "@uploadthing/expo";

import type { UploadRouter } from "~/app/api/uploadthing+api";

export const { useImageUploader, useDocumentUploader } =
  generateReactNativeHelpers<UploadRouter>({
    /**
     * Your server url.
     * @default process.env.EXPO_PUBLIC_SERVER_URL
     * @remarks In dev we will also try to use Expo.debuggerHost
     */
    url: "https://my-server.com",
  });
```

----------------------------------------

TITLE: TypeScript: Construct and Sign Uploadthing URL
DESCRIPTION: This TypeScript snippet demonstrates how to construct an Uploadthing upload URL and append necessary query parameters. It includes both required and optional parameters for file metadata and generates an HMAC SHA256 signature to secure the URL for client-side uploads.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/uploading-files/page.mdx#_snippet_4

LANGUAGE: TypeScript
CODE:
```
const searchParams = new URLSearchParams({
  // Required
  expires: Date.now() + 60 * 60 * 1000, // 1 hour from now (you choose)
  "x-ut-identifier": "MY_APP_ID",
  "x-ut-file-name": "my-file.png",
  "x-ut-file-size": 131072,
  "x-ut-slug": "MY_FILE_ROUTE",

  // Optional
  "x-ut-file-type": "image/png",
  "x-ut-custom-id": "MY_CUSTOM_ID",
  "x-ut-content-disposition": "inline",
  "x-ut-acl": "public-read"
});

const url = new URL(
  `https://{{ REGION_ALIAS }}.ingest.uploadthing.com/${fileKey}`,
);
url.search = searchParams.toString();

const signature = `hmac-sha256=${hmacSha256(url, apiKey)}`;
url.searchParams.append("signature", signature);
```

----------------------------------------

TITLE: Upload Function API Parameters and Returns
DESCRIPTION: Describes the parameters and return values for the core file upload functionality, including options for file input, headers, and progress tracking, along with controls for pausing, resuming, and awaiting upload completion.
SOURCE: https://github.com/pingdotgg/uploadthing/blob/main/docs/src/app/(docs)/api-reference/client/page.mdx#_snippet_3

LANGUAGE: APIDOC
CODE:
```
Parameters:
  files: File[] (required, since 7.0)
    An array of files to upload.
  input: TInput (since 7.0)
    Input JSON data matching your validator set on the FileRoute to send with the request.
  headers: HeadersInit | () => HeadersInit (since 7.0)
    Headers to be sent along the request to request the presigned URLs. Useful for authentication outside full-stack framework setups.
  onUploadProgress: (progress) => void (since 7.0)
    Callback function that gets continuously called as the file is uploaded to the storage provider.

Returns:
  pauseUpload: (file?: File) => void (since 7.0)
    Pause the upload of a file. If no file is provided, all files will be paused.
  resumeUpload: (file?: File) => void (since 7.0)
    Resume the upload of a file. If no file is provided, all files will be resumed.
  done: (file?: File) => Promise<MaybeArray<UploadedFileResponse>> (since 7.0)
    Await the completion of the upload of a file. If no file is provided, all files will be awaited. The returned object is the same as the one returned by `uploadFiles`. If a file is provided, the function returns an object, else it returns an array.
```