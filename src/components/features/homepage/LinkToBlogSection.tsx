'use client';

import { Button } from '@/components/ui/Button';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { makeMediaUrlRelative } from '@/lib/media-utils';

interface LinkToBlogSectionProps {
  data: {
    layout?: 'variant1' | 'variant2'; // Section layout variant
    enabled?: boolean;
    image?:
      | {
          url?: string;
          alt?: string;
          width?: number;
          height?: number;
        }
      | string;
    imageURL?: string;
    imageGrayscale?: boolean;
    heading?: string;
    description?: string;
    button?: {
      text?: string;
      url?: string;
      variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link';
      showIcon?: boolean;
    };
    spacing?: {
      top?: 'sm' | 'md' | 'lg';
      bottom?: 'sm' | 'md' | 'lg';
    };
  };
}

// Spacing classes - using full class names so Tailwind can detect them
const spacingClasses = {
  top: {
    sm: 'pt-8 md:pt-16',
    md: 'pt-16 md:pt-32',
    lg: 'pt-24 md:pt-40',
  },
  bottom: {
    sm: 'pb-8 md:pb-16',
    md: 'pb-16 md:pb-32',
    lg: 'pb-24 md:pb-40',
  },
};

// Component for Layout Variant 1
function LinkToBlogVariant1({ data }: { data: LinkToBlogSectionProps['data'] }) {
  // Get padding classes
  const topSpacing = data.spacing?.top || 'md';
  const bottomSpacing = data.spacing?.bottom || 'md';
  const paddingTopClass = spacingClasses.top[topSpacing];
  const paddingBottomClass = spacingClasses.bottom[bottomSpacing];

  // Get image URL
  let imageUrl = '';
  let imageAlt = 'Section image';
  let imageWidth = 2747;
  let imageHeight = 1830;

  // First check for the virtual imageURL field
  if (data.imageURL) {
    imageUrl = makeMediaUrlRelative(data.imageURL);
  } else if (data.image) {
    if (typeof data.image === 'string') {
      // If it's just an ID, the imageURL virtual field should have resolved it
      imageUrl = '';
    } else if (data.image.url) {
      imageUrl = makeMediaUrlRelative(data.image.url);
      imageAlt = data.image.alt || 'Section image';
      imageWidth = data.image.width || 2747;
      imageHeight = data.image.height || 1830;
    }
  }

  // Default values
  const heading =
    data.heading || 'The Lyra ecosystem brings together our models, products and platforms.';
  const description =
    data.description ||
    'Lyra is evolving to be more than just the models. It supports an entire ecosystem — from products to the APIs and platforms helping developers and businesses innovate.';
  const buttonText = data.button?.text || 'Learn More';
  const buttonUrl = data.button?.url || '/blog';
  const buttonVariant = data.button?.variant || 'secondary';
  const showIcon = data.button?.showIcon !== false;

  return (
    <section className={cn(paddingTopClass, paddingBottomClass)}>
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        {imageUrl && (
          <div className="relative w-full overflow-hidden rounded-lg">
            <Image
              className={cn('w-full h-auto object-cover', data.imageGrayscale && 'grayscale')}
              src={imageUrl}
              alt={imageAlt}
              width={imageWidth}
              height={imageHeight}
              loading="lazy"
            />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <h2 className="text-4xl font-medium whitespace-pre-line">{heading}</h2>
          <div className="space-y-6">
            <div className="text-muted-foreground whitespace-pre-line">{description}</div>

            <Button
              asChild
              variant={buttonVariant}
              size="sm"
              className={cn(showIcon && 'gap-1 pr-1.5')}
            >
              <Link href={buttonUrl}>
                <span>{buttonText}</span>
                {showIcon && <ChevronRight className="size-4" />}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main component that routes to the correct layout variant
export default function LinkToBlogSection({ data }: LinkToBlogSectionProps) {
  // Don't render if section is disabled
  if (!data?.enabled) {
    return null;
  }

  // Get the layout variant (default to variant1)
  const layoutVariant = data.layout || 'variant1';

  // Render the appropriate variant
  switch (layoutVariant) {
    case 'variant1':
      return <LinkToBlogVariant1 data={data} />;
    // Add more variants here in the future
    // case 'variant2':
    //   return <LinkToBlogVariant2 data={data} />;
    default:
      return <LinkToBlogVariant1 data={data} />;
  }
}
