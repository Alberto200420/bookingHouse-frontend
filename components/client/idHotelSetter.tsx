'use client';
import { useEffect } from 'react';
import { useHotelContext } from './contexStore';

interface HotelIdSetterProps {
  hotelId: number;
}

export default function IdHotelSetter({ hotelId }: HotelIdSetterProps) {
  const { setHotelId } = useHotelContext();

  useEffect(() => {
    setHotelId(hotelId);
  }, [hotelId, setHotelId]);

  return null; // This component doesn't render anything
}