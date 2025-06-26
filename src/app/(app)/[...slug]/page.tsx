import { notFound } from 'next/navigation'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { PageRenderer } from '@/components/PageRenderer'
import type { Page } from '@/payload-types'

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
}

export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise })
  
  const pages = await payload.find({
    collection: 'pages',
    where: {
      status: {
        equals: 'published',
      },
    },
    limit: 100,
  })

  return pages.docs.map((page) => ({
    slug: (page as Page).slug === 'home' ? [] : (page as Page).slug.split('/'),
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug: slugArray } = await params
  const slug = slugArray?.join('/') || 'home'
  const payload = await getPayloadHMR({ config: configPromise })
  
  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
      status: {
        equals: 'published',
      },
    },
    limit: 1,
  })

  const page = pages.docs[0] as Page | undefined

  if (!page) {
    return {}
  }

  const title = page.meta?.title || page.title
  const description = page.meta?.description || ''
  const image = page.meta?.image && typeof page.meta.image === 'object' 
    ? page.meta.image.url 
    : undefined

  return {
    title,
    description,
    openGraph: {
      title: page.openGraph?.title || title,
      description: page.openGraph?.description || description,
      images: image ? [{ url: image }] : [],
      type: page.openGraph?.type || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.openGraph?.title || title,
      description: page.openGraph?.description || description,
      images: image ? [image] : [],
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { slug: slugArray } = await params
  const slug = slugArray?.join('/') || 'home'
  const payload = await getPayloadHMR({ config: configPromise })
  
  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
      status: {
        equals: 'published',
      },
    },
    limit: 1,
    depth: 2,
  })

  const page = pages.docs[0] as Page | undefined

  if (!page) {
    notFound()
  }

  return <PageRenderer page={page} />
}