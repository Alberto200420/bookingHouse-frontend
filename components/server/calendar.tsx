'use client';

import React, { useState } from 'react';
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import { IoStar } from "react-icons/io5";
import { formatTime } from '@/functions/formatTime';
import { Reserve } from '@/functions/Reserve';
import Modal from './modal';

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

const daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ availabilities, id }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [reservationStatus, setReservationStatus] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState<string>('');
  const [roomNumber, setRoomNumber] = useState<number | undefined>(undefined);
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');

  const getDaysInMonth = (year: number, month: number): number => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number): number => new Date(year, month, 1).getDay();

  // components
  const renderCalendar = (): React.JSX.Element[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days: JSX.Element[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = daysOfWeek[date.getDay()];
      const isAvailable = availabilities[dayOfWeek].availableTimes.length > 0;
      const isSelected = selectedDate && selectedDate.getTime() === date.getTime();

      days.push(
        <div
          key={day}
          className={`p-2 border cursor-pointer ${isAvailable ? 'hover:bg-blue-100' : 'bg-gray-200 cursor-not-allowed'} ${isSelected ? 'bg-blue-200' : ''}`}
          onClick={() => isAvailable && setSelectedDate(date)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const renderAvailableTimes = (): React.JSX.Element | null => {
    if (!selectedDate) return null;

    const dayOfWeek = daysOfWeek[selectedDate.getDay()];
    let availableTimes = [...availabilities[dayOfWeek].availableTimes];

    // Check if the selected date is in DatesTimesNotAvailable
    const notAvailable = availabilities[dayOfWeek].DatesTimesNotAvailable.find(
      (item: TimeSlot) => item.date === selectedDate.toISOString().split('T')[0]
    );

    if (notAvailable) {
      availableTimes = availableTimes.filter(time => !notAvailable.times.includes(time));
    }

    return (
      <div className="mt-4">
        <h3 className="font-bold mb-2 text-gray-500">Available Times for <strong className='text-black font-medium'>{selectedDate.toDateString()}</strong></h3>
        <div className="grid grid-cols-4 gap-2">
          {availableTimes.map(time => (
            <button onClick={() => setSelectedHour(time)} key={time} className="p-2 border border-gray-400 hover:bg-blue-100 rounded">{formatTime(time)}</button>
          ))}
        </div>
      </div>
    );
  };

  function LogInForm () {
    return (
      <div className="mt-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full mt-1 p-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Room Number</label>
          <input
            type="number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(parseInt(e.target.value))}
            className="block w-full mt-1 p-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            placeholder="Enter room number"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="block w-full mt-1 p-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="block w-full mt-1 p-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          />
        </div>
      </div>
    )
  }

  // functions
  const reserve = async () => {
    if (!selectedDate || !selectedHour || !attendees) {
      setReservationStatus('Please fill out the form.');
      return;
    }

    try {
      const reservationDateTime = `${selectedDate.toISOString().split('T')[0]} ${selectedHour}:00`;
      const reservationData = {
        service: id,
        number_of_people: attendees,
        reservation_name: 'Ricardo Meza', // Replace with dynamic data if needed
        booking_date: reservationDateTime,
      };
      const response = await Reserve(reservationData);
      setReservationStatus(`Reservation successful! ID: ${response.reservation_id}`);
    } catch (error: any) {
      setIsModalOpen(true)
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleAction = () => {
    console.log('Action performed');
    setIsModalOpen(false)
  };

  return (
    <div className="p-4">
      {/* buttons arrow bar */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
          <MdOutlineChevronLeft />
        </button>
        <h2 className="text-xl font-bold">{currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</h2>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
          <MdOutlineChevronRight />
        </button>
      </div>

      {/* calendar */}
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map(day => (
          <div key={day} className="font-bold">{day.slice(0, 3)}</div>
        ))}
        {renderCalendar()}
      </div>

      {/* availabilities housr */}
      {renderAvailableTimes()}

      {/* Improved Number of Attendees Section */}
      {selectedHour && (
        <div className="sm:col-span-2 sm:col-start-1 mt-6">
          <label className="block text-gray-700 font-bold mb-2">Number of people who will attend</label>
          <div className="mt-2">
            <input
              type="number"
              value={attendees}
              onChange={(e) => setAttendees(parseInt(e.target.value))}
              min={1}
              className="block rounded-md border border-gray-300 py-2 px-3 shadow-sm"
            />
          </div>
        </div>
      )}

      {/* info display */}
      {selectedDate && selectedHour && (
        <h3 className='text-center mt-6 font-bold text-gray-500'>
          You will be reserving the day of 
          <strong className='text-black font-medium'>{` ${selectedDate.toDateString()} at ${formatTime(selectedHour)} `}</strong> for 
          <strong className='text-black font-medium'> {attendees}</strong> {attendees === 1 ? 'person' : 'people'}.
        </h3>
      )}

      {/* message display */}
      {reservationStatus && (
        <p className={`text-center mt-4 ${reservationStatus.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
          {reservationStatus}
        </p>
      )}

      {/* button section */}
      <section className="flex items-center justify-between pt-6 pb-3 px-4">
        <div className="md:flex items-center md:space-x-2 space-x-0">
          <span className="md:text-2xl text-sm font-bold">4.98</span>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <IoStar key={i} className="w-4 h-4 fill-current text-yellow-400 md:w-7 md:h-7" />
            ))}
          </div>
          <div className="text-sm text-gray-600 underline">84 Evaluations</div>
        </div>
        <button 
          className="px-12 py-2 border border-[#0800FA] text-[#0800FA] rounded-md hover:bg-[#0800FA] hover:text-white transition-colors"
          onClick={reserve}
        >
          Reserve
        </button>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Register to book"
        content={LogInForm()}
        actionButtonText="Log in"
        onAction={handleAction}
      />

    </div>
  );
};

export default AvailabilityCalendar;
