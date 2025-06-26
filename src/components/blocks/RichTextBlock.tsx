import { RichText } from '@/components/RichText'
import type { RichTextBlockData } from '@/types/blocks'

interface RichTextBlockProps {
  block: RichTextBlockData
}

export function RichTextBlock({ block }: RichTextBlockProps) {
  return (
    <section className="rich-text-block py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <RichText content={block.content} />
        </div>
      </div>
    </section>
  )
}