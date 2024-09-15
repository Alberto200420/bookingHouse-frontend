import { cache } from 'react';

export type ServicesProps = {
  id: string;
  title: string;
  header_image: string;
  require_reservation: boolean;
};

export type CategoriesAndServicesProps = {
  image_display: string;
  category_name: string;
  services: ServicesProps[];
};

export const getCategoryAndServiceList = cache(async (): Promise<CategoriesAndServicesProps[]> => {
  try {
    const response = await fetch(`${process.env.API_BACKEND}/directory/categories/services/`, {
      next: { revalidate: 86400 } // Revalidate every day
    });

    if (!response.ok) {
      throw new Error('Failed to fetch category and service list');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching category and service list:', error);
    return [];
  }
});