// // 'use client'
// import { generateLandmark, run, uploadImage } from '@/utils/action';
// import { writeFile } from 'fs/promises';
// import { join } from 'path';
// // import React, { useState } from 'react';

// const LandmarkPage = async() => {
//   // const image = run();
//   // console.log(image);  
//   // const [landmark,setLandmark] =useState();
//   // let {landmark} = await uploadImage();
//   let landmark = null

//   //  async function uploadImage(data) {
//   //   'use server' 

//   //   const file = data.get('file');
//   //   console.log(file);
//   //   if (!file) {
//   //     throw new Error('No file uploaded');
//   //   }

//   //   const bytes = await file.arrayBuffer();
//   //   const buffer = Buffer.from(bytes);

//   //   // With the file data in the buffer, you can do whatever you want with it.
//   //   // For this, we'll just write it to the filesystem in a new location
//   //   console.log(__dirname);
//   //   const path = join('C:/Users/shrey/OneDrive/Desktop/GPT Genius/gptgenius/public','/', 'upload', file.name);
//   //   console.log(path);
//   //   await writeFile(path, buffer);
//   //   console.log(`open ${path} to see the uploaded file`);
//   //   const {type,name} = file
//   //   const landmarkInfo = await generateLandmark({type,name})
//   //   // setLandmark(landmarkInfo)
//   //   return { landmark: landmarkInfo };
//   // }

//   return (
//     <main>
//       {!landmark?<>
//         <h1>Upload Landmark </h1>
//       <form action={uploadImage}>
//         <input type="file" name="file" />
//         <input type="submit" value="Upload" />
//       </form>
//       </>: 
//       <div>{landmark}</div> }
      

//     </main>
//   );
// }

// export default LandmarkPage


'use client'
import React, { useState } from 'react';
import Image from 'next/image'; // Assuming you're using Next.js, if not replace with appropriate image component
import Markdown from 'react-markdown'; // Assuming you use react-markdown for Markdown rendering

const UploadComponent = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    if (file) {
      // Simulate the upload process and setting a result
      setResult({ url: URL.createObjectURL(file), landmark: 'The Parthenon' });
    }
  };

  return (
    <div style={styles.container}>
      {!result ? (
        <form onSubmit={onSubmit} style={styles.form}>
          <input
            type="file"
            name="file"
            onChange={(e) => setFile(e.target.files?.[0])}
            style={styles.input}
          />
          <input type="submit" value="Upload" style={styles.button} />
        </form>
      ) : (
        <div style={styles.resultContainer}>
          <Image src={result.url} width={500} height={500} alt="Uploaded" style={styles.image} />
          <h3 style={styles.heading}><Markdown>{result.landmark}</Markdown></h3>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  input: {
    margin: '10px 0',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  resultContainer: {
    textAlign: 'center',
  },
  image: {
    borderRadius: '8px',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
};

export default UploadComponent;
