// Export client components only to prevent server imports in client bundles
export { FAQSectionClient } from './FAQSection.client';

// Client-safe wrapper that can be used in client components
// This component will fetch data client-side instead of server-side
export { FAQSectionClientWrapper as FAQSectionWrapper } from './FAQSectionClientWrapper';

// Default export is the client wrapper to prevent server imports in client components
export { FAQSectionClientWrapper as default } from './FAQSectionClientWrapper';

// Note: Server component is available via direct import from './FAQSection.server'