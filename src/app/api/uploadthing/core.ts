import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
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
    pdf: { maxFileSize: "16MB", maxFileCount: 1 },
    text: { maxFileSize: "4MB", maxFileCount: 1 },
    blob: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .input(z.object({ 
      bookingId: z.string(),
      scriptType: z.enum(["file", "text"]),
      scriptContent: z.string().optional(),
    }))
    .middleware(async ({ input }) => {
      const user = await authenticateUser();
      
      if (!user) {
        throw new UploadThingError("Unauthorized");
      }
      
      const payload = await getPayload();
      const booking = await payload.findByID({
        collection: 'bookings',
        id: input.bookingId,
        depth: 0,
      });
      
      if (!booking || booking.customer !== user.id) {
        throw new UploadThingError("Booking not found or unauthorized");
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
          booking: metadata.bookingId,
          uploadedBy: metadata.userId,
          type: metadata.scriptType,
          fileUrl: file.url,
          fileName: file.name,
          fileKey: file.key,
          fileSize: file.size,
          textContent: metadata.scriptContent,
        },
      });
      
      return { uploadedBy: metadata.userId };
    }),

  // Voiceover demo uploads (admin only)
  voiceoverDemo: f({
    audio: { maxFileSize: "32MB", maxFileCount: 1 },
  })
    .input(z.object({ 
      voiceoverId: z.string(),
      demoType: z.string(),
      demoYear: z.string(),
    }))
    .middleware(async ({ input }) => {
      const user = await authenticateUser();
      
      if (!user || user.role !== 'admin') {
        throw new UploadThingError("Admin access required");
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
      
      await payload.create({
        collection: 'voiceoverDemos',
        data: {
          voiceover: metadata.voiceoverId,
          uploadedBy: metadata.userId,
          name: `Demo ${metadata.demoType} ${metadata.demoYear}`,
          audio: {
            url: file.url,
            key: file.key,
            size: file.size,
          },
        },
      });
      
      return { uploadedBy: metadata.userId };
    }),

  // User avatar uploads
  userAvatar: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const user = await authenticateUser();
      
      if (!user) {
        throw new UploadThingError("Unauthorized");
      }
      
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const payload = await getPayload();
      
      await payload.update({
        collection: 'users',
        id: metadata.userId,
        data: {
          avatar: {
            url: file.url,
            key: file.key,
          },
        },
      });
      
      return { uploadedBy: metadata.userId };
    }),

  // Invoice uploads (admin only)
  invoice: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .input(z.object({ 
      bookingId: z.string(),
    }))
    .middleware(async ({ input }) => {
      const user = await authenticateUser();
      
      if (!user || user.role !== 'admin') {
        throw new UploadThingError("Admin access required");
      }
      
      return { 
        userId: user.id,
        bookingId: input.bookingId,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const payload = await getPayload();
      
      await payload.create({
        collection: 'invoices',
        data: {
          booking: metadata.bookingId,
          uploadedBy: metadata.userId,
          fileUrl: file.url,
          fileName: file.name,
          fileKey: file.key,
        },
      });
      
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;