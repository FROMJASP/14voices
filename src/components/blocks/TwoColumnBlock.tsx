import { RichText } from '@/components/RichText'
import type { TwoColumnBlockData } from '@/types/blocks'

interface TwoColumnBlockProps {
  block: TwoColumnBlockData
}

export function TwoColumnBlock({ block }: TwoColumnBlockProps) {
  const ratioClasses = {
    '50-50': 'md:grid-cols-2',
    '60-40': 'md:grid-cols-[3fr_2fr]',
    '40-60': 'md:grid-cols-[2fr_3fr]',
    '70-30': 'md:grid-cols-[7fr_3fr]',
    '30-70': 'md:grid-cols-[3fr_7fr]',
  }

  return (
    <section className="two-column-block py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className={`grid gap-8 md:gap-12 ${ratioClasses[block.columnRatio as keyof typeof ratioClasses] || 'md:grid-cols-2'}`}>
          <div className="prose prose-lg">
            <RichText content={block.leftColumn} />
          </div>
          <div className="prose prose-lg">
            <RichText content={block.rightColumn} />
          </div>
        </div>
      </div>
    </section>
  )
}