// 'use client'
import { generateLandmark, run, uploadImage } from '@/utils/action';
import { writeFile } from 'fs/promises';
import { join } from 'path';
// import React, { useState } from 'react';

const LandmarkPage = async() => {
  // const image = run();
  // console.log(image);  
  // const [landmark,setLandmark] =useState();
  // let {landmark} = await uploadImage();
  let landmark = null

  //  async function uploadImage(data) {
  //   'use server' 

  //   const file = data.get('file');
  //   console.log(file);
  //   if (!file) {
  //     throw new Error('No file uploaded');
  //   }

  //   const bytes = await file.arrayBuffer();
  //   const buffer = Buffer.from(bytes);

  //   // With the file data in the buffer, you can do whatever you want with it.
  //   // For this, we'll just write it to the filesystem in a new location
  //   console.log(__dirname);
  //   const path = join('C:/Users/shrey/OneDrive/Desktop/GPT Genius/gptgenius/public','/', 'upload', file.name);
  //   console.log(path);
  //   await writeFile(path, buffer);
  //   console.log(`open ${path} to see the uploaded file`);
  //   const {type,name} = file
  //   const landmarkInfo = await generateLandmark({type,name})
  //   // setLandmark(landmarkInfo)
  //   return { landmark: landmarkInfo };
  // }

  return (
    <main>
      {!landmark?<>
        <h1>Upload Landmark </h1>
      <form action={uploadImage}>
        <input type="file" name="file" />
        <input type="submit" value="Upload" />
      </form>
      </>: 
      <div>{landmark}</div> }
      

    </main>
  );
}

export default LandmarkPage