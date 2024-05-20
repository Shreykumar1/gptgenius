import TourInfo from '@/components/TourInfo';
import { getSingleTour } from '@/utils/action';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'
import axios from 'axios';
import Image from 'next/image';
const url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&query=`;

const SingleTourPage = async ({params}) => {
    console.log(params.id);
    const dataTour = await getSingleTour(params.id);
    if(!dataTour){
        redirect('/tours')
    }
    console.log(dataTour);
    const tour = { tour : dataTour };
    const { data } = await axios(`${url}${dataTour.city}`);
    const tourImage = data?.results[0]?.urls?.raw;
  return (
    <div>
        <Link href='/tours' className='btn btn-secondary mb-12'>Back to Tours</Link>
        {tourImage ? (
        <div>
          <Image
            src={tourImage}
            width={300}
            height={300}
            className='rounded-xl shadow-xl mb-16 h-96 w-96 object-cover'
            alt={tour.title}
            priority
          />
        </div>
      ) : null}
        <TourInfo tour={tour} />
    </div>
  )
}

export default SingleTourPage