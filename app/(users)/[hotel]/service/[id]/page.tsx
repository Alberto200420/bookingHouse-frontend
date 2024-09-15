import PathHeader from '@/components/client/pathHeader';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { LuBookOpen } from "react-icons/lu";
import AvailabilityCalendar from '@/components/client/calendar';

// TypeScript interface for the API response
interface TimeSlot {
  date: string;
  times: string[];
}

interface ServiceData {
  id: string;
  category: string;
  title: string;
  menu: string | null;
  header_image: string;
  description: string;
  availabilities: Record<string, { availableTimes: string[], DatesTimesNotAvailable: TimeSlot[] }>;
  requirement: string;
  require_reservation: boolean;
  maximum_capacity: number;
  images: Array<{
    description: string;
    image: string;
  }>;
}

// Function to generate SEO metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const response = await fetch(`${process.env.API_BACKEND}/directory/service/${params.id}/`);
  const service: ServiceData = await response.json();

  if (!service) {
    return {
      title: 'Service not found',
      description: 'The requested service could not be found.',
    };
  }

  return {
    title: service.title,
    description: service.description.slice(0, 160),
    openGraph: {
      images: `${process.env.API_BACKEND}${service.header_image}`,
      title: service.title,
      description: service.description.slice(0, 160),
    },
  };
}

// ServicePage component that fetches data on the server-side
export default async function ServicePage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.API_BACKEND}/directory/service/${params.id}/`, {cache: 'no-store'} );
  if (!res.ok) {
    notFound();
  }

  const service: ServiceData = await res.json();

  return (
    <main>
      {/* Full width, partial length header image */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        <Image
          src={`${service.header_image}`}
          alt={service.title}
          fill={true}  // Ensure it fills the container
          className="object-cover object-center"  // Maintain aspect ratio, cover the area object-none
        />
        {/* You can add overlay content here if needed */}
      </div>
      <div className="max-w-screen-lg mx-auto">

        <section className="mb-8 px-4">
          
          {/* path var */}
          <PathHeader ServiceName={service.title} />

          <h2 className="text-3xl md:text-5xl font-bold mb-2 text-center">{service.title}</h2>

          {service.menu && (
            <div className="flex items-center my-6">
              <a href={`${service.menu}`} target="_blank" className='bg-gray-400 py-1 px-2 flex items-center rounded'>
                <LuBookOpen className="text-brown-500 text-2xl mr-2" />
                <span className="text-lg">Menu</span>
              </a>
            </div>
          )}

          <p className="mb-4 text-lg">{service.description}</p>

          {service.requirement && (
            <div className="mb-4">
              <h3 className="text-2xl font-bold mb-2">Requirements</h3>
              <p>{service.requirement}</p>
            </div>
          )}

          {service.maximum_capacity && (
            <div>
              <div className='flex items-center' >
              <h3 className="text-2xl font-bold">Max Capacity</h3>
              {service.require_reservation ? <p className="ml-1 text-red-600 text-sm">**Reservation required**</p> : <div></div> }
              </div>
              <p className='text-lg'>{service.maximum_capacity} people</p>
            </div>
          )}
        </section>

        {/* Image gallery section */}
        <section className="mb-8 px-4">
          <h3 className="text-2xl font-bold mb-4">Live the experience</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {service.images.map((img, index) => (
              <div key={index} className="relative">
                <div className="relative w-full h-48">
                  <Image 
                    src={`${img.image}`} 
                    alt={img.description}
                    fill={true}  // Ensures the image fills the container
                    className="object-cover rounded-lg"  // Same styling as before
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                  {img.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        <AvailabilityCalendar availabilities={service.availabilities} id={service.id} />

      </div>
    </main>
  );
}