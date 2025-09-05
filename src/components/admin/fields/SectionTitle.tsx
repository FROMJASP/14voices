'use client';

import React from 'react';

interface SectionTitleProps {
  title: string;
  description?: string;
}

/**
 * Component to display section titles in the admin panel
 */
const SectionTitle: React.FC<SectionTitleProps> = ({ title, description }) => {
  return (
    <div className="section-title">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      <style jsx>{`
        .section-title {
          margin: 24px 0 16px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--theme-elevation-150);
        }
        
        .section-title h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--theme-text);
        }
        
        .section-title p {
          margin: 0;
          font-size: 14px;
          color: var(--theme-text-secondary);
        }
      `}</style>
    </div>
  );
};

export const LayoutSectionTitle: React.FC = () => (
  <SectionTitle 
    title="Layout"
    description="Control which blocks appear on the page and in what order"
  />
);

export const ContentSectionTitle: React.FC = () => (
  <SectionTitle 
    title="Blokken aanpassen"
    description="Edit the content of blocks that have been added to the layout"
  />
);