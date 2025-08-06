import { Payload } from 'payload';
import { BookingRepository } from '../repositories/BookingRepository';
import { ScriptRepository } from '../repositories/ScriptRepository';
import { ScriptService } from './ScriptService';
import { Booking, BookingCreateParams, BookingUpdateParams, Script } from '../types';

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
        throw new Error('Access denied');
      }
    }

    return booking;
  }

  async getUserBookings(userId: string, userRole: string): Promise<Booking[]> {
    return this.bookingRepository.getUserBookings(userId, userRole);
  }

  async createBooking(data: BookingCreateParams): Promise<Booking> {
    return this.bookingRepository.createBooking(data);
  }

  async updateBooking(
    bookingId: string,
    data: BookingUpdateParams,
    userId: string,
    userRole: string
  ): Promise<Booking> {
    const booking = await this.getBooking(bookingId, userId, userRole);

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Only admin or customer can update
    const customerId =
      typeof booking.customer === 'object' ? booking.customer.id : booking.customer;
    if (userRole !== 'admin' && customerId !== userId) {
      throw new Error('Access denied');
    }

    return this.bookingRepository.updateBooking(bookingId, data);
  }

  async deleteBooking(bookingId: string, userId: string, userRole: string): Promise<void> {
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
