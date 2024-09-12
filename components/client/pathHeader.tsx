"use client";
import { IoHomeOutline } from "react-icons/io5";
import { useParams } from 'next/navigation'
import Link from "next/link";

export type TodayServicesProps = {
  ServiceName: string;
};

export default function PathHeader({ ServiceName }: TodayServicesProps ) {
  const params = useParams<{ hotel: string }>()

  return (
    <div className='flex items-center space-x-2 mb-4'>
      <Link href={`/${params.hotel}`} > <IoHomeOutline className='cursor-pointer'/> </Link>
      <span className='cursor-pointer'>/</span>
      <span className='cursor-pointer'>service</span>
      <span className='cursor-pointer'>/</span>
      <span className='cursor-pointer'>{ServiceName}</span>
    </div>
  )
}