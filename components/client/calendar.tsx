'use client';

import React, { useState, ReactNode } from 'react';
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import { IoStar } from "react-icons/io5";
import { formatTime } from '@/functions/formatTime';
import { Reserve } from '@/functions/Reserve';
import Modal from '../server/modal';
import SignUpLogIn from '@/functions/SignUpLogIn';
import { useRouter, useParams } from 'next/navigation'

interface TimeSlot {
  date: string;
  times: string[];
}

interface DayAvailability {
  availableTimes: string[];
  DatesTimesNotAvailable: TimeSlot[];
}

interface Availabilities {
  [key: string]: DayAvailability;
}

interface AvailabilityCalendarProps {
  id: string;
  availabilities: Availabilities;
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ availabilities, id }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [reservationStatus, setReservationStatus] = useState<string | null>(null);
  const [attendees, setAttendees] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams<{ hotel: string }>()
  const router = useRouter()
  const [modalProps, setModalProps] = useState({
    title: '',
    content: '' as string | ReactNode,
    actionButtonText: '' as string | null,
    onAction: () => {}
  });

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const updateDate = (monthOffset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    return Array.from({ length: firstDayOfMonth + daysInMonth }).map((_, i) => {
      if (i < firstDayOfMonth) return <div key={`empty-${i}`} className="p-2"></div>;
      
      const day = i - firstDayOfMonth + 1;
      const date = new Date(year, month, day);
      const dayOfWeek = daysOfWeek[date.getDay()];
      const isAvailable = availabilities[dayOfWeek].availableTimes.length > 0;
      const isSelected = selectedDate && selectedDate.getTime() === date.getTime();

      return (
        <div
          key={day}
          className={`p-2 border cursor-pointer ${isAvailable ? 'hover:bg-blue-100' : 'bg-gray-200 cursor-not-allowed'} ${isSelected ? 'bg-blue-200' : ''}`}
          onClick={() => isAvailable && setSelectedDate(date)}
        >
          {day}
        </div>
      );
    });
  };

  const renderAvailableTimes = () => {
    if (!selectedDate) return null;

    const dayOfWeek = daysOfWeek[selectedDate.getDay()];
    const notAvailable = availabilities[dayOfWeek].DatesTimesNotAvailable.find(
      (item: TimeSlot) => item.date === selectedDate.toISOString().split('T')[0]
    );
    
    const availableTimes = availabilities[dayOfWeek].availableTimes.filter(
      time => !(notAvailable && notAvailable.times.includes(time))
    );

    return (
      <div className="mt-4">
        <h3 className="font-bold mb-2 text-gray-500">
          Available Times for <strong className='text-black font-medium'>{selectedDate.toDateString()}</strong>
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {availableTimes.map(time => (
            <button onClick={() => setSelectedHour(time)} key={time} className="p-2 border border-gray-400 hover:bg-blue-100 rounded">
              {formatTime(time)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const LogInForm = ({ onSubmit }: { onSubmit: (formData: any) => void }) => {
    const [formState, setFormState] = useState({
      name: '',
      roomNumber: null as number | null,
      checkIn: '',
      checkOut: ''
    });

    const handleInputChange = (field: string, value: any) => {
      setFormState(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formState);
    };

    return (
      <form onSubmit={handleSubmit} className="mt-4">
        {['name', 'roomNumber', 'checkIn', 'checkOut'].map((field, idx) => (
          <div key={idx} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{field.replace(/([A-Z])/g, ' $1')}</label>
            <input
              type={field === 'roomNumber' ? 'number' : field.includes('check') ? 'date' : 'text'}
              required
              value={(formState as any)[field] ?? ''}
              onChange={e => handleInputChange(field, field === 'roomNumber' ? parseInt(e.target.value) : e.target.value)}
              className="block w-full mt-1 p-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-150">
          Log in
        </button>
      </form>
    );
  };

  const closeModal = () => setIsModalOpen(false);

  const reserve = async () => {
    if (!selectedDate || !selectedHour || !attendees) {
      setReservationStatus('Please fill out the form.');
      return;
    }

    try {
      const reservationData = {
        service: id,
        number_of_people: attendees,
        booking_date: `${selectedDate.toISOString().split('T')[0]} ${selectedHour}`
      };
      console.log(reservationData)
      const response = await Reserve(reservationData);

      setModalProps({
        title: "Booked successfully",
        content: `${response.message}. Check your email for the details.`,
        actionButtonText: 'Close',
        onAction: () => router.push(`/${params.hotel}`)
      });
      setIsModalOpen(true);
    } catch (error) {
      setModalProps({
        title: "Register to book",
        content: <LogInForm onSubmit={handleAction} />,
        actionButtonText: null,
        onAction: () => {}
      });
      setIsModalOpen(true);
    }
  };

  const handleAction = async (formData: any) => {
    try {
      await SignUpLogIn("gogufase16@gmail.com", "qwert!123", "Ricardo", "Meza");
      console.log(formData);
      closeModal();
      // Attempt to make the reservation again
      await reserve();
    } catch (error) {
      console.error('Login failed:', error);
      setReservationStatus('Login failed. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => updateDate(-1)}><MdOutlineChevronLeft /></button>
        <h2 className="text-xl font-bold">{currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</h2>
        <button onClick={() => updateDate(1)}><MdOutlineChevronRight /></button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map(day => <div key={day} className="font-bold">{day.slice(0, 3)}</div>)}
        {renderCalendar()}
      </div>

      {renderAvailableTimes()}

      {selectedHour && (
        <div className="mt-6">
          <label className="block text-gray-700 font-bold mb-2">Number of people who will attend</label>
          <input
            type="number"
            value={attendees}
            onChange={(e) => setAttendees(parseInt(e.target.value))}
            min={1}
            className="block rounded-md border border-gray-300 py-2 px-3 shadow-sm"
          />
        </div>
      )}

      {selectedDate && selectedHour && (
        <h3 className='text-center mt-6 font-bold text-gray-500'>
          You will be reserving <strong className='text-black font-medium'>{selectedDate.toDateString()}</strong> at <strong className='text-black font-medium'>{formatTime(selectedHour)}</strong> for <strong className='text-black font-medium'>{attendees}</strong> {attendees === 1 ? 'person' : 'people'}.
        </h3>
      )}

      {reservationStatus && <p className={`text-center mt-4 ${reservationStatus.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>{reservationStatus}</p>}

      <section className="flex items-center justify-between pt-6 pb-3 px-4">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold">4.98</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => <IoStar key={i} className="w-4 h-4 fill-current text-yellow-400" />)}
          </div>
          <span className="text-gray-600 text-sm">(450)</span>
        </div>

        <button onClick={reserve} className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-all duration-150">Book now</button>
      </section>

      <Modal
        isOpen={isModalOpen}
        title={modalProps.title}
        content={modalProps.content}
        onClose={closeModal}
        actionButtonText={modalProps.actionButtonText}
        onAction={modalProps.onAction}
      />
    </div>
  );
};

export default AvailabilityCalendar;
