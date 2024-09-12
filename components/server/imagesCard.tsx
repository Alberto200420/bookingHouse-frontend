import { TodayServicesProps } from "@/functions/GetTodayServices";
import Link from "next/link";

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = ((hours + 11) % 12 + 1); // Convertir a formato de 12 horas
  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export default function ImagesCard({ id, title, header_image, domain, availabilities, require_reservation }: TodayServicesProps ) {
  return (
    <div className="group relative rounded-lg shadow hover:shadow-lg transition-all">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg">
        <img
          alt={title}
          src={'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg'}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">
          <Link href={`${domain}/service/${id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {title}
          </Link>
        </h3>
        {availabilities.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium">Available times:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {availabilities.map((time, index) => (
                <span key={index} className="text-xs bg-gray-200 rounded-md px-2 py-1">
                  {formatTime(time)}
                </span>
              ))}
            </div>
          </div>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {require_reservation ? 'Reservation required' : 'No reservation needed'}
        </p>
      </div>
    </div>
  );
}