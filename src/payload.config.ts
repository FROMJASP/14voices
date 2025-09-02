import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { resendAdapter } from '@payloadcms/email-resend';
// import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { wrappedMinioStorage } from '@root/lib/storage/minio-adapter';
import { en } from '@payloadcms/translations/languages/en';
import { nl } from '@payloadcms/translations/languages/nl';
import { i18n as customI18n } from './i18n/index';
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
import Forms from './collections/Forms';
import FormSubmissions from './collections/FormSubmissions';
import Testimonials from './collections/Testimonials';
import SecurityLogs from './collections/SecurityLogs';
import FAQ from './collections/FAQ';
import { EmailSettings } from './globals/EmailSettings';
import { FAQSettings } from './globals/FAQSettings';
import { SiteSettings } from './globals/SiteSettings';
import path from 'path';

export default buildConfig({
  admin: {
    user: Users.slug,
    avatar: {
      Component: './components/admin/CustomAvatar#default',
    },
    importMap: {
      baseDir: path.resolve(process.cwd(), 'src'),
    },
    livePreview: {
      url: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    },
    components: {
      // Temporarily disabled to troubleshoot webpack issue
      // beforeLogin: ['./components/admin/BeforeLogin#default'],
      afterDashboard: ['./components/admin/AdminEnhancements#default'],
      graphics: {
        Logo: './components/admin/graphics/Logo#default',
        Icon: './components/admin/graphics/Icon#default',
      },
      providers: ['./components/admin/AdminProvider#default'],
      views: {
        root: {
          Component: './components/admin/Root#default',
        },
      },
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
    dateFormat: 'dd MMMM, yyyy - HH:mm',
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
        ...customI18n.supportedLanguages.en.translations,
      },
      nl: {
        ...customI18n.supportedLanguages.nl.translations,
      },
    },
  },
  collections: [
    // Beheer Stemmen group - voiceover specific content
    Groups,
    Voiceovers,
    // Account Management group
    Users,
    // Opslag group - media storage
    Media,
    // Website group - main website content
    Pages,
    BlogPosts,
    Testimonials,
    FAQ,
    // Documents group
    Bookings,
    Scripts,
    Invoices,
    // Site Builder group
    Forms,
    FormSubmissions,
    // Email System group
    EmailComponents,
    EmailTemplates,
    EmailSequences,
    EmailLogs,
    EmailJobs,
    EmailCampaigns,
    EmailAudiences,
    EmailContacts,
    // System group
    SecurityLogs,
  ],
  globals: [EmailSettings, FAQSettings, SiteSettings],
  editor: lexicalEditor(),
  secret:
    process.env.PAYLOAD_SECRET ||
    (() => {
      throw new Error('PAYLOAD_SECRET environment variable is required');
    })(),
  typescript: {
    outputFile: './src/payload-types.ts',
  },
  serverURL: (() => {
    const url = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
    // Ensure URL has protocol
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  })(),
  cors: '*', // Allow all origins for development - restrict this in production
  csrf: [
    // Add your production domain here
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || '',
      // Optimized connection pooling for production performance
      max: parseInt(process.env.DB_POOL_MAX || '20', 10), // Maximum number of connections
      min: parseInt(process.env.DB_POOL_MIN || '5', 10), // Minimum number of connections
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10), // 30 seconds
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECT_TIMEOUT || '10000', 10), // 10 seconds
      // Enable keep-alive to detect broken connections
      keepAlive: true,
      keepAliveInitialDelayMillis: parseInt(process.env.DB_KEEPALIVE_DELAY || '10000', 10),
    },
  }),
  email: resendAdapter({
    defaultFromAddress: 'noreply@14voices.com',
    defaultFromName: '14voices',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  sharp,
  plugins: [
    // MinIO storage for self-hosted file uploads
    wrappedMinioStorage({
      collections: {
        media: true,
        scripts: true,
        invoices: true,
      },
      endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
      accessKeyId: process.env.S3_ACCESS_KEY || '',
      secretAccessKey: process.env.S3_SECRET_KEY || '',
      bucketName: process.env.S3_BUCKET || 'fourteenvoices-media',
      region: process.env.S3_REGION || 'us-east-1',
      publicUrl: process.env.S3_PUBLIC_URL,
    }),
  ],
});
