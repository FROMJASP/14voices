TITLE: Implementing Sonner Toast in React Application
DESCRIPTION: This React code snippet demonstrates how to use Sonner in a React application. It imports the necessary components, adds the Toaster component to render toasts, and includes a button that triggers a toast notification when clicked.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/README.md#2025-04-12_snippet_1

LANGUAGE: jsx
CODE:
```
import { Toaster, toast } from 'sonner';

// ...

function App() {
  return (
    <div>
      <Toaster />
      <button onClick={() => toast('My first toast')}>Give me a toast</button>
    </div>
  );
}
```

----------------------------------------

TITLE: Rendering a Toast Notification
DESCRIPTION: Example of how to create a toast notification using the toast function from Sonner. This snippet shows a button component that displays a toast message when clicked.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/getting-started.mdx#2025-04-12_snippet_5

LANGUAGE: tsx
CODE:
```
import { toast } from 'sonner';

function MyToast() {
  return <button onClick={() => toast('This is a sonner toast')}>Render my toast</button>;
}
```

----------------------------------------

TITLE: Adding Toaster Component to React Layout
DESCRIPTION: Implementation example showing how to add the Toaster component to a React application layout. This component can be placed anywhere in the application, including server components like layout.tsx.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/getting-started.mdx#2025-04-12_snippet_4

LANGUAGE: tsx
CODE:
```
import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

----------------------------------------

TITLE: Basic Toast Rendering in React
DESCRIPTION: Simple example of rendering a basic toast notification using Sonner.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/toast.mdx#2025-04-12_snippet_0

LANGUAGE: jsx
CODE:
```
import { toast } from 'sonner';

toast('Hello World!');
```

----------------------------------------

TITLE: Configurable Toast with Options
DESCRIPTION: Example showing toast creation with additional configuration options like className, description, duration, and custom icon.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/toast.mdx#2025-04-12_snippet_1

LANGUAGE: jsx
CODE:
```
import { toast } from 'sonner';

toast('My toast', {
  className: 'my-classname',
  description: 'My description',
  duration: 5000,
  icon: <MyIcon />,
});
```

----------------------------------------

TITLE: Promise Toast Implementation
DESCRIPTION: Shows how to create a toast that handles promise states with loading, success, and error messages.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/toast.mdx#2025-04-12_snippet_9

LANGUAGE: jsx
CODE:
```
toast.promise(myPromise, {
  loading: 'Loading...',
  success: (data) => {
    return `${data.name} toast has been added`;
  },
  error: 'Error',
});
```

----------------------------------------

TITLE: Success Toast Implementation
DESCRIPTION: Demonstrates rendering a success toast with a checkmark icon.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/toast.mdx#2025-04-12_snippet_3

LANGUAGE: jsx
CODE:
```
toast.success('My success toast');
```

----------------------------------------

TITLE: Error Toast Implementation
DESCRIPTION: Shows how to display an error toast with an error icon.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/toast.mdx#2025-04-12_snippet_4

LANGUAGE: jsx
CODE:
```
toast.error('My error toast');
```

----------------------------------------

TITLE: Loading Toast Implementation
DESCRIPTION: Example of creating a loading toast with a spinner indicator.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/toast.mdx#2025-04-12_snippet_10

LANGUAGE: jsx
CODE:
```
toast.loading('Loading data');
```

----------------------------------------

TITLE: Customizing Toaster Expansion and Visibility in React
DESCRIPTION: This snippet demonstrates how to use the Toaster component with expanded toasts and a custom number of visible toasts. It sets the expand prop to true and specifies 9 visible toasts instead of the default 3.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/toaster.mdx#2025-04-12_snippet_0

LANGUAGE: jsx
CODE:
```
// 9 toasts will be visible instead of the default, which is 3.
<Toaster expand visibleToasts={9} />
```

----------------------------------------

TITLE: Action Toast with Callback
DESCRIPTION: Example of creating a toast with an action button that executes a callback function.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/toast.mdx#2025-04-12_snippet_5

LANGUAGE: jsx
CODE:
```
toast('My action toast', {
  action: {
    label: 'Action',
    onClick: () => console.log('Action!'),
  },
});
```

----------------------------------------

TITLE: Action Toast with JSX Button
DESCRIPTION: Shows how to create a toast with a custom JSX button component as the action.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/toast.mdx#2025-04-12_snippet_6

LANGUAGE: jsx
CODE:
```
toast('My action toast', {
  action: <Button onClick={() => console.log('Action!')}>Action</Button>,
});
```

----------------------------------------

TITLE: Cancel Toast Implementation
DESCRIPTION: Example of adding a cancel button to a toast with a callback function.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/toast.mdx#2025-04-12_snippet_7

LANGUAGE: jsx
CODE:
```
toast('My cancel toast', {
  cancel: {
    label: 'Cancel',
    onClick: () => console.log('Cancel!'),
  },
});
```

----------------------------------------

TITLE: Cancel Toast with JSX
DESCRIPTION: Demonstrates how to add a custom JSX cancel button to a toast.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/toast.mdx#2025-04-12_snippet_8

LANGUAGE: jsx
CODE:
```
toast('My cancel toast', {
  cancel: <Button onClick={() => console.log('Cancel!')}>Cancel</Button>,
});
```

----------------------------------------

TITLE: Updating Existing Toast
DESCRIPTION: Shows how to update an existing toast using its ID.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/toast.mdx#2025-04-12_snippet_14

LANGUAGE: jsx
CODE:
```
const toastId = toast('Sonner');

toast.success('Toast has been updated', {
  id: toastId,
});
```

----------------------------------------

TITLE: Toast with Callbacks
DESCRIPTION: Example of creating a toast with dismissal and auto-close callbacks.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/toast.mdx#2025-04-12_snippet_15

LANGUAGE: jsx
CODE:
```
toast('Event has been created', {
  onDismiss: (t) => console.log(`Toast with id ${t.id} has been dismissed`),
  onAutoClose: (t) => console.log(`Toast with id ${t.id} has been closed automatically`),
});
```

----------------------------------------

TITLE: Applying Global Toast Styling in Sonner
DESCRIPTION: Configures global styling options for all toast notifications using the toastOptions prop on the Toaster component. This example shows how to set a custom background color and add a class name.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/styling.mdx#2025-04-12_snippet_0

LANGUAGE: jsx
CODE:
```
<Toaster
  toastOptions={{
    style: {
      background: 'red',
    },
    className: 'class',
  }}
/>
```

----------------------------------------

TITLE: Styling Individual Toast Notifications in Sonner
DESCRIPTION: Applies specific styling to a single toast notification when calling the toast function. This example demonstrates setting a custom background color and class name for an individual toast.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/styling.mdx#2025-04-12_snippet_1

LANGUAGE: jsx
CODE:
```
toast('Hello World', {
  style: {
    background: 'red',
  },
  className: 'class',
});
```

----------------------------------------

TITLE: Styling Sonner Toasts with Tailwind CSS (Global)
DESCRIPTION: Configures global styling using Tailwind CSS classes by leveraging the unstyled prop and classNames object. This approach allows for customizing different parts of the toast with Tailwind utility classes.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/styling.mdx#2025-04-12_snippet_2

LANGUAGE: jsx
CODE:
```
<Toaster
  toastOptions={{
    unstyled: true,
    classNames: {
      toast: 'bg-blue-400',
      title: 'text-red-400',
      description: 'text-red-400',
      actionButton: 'bg-zinc-400',
      cancelButton: 'bg-orange-400',
      closeButton: 'bg-lime-400',
    },
  }}
/>
```

----------------------------------------

TITLE: Styling Sonner Toasts by Type with Tailwind CSS
DESCRIPTION: Configures different styling for each toast type (error, success, warning, info) using Tailwind CSS classes. This approach allows for consistent styling based on the toast's purpose or severity.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/styling.mdx#2025-04-12_snippet_4

LANGUAGE: jsx
CODE:
```
<Toaster
  toastOptions={{
    unstyled: true,
    classNames: {
      error: 'bg-red-400',
      success: 'text-green-400',
      warning: 'text-yellow-400',
      info: 'bg-blue-400',
    },
  }}
/>
```

----------------------------------------

TITLE: Customizing Toast Icons in Sonner
DESCRIPTION: Changes the default icons used for different toast types by providing custom components through the icons prop. This example shows how to provide custom icon components for success, info, warning, error, and loading states.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/styling.mdx#2025-04-12_snippet_5

LANGUAGE: jsx
CODE:
```
<Toaster
  icons={{
    success: <SuccessIcon />,
    info: <InfoIcon />,
    warning: <WarningIcon />,
    error: <ErrorIcon />,
    loading: <LoadingIcon />,
  }}
/>
```

----------------------------------------

TITLE: Custom Elements in Toast
DESCRIPTION: Example of rendering custom elements and components within toast content.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/toast.mdx#2025-04-12_snippet_19

LANGUAGE: jsx
CODE:
```
toast(
  () => (
    <>
      View{' '}
      <a href="https://google.com" target="_blank">
        Animation on the Web
      </a>
    </>
  ),
  {
    description: () => <button>This is a button element!</button>,
  },
);
```

----------------------------------------

TITLE: Custom Styled Toast
DESCRIPTION: Shows how to create a custom toast while maintaining default styling.
SOURCE: https://github.com/emilkowalski/sonner/blob/main/website/src/pages/toast.mdx#2025-04-12_snippet_11

LANGUAGE: jsx
CODE:
```
toast(<div>A custom toast with default styling</div>, { duration: 5000 });
```