import { CollectionAfterChangeHook } from 'payload';
import { triggerEmailSequence } from '@/lib/email/sequences';

export const afterUserCreate: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  if (operation === 'create' && doc.email) {
    try {
      await triggerEmailSequence({
        sequenceKey: 'user-onboarding',
        userId: doc.id,
        variables: {
          userName: doc.name || doc.email,
          userEmail: doc.email,
        },
        payload: req.payload,
      });
    } catch (error) {
      console.error('Failed to trigger user onboarding sequence:', error);
    }
  }
};

export const afterBookingCreate: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  if (operation === 'create' && doc.customer) {
    try {
      const user = await req.payload.findByID({
        collection: 'users',
        id: doc.customer,
      });

      if (user && !user.emailPreferences?.unsubscribed) {
        const { sendEmail } = await import('@/lib/email/renderer');

        await sendEmail({
          templateKey: 'booking-confirmation',
          recipient: {
            email: user.email,
            name: user.name || undefined,
          },
          variables: {
            bookingId: doc.id,
            bookingDate: doc.date,
            voiceoverName:
              typeof doc.voiceover === 'object' && doc.voiceover ? doc.voiceover.name || '' : '',
          },
          payload: req.payload,
        });
      }
    } catch (error) {
      console.error('Failed to send booking confirmation:', error);
    }
  }
};

export const afterScriptUpload: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  operation,
}) => {
  if (operation === 'update' && doc.status === 'uploaded' && previousDoc.status !== 'uploaded') {
    try {
      const booking = await req.payload.findByID({
        collection: 'bookings',
        id: doc.booking,
        depth: 2,
      });

      if (
        booking?.customer &&
        typeof booking.customer === 'object' &&
        'email' in booking.customer &&
        !booking.customer.emailPreferences?.unsubscribed
      ) {
        const { sendEmail } = await import('@/lib/email/renderer');

        await sendEmail({
          templateKey: 'script-received',
          recipient: {
            email: booking.customer.email,
            name: booking.customer.name || undefined,
          },
          variables: {
            scriptTitle: doc.title,
            voiceoverName:
              typeof booking.voiceover === 'object' && booking.voiceover
                ? booking.voiceover.name || ''
                : '',
          },
          payload: req.payload,
        });
      }
    } catch (error) {
      console.error('Failed to send script received email:', error);
    }
  }
};
