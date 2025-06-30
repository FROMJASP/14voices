TITLE: Installing Driver.js with Package Managers (npm, pnpm, yarn)
DESCRIPTION: This snippet provides commands to install the driver.js package using popular Node.js package managers: npm, pnpm, and yarn. Choose the command corresponding to your preferred package manager to add driver.js to your project dependencies.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/installation.mdx#_snippet_0

LANGUAGE: bash
CODE:

```
# Using npm
npm install driver.js

# Using pnpm
pnpm install driver.js

# Using yarn
yarn add driver.js
```

---

TITLE: Creating a Basic Tour with driver.js (JavaScript)
DESCRIPTION: This snippet demonstrates how to initialize `driver.js` and create a multi-step tour. It configures the tour to show progress and defines several steps, each targeting a specific element with a popover title and description. The `drive()` method initiates the tour.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/basic-usage.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:

```
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
  showProgress: true,
  steps: [
    { element: '.page-header', popover: { title: 'Title', description: 'Description' } },
    { element: '.top-nav', popover: { title: 'Title', description: 'Description' } },
    { element: '.sidebar', popover: { title: 'Title', description: 'Description' } },
    { element: '.footer', popover: { title: 'Title', description: 'Description' } }
  ]
});

driverObj.drive();
```

---

TITLE: Highlighting an Element with Driver.js (Module Import)
DESCRIPTION: This JavaScript snippet shows how to import and initialize driver.js, then use it to highlight a specific HTML element. It demonstrates the basic usage for creating an interactive tour step with a title and description popover.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/installation.mdx#_snippet_2

LANGUAGE: js
CODE:

```
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver();
driverObj.highlight({
  element: "#some-element",
  popover: {
    title: "Title",
    description: "Description"
  }
});
```

---

TITLE: Migrating Driver.js API Methods (1.x)
DESCRIPTION: This snippet details the significant changes to Driver.js API methods in version 1.x. It lists deprecated methods (e.g., `preventMove`, `getCalculatedPosition`), renamed methods (e.g., `isActivated` to `isActive()`, `start` to `drive`, `reset` to `destroy`), and introduces new utility methods for navigation, state retrieval, and configuration management.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/migrating-from-0x.mdx#_snippet_4

LANGUAGE: diff
CODE:

```
- driverObj.preventMove();  // async support is built-in, no longer need to call this
- activeElement.getCalculatedPosition();
- activeElement.hidePopover();
- activeElement.showPopover();
- activeElement.getNode();

- const isActivated = driverObj.isActivated;
+ const isActivated = driverObj.isActive();

- driverObj.start(stepNumber = 0);
+ driverObj.drive(stepNumber = 0);

- driverObj.highlight(string|stepDefinition);
+ driverObj.highlight(stepDefinition)

- driverObj.reset();
+ driverObj.destroy();

- driverObj.hasHighlightedElement();
+ typeof driverObj.getActiveElement() !== 'undefined';

- driverObj.getHighlightedElement();
+ driverObj.getActiveElement();

- driverObj.getLastHighlightedElement();
+ driverObj.getPreviousElement();

+ // New options added
+ driverObj.moveTo(stepIndex)
+ driverObj.getActiveStep(); // returns the configured step definition
+ driverObj.getPreviousStep(); // returns the previous step definition
+ driverObj.isLastStep();
+ driverObj.isFirstStep();
+ driverObj.getState();
+ driverObj.getConfig();
+ driverObj.setConfig(config);
+ driverObj.refresh();
```

---

TITLE: Initializing Driver.js and Basic Tour Control - JavaScript
DESCRIPTION: This snippet demonstrates how to initialize the `driver.js` library and start a tour. It also shows methods for navigating between tour steps, including moving next, previous, or to a specific step, and checking step existence.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/api.mdx#_snippet_0

LANGUAGE: javascript
CODE:

```
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// Look at the configuration section for the options
// https://driverjs.com/docs/configuration#driver-configuration
const driverObj = driver({ /* ... */ });

// --------------------------------------------------
// driverObj is an object with the following methods
// --------------------------------------------------

// Start the tour using `steps` given in the configuration
driverObj.drive();  // Starts at step 0
driverObj.drive(4); // Starts at step 4

driverObj.moveNext(); // Move to the next step
driverObj.movePrevious(); // Move to the previous step
driverObj.moveTo(4); // Move to the step 4
driverObj.hasNextStep(); // Is there a next step
driverObj.hasPreviousStep() // Is there a previous step
```

---

TITLE: Highlighting a Single Element with driver.js (JavaScript)
DESCRIPTION: This example illustrates how to use the `highlight` method of `driver.js` to focus on and display a popover for a single HTML element. It initializes the driver object and then calls `highlight` with a configuration object specifying the target element and its popover content.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/basic-usage.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:

```
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver();
driverObj.highlight({
  element: '#some-element',
  popover: {
    title: 'Title for the Popover',
    description: 'Description for it'
  }
});
```

---

TITLE: Highlighting an Element with Popover using Driver.js
DESCRIPTION: This snippet initializes Driver.js with custom styling and stage padding, then highlights a specific HTML element (`#highlight-me`) and displays a popover with a title and description. It demonstrates basic element highlighting and popover functionality.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/simple-highlight.mdx#_snippet_0

LANGUAGE: js
CODE:

```
const driverObj = driver({
  popoverClass: "driverjs-theme",
  stagePadding: 4,
});

driverObj.highlight({
  element: "#highlight-me",
  popover: {
    side: "bottom",
    title: "This is a title",
    description: "This is a description",
  }
})
```

---

TITLE: Creating and Starting an Animated Tour with driver.js (JavaScript)
DESCRIPTION: This snippet demonstrates how to initialize a driver.js instance for an animated tour. It imports the necessary library and its default CSS, configures the tour with `showProgress` and an array of `steps`, each targeting a specific element with a popover. Finally, it starts the tour by calling the `drive()` method on the created driver object.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/animated-tour.mdx#_snippet_0

LANGUAGE: js
CODE:

```
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
  showProgress: true,
  steps: [
    { element: '#tour-example', popover: { title: 'Animated Tour Example', description: 'Here is the code example showing animated tour. Let\'s walk you through it.', side: "left", align: 'start' }},
    { element: 'code .line:nth-child(1)', popover: { title: 'Import the Library', description: 'It works the same in vanilla JavaScript as well as frameworks.', side: "bottom", align: 'start' }},
    { element: 'code .line:nth-child(2)', popover: { title: 'Importing CSS', description: 'Import the CSS which gives you the default styling for popover and overlay.', side: "bottom", align: 'start' }},
    { element: 'code .line:nth-child(4) span:nth-child(7)', popover: { title: 'Create Driver', description: 'Simply call the driver function to create a driver.js instance', side: "left", align: 'start' }},
    { element: 'code .line:nth-child(18)', popover: { title: 'Start Tour', description: 'Call the drive method to start the tour and your tour will be started.', side: "top", align: 'start' }},
    { element: 'a[href="/docs/configuration"]', popover: { title: 'More Configuration', description: 'Look at this page for all the configuration options you can pass.', side: "right", align: 'start' }},
    { popover: { title: 'Happy Coding', description: 'And that is all, go ahead and start adding tours to your applications.' } }
  ]
});

driverObj.drive();
```

---

TITLE: Asynchronous Tour - driver.js (JavaScript)
DESCRIPTION: This snippet demonstrates how to create an asynchronous tour using driver.js. It shows how to override the default `onNextClick` behavior to manually advance the tour after dynamically loading an element, and how to remove dynamic elements using `onDeselected`.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/async-tour.mdx#_snippet_0

LANGUAGE: js
CODE:

```
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
  showProgress: true,
  steps: [
    {
      popover: {
        title: 'First Step',
        description: 'This is the first step. Next element will be loaded dynamically.'
        // By passing onNextClick, you can override the default behavior of the next button.
        // This will prevent the driver from moving to the next step automatically.
        // You can then manually call driverObj.moveNext() to move to the next step.
        onNextClick: () => {
          // .. load element dynamically
          // .. and then call
          driverObj.moveNext();
        },
      },
    },
    {
      element: '.dynamic-el',
      popover: {
        title: 'Async Element',
        description: 'This element is loaded dynamically.'
      },
      // onDeselected is called when the element is deselected.
      // Here we are simply removing the element from the DOM.
      onDeselected: () => {
        // .. remove element
        document.querySelector(".dynamic-el")?.remove();
      }
    },
    { popover: { title: 'Last Step', description: 'This is the last step.' } }
  ]

});

driverObj.drive();
```

---

TITLE: Adding Custom Popover Buttons with onPopoverRender in Driver.js
DESCRIPTION: This example illustrates how to add custom buttons to a `driver.js` popover using the `onPopoverRender` callback. This powerful hook provides full control over the popover's DOM, enabling you to append new elements like a 'Go to First' button, which, when clicked, programmatically navigates the tour back to its initial step.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/buttons.mdx#_snippet_3

LANGUAGE: javascript
CODE:

```
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
  // Get full control over the popover rendering.
  // Here we are adding a custom button that takes
  // user to the first step.
  onPopoverRender: (popover, { config, state }) => {
    const firstButton = document.createElement("button");
    firstButton.innerText = "Go to First";
    popover.footerButtons.appendChild(firstButton);

    firstButton.addEventListener("click", () => {
      driverObj.drive(0);
    });
  },
  steps: [
    // ..
  ]
});

driverObj.drive();
```

---

TITLE: Implementing Custom Button Click Handlers in Driver.js
DESCRIPTION: This snippet demonstrates how to attach custom event handlers to the 'next', 'previous', and 'close' buttons in `driver.js` popovers using `onNextClick`, `onPrevClick`, and `onCloseClick` callbacks. When these callbacks are configured, they override the default button behavior, allowing you to execute custom logic, such as logging events or controlling tour navigation programmatically.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/buttons.mdx#_snippet_2

LANGUAGE: javascript
CODE:

```
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
  onNextClick:() => {
    console.log('Next Button Clicked');
    // Implement your own functionality here
    driverObj.moveNext();
  },
  onPrevClick:() => {
    console.log('Previous Button Clicked');
    // Implement your own functionality here
    driverObj.movePrevious();
  },
  onCloseClick:() => {
    console.log('Close Button Clicked');
    // Implement your own functionality here
    driverObj.destroy();
  },
  steps: [
    // ...
  ]
});

driverObj.drive();
```

---

TITLE: Defining Popover Configuration Options in TypeScript
DESCRIPTION: This TypeScript type defines the configuration options specific to the Driver.js popover UI element. It allows customization of the popover's title, description, position, alignment, button display, progress text, custom CSS classes, and provides hooks for popover rendering and button click events.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/configuration.mdx#_snippet_1

LANGUAGE: TypeScript
CODE:

```
type Popover = {
  // Title and descriptions shown in the popover.
  // You can use HTML in these. Also, you can
  // omit one of these to show only the other.
  title?: string;
  description?: string;

  // The position and alignment of the popover
  // relative to the target element.
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";

  // Array of buttons to show in the popover.
  // When highlighting a single element, there
  // are no buttons by default. When showing
  // a tour, the default buttons are "next",
  // "previous" and "close".
  showButtons?: ("next" | "previous" | "close")[];
  // An array of buttons to disable. This is
  // useful when you want to show some of the
  // buttons, but disable some of them.
  disableButtons?: ("next" | "previous" | "close")[];

  // Text to show in the buttons. `doneBtnText`
  // is used on the last step of a tour.
  nextBtnText?: string;
  prevBtnText?: string;
  doneBtnText?: string;

  // Whether to show the progress text in popover.
  showProgress?: boolean;
  // Template for the progress text. You can use
  // the following placeholders in the template:
  //   - {{current}}: The current step number
  //   - {{total}}: Total number of steps
  // Defaults to following if `showProgress` is true:
  //   - "{{current}} of {{total}}"
  progressText?: string;

  // Custom class to add to the popover element.
  // This can be used to style the popover.
  popoverClass?: string;

  // Hook to run after the popover is rendered.
  // You can modify the popover element here.
  // Parameter is an object with references to
  // the popover DOM elements such as buttons
  // title, descriptions, body, etc.
  onPopoverRender?: (popover: PopoverDOM, options: { config: Config; state: State, driver: Driver }) => void;

  // Callbacks for button clicks. You can use
  // these to add custom behavior to the buttons.
  // Each callback receives the following parameters:
  //   - element: The current DOM element of the step
  //   - step: The step object configured for the step
  //   - options.config: The current configuration options
  //   - options.state: The current state of the driver
  //   - options.driver: Current driver object
  onNextClick?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void
  onPrevClick?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void
  onCloseClick?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void
}
```

---

TITLE: Initializing Driver.js Instance (1.x)
DESCRIPTION: This snippet demonstrates the new initialization pattern for Driver.js 1.x. Instead of instantiating a class and then separately setting steps, the `driver` function is now called directly, allowing steps to be passed as part of the configuration object in the constructor, simplifying setup.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/migrating-from-0x.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:

```
// Steps can be passed in the constructor
const driverObj = driver({
  ...config,
  steps
});
```

---

TITLE: Defining Global Driver Configuration Options in TypeScript
DESCRIPTION: This TypeScript type definition outlines the global configuration options for Driver.js. It includes properties for managing product tour steps, animations, overlay appearance, scrolling behavior, keyboard controls, popover styling, button visibility, progress text, and various lifecycle hooks for events like highlighting, deselection, destruction, and button clicks.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/configuration.mdx#_snippet_0

LANGUAGE: TypeScript
CODE:

```
type Config = {
  // Array of steps to highlight. You should pass
  // this when you want to setup a product tour.
  steps?: DriveStep[];

  // Whether to animate the product tour. (default: true)
  animate?: boolean;
  // Overlay color. (default: black)
  // This is useful when you have a dark background
  // and want to highlight elements with a light
  // background color.
  overlayColor?: string;
  // Whether to smooth scroll to the highlighted element. (default: false)
  smoothScroll?: boolean;
  // Whether to allow closing the popover by clicking on the backdrop. (default: true)
  allowClose?: boolean;
  // Opacity of the backdrop. (default: 0.5)
  overlayOpacity?: number;
  // What to do when the overlay backdrop is clicked.
  // Possible options are 'close' and 'nextStep'. (default: 'close')
  overlayClickBehavior?: string,
  // Distance between the highlighted element and the cutout. (default: 10)
  stagePadding?: number;
  // Radius of the cutout around the highlighted element. (default: 5)
  stageRadius?: number;

  // Whether to allow keyboard navigation. (default: true)
  allowKeyboardControl?: boolean;

  // Whether to disable interaction with the highlighted element. (default: false)
  // Can be configured at the step level as well
  disableActiveInteraction?: boolean;

  // If you want to add custom class to the popover
  popoverClass?: string;
  // Distance between the popover and the highlighted element. (default: 10)
  popoverOffset?: number;
  // Array of buttons to show in the popover. Defaults to ["next", "previous", "close"]
  // for product tours and [] for single element highlighting.
  showButtons?: AllowedButtons[];
  // Array of buttons to disable. This is useful when you want to show some of the
  // buttons, but disable some of them.
  disableButtons?: AllowedButtons[];

  // Whether to show the progress text in popover. (default: false)
  showProgress?: boolean;
  // Template for the progress text. You can use the following placeholders in the template:
  //  - {{current}}: The current step number
  //  - {{total}}: Total number of steps
  progressText?: string;

  // Text to show in the buttons. `doneBtnText`
  // is used on the last step of a tour.
  nextBtnText?: string;
  prevBtnText?: string;
  doneBtnText?: string;

  // Called after the popover is rendered.
  // PopoverDOM is an object with references to
  // the popover DOM elements such as buttons
  // title, descriptions, body, container etc.
  onPopoverRender?: (popover: PopoverDOM, options: { config: Config; state: State, driver: Driver }) => void;

  // Hooks to run before and after highlighting
  // each step. Each hook receives the following
  // parameters:
  //   - element: The target DOM element of the step
  //   - step: The step object configured for the step
  //   - options.config: The current configuration options
  //   - options.state: The current state of the driver
  //   - options.driver: Current driver object
  onHighlightStarted?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;
  onHighlighted?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;
  onDeselected?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;

  // Hooks to run before and after the driver
  // is destroyed. Each hook receives
  // the following parameters:
  //   - element: Currently active element
  //   - step: The step object configured for the currently active
  //   - options.config: The current configuration options
  //   - options.state: The current state of the driver
  //   - options.driver: Current driver object
  onDestroyStarted?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;
  onDestroyed?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;

  // Hooks to run on button clicks. Each hook receives
  // the following parameters:
  //   - element: The current DOM element of the step
  //   - step: The step object configured for the step
  //   - options.config: The current configuration options
  //   - options.state: The current state of the driver
  //   - options.driver: Current driver object
  onNextClick?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;
  onPrevClick?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;
  onCloseClick?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;
};
```

---

TITLE: Accessing Driver State with State Type (TypeScript)
DESCRIPTION: Defines the `State` type, which represents the current status of the driver. It includes properties like `isInitialized`, `activeIndex`, `activeElement`, `activeStep` for the current step, `previousElement`, `previousStep` for the prior step, and `popover` for popover DOM elements. This state object is accessible via `getState` and passed to hooks/callbacks.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/configuration.mdx#_snippet_3

LANGUAGE: TypeScript
CODE:

```
type State = {
  // Whether the driver is currently active or not
  isInitialized?: boolean;

  // Index of the currently active step if using
  // as a product tour and have configured the
  // steps array.
  activeIndex?: number;
  // DOM element of the currently active step
  activeElement?: Element;
  // Step object of the currently active step
  activeStep?: DriveStep;

  // DOM element that was previously active
  previousElement?: Element;
  // Step object of the previously active step
  previousStep?: DriveStep;

  // DOM elements for the popover i.e. including
  // container, title, description, buttons etc.
  popover?: PopoverDOM;
}
```

---

TITLE: Configuring Individual Tour Steps with DriveStep (TypeScript)
DESCRIPTION: Defines the `DriveStep` type, which is used to configure individual steps in a product tour or highlight. It specifies the target `element`, optional `popover` settings, `disableActiveInteraction` for user interaction control, and various lifecycle callbacks (`onDeselected`, `onHighlightStarted`, `onHighlighted`) that provide context about the current step and driver state.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/configuration.mdx#_snippet_2

LANGUAGE: TypeScript
CODE:

```
type DriveStep = {
  // The target element to highlight.
  // This can be a DOM element, or a CSS selector.
  // If this is a selector, the first matching
  // element will be highlighted.
  element: Element | string;

  // The popover configuration for this step.
  // Look at the Popover Configuration section
  popover?: Popover;

  // Whether to disable interaction with the highlighted element. (default: false)
  disableActiveInteraction?: boolean;

  // Callback when the current step is deselected,
  // about to be highlighted or highlighted.
  // Each callback receives the following parameters:
  //   - element: The current DOM element of the step
  //   - step: The step object configured for the step
  //   - options.config: The current configuration options
  //   - options.state: The current state of the driver
  //   - options.driver: Current driver object
  onDeselected?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;
  onHighlightStarted?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;
  onHighlighted?: (element?: Element, step: DriveStep, options: { config: Config; state: State, driver: Driver }) => void;
}
```

---

TITLE: Accessing State and Highlighting Elements - JavaScript
DESCRIPTION: This snippet demonstrates how to retrieve the current state of the `driver.js` instance and how to highlight a specific HTML element directly without starting a full tour. It also includes the method for destroying the tour instance.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/api.mdx#_snippet_3

LANGUAGE: javascript
CODE:

```
// Look at the state section of configuration for format of the state
// https://driverjs.com/docs/configuration#state
driverObj.getState();

// Look at the DriveStep section of configuration for format of the step
// https://driverjs.com/docs/configuration/#drive-step-configuration
driverObj.highlight({ /* ... */ }); // Highlight an element

driverObj.destroy(); // Destroy the tour
```

---

TITLE: Retrieving Tour Step and Element Information - JavaScript
DESCRIPTION: This snippet illustrates methods for querying the current state of the tour, such as determining if the current step is the first or last, getting the active step's index, and retrieving configuration details for active or previous steps and their associated HTML elements.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/api.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
driverObj.isFirstStep(); // Is the current step the first step
driverObj.isLastStep(); // Is the current step the last step

driverObj.getActiveIndex(); // Gets the active step index

driverObj.getActiveStep(); // Gets the active step configuration
driverObj.getPreviousStep(); // Gets the previous step configuration
driverObj.getActiveElement(); // Gets the active HTML element
driverObj.getPreviousElement(); // Gets the previous HTML element
```

---

TITLE: Initializing Driver.js with Tour Progress and Navigation Buttons (JavaScript)
DESCRIPTION: This snippet demonstrates how to initialize a `driver.js` tour with progress display enabled and custom navigation buttons. It imports the necessary library and CSS, then configures the `driverObj` to show progress and defines a series of steps for the tour, finally initiating the tour with `drive()`.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/tour-progress.mdx#_snippet_0

LANGUAGE: js
CODE:

```
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
  showProgress: true,
  showButtons: ['next', 'previous'],
  steps: [
    { element: '#tour-example', popover: { title: 'Animated Tour Example', description: 'Here is the code example showing animated tour. Let\'s walk you through it.', side: "left", align: 'start' }},
    { element: 'code .line:nth-child(1)', popover: { title: 'Import the Library', description: 'It works the same in vanilla JavaScript as well as frameworks.', side: "bottom", align: 'start' }},
    { element: 'code .line:nth-child(2)', popover: { title: 'Importing CSS', description: 'Import the CSS which gives you the default styling for popover and overlay.', side: "bottom", align: 'start' }},
    { element: 'code .line:nth-child(4) span:nth-child(7)', popover: { title: 'Create Driver', description: 'Simply call the driver function to create a driver.js instance', side: "left", align: 'start' }},
    { element: 'code .line:nth-child(16)', popover: { title: 'Start Tour', description: 'Call the drive method to start the tour and your tour will be started.', side: "top", align: 'start' }},
  ]
});

driverObj.drive();
```

---

TITLE: Managing Tour State and Configuration - JavaScript
DESCRIPTION: This snippet covers methods for checking if a tour or highlight is active, refreshing the highlight's position, and managing the tour's configuration and steps. It includes methods for getting and setting configuration options and defining tour steps.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/api.mdx#_snippet_2

LANGUAGE: javascript
CODE:

```
// Is the tour or highlight currently active
driverObj.isActive();

// Recalculate and redraw the highlight
driverObj.refresh();

// Look at the configuration section for configuration options
// https://driverjs.com/docs/configuration#driver-configuration
driverObj.getConfig();
driverObj.setConfig({ /* ... */ });

driverObj.setSteps([ /* ... */ ]); // Set the steps
```

---

TITLE: Providing Contextual Help for Form Fields with Driver.js
DESCRIPTION: This snippet initializes Driver.js to provide dynamic, contextual help for form input fields. It attaches focus event listeners to each input, triggering a Driver.js highlight and popover specific to that field, and destroys the Driver.js instance when the form loses focus.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/simple-highlight.mdx#_snippet_2

LANGUAGE: js
CODE:

```
const driverObj = driver({
  popoverClass: "driverjs-theme",
  stagePadding: 0,
  onDestroyed: () => {
    document?.activeElement?.blur();
  }
});

const nameEl = document.getElementById("name");
const educationEl = document.getElementById("education");
const ageEl = document.getElementById("age");
const addressEl = document.getElementById("address");
const formEl = document.querySelector("form");

nameEl.addEventListener("focus", () => {
  driverObj.highlight({
    element: nameEl,
    popover: {
      title: "Name",
      description: "Enter your name here",
    },
  });
});

educationEl.addEventListener("focus", () => {
  driverObj.highlight({
    element: educationEl,
    popover: {
      title: "Education",
      description: "Enter your education here",
    },
  });
});

ageEl.addEventListener("focus", () => {
  driverObj.highlight({
    element: ageEl,
    popover: {
      title: "Age",
      description: "Enter your age here",
    },
  });
});

addressEl.addEventListener("focus", () => {
  driverObj.highlight({
    element: addressEl,
    popover: {
      title: "Address",
      description: "Enter your address here",
    },
  });
});

formEl.addEventListener("blur", () => {
  driverObj.destroy();
});
```

---

TITLE: Including Driver.js via CDN in HTML
DESCRIPTION: This HTML snippet demonstrates how to include the driver.js library and its associated stylesheet directly into a web page using a Content Delivery Network (CDN). This method is suitable for quick integration without a build step.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/installation.mdx#_snippet_1

LANGUAGE: html
CODE:

```
<script src="https://cdn.jsdelivr.net/npm/driver.js@latest/dist/driver.js.iife.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/driver.js@latest/dist/driver.css"/>
```

---

TITLE: Customizing Popover Button Text in Driver.js
DESCRIPTION: This example illustrates how to customize the text displayed on the 'next', 'previous', and 'done' buttons within `driver.js` popovers. By utilizing the `nextBtnText`, `prevBtnText`, and `doneBtnText` configuration options, you can replace the default labels with custom characters or strings, enhancing the user interface.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/buttons.mdx#_snippet_1

LANGUAGE: javascript
CODE:

```
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
  nextBtnText: '—›',
  prevBtnText: '‹—',
  doneBtnText: '✕',
  showProgress: true,
  steps: [
    // ...
  ]
});

driverObj.drive();
```

---

TITLE: Applying Custom CSS Class to Driver.js Popover (JavaScript)
DESCRIPTION: This snippet demonstrates how to apply a custom CSS class to a Driver.js popover using the `popoverClass` option. It initializes a driver instance with `popoverClass: 'driverjs-theme'` to apply a specific theme, then highlights an element with a custom popover. This allows for global or per-step styling overrides.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/styling-popover.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:

```
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
  popoverClass: 'driverjs-theme'
});

driverObj.highlight({
  element: '#demo-theme',
  popover: {
    title: 'Style However You Want',
    description: 'You can use the default class names and override the styles or you can pass a custom class name to the popoverClass option either globally or per step.'
  }
});
```

---

TITLE: Highlighting an Element with Driver.js (CDN Access)
DESCRIPTION: This JavaScript snippet illustrates how to access and use the driver.js library when it's loaded via a CDN. It shows how to retrieve the `driver` object from the `window` global and then use it to highlight an element with a popover, similar to the module import method.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/installation.mdx#_snippet_3

LANGUAGE: js
CODE:

```
const driver = window.driver.js.driver;

const driverObj = driver();

driverObj.highlight({
  element: "#some-element",
  popover: {
    title: "Title",
    description: "Description"
  }
});
```

---

TITLE: Modifying Driver.js Popover DOM with `onPopoverRender` Hook (JavaScript)
DESCRIPTION: This snippet demonstrates using the `onPopoverRender` callback to programmatically modify the Driver.js popover's DOM before it is rendered. It adds a custom 'Go to First' button to the popover's footer, which, when clicked, navigates the tour back to the first step. This hook provides fine-grained control over popover content and interactivity.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/styling-popover.mdx#_snippet_2

LANGUAGE: JavaScript
CODE:

```
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
  // Get full control over the popover rendering.
  // Here we are adding a custom button that takes
  // the user to the first step.
  onPopoverRender: (popover, { config, state }) => {
    const firstButton = document.createElement("button");
    firstButton.innerText = "Go to First";
    popover.footerButtons.appendChild(firstButton);

    firstButton.addEventListener("click", () => {
      driverObj.drive(0);
    });
  },
  steps: [
    // ..
  ]
});

driverObj.drive();
```

---

TITLE: Configuring Popover Classes in Driver.js (JavaScript)
DESCRIPTION: This snippet demonstrates how to apply custom CSS classes to driver.js popovers. The `popoverClass` option can be set globally during driver initialization or individually for specific steps, allowing for flexible styling. This enables developers to target popovers with custom CSS rules.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/theming.mdx#_snippet_0

LANGUAGE: javascript
CODE:

```
const driverObj = driver({
  popoverClass: 'my-custom-popover-class'
});

// or you can also have different classes for different steps
const driverObj2 = driver({
  steps: [
    {
      element: '#some-element',
      popover: {
        title: 'Title',
        description: 'Description',
        popoverClass: 'my-custom-popover-class'
      }
    }
  ],
})
```

---

TITLE: Custom CSS for Driver.js Popover Theme
DESCRIPTION: This CSS snippet defines the styles for the `driverjs-theme` class, which is applied to Driver.js popovers. It customizes various aspects of the popover, including background color, text color, font sizes, button styles, and arrow colors, providing a distinct visual theme.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/styling-popover.mdx#_snippet_1

LANGUAGE: CSS
CODE:

```
.driver-popover.driverjs-theme {
  background-color: #fde047;
  color: #000;
}

.driver-popover.driverjs-theme .driver-popover-title {
  font-size: 20px;
}

.driver-popover.driverjs-theme .driver-popover-title,
.driver-popover.driverjs-theme .driver-popover-description,
.driver-popover.driverjs-theme .driver-popover-progress-text {
  color: #000;
}

.driver-popover.driverjs-theme button {
  flex: 1;
  text-align: center;
  background-color: #000;
  color: #ffffff;
  border: 2px solid #000;
  text-shadow: none;
  font-size: 14px;
  padding: 5px 8px;
  border-radius: 6px;
}

.driver-popover.driverjs-theme button:hover {
  background-color: #000;
  color: #ffffff;
}

.driver-popover.driverjs-theme .driver-popover-navigation-btns {
  justify-content: space-between;
  gap: 3px;
}

.driver-popover.driverjs-theme .driver-popover-close-btn {
  color: #9b9b9b;
}

.driver-popover.driverjs-theme .driver-popover-close-btn:hover {
  color: #000;
}

.driver-popover.driverjs-theme .driver-popover-arrow-side-left.driver-popover-arrow {
  border-left-color: #fde047;
}

.driver-popover.driverjs-theme .driver-popover-arrow-side-right.driver-popover-arrow {
  border-right-color: #fde047;
}

.driver-popover.driverjs-theme .driver-popover-arrow-side-top.driver-popover-arrow {
  border-top-color: #fde047;
}

.driver-popover.driverjs-theme .driver-popover-arrow-side-bottom.driver-popover-arrow {
  border-bottom-color: #fde047;
}
```

---

TITLE: Refining Driver.js Step and Popover Definitions (1.x)
DESCRIPTION: This snippet outlines the modifications to step and popover definitions in Driver.js 1.x. Key changes include `closeBtnText` removal, `element` becoming optional, `className` renamed to `popoverClass`, and the introduction of separate `side` and `align` properties for precise popover positioning. New options like `showProgress` and additional lifecycle hooks are also introduced.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/migrating-from-0x.mdx#_snippet_3

LANGUAGE: diff
CODE:

```
const stepDefinition = {
  popover: {
-   closeBtnText: 'Close', // Removed, close button is an icon
-   element: '.some-element', // Required
+   element: '.some-element', // Optional, if not provided, step will be shown as modal
-   className: 'popover-class',
+   popoverClass: string;
-   showButtons: false,
+   showButtons: ["next", "previous", "close"]; // Array of buttons to show
-   title: '';  // Required
+   title: '';  // Optional
-   description: ''; // Required
+   description: ''; // Optional

-   // position can be left, left-center, left-bottom, top,
-   // top-center, top-right, right, right-center, right-bottom,
-   // bottom, bottom-center, bottom-right, mid-center
-   position: 'left',
+   // Now you need to specify the side and align separately
+   side?: "top" | "right" | "bottom" | "left";
+   align?: "start" | "center" | "end";

+   // New options
+   showProgress?: boolean;
+   progressText?: string;
+   onPopoverRender?: (popover: PopoverDOM, options: { config: Config; state: State }) => void;
+   onNextClick?: (element?: Element, step: DriveStep, options: { config: Config; state: State }) => void
+   onPrevClick?: (element?: Element, step: DriveStep, options: { config: Config; state: State }) => void
+   onCloseClick?: (element?: Element, step: DriveStep, options: { config: Config; state: State }) => void
  }

+ // New hook to control the flow of the driver
+ onDeselected?: (element?: Element, step: DriveStep, options: { config: Config; state: State }) => void;
+ onHighlightStarted?: (element?: Element, step: DriveStep, options: { config: Config; state: State }) => void;
+ onHighlighted?: (element?: Element, step: DriveStep, options: { config: Config; state: State }) => void;
};
```

---

TITLE: Updating Driver.js Configuration Options (1.x)
DESCRIPTION: This snippet details the extensive changes to Driver.js configuration options in version 1.x. It highlights removed options (e.g., `overlayClickNext`, `closeBtnText`), renamed options (e.g., `opacity` to `overlayOpacity`, `className` to `popoverClass`), and new options (e.g., `overlayColor`, `stageRadius`), along with updated event handler signatures and button visibility controls.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/migrating-from-0x.mdx#_snippet_2

LANGUAGE: diff
CODE:

```
const config = {
-  overlayClickNext: false, // Option has been removed
-  closeBtnText: 'Close', // Option has been removed (close button is now an icon)
-  scrollIntoViewOptions: {}, // Option has been renamed
-  opacity: 0.75,
+  overlayOpacity: 0.75,
-  className: 'scoped-class',
+  popoverClass: 'scoped-class',
-  padding: 10,
+  stagePadding: 10,
-  showButtons: false,
+  showButtons: ['next', 'prev', 'close'], // pass an array of buttons to show
-  keyboardControl: true,
+  allowKeyboardControl: true,
-  onHighlightStarted: (Element) {},
+  onHighlightStarted?: (element?: Element, step: DriveStep, options: { config: Config; state: State }) => void;
-  onHighlighted: (Element) {},
+  onHighlighted?: (element?: Element, step: DriveStep, options: { config: Config; state: State }) => void;
-  onDeselected: (Element) {}, // Called when element has been deselected
+  onDeselected?: (element?: Element, step: DriveStep, options: { config: Config; state: State }) => void;

-  onReset: (Element) {},        // Called when overlay is about to be cleared
+  onDestroyStarted?: (element?: Element, step: DriveStep, options: { config: Config; state: State }) => void;
+  onDestroyed?: (element?: Element, step: DriveStep, options: { config: Config; state: State }) => void;
+  onCloseClick?: (element?: Element, step: DriveStep, options: { config: Config; state: State }) => void;

-  onNext: (Element) => {},
-  onPrevious: (Element) => {},
+  // By overriding the default onNextClick and onPrevClick, you control the flow of the driver
+  // Visit for more details: https://driverjs.com/docs/configuration
+  onNextClick?: (element?: Element, step: DriveStep, options: { config: Config; state: State }) => void;
+  onPrevClick?: (element?: Element, step: DriveStep, options: { config: Config; state: State }) => void;

+  // New options added
+  overlayColor?: string;
+  stageRadius?: number;
+  popoverOffset?: number;
+  disableButtons?: ["next", "prev", "close"];
+  showProgress?: boolean;
+  progressText?: string;
+  onPopoverRender?: (popover: PopoverDOM, options: { config: Config; state: State }) => void;
}
```

---

TITLE: Displaying a Modal Popover without Element Highlight in Driver.js
DESCRIPTION: This snippet initializes Driver.js and displays a standalone popover without highlighting any specific element. The popover contains custom HTML content, including an image and styled text, effectively acting as a simple modal or informational display.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/simple-highlight.mdx#_snippet_1

LANGUAGE: js
CODE:

```
const driverObj = driver();

driverObj.highlight({
  popover: {
    description: "<img src='https://i.imgur.com/EAQhHu5.gif' style='height: 202.5px; width: 270px;' /><span style='font-size: 15px; display: block; margin-top: 10px; text-align: center;'>Yet another highlight example.</span>",
  }
})
```

---

TITLE: Configuring a Non-Exitable Tour with driver.js in JavaScript
DESCRIPTION: This snippet initializes a `driver.js` tour with the `allowClose` option set to `false`, preventing users from exiting the tour until all steps are completed. It imports the `driver.js` library and its default CSS, defines a series of steps targeting specific elements, and then starts the tour programmatically.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/prevent-destroy.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:

```
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
  showProgress: true,
  allowClose: false,
  steps: [
    { element: '#prevent-exit', popover: { title: 'Animated Tour Example', description: 'Here is the code example showing animated tour. Let\'s walk you through it.', side: "left", align: 'start' }},
    { element: 'code .line:nth-child(1)', popover: { title: 'Import the Library', description: 'It works the same in vanilla JavaScript as well as frameworks.', side: "bottom", align: 'start' }},
    { element: 'code .line:nth-child(2)', popover: { title: 'Importing CSS', description: 'Import the CSS which gives you the default styling for popover and overlay.', side: "bottom", align: 'start' }},
    { popover: { title: 'Happy Coding', description: 'And that is all, go ahead and start adding tours to your applications.' } }
  ]
});

driverObj.drive();
```

---

TITLE: Configuring driver.js Overlay with Blue Color and Opacity
DESCRIPTION: This JavaScript object literal provides a configuration for driver.js, specifying the `overlayColor` as 'blue' and `overlayOpacity` as 0.3. It illustrates how to easily change the overlay's hue while maintaining a consistent level of transparency.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/styling-overlay.mdx#_snippet_2

LANGUAGE: JavaScript
CODE:

```
{
  overlayColor: 'blue',
  overlayOpacity: 0.3
}
```

---

TITLE: Implementing Confirm on Exit with driver.js in JavaScript
DESCRIPTION: This snippet demonstrates how to use the `onDestroyStarted` hook in `driver.js` to prompt the user for confirmation before exiting a tour. It checks if there are remaining steps and calls `driverObj.destroy()` only if the user confirms or if no more steps are available. This ensures a controlled exit flow.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/confirm-on-exit.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:

```
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const driverObj = driver({
  showProgress: true,
  steps: [
    { element: '#confirm-destroy-example', popover: { title: 'Animated Tour Example', description: 'Here is the code example showing animated tour. Let\'s walk you through it.', side: "left", align: 'start' }},
    { element: 'code .line:nth-child(1)', popover: { title: 'Import the Library', description: 'It works the same in vanilla JavaScript as well as frameworks.', side: "bottom", align: 'start' }},
    { element: 'code .line:nth-child(2)', popover: { title: 'Importing CSS', description: 'Import the CSS which gives you the default styling for popover and overlay.', side: "bottom", align: 'start' }},
    { popover: { title: 'Happy Coding', description: 'And that is all, go ahead and start adding tours to your applications.' } }
  ],
  // onDestroyStarted is called when the user tries to exit the tour
  onDestroyStarted: () => {
    if (!driverObj.hasNextStep() || confirm("Are you sure?")) {
      driverObj.destroy();
    }
  },
});

driverObj.drive();
```

---

TITLE: CSS Classes for Driver.js Popover Elements
DESCRIPTION: This snippet lists the standard CSS classes applied to various parts of a driver.js popover. These classes can be used in conjunction with a custom `popoverClass` to apply specific styles to the popover's wrapper, arrow, title, description, close button, footer, progress text, and navigation buttons.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/theming.mdx#_snippet_1

LANGUAGE: css
CODE:

```
/* Class assigned to popover wrapper */
.driver-popover {}

/* Arrow pointing towards the highlighted element */
.driver-popover-arrow {}

/* Title and description */
.driver-popover-title {}
.driver-popover-description {}

/* Close button displayed on the top right corner */
.driver-popover-close-btn {}

/* Footer of the popover displaying progress and navigation buttons */
.driver-popover-footer {}
.driver-popover-progress-text {}
.driver-popover-prev-btn {}
.driver-popover-next-btn {}
```

---

TITLE: Configuring driver.js Overlay with Red Color and Opacity
DESCRIPTION: This JavaScript object literal demonstrates a configuration for driver.js, setting the `overlayColor` to 'red' and `overlayOpacity` to 0.3. This allows for fine-grained control over both the color and transparency of the overlay when highlighting elements.
SOURCE: https://github.com/kamranahmedse/driver.js/blob/master/docs/src/content/guides/styling-overlay.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:

```
{
  overlayColor: 'red',
  overlayOpacity: 0.3
}
```
