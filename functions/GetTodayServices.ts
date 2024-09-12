import { cache } from 'react';

export type TodayServicesProps = {
  id: string;
  title: string;
  domain: string;
  header_image: string;
  availabilities: string[];
  require_reservation: boolean;
};

export const getTodayServices = cache(async (): Promise<TodayServicesProps[]> => {
  try {
    const response = await fetch(`${process.env.API_BACKEND}/directory/services/today/`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch today\'s services');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching today\'s services:', error);
    return [];
  }
});