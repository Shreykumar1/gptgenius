"use client";

import { generateLandmark } from "@/utils/action";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import Markdown from "react-markdown";

const LandmarkUpload = () => {
  const [file, setFile] = useState();
  const [result, setResult] = useState({});
  const [landmark, setLandmark] = useState();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      const data = new FormData();
      data.set("file", file);
      setLoading(true);
      const blob = new Blob([file], { type: file.type });

      const blobUrl = URL.createObjectURL(blob);
      // Convert Blob to Base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result; // This is the Base64 string
        // Strip the prefix if it exists
        const base64String = base64data.split(',')[1]; // Get only the Base64 part
        const resData = { data: { name: file.name, type: file.type, base64: base64String } };
        setResult(resData.data);
        setResult({...resData.data,url:blobUrl});
        console.log(resData);
        const { name, type, base64 } = resData.data;
        const landmarkInfo = await generateLandmark({ type, name, base64 }); // Pass Base64 data
        console.log(landmarkInfo);
        setLandmark(landmarkInfo);
        setLoading(false);
      };
      reader.readAsDataURL(blob); // Read the Blob as a Data URL (Base64)
    } catch (e) {
      // Handle errors here
      toast.error("something went wrong");
      console.error(e);
    }
  };
  if (loading) {
    return <span className="loading loading-lg"></span>;
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <h3 class="mb-2 mt-4 md:mt-0 text-sm md:text-xl font-extrabold leading-none tracking-loose text-neutral  ">
          Upload{" "}
          <mark class="px-2 text-white bg-blue-600 rounded dark:bg-primary">
            Landmark
          </mark>{" "}
          Photo for Description
        </h3>
        {/* <p class="text-lg mb-3 font-normal text-gray-500  dark:text-gray-400">
  Share a photo of a landmark and receive its text description.
</p> */}

        <div className="md:join w-full max-w-5xl">
          {/* className=" join-item  text-xl text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" */}
          <input
            type="file"
            className="input input-bordered w-full sm:w-auto join-item px-0.5 sm:px-1 py-2 h-auto sm:h-10 md:pt-0.5 text-sm sm:text-lg rounded-lg "
            // className="input input-bordered join-item px-0.5 py-2 h-auto sm:h-10 md:pt-0.5 text-sm md:text-lg rounded-lg "
            id="file_input"
            name="file"
            onChange={(e) => setFile(e.target.files?.[0])}
          />

          <button
            className="btn btn-sm  w-full mt-2 md:mt-0 md:w-auto md:h-10 btn-primary join-item"
            type="submit"
          >
            Upload
          </button>
        </div>
        <p
          class="mt-2 mb-10 text-xs sm:text-base  text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          PNG, JPEG (MAX. 800x400px).
        </p>
      </form>
      {landmark ? (
        <div className="max-w-2xl">
          <Image
            src={result.url || 'blob:http://localhost:3000/9730b5d2-fc43-40e3-844d-cab3d4a947cd'}
            width={400}
            height={300}
            className="w-36 h-28 md:w-auto md:h-auto rounded-lg shadow-lg mb-4"
          />
          <h3 className="leading-loose">
            <Markdown>{landmark}</Markdown>
          </h3>
        </div>
      ) : null}
    </>
  );
};

export default LandmarkUpload;
