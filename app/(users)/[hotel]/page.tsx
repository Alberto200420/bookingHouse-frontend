import logo from "@/assets/buenaventura-horizontal-logo.jpg"
import type { Metadata, ResolvingMetadata } from "next";
import { PiCalendarCheckLight } from "react-icons/pi";
import { notFound } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";

type Props = { params: { hotel: string } };
type HotelData = { id: number; hotel_name: string; logo: string; };

async function getHotelData(path: string): Promise<HotelData | null> {
  try {
    const response = await fetch(`${process.env.API_BACKEND}/hotel/get/${path}/`, { next: { revalidate: 3600 } });
    
    if (!response.ok) {
      throw new Error('Failed to fetch hotel data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching hotel data:', error);
    return null;
  }
}

export async function generateMetadata( { params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const hotelData = await getHotelData(params.hotel);

  if (!hotelData) {
    return {
      title: 'Hotel Not Found',
      description: 'The requested hotel could not be found.',
    };
  }

  return {
    title: hotelData.hotel_name,
    description: `Disfruta de tus vacaciones en ${hotelData.hotel_name}. Reserva servicios, encuentra todo lo que necesitas para ti.`,
    openGraph: {
      images: [hotelData.logo],
    },
  };
}

export default async function HotelPage({ params }: Props) {

  const hotelData = await getHotelData(params.hotel);

  if (!hotelData) {
    notFound();
  }

  console.log(hotelData.logo)
  return (
    <div>
      {/* navbar */}
      <header>
        <nav aria-label="Global" className="flex items-center justify-between pt-6 ">
            <div className="flex lg:flex-1">
              <Image
                alt={`${hotelData.hotel_name} logo`}
                src={logo}
                width={200}
                height={200}
              />
            </div>
            <div className=" lg:flex lg:flex-1 lg:justify-end">
              <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                Log in <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </nav>
      </header>

      <main>

      <div className="flex items-center justify-between lg:m-8 mt-8">
        <div className="flex items-center">
          <PiCalendarCheckLight className="text-2xl text-brown-500 mr-2 h-8 w-8" />
          <span className="text-sm text-gray-800 md:text-lg">What&apos;s on next</span>
        </div>
        <Link href={'/'} className="bg-brown-500 rounded hover:bg-brown-600 transition text-sm md:text-lg">
          See all today&apos;s services
        </Link>
      </div>

      </main>
    </div>
  );
}