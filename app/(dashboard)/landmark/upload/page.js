'use client'

import { generateLandmark } from '@/utils/action';
import axios from 'axios'
import Image from 'next/image';
import { useState } from 'react'

const LandmarkUpload =   () => {
  const [file, setFile] = useState();
  const [result, setResult] = useState({});
  const [landmark, setLandmark] = useState();

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    try {
      const data = new FormData()
      data.set('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      })
      // handle the error

      if (!res.ok) throw new Error(await res.text());
      const resData = await res.json();
      setResult(resData.data);
      console.log(resData);
    const {name,type} = resData.data 
      const  landmarkInfo = await generateLandmark({type,name});
      console.log(landmarkInfo);
      setLandmark(landmarkInfo)
    } catch (e) {
      // Handle errors here
      console.error(e)
    }
  }


  return (
    <>
    {!landmark?    <form onSubmit={onSubmit}>
      <input
        type="file"
        name="file"
        onChange={(e) => setFile(e.target.files?.[0])}
      />
      <input type="submit" value="Upload" />
    </form> : 
    <div>
        <Image src={result.url} width={500}height={500} />
        <h3>{landmark}</h3> 
    </div>
    }
    </>

  )
}

export default LandmarkUpload