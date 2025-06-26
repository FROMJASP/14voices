'use client'

import type { Block } from '@/payload-types'
import { HeroBanner } from './blocks/HeroBanner'
import { FeatureGrid } from './blocks/FeatureGrid'
import { ContentSection } from './blocks/ContentSection'
import { CallToAction } from './blocks/CallToAction'
import { FAQAccordion } from './blocks/FAQAccordion'
import { TestimonialsDisplay } from './blocks/TestimonialsDisplay'
import { TeamDisplay } from './blocks/TeamDisplay'
import { PortfolioDisplay } from './blocks/PortfolioDisplay'

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
          <HeroBanner data={block.heroBanner as any} />
        </div>
      )
    case 'featureGrid':
      return (
        <div className={wrapperClasses}>
          <FeatureGrid data={block.featureGrid as any} />
        </div>
      )
    case 'contentSection':
      return (
        <div className={wrapperClasses}>
          <ContentSection data={block.contentSection as any} />
        </div>
      )
    case 'callToAction':
      return (
        <div className={wrapperClasses}>
          <CallToAction data={block.callToAction as any} />
        </div>
      )
    case 'faqAccordion':
      return (
        <div className={wrapperClasses}>
          <FAQAccordion data={block.faqAccordion as any} />
        </div>
      )
    case 'testimonialsDisplay':
      return (
        <div className={wrapperClasses}>
          <TestimonialsDisplay data={block.testimonialsDisplay || {}} />
        </div>
      )
    case 'teamDisplay':
      return (
        <div className={wrapperClasses}>
          <TeamDisplay data={block.teamDisplay || {}} />
        </div>
      )
    case 'portfolioDisplay':
      return (
        <div className={wrapperClasses}>
          <PortfolioDisplay data={block.portfolioDisplay || {}} />
        </div>
      )
    default:
      return null
  }
}