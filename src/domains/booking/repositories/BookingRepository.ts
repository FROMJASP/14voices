import { Payload, Where } from 'payload';
import { Booking, BookingCreateParams, BookingUpdateParams } from '../types';

export class BookingRepository {
  constructor(private payload: Payload) {}

  async getBooking(id: string): Promise<Booking | null> {
    try {
      const booking = await this.payload.findByID({
        collection: 'bookings',
        id,
        depth: 2,
      });
      return booking as unknown as Booking;
    } catch {
      return null;
    }
  }

  async getUserBookings(userId: string, role: string = 'customer'): Promise<Booking[]> {
    const where: Where | undefined =
      role === 'admin'
        ? undefined
        : {
            or: [{ customer: { equals: userId } }, { voiceover: { equals: userId } }],
          };

    const response = await this.payload.find({
      collection: 'bookings',
      where,
      depth: 2,
      sort: '-createdAt',
    });

    return response.docs as unknown as Booking[];
  }

  async createBooking(data: BookingCreateParams): Promise<Booking> {
    const booking = await this.payload.create({
      collection: 'bookings',
      data: {
        ...data,
        customer: Number(data.customer),
        voiceover: Number(data.voiceover),
        status: 'pending',
      },
    });

    return booking as unknown as Booking;
  }

  async updateBooking(id: string, data: BookingUpdateParams): Promise<Booking> {
    const booking = await this.payload.update({
      collection: 'bookings',
      id,
      data,
    });

    return booking as unknown as Booking;
  }

  async deleteBooking(id: string): Promise<void> {
    await this.payload.delete({
      collection: 'bookings',
      id,
    });
  }

  async getBookingsByStatus(status: string): Promise<Booking[]> {
    const response = await this.payload.find({
      collection: 'bookings',
      where: {
        status: { equals: status },
      },
      depth: 2,
    });

    return response.docs as unknown as Booking[];
  }

  async getUpcomingBookings(days: number = 7): Promise<Booking[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const response = await this.payload.find({
      collection: 'bookings',
      where: {
        and: [
          { status: { not_equals: 'completed' } },
          { status: { not_equals: 'cancelled' } },
          { deadline: { less_than: futureDate.toISOString() } },
        ],
      },
      depth: 2,
      sort: 'deadline',
    });

    return response.docs as unknown as Booking[];
  }
}
