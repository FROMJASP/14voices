'use client';

import type { Page, Block, Form, Section } from '@/payload-types';
import { UnifiedHero, UnifiedCTA } from './unified';
import { UnifiedSection } from './unified/UnifiedSection';
import { ReusableBlock } from './blocks/ReusableBlock';
import { FormBlock } from './blocks/FormBlock';
import { LayoutWrapper } from './LayoutWrapper';
import type { TwoColumnBlockData, CTABlockData } from '@/types/blocks';

interface PageRendererProps {
  page: Page;
}

export function PageRenderer({ page }: PageRendererProps) {
  const content = (
    <article className="page-content">
      {/* Hero Section */}
      {page.hero && page.hero.type !== 'none' && (
        <UnifiedHero variant="page" pageHero={page.hero} />
      )}

      {/* Dynamic Blocks */}
      <div className="blocks-container">
        {page.blocks?.map((block, index) => {
          switch (block.blockType) {
            case 'richText':
              return (
                <UnifiedSection
                  key={index}
                  content={(block as { content: unknown; blockType: string }).content}
                />
              );
            case 'twoColumn':
              return <UnifiedSection key={index} {...(block as unknown as TwoColumnBlockData)} />;
            case 'cta':
              return (
                <UnifiedCTA
                  key={index}
                  variant="block"
                  blockData={block as unknown as CTABlockData}
                />
              );
            case 'reusableBlock':
              return (
                <ReusableBlock
                  key={index}
                  block={block as { block: string | Block; blockType: 'reusableBlock' }}
                />
              );
            case 'section':
              return (
                <UnifiedSection
                  key={index}
                  section={
                    (block as { section: unknown; blockType: string }).section as
                      | Section
                      | string
                      | undefined
                  }
                />
              );
            case 'form':
              return (
                <FormBlock
                  key={index}
                  block={
                    block as {
                      form: string | Form;
                      showTitle?: boolean;
                      showDescription?: boolean;
                      blockType: 'form';
                    }
                  }
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </article>
  );

  // Wrap in layout if specified
  if (page.layout) {
    return <LayoutWrapper layout={page.layout}>{content}</LayoutWrapper>;
  }

  return content;
}
