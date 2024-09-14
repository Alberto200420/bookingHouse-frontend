'use server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache'

interface ReserveParams {
  service: string;
  number_of_people: number;
  booking_date: string;
}

interface ReservationResponse {
  message: string;
  reservation_id: string;
}

export const Reserve = async (params: ReserveParams): Promise<ReservationResponse> => {
  const cookieStore = cookies();
  const accessCookie = cookieStore.get('access')?.value;

  try {
    const response = await fetch(`${process.env.API_BACKEND}/reservations/reserve/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${accessCookie}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred while making the reservation');
    }

    const data: ReservationResponse = await response.json();
    console.log('Reservation created successfully:', data.message);
    revalidatePath('/(users)/[hotel]', 'page')
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Reservation failed:', error.message);
      throw error;
    } else {
      console.error('An unknown error occurred');
      throw new Error('An unknown error occurred');
    }
  }
};