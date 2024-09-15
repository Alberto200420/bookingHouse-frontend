'use client';
import { createContext, ReactNode, useState, useContext } from 'react';

interface HotelContextProps {
  hotelId: number | null;
  setHotelId: (id: number) => void;
}

const HotelContext = createContext<HotelContextProps | undefined>(undefined);

export function HotelContextProvider({ children }: { children: ReactNode }) {
  const [hotelId, setHotelId] = useState<number | null>(null);

  return (
    <HotelContext.Provider value={{ hotelId, setHotelId }}>
      {children}
    </HotelContext.Provider>
  );
}

export function useHotelContext() {
  const context = useContext(HotelContext);
  if (context === undefined) {
    throw new Error('useHotelContext must be used within a HotelContextProvider');
  }
  return context;
}