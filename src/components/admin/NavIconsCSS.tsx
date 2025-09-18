'use client';

import React, { useEffect, useState } from 'react';

const NavIconsCSS: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Inject CSS that adds icons using pseudo-elements
    const styleId = 'nav-icons-styles';

    // Remove existing styles if any
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create new style element
    const style = document.createElement('style');
    style.id = styleId;

    // Icon SVGs as data URIs - using currentColor which will inherit the text color
    const icons = {
      users: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
      voiceovers: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>`,
      groups: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
      media: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
      pages: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
      'blog-posts': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
      testimonials: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
      faq: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
      bookings: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
      scripts: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
      invoices: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="16" y1="21" x2="8" y2="21"></line></svg>`,
      productions: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"></path><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"></path></svg>`,
      'extra-services': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
      forms: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
      'form-submissions': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg>`,
      'email-components': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
      'email-templates': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
      'email-sequences': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
      'email-logs': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
      'email-jobs': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
      'email-campaigns': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
      'email-audiences': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
      'email-contacts': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>`,
      'security-logs': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
      'site-settings': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m4.22-10.22l1.42-1.42m-1.42 8.49l1.42 1.42M20 12h6m-6 0h-6m-6.22-4.22l-1.42-1.42m1.42 8.49l-1.42 1.42M6 12H1"></path></svg>`,
      'email-settings': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
      'faq-settings': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    };

    // Convert SVG to data URI
    const svgToDataUri = (svg: string) => {
      const encoded = encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22');
      return `data:image/svg+xml,${encoded}`;
    };

    // Generate CSS rules
    let css = '';

    // Collection icons
    Object.entries(icons).forEach(([slug, svg]) => {
      const dataUri = svgToDataUri(svg);
      css += `
        a[href="/admin/collections/${slug}"]::before,
        a[href*="/admin/collections/${slug}/"]::before {
          content: '';
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-right: 8px;
          background-image: url("${dataUri}");
          background-size: 16px 16px;
          background-position: center;
          background-repeat: no-repeat;
          flex-shrink: 0;
          vertical-align: middle;
          filter: var(--payload-icon-filter, none);
          transition: filter 0.2s ease;
        }
        
        a[href="/admin/collections/${slug}"],
        a[href*="/admin/collections/${slug}/"] {
          display: flex !important;
          align-items: center !important;
        }
      `;
    });

    // Global icons
    ['site-settings', 'email-settings', 'faq-settings'].forEach((slug) => {
      const svg = icons[slug as keyof typeof icons];
      if (svg) {
        const dataUri = svgToDataUri(svg);
        css += `
          a[href="/admin/globals/${slug}"]::before,
          a[href*="/admin/globals/${slug}/"]::before {
            content: '';
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 8px;
            background-image: url("${dataUri}");
            background-size: 16px 16px;
            background-position: center;
            background-repeat: no-repeat;
            flex-shrink: 0;
            vertical-align: middle;
            filter: var(--payload-icon-filter, none);
            transition: filter 0.2s ease;
          }
          
          a[href="/admin/globals/${slug}"],
          a[href*="/admin/globals/${slug}/"] {
            display: flex !important;
            align-items: center !important;
          }
        `;
      }
    });

    // Hide Categories from sidebar navigation (it's accessible via Blog Posts tabs)
    css += `
      /* Hide categories link in the sidebar - comprehensive selectors */
      nav a[href="/admin/collections/categories"],
      aside a[href="/admin/collections/categories"],
      .nav-group a[href="/admin/collections/categories"],
      [class*="nav"] a[href="/admin/collections/categories"],
      [class*="sidebar"] a[href="/admin/collections/categories"],
      a[href="/admin/collections/categories"][class*="nav"],
      li:has(> a[href="/admin/collections/categories"]),
      div:has(> a[href="/admin/collections/categories"]:only-child) {
        display: none !important;
      }
      
      /* Hide parent list item if it contains categories link */
      ul li:has(a[href="/admin/collections/categories"]),
      ol li:has(a[href="/admin/collections/categories"]) {
        display: none !important;
      }
      
      /* Hide any wrapper that only contains the categories link */
      *:has(> a[href="/admin/collections/categories"]:only-child):not(body):not(html) {
        display: none !important;
      }
      
      /* Hide empty 'Inhoud' (Content) group if it has no visible children */
      .nav-group:has(.nav-group__label:contains("Inhoud")):not(:has(li:not([style*="display: none"]))) {
        display: none !important;
      }
    `;

    // Fix sidebar height issue - prevent sidebar from expanding to match main content
    css += `
      /* Fix sidebar height and layout issues */
      .nav__wrap {
        max-height: 100vh !important;
        height: auto !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        flex-grow: 0 !important;
        flex-shrink: 0 !important;
      }
      
      .nav {
        position: relative !important;
        height: auto !important;
        min-height: auto !important;
      }
      
      .nav__scroll {
        height: auto !important;
        min-height: auto !important;
      }
      
      /* Ensure proper flexbox layout for admin panels */
      .template__wrap,
      .app__wrap,
      [class*="template__wrap"],
      [class*="app__wrap"] {
        display: flex !important;
        flex-direction: row !important;
        align-items: flex-start !important;
      }
      
      /* Prevent sidebar from stretching to match content */
      .template__nav,
      .app__nav,
      [class*="template__nav"],
      [class*="app__nav"] {
        height: auto !important;
        max-height: 100vh !important;
        flex: 0 0 auto !important;
        align-self: flex-start !important;
      }
      
      /* Ensure main content can grow independently */
      .template__content,
      .app__content,
      [class*="template__content"],
      [class*="app__content"] {
        flex: 1 1 auto !important;
        min-height: 100vh !important;
      }
      
      /* Remove any flex spacers that Payload might inject */
      .nav > div[style*="flex-grow"],
      .nav > div[style*="flex: 1"],
      .nav > :nth-child(2)[style*="flex-grow"] {
        display: none !important;
      }
    `;

    // Add custom blocks drawer styling
    css += `
      /* Custom styling for blocks drawer to show image + text layout */
      .blocks-drawer__blocks {
        display: flex !important;
        flex-direction: column !important;
        gap: 0.75rem !important;
        padding: 1rem !important;
        grid-template-columns: unset !important;
      }
      
      /* Force all images in blocks drawer to be small thumbnails */
      .blocks-drawer__block img,
      .blocks-drawer__blocks img,
      .blocks-drawer img[src*="block-previews"],
      .blocks-drawer img[src*=".jpg"],
      .blocks-drawer img[src*=".png"],
      .blocks-drawer img {
        max-width: 180px !important;
        max-height: 110px !important;
        width: 180px !important;
        height: 110px !important;
        object-fit: cover !important;
        flex-shrink: 0 !important;
        border-radius: 6px !important;
        display: inline-block !important;
        vertical-align: top !important;
      }
      
      /* Special handling for specific images that need to show more */
      .blocks-drawer img[src*="hero-1"],
      .blocks-drawer img[src*="blog-section-1"] {
        object-fit: contain !important;
        background: #f5f5f5 !important;
        padding: 8px !important;
        box-sizing: border-box !important;
      }
      
      /* Style each block option */
      .blocks-drawer__block {
        display: flex !important;
        flex-direction: row !important;
        align-items: flex-start !important;
        padding: 1rem !important;
        border: 1px solid var(--theme-elevation-100) !important;
        border-radius: 8px !important;
        transition: all 0.2s ease !important;
        gap: 1rem !important;
        cursor: pointer !important;
        background: var(--theme-bg) !important;
        text-align: left !important;
        width: 100% !important;
        height: auto !important;
      }
      
      .blocks-drawer__block:hover {
        background: var(--theme-elevation-50) !important;
        border-color: var(--theme-elevation-150) !important;
        transform: translateY(-1px) !important;
      }
      
      /* If block has a button inside, style it too */
      .blocks-drawer__block button {
        display: flex !important;
        flex-direction: row !important;
        align-items: flex-start !important;
        gap: 1rem !important;
        width: 100% !important;
        border: none !important;
        background: transparent !important;
        padding: 0 !important;
        cursor: pointer !important;
        font-family: inherit !important;
        font-size: inherit !important;
        color: inherit !important;
        text-align: left !important;
      }
      
      /* Block content wrapper */
      .blocks-drawer__block-content {
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 0.5rem !important;
        min-width: 0 !important;
      }
      
      /* Block title */
      .blocks-drawer__block-label,
      .blocks-drawer__block .label {
        font-size: 1.25rem !important; /* Increased from 1.125rem */
        font-weight: 600 !important;
        color: var(--theme-text) !important;
        margin: 0 !important;
        line-height: 1.3 !important;
        display: block !important;
      }
      
      /* Block description */
      .blocks-drawer__block-description {
        font-size: 1rem !important; /* Increased from 0.9375rem */
        color: var(--theme-text-light) !important;
        line-height: 1.5 !important;
        margin: 0 !important;
        display: block !important;
        padding: 0 !important;
      }
      
      /* Content container to hold title + description */
      .blocks-drawer__block-text-content {
        display: flex !important;
        flex-direction: column !important;
        gap: 0.5rem !important;
        flex: 1 !important;
        padding-top: 0.75rem !important; /* Add padding to move content down */
      }
      
      /* Override default Payload styles that might interfere */
      .blocks-drawer__drawer .drawer__content {
        padding: 0 !important;
      }
      
      /* Hide default grid layout if it exists */
      .blocks-field__drawer-blocks-grid {
        display: none !important;
      }
      
      /* Mobile adjustments */
      @media (max-width: 768px) {
        .blocks-drawer__block img,
        .blocks-drawer img {
          width: 120px !important;
          height: 80px !important;
          max-width: 120px !important;
          max-height: 80px !important;
        }
        
        .blocks-drawer__block-description {
          -webkit-line-clamp: 1 !important;
        }
      }
      
      /* Dark mode support */
      [data-theme="dark"] .blocks-drawer__block {
        background: var(--theme-elevation-0) !important;
      }
      
      [data-theme="dark"] .blocks-drawer__block:hover {
        background: var(--theme-elevation-100) !important;
      }
    `;

    // Add styles to the document
    style.textContent = css;
    document.head.appendChild(style);

    // Block descriptions for each block type
    const blockDescriptions: Record<string, { en: string; nl: string }> = {
      'hero-v1': {
        en: 'Hero section with process steps on the left and image on the right. Useful for homepage headers where you want to show at a glance what your brand stands for.',
        nl: 'Hero sectie met processtappen links en afbeelding rechts. Handig voor homepage headers waarin je in 1 oogopslag wil laten zien waar je merk voor staat.',
      },
      'hero-v2': {
        en: 'Centered hero section with badge, title, and subtitle. Great for landing pages and promotional content with a focused message.',
        nl: "Gecentreerde hero sectie met badge, titel en ondertitel. Ideaal voor landingspagina's en promotionele content met een gerichte boodschap.",
      },
      'content-v1': {
        en: 'Content section with image, title, description and call-to-action button. Use this to highlight specific content or link to other pages.',
        nl: "Content sectie met afbeelding, titel, beschrijving en call-to-action knop. Gebruik dit om specifieke content te highlighten of te linken naar andere pagina's.",
      },
      'voiceover-v1': {
        en: 'Product cards grid showing voice-over artists with their details and audio samples. Automatically pulls data from your voice-over collection.',
        nl: 'Product kaarten grid met voice-over artiesten, hun details en audio samples. Haalt automatisch data op uit je voice-over collectie.',
      },
      'blog-section-1': {
        en: 'Blog posts grid with category sidebar. Shows latest blog posts with filtering options. Ideal for news sections or blog overviews.',
        nl: 'Blog posts grid met categorieën zijbalk. Toont laatste blogberichten met filteropties. Ideaal voor nieuwssecties of blogoverzichten.',
      },
      'blog-post-header': {
        en: 'Blog post header with title, author info, date, and featured image. Automatically uses blog post data. Use at the top of blog pages.',
        nl: "Blog post header met titel, auteur info, datum en uitgelichte afbeelding. Gebruikt automatisch blog post data. Gebruik bovenaan blogpagina's.",
      },
      'blog-post-content': {
        en: 'Blog post content area that displays the main blog content. Place after the blog header block. Includes optional comments section.',
        nl: 'Blog post content gebied dat de hoofdinhoud van de blog toont. Plaats na het blog header blok. Bevat optionele reactiesectie.',
      },
    };

    // Also use MutationObserver to hide categories link and empty groups dynamically
    const observer = new MutationObserver(() => {
      // Hide categories links
      const categoriesLinks = document.querySelectorAll('a[href="/admin/collections/categories"]');
      categoriesLinks.forEach((link) => {
        const parent = link.parentElement;
        if (parent && parent.style.display !== 'none') {
          parent.style.display = 'none';
        }
      });

      // Hide empty 'Inhoud' group
      const navGroups = document.querySelectorAll(
        '.nav-group, [class*="nav-group"], [class*="nav__group"]'
      );
      navGroups.forEach((group) => {
        const groupText = group.textContent || '';
        if (groupText.includes('Inhoud') || groupText.includes('Content')) {
          const visibleLinks = group.querySelectorAll(
            'a:not([href="/admin/collections/categories"])'
          );
          const hasVisibleChildren = Array.from(visibleLinks).some((link) => {
            const parent = link.parentElement;
            return (
              parent &&
              parent.style.display !== 'none' &&
              window.getComputedStyle(parent).display !== 'none'
            );
          });

          if (
            !hasVisibleChildren &&
            group instanceof HTMLElement &&
            group.style.display !== 'none'
          ) {
            group.style.display = 'none';
          }
        }
      });

      // Add descriptions to block items in the drawer
      setTimeout(() => {
        const blockItems = document.querySelectorAll('.blocks-drawer__block');

        blockItems.forEach((item) => {
          // Check if description already added
          if (item.querySelector('.blocks-drawer__block-description')) return;

          // Try multiple ways to get block slug
          let blockSlug = null;

          // Method 1: From image src - this is most reliable
          const img = item.querySelector('img');
          if (img && img.src) {
            // Match patterns like hero-1.jpg, content-1.jpg, etc.
            const match = img.src.match(/block-previews\/([\w-]+)\.(jpg|png|svg)/);
            if (match) {
              const filename = match[1];
              // Map filename to block slug
              if (filename === 'hero-1') blockSlug = 'hero-v1';
              else if (filename === 'hero-2') blockSlug = 'hero-v2';
              else if (filename === 'content-1') blockSlug = 'content-v1';
              else if (filename === 'products-1') blockSlug = 'voiceover-v1';
              else if (filename === 'blog-section-1') blockSlug = 'blog-section-1';
              else if (filename === 'blog-post-header') blockSlug = 'blog-post-header';
              else if (filename === 'blog-post-content') blockSlug = 'blog-post-content';
            }
          }

          // Method 2: From text content
          if (!blockSlug) {
            const labelText = item.textContent?.toLowerCase() || '';
            if (labelText.includes('hero 1')) blockSlug = 'hero-v1';
            else if (labelText.includes('hero 2')) blockSlug = 'hero-v2';
            else if (labelText.includes('content 1')) blockSlug = 'content-v1';
            else if (labelText.includes('product cards')) blockSlug = 'voiceover-v1';
            else if (labelText.includes('blog sectie') || labelText.includes('blog section'))
              blockSlug = 'blog-section-1';
            else if (
              labelText.includes('blogpost header') ||
              labelText.includes('blog post header')
            )
              blockSlug = 'blog-post-header';
            else if (
              labelText.includes('blogpost inhoud') ||
              labelText.includes('blog post content')
            )
              blockSlug = 'blog-post-content';
          }

          if (blockSlug) {
            // Get current language
            const currentLang = document.documentElement.lang || 'en';
            const description =
              blockDescriptions[blockSlug]?.[currentLang as 'en' | 'nl'] ||
              blockDescriptions[blockSlug]?.en;

            if (description) {
              // Find the title text (everything after the image)
              const titleText = item.textContent?.trim() || '';

              // Clear the current text content (but keep the image)
              const img = item.querySelector('img');
              item.textContent = '';
              if (img) {
                item.appendChild(img);
              }

              // Create a container for text content
              const textContainer = document.createElement('div');
              textContainer.className = 'blocks-drawer__block-text-content';

              // Add title
              const titleElement = document.createElement('div');
              titleElement.className = 'blocks-drawer__block-label';
              titleElement.textContent = titleText;
              textContainer.appendChild(titleElement);

              // Add description
              const descriptionElement = document.createElement('div');
              descriptionElement.className = 'blocks-drawer__block-description';
              descriptionElement.textContent = description;
              textContainer.appendChild(descriptionElement);

              // Append text container to block item
              item.appendChild(textContainer);
            }
          }
        });
      }, 500); // Delay to ensure DOM is ready
    });

    // Start observing the document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      // Cleanup on unmount
      observer.disconnect();
      const styleEl = document.getElementById('nav-icons-styles');
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, [mounted]);

  return null;
};

export default NavIconsCSS;
