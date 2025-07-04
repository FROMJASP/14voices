// Type definitions for shepherd.js
// Based on shepherd.js v14.5.0

declare module 'shepherd.js' {
  export interface ShepherdTheme {
    classes?: string;
  }

  export interface ShepherdButtonOptions {
    text: string;
    action?: string | (() => void);
    classes?: string;
    secondary?: boolean;
  }

  export interface ShepherdStepAttachTo {
    element: string | HTMLElement;
    on: 'top' | 'bottom' | 'left' | 'right' | 'center';
  }

  export interface ShepherdStepAdvanceOn {
    selector?: string;
    event?: string;
  }

  export interface ShepherdStepWhenOptions {
    show?: (this: Step) => void;
    hide?: (this: Step) => void;
    cancel?: (this: Step) => void;
    complete?: (this: Step) => void;
    destroy?: (this: Step) => void;
  }

  export interface ShepherdStepOptions {
    id?: string;
    attachTo?: ShepherdStepAttachTo;
    advanceOn?: ShepherdStepAdvanceOn;
    beforeShowPromise?: () => Promise<unknown>;
    buttons?: ShepherdButtonOptions[];
    cancelIcon?: {
      enabled: boolean;
      label?: string;
    };
    canClickTarget?: boolean;
    classes?: string;
    highlightClass?: string;
    modalOverlayOpeningPadding?: number;
    modalOverlayOpeningRadius?: number;
    scrollTo?: boolean | ScrollIntoViewOptions;
    scrollToHandler?: (element: HTMLElement) => void;
    showOn?: () => boolean;
    text?: string | string[] | HTMLElement;
    title?: string;
    when?: ShepherdStepWhenOptions;
    arrow?: boolean;
  }

  export interface TourOptions {
    confirmCancel?: boolean;
    confirmCancelMessage?: string;
    classPrefix?: string;
    defaultStepOptions?: ShepherdStepOptions;
    exitOnEsc?: boolean;
    keyboardNavigation?: boolean;
    stepsContainer?: HTMLElement;
    modalContainer?: HTMLElement;
    steps?: ShepherdStepOptions[];
    tourName?: string;
    useModalOverlay?: boolean;
  }

  export class Step {
    constructor(tour: Tour, options: ShepherdStepOptions);

    id: string;
    tour: Tour;
    options: ShepherdStepOptions;
    el?: HTMLElement;
    target?: HTMLElement;

    show(): Promise<void>;
    hide(): void;
    cancel(): void;
    complete(): void;
    scrollTo(): void;
    isOpen(): boolean;
    destroy(): void;
    on(event: string, handler: (...args: unknown[]) => void): void;
    off(event: string, handler?: (...args: unknown[]) => void): void;
    once(event: string, handler: (...args: unknown[]) => void): void;
    getTarget(): HTMLElement | null;
  }

  export class Tour {
    constructor(options?: TourOptions);

    options: TourOptions;
    steps: Step[];
    currentStep?: Step;

    addStep(options: ShepherdStepOptions): Step;
    addSteps(steps: ShepherdStepOptions[]): void;
    back(): void;
    cancel(): void;
    complete(): void;
    getCurrentStep(): Step | undefined;
    hide(): void;
    isActive(): boolean;
    next(): void;
    removeStep(name: string): void;
    show(name?: string | number): void;
    start(): void;
    on(event: string, handler: (...args: unknown[]) => void): void;
    off(event: string, handler?: (...args: unknown[]) => void): void;
    once(event: string, handler: (...args: unknown[]) => void): void;
  }

  const Shepherd: {
    Tour: typeof Tour;
    Step: typeof Step;
  };

  export default Shepherd;
}
