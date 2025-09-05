'use client';

import { Button } from '@/components/ui/Button';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { makeMediaUrlRelative } from '@/lib/media-utils';

interface ContentSectionProps {
  data: {
    image?: any;
    imageStyle?: {
      grayscale?: boolean;
      rounded?: boolean;
    };
    title?: string;
    description?: string;
    button?: {
      label?: string;
      url?: string;
      style?: 'default' | 'secondary' | 'outline' | 'ghost';
      showIcon?: boolean;
    };
  };
}

export default function ContentSection({ data }: ContentSectionProps) {
  // Extract image URL
  let imageUrl: string | null = null;
  if (data.image) {
    if (typeof data.image === 'string') {
      imageUrl = null; // Just an ID, can't use it
    } else if (typeof data.image === 'object') {
      if (data.image.url) {
        imageUrl = makeMediaUrlRelative(data.image.url);
      } else if (data.image.filename) {
        imageUrl = makeMediaUrlRelative(`/media/${data.image.filename}`);
      }
    }
  }

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        {imageUrl && (
          <div className="relative w-full h-[300px] md:h-[400px]">
            <Image
              className={`
                object-cover w-full h-full
                ${data.imageStyle?.grayscale !== false ? 'grayscale' : ''}
                ${data.imageStyle?.rounded !== false ? 'rounded-lg' : ''}
              `}
              src={imageUrl}
              alt={data.title || 'Content image'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              loading="lazy"
            />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          {data.title && (
            <h2 className="text-4xl font-medium">{data.title}</h2>
          )}
          <div className="space-y-6">
            {data.description && (
              <p className="text-gray-600 dark:text-gray-400">{data.description}</p>
            )}
            
            {data.button?.label && data.button?.url && (
              <Button
                asChild
                variant={data.button.style === 'primary' ? 'default' : (data.button.style || 'secondary')}
                size="sm"
                className={data.button.showIcon !== false ? "gap-1 pr-1.5" : ""}>
                <Link href={data.button.url}>
                  <span>{data.button.label}</span>
                  {data.button.showIcon !== false && (
                    <ChevronRight className="size-4" />
                  )}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}