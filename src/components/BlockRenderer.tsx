'use client'

import type { Block } from '@/payload-types'
import type { 
  HeroBannerData, 
  FeatureGridData, 
  ContentSectionData, 
  CallToActionData, 
  FAQAccordionData 
} from '@/types/blocks'
import { UnifiedHero, UnifiedCTA } from './unified'
import { FeatureGrid } from './blocks/FeatureGrid'
import { UnifiedSection } from './unified/UnifiedSection'
import { FAQAccordion } from './blocks/FAQAccordion'
import { TestimonialsDisplay } from './blocks/TestimonialsDisplay'

interface BlockRendererProps {
  block: Block
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const visibilityClasses = [
    block.visibility?.showOnDesktop ? 'block' : 'hidden',
    block.visibility?.showOnTablet ? 'md:block' : 'md:hidden',
    block.visibility?.showOnMobile ? 'lg:block' : 'lg:hidden',
  ].join(' ')

  const wrapperClasses = `${visibilityClasses} ${block.customClasses || ''}`

  switch (block.blockType) {
    case 'heroBanner':
      return (
        <div className={wrapperClasses}>
          <UnifiedHero variant="banner" bannerData={block.heroBanner as unknown as HeroBannerData} />
        </div>
      )
    case 'featureGrid':
      return (
        <div className={wrapperClasses}>
          <FeatureGrid data={block.featureGrid as unknown as FeatureGridData} />
        </div>
      )
    case 'contentSection':
      return (
        <div className={wrapperClasses}>
          <UnifiedSection data={block.contentSection as unknown as ContentSectionData} />
        </div>
      )
    case 'callToAction':
      return (
        <div className={wrapperClasses}>
          <UnifiedCTA variant="action" actionData={block.callToAction as unknown as CallToActionData} />
        </div>
      )
    case 'faqAccordion':
      return (
        <div className={wrapperClasses}>
          <FAQAccordion data={block.faqAccordion as unknown as FAQAccordionData} />
        </div>
      )
    case 'testimonialsDisplay':
      return (
        <div className={wrapperClasses}>
          <TestimonialsDisplay data={block.testimonialsDisplay || {}} />
        </div>
      )
    default:
      return null
  }
}