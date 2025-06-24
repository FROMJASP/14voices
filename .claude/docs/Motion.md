TITLE: Basic Motion Component Usage in Vue Template
DESCRIPTION: Demonstrates the basic structure of using the `<motion.div />` component within a Vue template, representing a standard DOM element with animation capabilities.
SOURCE: https://motion.dev/docs/docs/vue

LANGUAGE: Vue
CODE:
```
<template>
  <motion.div />
</template>
```

----------------------------------------

TITLE: Using Stable ID as Key in AnimatePresence (Good)
DESCRIPTION: Shows the recommended approach for using keys with `AnimatePresence` by using a unique and stable identifier like `item.id`. This ensures that `AnimatePresence` can correctly track components for exit animations even if the list changes.
SOURCE: https://motion.dev/docs/docs/react-animate-presence

LANGUAGE: JSX
CODE:
```
<AnimatePresence>
  {items.map((item) => (
    <Component key={item.id} />
  ))}
</AnimatePresence>
```

----------------------------------------

TITLE: Animating Component with Animate Prop - React
DESCRIPTION: Shows how to apply a simple animation by setting target values directly in the `animate` prop. The component will animate to these values when they change.
SOURCE: https://motion.dev/docs/docs/react-quick-start

LANGUAGE: jsx
CODE:
```
<motion.ul animate={{ rotate: 360 }} />
```

----------------------------------------

TITLE: Applying Simple Layout Animations
DESCRIPTION: Demonstrates the ease of animating layout changes within the same element by simply adding the `layout` prop.
SOURCE: https://motion.dev/docs/docs/react-quick-start

LANGUAGE: React
CODE:
```
<motion.div layout />
```

----------------------------------------

TITLE: Animating to Target Values with the animate Prop
DESCRIPTION: Explains how to use the `animate` prop with an object of target values to define the state the component should animate to on mount and update.
SOURCE: https://motion.dev/docs/docs/react-motion-component

LANGUAGE: JavaScript
CODE:
```
<motion.div
  initial={{ boxShadow: "0px 0px #000" }}
  animate={{ boxShadow: "10px 10px #000" }}
/>
```

----------------------------------------

TITLE: Enabling Layout Animations (Motion 2+)
DESCRIPTION: Shows the current method for enabling layout animations in Framer Motion 2 and later using the simplified `layout` prop.
SOURCE: https://motion.dev/docs/docs/react-upgrade-guide

LANGUAGE: JSX
CODE:
```
// After
<motion.div layout />
```

----------------------------------------

TITLE: Applying Variants Prop to Motion Component in Vue
DESCRIPTION: Demonstrates passing the defined variants object to a motion component using the :variants prop, making the named targets available for use by the component and its children.
SOURCE: https://motion.dev/docs/docs/vue-animation

LANGUAGE: Vue
CODE:
```
<motion.div :variants="variants" />
```

----------------------------------------

TITLE: Basic motion Component Usage
DESCRIPTION: Illustrates the most basic usage of a `motion` component, showing that it can be used like a standard HTML or SVG element.
SOURCE: https://motion.dev/docs/docs/react-motion-component

LANGUAGE: JSX
CODE:
```
<motion.div className="box" />
```

----------------------------------------

TITLE: Correct Conditional Rendering of AnimatePresence Children (React)
DESCRIPTION: Demonstrates the correct pattern where `AnimatePresence` is always rendered, and only its children are conditionally rendered. This allows `AnimatePresence` to detect when a child is removed from the React tree and trigger the exit animation.
SOURCE: https://motion.dev/docs/docs/react-animate-presence

LANGUAGE: JSX
CODE:
```
<AnimatePresence>
  {isVisible && <Component />}
</AnimatePresence>
```

----------------------------------------

TITLE: Accessing Animation Controls (JavaScript)
DESCRIPTION: Illustrates how the `animate` function returns an object providing playback controls, allowing manipulation of the animation after it has been created, such as setting time or stopping.
SOURCE: https://motion.dev/docs/docs/animate

LANGUAGE: JavaScript
CODE:
```
const animation = animate(element, { opacity: 1 })

animation.time = 0.5
animation.stop()
```

----------------------------------------

TITLE: Defining Motion Variants Object (React)
DESCRIPTION: Shows the structure for defining a JavaScript object containing named animation targets, known as variants, which can be reused and orchestrated.
SOURCE: https://motion.dev/docs/docs/react-animation

LANGUAGE: javascript
CODE:
```
const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
}
```

----------------------------------------

TITLE: Delaying an animation using animate function in JavaScript
DESCRIPTION: Delays the start of an animation by a specified duration in seconds. A negative value starts the animation partway through.
SOURCE: https://motion.dev/docs/docs/react-transitions

LANGUAGE: javascript
CODE:
```
animate(element, { filter: "blur(10px)" }, { delay: 0.3 })
```

----------------------------------------

TITLE: Using AnimatePresence for Exit Animations (Vue)
DESCRIPTION: Demonstrates how to wrap a component with `AnimatePresence` and use the `:exit` prop on a `Motion` component to perform exit animations when the component is conditionally rendered (`v-if`). This pattern is essential for animating components that are being removed from the DOM.
SOURCE: https://motion.dev/docs/docs/vue-radix

LANGUAGE: Vue
CODE:
```
<template>
  <AnimatePresence>
    <Motion
      v-if="isOpen"
      :exit="{ opacity: 0 }"
    />
  </AnimatePresence>
</template>
```

----------------------------------------

TITLE: Importing Motion Component in React
DESCRIPTION: Shows the standard way to import the `motion` component for use in both client-side React applications and React Server Components. Requires the 'motion/react' or 'motion/react-client' package.
SOURCE: https://motion.dev/docs/docs/react-motion-component

LANGUAGE: JavaScript
CODE:
```
// React
import { motion } from "motion/react"

// React Server Components
import * as motion from "motion/react-client"
```

----------------------------------------

TITLE: Importing motion Component (React)
DESCRIPTION: Provides the standard import statement for the `motion` component when used in a typical React application.
SOURCE: https://motion.dev/docs/docs/react-motion-component

LANGUAGE: JavaScript
CODE:
```
// React
import { motion } from "motion/react"
```

----------------------------------------

TITLE: Framer Motion Drag and whileDrag (JSX)
DESCRIPTION: Demonstrates enabling dragging with the `drag` prop and animating the component while dragging using the `whileDrag` prop on a `motion.div`.
SOURCE: https://motion.dev/docs/docs/react-gestures

LANGUAGE: JSX
CODE:
```
<motion.div drag whileDrag={{ scale: 1.2, backgroundColor: "#f00" }} />
```

----------------------------------------

TITLE: Applying Direct Animation Targets with whileHover/whileTap
DESCRIPTION: Illustrates using `whileHover` and `whileTap` props to define direct animation targets (scale, transition) for a Motion button component when the corresponding gestures are active.
SOURCE: https://motion.dev/docs/docs/react-gestures

LANGUAGE: JavaScript
CODE:
```
<motion.button
  whileHover={{
    scale: 1.2,
    transition: { duration: 1 },
  }}
  whileTap={{ scale: 0.9 }}
/>
```

----------------------------------------

TITLE: Implementing Spring Animations in Motion JavaScript
DESCRIPTION: Shows how to create physics-based spring animations using the Motion library. This involves importing the `spring` type and providing it to the `type` option, along with spring-specific options like `stiffness`, in the `animate` function.
SOURCE: https://motion.dev/docs/docs/improvements-to-the-web-animations-api-dx

LANGUAGE: JavaScript
CODE:
```
import { animate } from "motion/dom"
import { spring } from "motion"

animate(
  "li",
  { transform: "translateX(100px)" },
  { type: spring, stiffness: 400 }
)
```

----------------------------------------

TITLE: Using Tween Transition Type in React
DESCRIPTION: Example of setting the `type` property of a transition to "tween", specifying a duration for a time-based animation.
SOURCE: https://motion.dev/docs/docs/react-transitions

LANGUAGE: React
CODE:
```
<motion.path
  animate={{ pathLength: 1 }}
  transition={{ duration: 2, type: "tween" }}
/>
```

----------------------------------------

TITLE: Basic Scroll-Triggered Animation with whileInView (React/Framer Motion)
DESCRIPTION: Shows the simplest use case of the whileInView prop on a motion component to trigger an animation (fading in opacity) when the element enters the viewport.
SOURCE: https://motion.dev/docs/docs/react-scroll-animations

LANGUAGE: javascript
CODE:
```
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
/>
```

----------------------------------------

TITLE: Passing Motion Value to style Prop (React)
DESCRIPTION: Shows how to pass a created motion value to a `motion` component's `style` prop to control CSS properties.
SOURCE: https://motion.dev/docs/docs/react-motion-value

LANGUAGE: JSX
CODE:
```
<motion.li style={{ x }} />
```

----------------------------------------

TITLE: Using Basic Motion Component in React
DESCRIPTION: Demonstrates the fundamental usage of the `<motion.div />` component, which is a standard DOM element enhanced with animation capabilities by Motion for React. It serves as the base for creating animatable elements.
SOURCE: https://motion.dev/docs/docs/react-quick-start

LANGUAGE: JSX
CODE:
```
<motion.div />
```

----------------------------------------

TITLE: Animating Layout on Component Unmount with AnimatePresence in Vue
DESCRIPTION: Wrap a conditionally rendered component (`v-if`) with `AnimatePresence` to keep it mounted in the DOM until its exit animation, including layout animations driven by `layoutId`, is complete.
SOURCE: https://motion.dev/docs/docs/vue-layout-animations

LANGUAGE: Vue
CODE:
```
<AnimatePresence>
  <motion.div v-if="isOpen" layoutId="modal" />
</AnimatePresence>
```

----------------------------------------

TITLE: Importing Motion Component in React
DESCRIPTION: Shows the standard ES module import statement for bringing the core `motion` component into a React file. This allows you to use `<motion />` components in your application. Requires Motion library installed.
SOURCE: https://motion.dev/docs/docs/react-quick-start

LANGUAGE: javascript
CODE:
```
import { motion } from "motion/react"
```

----------------------------------------

TITLE: Basic motion.div Component Usage (Vue)
DESCRIPTION: Demonstrates using the `motion.div` component directly in a Vue template, similar to using a standard HTML `div` element.
SOURCE: https://motion.dev/docs/docs/vue-motion-component

LANGUAGE: vue
CODE:
```
<motion.div class="box" />
```

----------------------------------------

TITLE: Basic Motion Component Usage (Vue Template)
DESCRIPTION: Shows the fundamental structure of using a `<motion />` component in a Vue template, acting as a supercharged DOM element.
SOURCE: https://motion.dev/docs/docs/vue

LANGUAGE: HTML
CODE:
```
<template>
  <motion.div />
</template>
```

----------------------------------------

TITLE: Using spring with Motion's animate function - JavaScript
DESCRIPTION: Demonstrates how to use the `spring` easing function with Motion's `animate` function to apply a spring animation to an element's transform property. Configures the spring with `bounce` and `duration` options.
SOURCE: https://motion.dev/docs/docs/spring

LANGUAGE: JavaScript
CODE:
```
import { animate } from "motion/mini"
import { spring } from "motion"

animate(
  element,
  { transform: "translateX(100px)" },
  { type: spring, bounce: 0.3, duration: 0.8 }
)
```

----------------------------------------

TITLE: Using animate Prop with Animation Targets
DESCRIPTION: Defines the target state for animation on component mount and updates using objects for both `initial` and `animate` props.
SOURCE: https://motion.dev/docs/docs/react-motion-component

LANGUAGE: JSX
CODE:
```
<motion.div
  initial={{ boxShadow: "0px 0px #000" }}
  animate={{ boxShadow: "10px 10px #000" }}
/>
```

----------------------------------------

TITLE: Mapping Motion Value Output with mapValue
DESCRIPTION: This snippet demonstrates how to use mapValue to transform a numerical motion value's output. It shows mapping a value 'x' to control opacity based on a numerical range and then mapping the resulting opacity value to control background color based on a color range.
SOURCE: https://motion.dev/docs/docs/map-value

LANGUAGE: JavaScript
CODE:
```
const x = motionValue(100)

// Fade out outside the 0-100 range
const opacity = mapValue(x, [-100, 0, 100, 200], [0, 1, 1, 0])

// Shift color when fading out
const backgroundColor = mapValue(opacity, [0, 1], ["#f00", "#00f"])
```

----------------------------------------

TITLE: Initialize and Pass Drag Controls
DESCRIPTION: Initializes the drag controls using the useDragControls hook and associates them with a draggable motion component by passing the controls object to the dragControls prop.
SOURCE: https://motion.dev/docs/docs/react-use-drag-controls

LANGUAGE: React
CODE:
```
const controls = useDragControls()

return <motion.div drag dragControls={controls} />
```

----------------------------------------

TITLE: Framer Motion whileHover/whileTap with Targets (JSX)
DESCRIPTION: Demonstrates using the `whileHover` and `whileTap` props on a `motion.button` component to animate directly to target values when the respective gestures are active.
SOURCE: https://motion.dev/docs/docs/react-gestures

LANGUAGE: JSX
CODE:
```
<motion.button
  whileHover={{
    scale: 1.2,
    transition: { duration: 1 },
  }}
  whileTap={{ scale: 0.9 }}
/>
```

----------------------------------------

TITLE: Basic prop-based animation in Vue
DESCRIPTION: Demonstrates animating a CSS property (`opacity`) on a `motion.div` component by setting the `animate` prop. Motion automatically handles the animation when the value in the `animate` prop changes.
SOURCE: https://motion.dev/docs/docs/vue-animation

LANGUAGE: Vue
CODE:
```
<motion.div :animate="{ opacity: 1 }" />
```

----------------------------------------

TITLE: Adapting Animation with useReducedMotion in React
DESCRIPTION: Illustrates how to use the useReducedMotion hook within a React component to conditionally modify animation properties, such as replacing an x-axis animation with a simple opacity change when reduced motion is enabled.
SOURCE: https://motion.dev/docs/docs/react-use-reduced-motion

LANGUAGE: javascript
CODE:
```
export function Sidebar({ isOpen }) {
  const shouldReduceMotion = useReducedMotion()
  const closedX = shouldReduceMotion ? 0 : "-100%"

  return (
    <motion.div animate={{
      opacity: isOpen ? 1 : 0,
      x: isOpen ? 0 : closedX
    }} />
  )
}
```

----------------------------------------

TITLE: Installing Motion via npm (Shell)
DESCRIPTION: The command-line instruction to install the 'motion' library as a project dependency using the npm package manager. This is the standard way to include the library in a Node.js or front-end project using a build tool.
SOURCE: https://motion.dev/docs/docs/quick-start

LANGUAGE: Shell
CODE:
```
npm install motion
```

----------------------------------------

TITLE: Passing Motion Value to Style (Vue)
DESCRIPTION: Shows how to bind a motion value to a CSS style property (`x` in this case) on a `motion` component using the `:style` binding in Vue.
SOURCE: https://motion.dev/docs/docs/vue-motion-value

LANGUAGE: html
CODE:
```
<motion.li :style="{ x }" />
```

----------------------------------------

TITLE: Enabling Basic Layout Animation in Motion.div (React)
DESCRIPTION: Apply the `layout` prop to a `motion.div` component to automatically animate changes in its layout properties. This simple prop enables smooth transitions for position and size changes.
SOURCE: https://motion.dev/docs/docs/react-layout-animations

LANGUAGE: JSX
CODE:
```
<motion.div layout />
```

----------------------------------------

TITLE: Install Motion for Vue (npm)
DESCRIPTION: Install the Motion for Vue library into your project using the npm package manager.
SOURCE: https://motion.dev/docs/docs/vue

LANGUAGE: Shell
CODE:
```
npm install motion-v
```

----------------------------------------

TITLE: Implementing Exit Animations with AnimatePresence
DESCRIPTION: Explains how to animate components when they are removed from the DOM by wrapping them in `<AnimatePresence>` and defining the exit state using the `exit` prop on the `motion` component.
SOURCE: https://motion.dev/docs/docs/react-quick-start

LANGUAGE: React
CODE:
```
<AnimatePresence>
  {show ? <motion.div key="box" exit={{ opacity: 0 }} /> : null}
</AnimatePresence>
```

----------------------------------------

TITLE: Pass Variants to Motion Component in Vue
DESCRIPTION: Demonstrates how to pass the defined variants object to a `motion` component using the `variants` prop.
SOURCE: https://motion.dev/docs/docs/vue-animation

LANGUAGE: html
CODE:
```
<motion.div :variants="variants" />
```

----------------------------------------

TITLE: Optimizing Performance with useMotionValue React/JavaScript
DESCRIPTION: Demonstrates how to use the `useMotionValue` hook to manage animatable values outside the React render cycle. Updating a motion value directly (`x.set(100)`) avoids triggering component re-renders, improving performance.
SOURCE: https://motion.dev/docs/docs/react-motion-component

LANGUAGE: JavaScript
CODE:
```
const x = useMotionValue(0)

useEffect(() => {
  // Won't trigger a re-render!
  const timeout = setTimeout(() => x.set(100), 1000)

  return () => clearTimeout(timeout)
}, [])

return <motion.div style={{ x }} />
```

----------------------------------------

TITLE: Initializing a Motion Value
DESCRIPTION: Demonstrates how to create a basic motion value `x` initialized to 0 using `useMotionValue`. This value serves as the input for subsequent transformations.
SOURCE: https://motion.dev/docs/docs/vue-use-transform

LANGUAGE: JavaScript
CODE:
```
const x = useMotionValue(0)
```

----------------------------------------

TITLE: Animating Motion Component with Animate Prop
DESCRIPTION: Shows how to apply an animation to a `<motion />` component by setting target values directly in the `animate` prop. The component will animate when these values change.
SOURCE: https://motion.dev/docs/docs/vue

LANGUAGE: Vue
CODE:
```
<motion.ul :animate="{ rotate: 360 }" />
```

----------------------------------------

TITLE: Basic Motion Component Usage - Vue Template
DESCRIPTION: Demonstrates the basic usage of the `<motion />` component, which is a standard DOM element enhanced with animation capabilities.
SOURCE: https://motion.dev/docs/docs/vue

LANGUAGE: Vue Template
CODE:
```
<template>
  <motion.div />
</template>
```

----------------------------------------

TITLE: Basic Usage of Motion animate() (JavaScript)
DESCRIPTION: Introduces the basic usage of the `animate()` function from the Motion library, targeting elements via a CSS selector.
SOURCE: https://motion.dev/docs/docs/animate

LANGUAGE: JavaScript
CODE:
```
animate("li", { opacity: 0 })
```

----------------------------------------

TITLE: Animating Based on React State with Variants
DESCRIPTION: Provides an example of using React state directly in the 'animate' prop, leveraging variants to define different animation targets corresponding to different state values.
SOURCE: https://motion.dev/docs/docs/react-animation

LANGUAGE: jsx
CODE:
```
const [status, setStatus] = useState<"inactive" | "active" | "complete">(
  "inactive"
);

<motion.div
  animate={status} // pass in our React state!
  variants={{
    inactive: { scale: 0.9, color: "var(--gray-500)" },
    active: { scale: 1, color: "var(--blue-500)" },
    complete: { scale: 1, color: "var(--blue-500)" }
  }}
>
  <motion.svg
    path={checkmarkPath}
    variants={{
      inactive: { pathLength: 0 },
      active: { pathLength: 0 },
      complete: { pathLength: 1}
    }}
  />
</motion.div>
```

----------------------------------------

TITLE: Basic Animation with Animate Prop (JSX)
DESCRIPTION: Demonstrates the simplest way to animate a 'motion.div' component by setting the target value ('opacity: 1') directly on the 'animate' prop. Motion automatically handles the animation when the prop changes.
SOURCE: https://motion.dev/docs/docs/react-animation

LANGUAGE: JSX
CODE:
```
<motion.div animate={{ opacity: 1 }} />
```

----------------------------------------

TITLE: Animating Layout Changes with layoutId React/JSX
DESCRIPTION: Demonstrates how to use the `layoutId` prop on `motion` components to animate layout changes. When a new element with a matching `layoutId` enters the DOM, it animates from the size/position of an existing element with the same ID.
SOURCE: https://motion.dev/docs/docs/react-motion-component

LANGUAGE: JSX
CODE:
```
{items.map(item => (
   <motion.li layout>
      {item.name}
      {item.isSelected && <motion.div layoutId="underline" />}
   </motion.li>
))}
```

----------------------------------------

TITLE: Enabling Drag and whileDrag Animation with Motion
DESCRIPTION: Illustrates how to make a Motion component draggable by setting the `drag` prop and applying an animation using the `whileDrag` prop while the component is being dragged. By default, an inertia animation occurs when dragging ends.
SOURCE: https://motion.dev/docs/docs/react-gestures

LANGUAGE: jsx
CODE:
```
<motion.div drag whileDrag={{ scale: 1.2, backgroundColor: "#f00" }} />
```

----------------------------------------

TITLE: Scroll-Triggered Animations with useInView (React)
DESCRIPTION: Illustrates how to combine useAnimate with the useInView hook to trigger animations on the scoped element or its children when the element scrolls into the viewport.
SOURCE: https://motion.dev/docs/docs/react-use-animate

LANGUAGE: JavaScript
CODE:
```
import { useAnimate, useInView } from "motion/react"

function Component() {
  const [scope, animate] = useAnimate()
  const isInView = useInView(scope)

  useEffect(() => {
     if (isInView) {
       animate(scope.current, { opacity: 1 })
     }
  }, [isInView])

  return (
    <ul ref={scope}>
      <li />
      <li />
      <li />
    </ul>
  )
}
```

----------------------------------------

TITLE: Staggering Child Animations with staggerChildren (Vue)
DESCRIPTION: Applies a staggered delay to child animations based on their order. Each subsequent child's animation is delayed by the specified duration in seconds, in addition to any delayChildren.
SOURCE: https://motion.dev/docs/docs/vue-transitions

LANGUAGE: JavaScript
CODE:
```
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5
    }
  }
}

const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1 }
}
```

LANGUAGE: Vue
CODE:
```
<template>
  <motion.ol
    :variants="container"
    initial="hidden"
    animate="show"
  >
    <motion.li :variants="item" />
    <motion.li :variants="item" />
  </motion.ol>
</template>
```

----------------------------------------

TITLE: Using Variant Labels for Animation in Vue
DESCRIPTION: Shows how to trigger animations by referencing the named variants defined in the :variants prop using string labels in props like initial and animate.
SOURCE: https://motion.dev/docs/docs/vue-animation

LANGUAGE: Vue
CODE:
```
<motion.div
  :variants="variants"
  initial="hidden"
  animate="visible"
/>
```

----------------------------------------

TITLE: Setting Initial State with an Object - Vue
DESCRIPTION: Demonstrates setting the `initial` prop with an object to define the starting visual state of the component before any animations begin.
SOURCE: https://motion.dev/docs/docs/vue-motion-component

LANGUAGE: html
CODE:
```
<motion.section :initial="{ opacity: 0, x: 0 }" />
```

----------------------------------------

TITLE: Smooth Scroll Progress with useSpring (Vue)
DESCRIPTION: Demonstrates how to use the useSpring hook to smooth the scrollYProgress motion value obtained from useScroll. The smoothed value is then applied to the scaleX style of a motion.div component, creating a smooth progress bar effect. Requires useScroll and useSpring from the motion library.
SOURCE: https://motion.dev/docs/docs/vue-scroll-animations

LANGUAGE: Vue
CODE:
```
<script setup>
const { scrollYProgress } = useScroll();
const scaleX = useSpring(scrollYProgress, {
  stiffness: 100,
  damping: 30,
  restDelta: 0.001
})
</script>

<template>
 <motion.div :style="{ scaleX }" />
</template>
```

----------------------------------------

TITLE: Conditionally Animate with Opacity or Transform using useReducedMotion in React
DESCRIPTION: Provides an example of using the `useReducedMotion` hook to conditionally apply different animation properties based on the user's preference. It shows how to animate opacity instead of transform (like x or y position) when Reduced Motion is enabled, mimicking common OS behavior for transitions.
SOURCE: https://motion.dev/docs/docs/react-accessibility

LANGUAGE: javascript
CODE:
```
function Sidebar({ isOpen }) {
  const shouldReduceMotion = useReducedMotion()
  let animate

  if (isOpen) {
    animate = shouldReduceMotion ? { opacity: 1 } : { x: 0 }
  } else {
    animate = shouldReduceMotion
      ? { opacity: 0 }
      : { x: "-100%" }
  }

  return <motion.div animate={animate} />
}
```

----------------------------------------

TITLE: Enabling Basic Layout Animation with Layout Prop
DESCRIPTION: Applies the `layout` prop to a `<motion />` component to automatically animate changes in its position or size using transforms, enabling smooth layout transitions.
SOURCE: https://motion.dev/docs/docs/vue

LANGUAGE: Vue
CODE:
```
<motion.div layout />
```

----------------------------------------

TITLE: Animating Component Exit with AnimatePresence
DESCRIPTION: Illustrates how to use the `exit` prop within an `AnimatePresence` component to define an animation that runs when a component is removed from the React tree. The component must be a direct child of `AnimatePresence`.
SOURCE: https://motion.dev/docs/docs/react-motion-component

LANGUAGE: JavaScript
CODE:
```
<AnimatePresence>
  {isVisible && (
    <ul key="list">
      <motion.li exit={{ opacity: 0 }} />
    </ul>
  )}
</AnimatePresence>
```

----------------------------------------

TITLE: Enabling Basic Layout Animation with Motion (JSX)
DESCRIPTION: Apply the `layout` prop to a Motion component. This automatically enables smooth animations for layout changes like size, position, or flex/grid properties when the component re-renders due to state changes.
SOURCE: https://motion.dev/docs/docs/react-layout-animations

LANGUAGE: jsx
CODE:
```
<motion.div layout />
```

----------------------------------------

TITLE: Link Scroll Progress to Style in Vue
DESCRIPTION: Demonstrates how to link the scrollYProgress motion value obtained from the useScroll hook directly to a CSS style property, such as scaleX, on a motion.div component to create a scroll-linked animation.
SOURCE: https://motion.dev/docs/docs/vue-scroll-animations

LANGUAGE: Vue
CODE:
```
<script>
import { useScroll } from "motion-v"
const { scrollYProgress } = useScroll();
</script>

<template>
  <motion.div :style="{ scaleX: scrollYProgress }" />
</template>
```

----------------------------------------

TITLE: Basic motion Component Usage - Vue
DESCRIPTION: Illustrates the basic usage of a `motion` component, treating it like a standard HTML element component (`motion.div`) within a Vue template.
SOURCE: https://motion.dev/docs/docs/vue-motion-component

LANGUAGE: html
CODE:
```
<motion.div class="box" />
```

----------------------------------------

TITLE: Basic Usage of motion.div Component in Vue
DESCRIPTION: This snippet demonstrates the basic usage of the `motion.div` component within a Vue template, treating it similarly to a standard HTML `div` element.
SOURCE: https://motion.dev/docs/docs/vue-motion-component

LANGUAGE: Vue
CODE:
```
<motion.div class="box" />
```

----------------------------------------

TITLE: Animating MotionValue with Vue Composition API
DESCRIPTION: Demonstrates how to create a MotionValue, animate it using the `animate` function, and display its value in a component using `RowValue`. It also shows how to manage the animation lifecycle using Vue's `onMount` and `onUnmount` hooks.
SOURCE: https://motion.dev/docs/docs/vue-animation

LANGUAGE: Vue
CODE:
```
<script setup>
  import { useMotionValue, motion, animate, RowValue } from "motion-v"
  import { onMount, onUnmount } from "vue"

  const count = useMotionValue(0)
  let controls

  onMount(()=>{
    controls = animate(count, 100, { duration: 5 })
  })

  onUnmount(()=>{
    controls.stop()
  })
</script>

<template>
 <motion.pre><RowValue :value="count"/></motion.pre>
</template>
```

----------------------------------------

TITLE: Updating Style with useMotionValue for Performance - Vue
DESCRIPTION: Shows how to use the `useMotionValue` hook to manage animated values outside the Vue reactivity system, preventing unnecessary component re-renders when updating styles.
SOURCE: https://motion.dev/docs/docs/vue-motion-component

LANGUAGE: javascript
CODE:
```
<script setup>
  import { useMotionValue } from "motion-v"

  const x = useMotionValue(0)
  let timeout;

  onMounted(() => {
    // Won't trigger a re-render!
    timeout = setTimeout(() => x.set(100), 1000)
  })

  onUnmounted(()=>{
    clearTimeout(timeout)
  })
</script>
```

LANGUAGE: html
CODE:
```
<template>
   <motion.div :style="{ x }" />
</template>
```

----------------------------------------

TITLE: Implementing Exit Animations with AnimatePresence in Vue
DESCRIPTION: Demonstrates how to use the AnimatePresence component to keep an element in the DOM while it performs an exit animation when its v-if condition becomes false. Requires the AnimatePresence component from Motion.
SOURCE: https://motion.dev/docs/docs/vue-animation

LANGUAGE: Vue
CODE:
```
<AnimatePresence>
    <motion.div
      v-if="isVisible"
      key="modal"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
    />
</AnimatePresence>
```

----------------------------------------

TITLE: Creating a Transformed Motion Value
DESCRIPTION: Shows the basic syntax for creating a new motion value called `opacity` by transforming an existing motion value `x` based on defined input and output ranges.
SOURCE: https://motion.dev/docs/docs/vue-use-transform

LANGUAGE: JavaScript
CODE:
```
const opacity = useTransform(x, input, output)
```

----------------------------------------

TITLE: Updating a Motion Value
DESCRIPTION: Update the state of a motion value using the `set` method. Changes are batched and applied to the DOM on the next animation frame.
SOURCE: https://motion.dev/docs/docs/vue-motion-value

LANGUAGE: JavaScript
CODE:
```
x.set(100)
```

----------------------------------------

TITLE: Basic Usage of motion.div Component in React
DESCRIPTION: Demonstrates the fundamental usage of a `motion` component, specifically `motion.div`, as a standard React element. It can be used like any regular HTML or SVG component.
SOURCE: https://motion.dev/docs/docs/react-motion-component

LANGUAGE: React
CODE:
```
<motion.div className="box" />
```

----------------------------------------

TITLE: Basic scroll() Usage with Callback
DESCRIPTION: Illustrates the fundamental usage of the `scroll()` function by providing a callback that receives the current scroll progress value (between 0 and 1) whenever the scroll position changes.
SOURCE: https://motion.dev/docs/docs/scroll

LANGUAGE: JavaScript
CODE:
```
scroll(progress => console.log(progress))
```

----------------------------------------

TITLE: Using Variants for Exit Animations with AnimatePresence
DESCRIPTION: Similar to 'initial' and 'animate', the 'exit' prop can reference a variant label defined in a variants object. This allows for more complex or coordinated exit animations, potentially with transitions.
SOURCE: https://motion.dev/docs/docs/react-animate-presence

LANGUAGE: javascript
CODE:
```
const modalVariants = {
  visible: { opacity: 1, transition: { when: "beforeChildren" } },
  hidden: { opacity: 0, transition: { when: "afterChildren" } }
}

function Modal({ children }) {
  return (
    <motion.div initial="hidden" animate="visible" exit="hidden">
      {children}
    </motion.div>
  )
}
```

----------------------------------------

TITLE: Using scrollYProgress for Scale Animation (React)
DESCRIPTION: Demonstrates how to use the `scrollYProgress` motion value returned by `useScroll` to animate the `scaleX` property of a `motion.div` element, creating a scroll-linked progress bar effect.
SOURCE: https://motion.dev/docs/docs/react-use-scroll

LANGUAGE: javascript
CODE:
```
const { scrollYProgress } = useScroll()

return <motion.div style={{ scaleX: scrollYProgress }} />
```

----------------------------------------

TITLE: Setting animate Prop as Animation Target
DESCRIPTION: Shows how to define the component's target visual state by providing an animation target object directly to the `animate` prop.
SOURCE: https://motion.dev/docs/docs/react-motion-component

LANGUAGE: JSX
CODE:
```
<motion.div
  initial={{ boxShadow: "0px 0px #000" }}
  animate={{ boxShadow: "10px 10px #000" }}
/>
```

----------------------------------------

TITLE: Install Motion for Vue via npm
DESCRIPTION: This command installs the Motion for Vue library using the npm package manager. It is the standard way to add Motion to your Vue project as a dependency.
SOURCE: https://motion.dev/docs/docs/vue

LANGUAGE: shell
CODE:
```
npm install motion-v
```

----------------------------------------

TITLE: Correct Conditional Rendering with AnimatePresence (Vue)
DESCRIPTION: Demonstrates the correct way to use AnimatePresence with conditional rendering. By placing the conditional (v-if) on the child component inside AnimatePresence, AnimatePresence remains mounted and can detect when the child is removed, triggering the exit animation.
SOURCE: https://motion.dev/docs/docs/vue-animate-presence

LANGUAGE: html
CODE:
```
<AnimatePresence>
  <Component v-if="isVisible" />
</AnimatePresence>
```

----------------------------------------

TITLE: Defining Explicit Initial State for Enter Animation (JSX)
DESCRIPTION: Demonstrates how to define an explicit initial state for a component's first render using the `initial` prop. When the component mounts, it will automatically animate from the values specified in `initial` (opacity 0, scale 0) to the values in `animate` (opacity 1, scale 1).
SOURCE: https://motion.dev/docs/docs/react-animation

LANGUAGE: jsx
CODE:
```
<motion.li
  initial={{ opacity: 0, scale: 0 }}
  animate={{ opacity: 1, scale: 1 }}
/>
```

----------------------------------------

TITLE: Animating on Component Mount (Enter Animation)
DESCRIPTION: Shows how to define an animation that runs when the component first enters the DOM by providing starting values via the `initial` prop and target values via the `animate` prop.
SOURCE: https://motion.dev/docs/docs/react-quick-start

LANGUAGE: React
CODE:
```
<motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} />
```

----------------------------------------

TITLE: Implementing Exit Animation with AnimatePresence (JSX)
DESCRIPTION: Illustrates how to use the `AnimatePresence` component to enable exit animations. When a `motion` component is removed from the DOM (e.g., when `isVisible` becomes false), `AnimatePresence` keeps it mounted temporarily to perform the animation defined in the `exit` prop (opacity 0). A unique `key` is required for the animating component within `AnimatePresence`.
SOURCE: https://motion.dev/docs/docs/react-animation

LANGUAGE: jsx
CODE:
```
<AnimatePresence>
  {isVisible && (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )}
</AnimatePresence>
```