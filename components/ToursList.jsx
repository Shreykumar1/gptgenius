import React from 'react'
import ToursCard from './ToursCard';

const ToursList = ({data}) => {
  console.log(data);
  
    if(data === undefined || data.length === 0) return <h4 className='text-lg'>No tours found...</h4>
  return (
    <div className='grid sm:grid-cols-2  lg:grid-cols-4 gap-8'>
      {data.map((tour) => {
        return <ToursCard key={tour.id} tour={tour} />;
      })}
    </div>
  )
}

export default ToursList