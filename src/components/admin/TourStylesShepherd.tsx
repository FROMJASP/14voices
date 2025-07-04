'use client';

import { useEffect } from 'react';

export function TourStylesShepherd() {
  useEffect(() => {
    // Inject styles with a delay to ensure they override Shepherd.js styles
    const injectStyles = () => {
      const styleId = 'shepherd-override-styles';

      // Remove existing styles if any
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }

      // Create and inject new styles
      const style = document.createElement('style');
      style.id = styleId;
      style.setAttribute('data-priority', 'high');
      style.textContent = `
      /* Force override all Shepherd.js styles - Injected by TourStylesShepherd */
      
      /* Lighter modal overlay */
      .shepherd-modal-overlay-container {
        background-color: rgba(0, 0, 0, 0.2) !important;
        cursor: pointer !important;
        z-index: 9998 !important;
      }
      
      /* Highlighted element opening */
      .shepherd-modal-overlay-container.shepherd-modal-is-visible path {
        fill: rgba(0, 0, 0, 0.2) !important;
      }
      
      /* Ensure highlighted element is visible above overlay */
      .shepherd-enabled.shepherd-target {
        z-index: 9999 !important;
        position: relative !important;
      }
      
      /* Force the target to be highlighted properly - fallback if SVG fails */
      .shepherd-target.shepherd-enabled,
      .shepherd-target-highlight {
        outline: 3px solid #3b82f6 !important;
        outline-offset: 4px !important;
        position: relative !important;
        z-index: 9999 !important;
      }
      
      /* Alternative highlight using pseudo-element */
      .shepherd-enabled.shepherd-target::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.2);
        pointer-events: none;
        z-index: -1;
      }
      
      /* Modal overlay SVG styling */
      .shepherd-modal-overlay-container svg {
        height: 100vh !important;
        width: 100vw !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        pointer-events: none !important;
      }
      
      /* Modal opening for highlighted element - the cutout */
      .shepherd-modal-overlay-container rect {
        rx: 8 !important;
        ry: 8 !important;
        fill: black !important;
      }
      
      /* Ensure the SVG path (dark overlay) has proper fill */
      .shepherd-modal-overlay-container path {
        pointer-events: auto !important;
        fill-rule: evenodd !important;
      }
      
      /* Fix for SVG mask rendering */
      .shepherd-modal-overlay-container {
        pointer-events: none !important;
      }
      
      .shepherd-modal-overlay-container path {
        pointer-events: auto !important;
      }
      
      /* Tour element styling */
      .shepherd-element {
        background: #ffffff !important;
        border: 1px solid #e5e7eb !important;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
        border-radius: 12px !important;
        overflow: hidden !important;
        max-width: 500px !important;
        z-index: 10000 !important;
      }
      
      /* Header styling */
      .shepherd-header {
        background: #f9fafb !important;
        border-bottom: 1px solid #e5e7eb !important;
        padding: 1.25rem !important;
      }
      
      /* Title styling */
      .shepherd-title {
        font-size: 20px !important;
        font-weight: 700 !important;
        color: #111827 !important;
        letter-spacing: -0.025em !important;
        margin: 0 !important;
      }
      
      /* Close button positioning */
      .shepherd-cancel-icon {
        position: absolute !important;
        top: 0.75rem !important;
        right: 0.75rem !important;
        left: auto !important;
        color: #6b7280 !important;
        transition: color 0.2s !important;
        cursor: pointer !important;
        z-index: 10 !important;
      }
      
      .shepherd-cancel-icon:hover {
        color: #374151 !important;
      }
      
      /* Ensure header has relative positioning for absolute close button */
      .shepherd-header {
        position: relative !important;
        padding-right: 2.5rem !important; /* Make room for close button */
      }
      
      /* Content area */
      .shepherd-text {
        padding: 1.25rem !important;
        font-size: 16px !important;
        line-height: 1.6 !important;
        color: #374151 !important;
        font-weight: 400 !important;
        letter-spacing: 0 !important;
      }
      
      /* Footer */
      .shepherd-footer {
        padding: 1rem 1.25rem !important;
        background: #f9fafb !important;
        border-top: 1px solid #e5e7eb !important;
        display: flex !important;
        gap: 0.75rem !important;
        justify-content: flex-end !important;
      }
      
      /* Button base styles */
      .shepherd-button {
        font-weight: 600 !important;
        letter-spacing: 0 !important;
        padding: 0.75rem 1.5rem !important;
        font-size: 15px !important;
        border-radius: 0.5rem !important;
        border: 2px solid transparent !important;
        transition: all 0.2s !important;
        cursor: pointer !important;
      }
      
      /* Secondary button (Previous) */
      .shepherd-button-secondary {
        background-color: #f3f4f6 !important;
        color: #1f2937 !important;
        border-color: #d1d5db !important;
      }
      
      .shepherd-button-secondary:hover {
        background-color: #e5e7eb !important;
        color: #111827 !important;
        border-color: #9ca3af !important;
      }
      
      /* Primary button (Next) */
      .shepherd-button-primary {
        background-color: #3b82f6 !important;
        color: #ffffff !important;
        border-color: #3b82f6 !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
      }
      
      .shepherd-button-primary:hover {
        background-color: #2563eb !important;
        color: #ffffff !important;
        border-color: #2563eb !important;
      }
      
      /* Success button (Done/Complete) */
      .shepherd-button-success {
        background-color: #10b981 !important;
        color: #ffffff !important;
        border-color: #10b981 !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
      }
      
      .shepherd-button-success:hover {
        background-color: #059669 !important;
        color: #ffffff !important;
        border-color: #059669 !important;
      }
      
      /* Arrow styling */
      .shepherd-arrow {
        width: 16px !important;
        height: 16px !important;
      }
      
      .shepherd-arrow:before {
        background: #ffffff !important;
        border: 1px solid #e5e7eb !important;
        width: 16px !important;
        height: 16px !important;
        content: '' !important;
        transform: rotate(45deg) !important;
        position: absolute !important;
      }
      
      /* For centered popovers without element */
      .shepherd-element.shepherd-centered {
        position: fixed !important;
        left: 50% !important;
        top: 50% !important;
        transform: translate(-50%, -50%) !important;
      }
      
      /* Remove default transitions that might interfere */
      .shepherd-element,
      .shepherd-element * {
        transition-property: opacity, transform !important;
        transition-duration: 200ms !important;
      }
      
      /* Fix text rendering */
      .shepherd-element,
      .shepherd-element * {
        -webkit-font-smoothing: subpixel-antialiased !important;
        -moz-osx-font-smoothing: auto !important;
        text-rendering: optimizeLegibility !important;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif !important;
      }
      
      /* Ensure proper z-index */
      .shepherd-modal-overlay-container {
        z-index: 9998 !important;
      }
      
      .shepherd-element {
        z-index: 10002 !important;
      }
      
      /* Progress dots if needed */
      .shepherd-progress {
        margin-top: 1rem !important;
        display: flex !important;
        justify-content: center !important;
        gap: 0.5rem !important;
      }
      
      .shepherd-progress-dot {
        width: 8px !important;
        height: 8px !important;
        border-radius: 50% !important;
        background-color: #d1d5db !important;
        transition: all 0.2s !important;
      }
      
      .shepherd-progress-dot.active {
        background-color: #3b82f6 !important;
        transform: scale(1.2) !important;
      }
    `;

      document.head.appendChild(style);
      console.log('[TourStyles] Custom Shepherd.js styles injected');

      // Force styles to take precedence by adding them to the end of head
      setTimeout(() => {
        const existingStyle = document.getElementById(styleId);
        if (existingStyle && existingStyle.parentNode === document.head) {
          document.head.appendChild(existingStyle); // Move to end
        }
      }, 100);
    };

    // Inject styles immediately
    injectStyles();

    // Also inject after a delay to ensure they take precedence
    const timeoutId = setTimeout(injectStyles, 500);

    // Re-inject when Shepherd styles load
    let isInjecting = false;
    const observer = new MutationObserver((mutations) => {
      if (isInjecting) return; // Prevent infinite loop

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          // Only re-inject if it's a Shepherd style
          if (
            (node.nodeName === 'STYLE' && node.textContent?.includes('shepherd')) ||
            (node.nodeName === 'LINK' && (node as HTMLLinkElement).href?.includes('shepherd'))
          ) {
            // Re-inject our styles to maintain priority
            isInjecting = true;
            injectStyles();
            setTimeout(() => {
              isInjecting = false;
            }, 100);
          }
        });
      });
    });

    observer.observe(document.head, { childList: true });

    return () => {
      // Cleanup
      clearTimeout(timeoutId);
      observer.disconnect();
      const styleToRemove = document.getElementById('shepherd-override-styles');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, []);

  return null;
}
