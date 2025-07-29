import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Custom render function that includes common providers
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  // Add any global providers here (e.g., Theme, Router, etc.)
  // For now, we'll just use the basic render
  return render(ui, options);
}

// Re-export everything
export * from '@testing-library/react';
export { renderWithProviders as render };

// Helper to find elements by partial class name
export const findByPartialClassName = (container: HTMLElement, partialClass: string) => {
  return Array.from(container.querySelectorAll('*')).find((element) =>
    element.className.includes(partialClass)
  );
};

// Helper to wait for animation/transition to complete
export const waitForAnimation = (duration = 300) => {
  return new Promise((resolve) => setTimeout(resolve, duration));
};

// Helper to mock window dimensions
export const mockWindowDimensions = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });

  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });

  window.dispatchEvent(new Event('resize'));
};

// Helper to check if element is visible
export const isElementVisible = (element: HTMLElement) => {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
};
