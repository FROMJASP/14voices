import { Payload } from 'payload';
import { BookingRepository } from '../repositories/BookingRepository';
import { ScriptRepository } from '../repositories/ScriptRepository';
import { ScriptService } from './ScriptService';
import { Booking, BookingCreateParams, BookingUpdateParams, Script } from '../types';
import { 
  BookingNotFoundError, 
  BookingFailedError, 
  ForbiddenError,
  ValidationError,
  DatabaseError 
} from '@/lib/errors';
import { logger } from '@/lib/errors/logger';

export class BookingService {
  private bookingRepository: BookingRepository;
  private scriptRepository: ScriptRepository;
  private scriptService: ScriptService;

  constructor(payload: Payload) {
    this.bookingRepository = new BookingRepository(payload);
    this.scriptRepository = new ScriptRepository(payload);
    this.scriptService = new ScriptService(this.scriptRepository);
  }

  // Bookings
  async getBooking(bookingId: string, userId: string, userRole: string): Promise<Booking | null> {
    if (!bookingId) {
      throw new ValidationError('Booking ID is required');
    }

    try {
      logger.debug(`Fetching booking: ${bookingId}`, {
        action: 'get_booking',
        metadata: { bookingId, userId, userRole },
      });

      const booking = await this.bookingRepository.getBooking(bookingId);

      if (!booking) {
        return null;
      }

      // Check access permissions
      if (userRole !== 'admin') {
        const customerId =
          typeof booking.customer === 'object' ? booking.customer.id : booking.customer;
        const voiceoverId =
          typeof booking.voiceover === 'object' ? booking.voiceover.id : booking.voiceover;

        if (customerId !== userId && voiceoverId !== userId) {
          logger.warn(`Access denied to booking ${bookingId} for user ${userId}`, {
            action: 'booking_access_denied',
            metadata: { bookingId, userId, customerId, voiceoverId },
          });
          throw new ForbiddenError(`booking/${bookingId}`);
        }
      }

      logger.info(`Successfully fetched booking: ${bookingId}`, {
        action: 'booking_fetched',
        metadata: { bookingId, userId },
      });

      return booking;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw error;
      }

      logger.error(`Failed to fetch booking: ${bookingId}`, error, {
        action: 'get_booking_error',
        metadata: { bookingId, userId },
      });

      throw new DatabaseError('getBooking', error);
    }
  }

  async getUserBookings(userId: string, userRole: string): Promise<Booking[]> {
    return this.bookingRepository.getUserBookings(userId, userRole);
  }

  async createBooking(data: BookingCreateParams): Promise<Booking> {
    try {
      // Validate required fields
      if (!data.customer || !data.voiceover || !data.title) {
        throw new ValidationError('Missing required booking fields', {
          customer: !data.customer,
          voiceover: !data.voiceover,
          title: !data.title,
        });
      }

      logger.info('Creating new booking', {
        action: 'create_booking',
        metadata: {
          customer: data.customer,
          voiceover: data.voiceover,
          title: data.title,
        },
      });

      const booking = await this.bookingRepository.createBooking(data);

      logger.info(`Booking created successfully: ${booking.id}`, {
        action: 'booking_created',
        metadata: { bookingId: booking.id },
      });

      return booking;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }

      logger.error('Failed to create booking', error, {
        action: 'create_booking_error',
        metadata: data,
      });

      throw new BookingFailedError('Unable to create booking', error);
    }
  }

  async updateBooking(
    bookingId: string,
    data: BookingUpdateParams,
    userId: string,
    userRole: string
  ): Promise<Booking> {
    try {
      const booking = await this.getBooking(bookingId, userId, userRole);

      if (!booking) {
        throw new BookingNotFoundError(bookingId);
      }

      // Only admin or customer can update
      const customerId =
        typeof booking.customer === 'object' ? booking.customer.id : booking.customer;
      if (userRole !== 'admin' && customerId !== userId) {
        logger.warn(`Update access denied for booking ${bookingId}`, {
          action: 'booking_update_denied',
          metadata: { bookingId, userId, customerId },
        });
        throw new ForbiddenError(`booking/${bookingId}`);
      }

      logger.info(`Updating booking: ${bookingId}`, {
        action: 'update_booking',
        metadata: { bookingId, updates: Object.keys(data) },
      });

      const updatedBooking = await this.bookingRepository.updateBooking(bookingId, data);

      logger.info(`Booking updated successfully: ${bookingId}`, {
        action: 'booking_updated',
        metadata: { bookingId },
      });

      return updatedBooking;
    } catch (error) {
      if (error instanceof BookingNotFoundError || error instanceof ForbiddenError) {
        throw error;
      }

      logger.error(`Failed to update booking: ${bookingId}`, error, {
        action: 'update_booking_error',
        metadata: { bookingId, data },
      });

      throw new BookingFailedError('Unable to update booking', error);
    }
  }

  async deleteBooking(bookingId: string, _userId: string, userRole: string): Promise<void> {
    // Only admin can delete bookings
    if (userRole !== 'admin') {
      throw new Error('Access denied');
    }

    await this.bookingRepository.deleteBooking(bookingId);
  }

  async getBookingsByStatus(status: string): Promise<Booking[]> {
    return this.bookingRepository.getBookingsByStatus(status);
  }

  async getUpcomingBookings(days: number = 7): Promise<Booking[]> {
    return this.bookingRepository.getUpcomingBookings(days);
  }

  // Scripts
  async getScript(scriptId: string, userId: string, userRole: string): Promise<Script | null> {
    return this.scriptService.getScript(scriptId, userId, userRole);
  }

  async deleteScript(scriptId: string, userId: string, userRole: string): Promise<void> {
    return this.scriptService.deleteScript(scriptId, userId, userRole);
  }

  async getUserScripts(userId: string, userRole: string): Promise<Script[]> {
    return this.scriptService.getUserScripts(userId, userRole);
  }

  // Direct repository access for complex operations
  get bookingRepo() {
    return this.bookingRepository;
  }

  get scriptRepo() {
    return this.scriptRepository;
  }
}
