import PathHeader from '@/components/client/pathHeader';
import { IoStar } from "react-icons/io5";
import { Metadata } from 'next';
// import Image from 'next/image';
import { notFound } from 'next/navigation';
import { LuBookOpen } from "react-icons/lu";

// TypeScript interface for the API response
interface ServiceData {
  id: string;
  category: string;
  title: string;
  menu: string | null;
  header_image: string;
  description: string;
  availabilities: Record<string, any>;
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

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = ((hours + 11) % 12 + 1); // Convertir a formato de 12 horas
  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// ServicePage component that fetches data on the server-side
export default async function ServicePage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.API_BACKEND}/directory/service/${params.id}/`, {cache: 'no-store'} );
  if (!res.ok) {
    notFound();
  }

  const service: ServiceData = await res.json();

  return (
    <main>
        <img
          src={'https://litter.catbox.moe/9i0j6r.jpeg'}
          alt={service.title}
          className="mb-4 w-full h-1/3"
        />
      <div className="max-w-screen-lg mx-auto">

        <section className="mb-8 px-4">
          
          {/* path var */}
          <PathHeader ServiceName={service.title} />

          <h2 className="text-3xl md:text-5xl font-bold mb-2 text-center">{service.title}</h2>

          {service.menu && (
            <div className="flex items-center mb-4">
              <a href="#" className='bg-gray-400 p-1 flex items-center rounded'>
                <LuBookOpen className="text-brown-500 text-2xl mr-2" />
                <span className="text-lg">Menu</span>
              </a>
            </div>
          )}

          <p className="mb-2 text-lg">{service.description}</p>

          {service.requirement && (
            <div className="mb-4">
              <h3 className="text-2xl font-bold mb-2">Requirements</h3>
              <p>{service.requirement}</p>
            </div>
          )}

          {service.maximum_capacity && (
            <div className="mb-4">
              <h3 className="text-2xl font-bold mb-2">Max Capacity</h3>
              <p>{service.maximum_capacity} people</p>
            </div>
          )}

          {service.require_reservation && (
            <p className="mb-2">Reservation required</p>
          )}
        </section>

        {/* Image gallery section */}
        <section className="mb-8 px-4">
          <h3 className="text-2xl font-bold mb-4">Live the experience</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {service.images.map((img, index) => (
              <div key={index} className="relative">
                <img 
                  src={`${process.env.API_BACKEND}${img.image}`} 
                  alt={img.description} 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                  {img.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-between pt-6 pb-10 px-4">
          <div className="md:flex items-center md:space-x-2 space-x-0">
            <div className="md:text-2xl text-sm font-bold">4.98</div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <IoStar key={i} className="w-4 h-4 fill-current text-yellow-400 md:w-7 md:h-7" />
              ))}
            </div>
            <div className="text-sm text-gray-600 underline">84 Evaluaciones</div>
          </div>
          <button className="px-12 py-2 border border-[#0800FA] text-[#0800FA] rounded-md hover:bg-[#0800FA] hover:text-white transition-colors">
            Reserve
          </button>
        </section>

      </div>
    </main>
  );
}

          {/* <div className="mb-4">
            <h3 className="text-xl font-semibold">Available Times</h3>
            {Object.keys(service.availabilities).map((day) => (
              <div key={day} className="mb-2">
                <h4 className="font-bold">{day}</h4>
                <p>
                  {service.availabilities[day].availableTimes
                    .map((time: string) => formatTime(time))
                    .join(", ")}
                </p>
              </div>
            ))}
          </div> */}