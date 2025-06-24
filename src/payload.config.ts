import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from '@payloadcms/email-resend'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp'
import Users from './collections/Users'
import Media from './collections/Media'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: process.cwd(),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: './src/payload-types.ts',
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL,
    },
  }),
  email: resendAdapter({
    defaultFromAddress: 'noreply@14voices.com',
    defaultFromName: '14voices',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  sharp,
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: {
              media: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})