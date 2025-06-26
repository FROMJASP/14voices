import type { CollectionConfig, Where } from 'payload'
import { formatSlug } from '../utilities/formatSlug'
import { blogEditorConfig } from '../fields/lexical/blogEditorConfig'

const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'author', 'publishedDate', 'views'],
    listSearchableFields: ['title', 'subtitle', 'content'],
    group: 'Content',
    preview: (doc) => {
      if (doc?.slug) {
        return `${process.env.NEXT_PUBLIC_SERVER_URL}/blog/${doc.slug}`
      }
      return null
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      
      // If user is logged in, show their posts and published posts
      if (user) {
        const query: Where = {
          or: [
            {
              status: {
                equals: 'published',
              },
            },
            {
              author: {
                equals: user.id,
              },
            },
          ],
        }
        return query
      }
      
      // If no user, only show published posts
      return {
        status: {
          equals: 'published',
        },
      }
    },
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return {
        author: {
          equals: user?.id,
        },
      }
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'The main title of your blog post',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              admin: {
                description: 'Optional subtitle or tagline',
              },
            },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              admin: {
                position: 'sidebar',
                description: 'URL-friendly version of the title',
              },
              hooks: {
                beforeValidate: [formatSlug('title')],
              },
            },
            {
              name: 'bannerImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Hero image displayed at the top of the post',
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              editor: blogEditorConfig,
              admin: {
                description: 'The main content of your blog post',
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              admin: {
                description: 'Short summary for previews and listings (auto-generated if empty)',
              },
              hooks: {
                beforeValidate: [
                  ({ data, value }) => {
                    if (!value && data?.content) {
                      const plainText = data.content.root.children
                        .map((node: { children?: Array<{ text?: string }> }) => node.children?.map((child) => child.text).join('') || '')
                        .join(' ')
                      return plainText.substring(0, 160) + '...'
                    }
                    return value
                  },
                ],
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              interfaceName: 'Meta',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'Override the default title for SEO (defaults to post title)',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: {
                    description: 'Meta description for search engines (defaults to excerpt)',
                  },
                },
                {
                  name: 'keywords',
                  type: 'array',
                  admin: {
                    description: 'SEO keywords for this post',
                  },
                  fields: [
                    {
                      name: 'keyword',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Social media preview image (defaults to banner image)',
                  },
                },
                {
                  name: 'noIndex',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Prevent search engines from indexing this page',
                  },
                },
              ],
            },
            {
              name: 'openGraph',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'OG title for social sharing',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: {
                    description: 'OG description for social sharing',
                  },
                },
                {
                  name: 'type',
                  type: 'select',
                  defaultValue: 'article',
                  options: [
                    { label: 'Article', value: 'article' },
                    { label: 'Website', value: 'website' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            {
              name: 'author',
              type: 'relationship',
              relationTo: 'users',
              required: true,
              defaultValue: ({ user }) => user?.id,
              admin: {
                description: 'The author of this post',
              },
            },
            {
              name: 'categories',
              type: 'array',
              admin: {
                description: 'Organize posts by categories',
              },
              fields: [
                {
                  name: 'category',
                  type: 'select',
                  options: [
                    { label: 'News', value: 'news' },
                    { label: 'Tips & Tricks', value: 'tips-tricks' },
                    { label: 'Behind the Scenes', value: 'behind-scenes' },
                    { label: 'Industry Insights', value: 'industry-insights' },
                    { label: 'Voice Acting', value: 'voice-acting' },
                    { label: 'Technology', value: 'technology' },
                  ],
                },
              ],
            },
            {
              name: 'tags',
              type: 'array',
              admin: {
                description: 'Add tags for better discoverability',
              },
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                },
              ],
            },
            {
              name: 'status',
              type: 'select',
              defaultValue: 'draft',
              required: true,
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
                { label: 'Archived', value: 'archived' },
              ],
              admin: {
                position: 'sidebar',
                description: 'Post visibility status',
              },
            },
            {
              name: 'publishedDate',
              type: 'date',
              admin: {
                position: 'sidebar',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                description: 'Schedule post publication',
              },
              defaultValue: () => new Date().toISOString(),
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                position: 'sidebar',
                description: 'Feature this post on the homepage',
              },
            },
            {
              name: 'enableComments',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                position: 'sidebar',
                description: 'Allow comments on this post',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Number of times this post has been viewed',
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Estimated reading time in minutes',
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data?.content) {
              const plainText = data.content.root.children
                .map((node: { children?: Array<{ text?: string }> }) => node.children?.map((child) => child.text).join('') || '')
                .join(' ')
              const wordsPerMinute = 200
              const wordCount = plainText.split(/\s+/).length
              return Math.ceil(wordCount / wordsPerMinute)
            }
            return 0
          },
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          data.views = 0
        }
        return data
      },
    ],
  },
  endpoints: [
    {
      path: '/increment-views',
      method: 'post',
      handler: async (req) => {
        const body = req.json ? await req.json() : {}
        const { id } = body
        if (!id) {
          return Response.json({ error: 'Post ID required' }, { status: 400 })
        }
        try {
          const post = await req.payload.findByID({
            collection: 'blog-posts',
            id,
          })
          if (!post) {
            return Response.json({ error: 'Post not found' }, { status: 404 })
          }
          await req.payload.update({
            collection: 'blog-posts',
            id,
            data: {
              views: (post.views || 0) + 1,
            },
          })
          return Response.json({ success: true })
        } catch {
          return Response.json({ error: 'Failed to increment views' }, { status: 500 })
        }
      },
    },
  ],
}

export default BlogPosts