import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { z } from 'zod';
import { getPayload } from '@/utilities/payload';
import { headers } from 'next/headers';

const f = createUploadthing();

async function authenticateUser() {
  const payload = await getPayload();
  const headersList = await headers();
  const authHeader = headersList.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  // const token = authHeader.split(' ')[1];

  try {
    const { user } = await payload.auth({ headers: headersList });
    return user;
  } catch {
    return null;
  }
}

export const ourFileRouter = {
  // Customer booking script uploads
  bookingScript: f({
    pdf: { maxFileSize: '16MB', maxFileCount: 1 },
    text: { maxFileSize: '4MB', maxFileCount: 1 },
    blob: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .input(
      z.object({
        bookingId: z.string(),
        scriptType: z.enum(['file', 'text']),
        scriptContent: z.string().optional(),
      })
    )
    .middleware(async ({ input }) => {
      const user = await authenticateUser();

      if (!user) {
        throw new UploadThingError('Unauthorized');
      }

      const payload = await getPayload();
      const booking = await payload.findByID({
        collection: 'bookings',
        id: input.bookingId,
        depth: 0,
      });

      if (!booking || booking.customer !== user.id) {
        throw new UploadThingError('Booking not found or unauthorized');
      }

      return {
        userId: user.id,
        bookingId: input.bookingId,
        scriptType: input.scriptType,
        scriptContent: input.scriptContent,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const payload = await getPayload();

      await payload.create({
        collection: 'scripts',
        data: {
          title: `Script for booking ${metadata.bookingId}`,
          uploadedBy: metadata.userId,
          scriptType: 'other', // Default to 'other' for uploaded scripts
          language: 'en', // Default to English
          confidentialityLevel: 'standard', // Default confidentiality level
          originalFilename: file.name,
          filename: file.name,
          url: file.url,
          filesize: file.size,
        },
      });

      return { uploadedBy: metadata.userId };
    }),

  // Voiceover demo uploads (admin only)
  voiceoverDemo: f({
    audio: { maxFileSize: '32MB', maxFileCount: 1 },
  })
    .input(
      z.object({
        voiceoverId: z.string(),
        demoType: z.string(),
        demoYear: z.string(),
      })
    )
    .middleware(async ({ input }) => {
      const user = await authenticateUser();

      if (!user || user.role !== 'admin') {
        throw new UploadThingError('Admin access required');
      }

      return {
        userId: user.id,
        voiceoverId: input.voiceoverId,
        demoType: input.demoType,
        demoYear: input.demoYear,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const payload = await getPayload();

      // Create media entry for the demo
      const mediaEntry = await payload.create({
        collection: 'media',
        data: {
          filename: file.name,
          filesize: file.size,
          mimeType: 'audio/mpeg',
          url: file.url,
          alt: `Demo ${metadata.demoType} ${metadata.demoYear}`,
          uploadedBy: metadata.userId,
        },
      });

      // Update voiceover with the demo based on demo type
      const updateData: Record<string, any> = {};
      if (metadata.demoType === 'full') {
        updateData.fullDemoReel = mediaEntry.id;
      } else if (metadata.demoType === 'commercials') {
        updateData.commercialsDemo = mediaEntry.id;
      } else if (metadata.demoType === 'narrative') {
        updateData.narrativeDemo = mediaEntry.id;
      }

      await payload.update({
        collection: 'voiceovers',
        id: metadata.voiceoverId,
        data: updateData,
      });

      return { uploadedBy: metadata.userId };
    }),

  // User avatar uploads
  userAvatar: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      const user = await authenticateUser();

      if (!user) {
        throw new UploadThingError('Unauthorized');
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const payload = await getPayload();

      // Create media entry for the avatar
      const mediaEntry = await payload.create({
        collection: 'media',
        data: {
          filename: file.name,
          filesize: file.size,
          mimeType: file.type || 'image/jpeg',
          url: file.url,
          alt: 'User avatar',
          uploadedBy: metadata.userId,
        },
      });

      // Update user with the avatar media ID
      await payload.update({
        collection: 'users',
        id: metadata.userId,
        data: {
          avatar: mediaEntry.id,
        },
      });

      return { uploadedBy: metadata.userId };
    }),

  // Invoice uploads (admin only)
  invoice: f({
    pdf: { maxFileSize: '8MB', maxFileCount: 1 },
  })
    .input(
      z.object({
        bookingId: z.string(),
      })
    )
    .middleware(async ({ input }) => {
      const user = await authenticateUser();

      if (!user || user.role !== 'admin') {
        throw new UploadThingError('Admin access required');
      }

      return {
        userId: user.id,
        bookingId: input.bookingId,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const payload = await getPayload();

      // Generate invoice number
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      const count = await payload.count({
        collection: 'invoices',
        where: {
          invoiceNumber: {
            contains: `INV-${year}-${month}`,
          },
        },
      });
      const invoiceNumber = `INV-${year}-${month}-${String(count.totalDocs + 1).padStart(3, '0')}`;

      // For now, we'll need to determine client and provider
      // This would typically come from the booking data
      await payload.create({
        collection: 'invoices',
        data: {
          invoiceNumber,
          client: metadata.userId, // This should be determined from booking
          provider: metadata.userId, // This should be determined from booking
          status: 'draft',
          amount: 0, // This should be calculated from booking
          currency: 'USD',
          issueDate: new Date().toISOString(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          originalFilename: file.name,
          filename: file.name,
          filesize: file.size,
          url: file.url,
          mimeType: 'application/pdf',
        },
      });

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
