import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { resendAdapter } from '@payloadcms/email-resend';
// import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { en } from '@payloadcms/translations/languages/en';
import { nl } from '@payloadcms/translations/languages/nl';
// import { i18n as customI18n } from './i18n/index';
import sharp from 'sharp';
import Users from './collections/Users';
import Media from './collections/Media';
import Voiceovers from './collections/Voiceovers';
import Groups from './collections/Groups';
import Scripts from './collections/Scripts';
import { Bookings } from './collections/Bookings';
import Invoices from './collections/Invoices';
import EmailComponents from './collections/EmailComponents';
import EmailTemplates from './collections/EmailTemplates';
import EmailSequences from './collections/EmailSequences';
import EmailLogs from './collections/EmailLogs';
import EmailJobs from './collections/EmailJobs';
import EmailCampaigns from './collections/EmailCampaigns';
import EmailAudiences from './collections/EmailAudiences';
import EmailContacts from './collections/EmailContacts';
import BlogPosts from './collections/BlogPosts';
import Pages from './collections/Pages';
import Blocks from './collections/Blocks';
import Layouts from './collections/Layouts';
import Sections from './collections/Sections';
import Forms from './collections/Forms';
import FormSubmissions from './collections/FormSubmissions';
import Testimonials from './collections/Testimonials';
import Navigation from './collections/Navigation';
import { EmailSettings } from './globals/EmailSettings';
import { SiteSettings } from './globals/SiteSettings';
import path from 'path';

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(process.cwd(), 'src'),
    },
    components: {
      beforeLogin: ['./components/admin/BeforeLogin#default'],
      afterDashboard: ['./components/admin/AdminEnhancements#default'],
      actions: ['./components/admin/AdminActions#default'],
      graphics: {
        Logo: './components/admin/graphics/Logo#default',
        Icon: './components/admin/graphics/Icon#default',
      },
      providers: ['./components/admin/Root#default'],
    },
    meta: {
      titleSuffix: ' - Fourteen Voices',
      openGraph: {
        images: ['/og-image.jpg'],
      },
      icons: {
        icon: '/favicon.svg',
      },
    },
  },
  localization: {
    locales: [
      {
        label: 'Nederlands',
        code: 'nl',
      },
      {
        label: 'English',
        code: 'en',
      },
    ],
    defaultLocale: 'nl',
    fallback: true,
  },
  i18n: {
    supportedLanguages: { en, nl },
    translations: {
      en: {
        // ...customI18n.supportedLanguages.en.translations,
      },
      nl: {
        // ...customI18n.supportedLanguages.nl.translations,
      },
    },
  },
  collections: [
    Users,
    Media, // General media repository
    Groups,
    Voiceovers,
    Bookings,
    Scripts,
    Invoices,
    BlogPosts,
    Navigation,
    Pages,
    Blocks,
    Layouts,
    Sections,
    Forms,
    FormSubmissions,
    Testimonials,
    EmailComponents,
    EmailTemplates,
    EmailSequences,
    EmailLogs,
    EmailJobs,
    EmailCampaigns,
    EmailAudiences,
    EmailContacts,
  ],
  globals: [EmailSettings, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: './src/payload-types.ts',
  },
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || '',
    },
  }),
  email: resendAdapter({
    defaultFromAddress: 'noreply@14voices.com',
    defaultFromName: '14voices',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  sharp,
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN &&
    process.env.BLOB_READ_WRITE_TOKEN.startsWith('vercel_blob_rw_')
      ? [
          vercelBlobStorage({
            collections: {
              media: true,
              scripts: true,
              invoices: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
});
