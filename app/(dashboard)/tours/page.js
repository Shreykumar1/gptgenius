import { getExistingTour } from '@/utils/action';
import React from 'react'

const ToursPage = async () => {
  const place = {city : 'London',country :'England'}
console.log( await getExistingTour(place));
  return (
    <div>ToursPage</div>
  )
}

export default ToursPage