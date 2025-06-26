import { CollectionAfterChangeHook, CollectionAfterCreateHook } from 'payload'
import { triggerEmailSequence } from '@/lib/email/sequences'

export const afterUserCreate: CollectionAfterCreateHook = async ({
  doc,
  req,
  operation,
}) => {
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
      })
    } catch (error) {
      console.error('Failed to trigger user onboarding sequence:', error)
    }
  }
}

export const afterBookingCreate: CollectionAfterCreateHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation === 'create' && doc.customer) {
    try {
      const user = await req.payload.findByID({
        collection: 'users',
        id: doc.customer,
      })
      
      if (user && !user.emailPreferences?.unsubscribed) {
        const { sendEmail } = await import('@/lib/email/renderer')
        
        await sendEmail({
          templateKey: 'booking-confirmation',
          recipient: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          variables: {
            bookingId: doc.id,
            bookingDate: doc.date,
            voiceoverName: doc.voiceover?.name,
          },
          payload: req.payload,
        })
      }
    } catch (error) {
      console.error('Failed to send booking confirmation:', error)
    }
  }
}

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
      })
      
      if (booking?.user && !booking.user.emailPreferences?.unsubscribed) {
        const { sendEmail } = await import('@/lib/email/renderer')
        
        await sendEmail({
          templateKey: 'script-received',
          recipient: {
            id: booking.user.id,
            email: booking.user.email,
            name: booking.user.name,
          },
          variables: {
            scriptTitle: doc.title,
            voiceoverName: booking.voiceover?.name,
          },
          payload: req.payload,
        })
      }
    } catch (error) {
      console.error('Failed to send script received email:', error)
    }
  }
}