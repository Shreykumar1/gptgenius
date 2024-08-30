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
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      // handle the error

      if (!res.ok) throw new Error(await res.text());
      const resData = await res.json();
      setResult(resData.data);
      console.log(resData);
      const { name, type } = resData.data;
      const landmarkInfo = await generateLandmark({ type, name });
      console.log(landmarkInfo);
      setLandmark(landmarkInfo);
      setLoading(false);
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
        <h3 class="mb-2 text-xl font-extrabold leading-none tracking-loose text-neutral  ">
          Upload{" "}
          <mark class="px-2 text-white bg-blue-600 rounded dark:bg-primary">
            Landmark
          </mark>{" "}
          Photo for Description
        </h3>
        {/* <p class="text-lg mb-3 font-normal text-gray-500  dark:text-gray-400">
  Share a photo of a landmark and receive its text description.
</p> */}

        <div className="join w-full">
          {/* className=" join-item  text-xl text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" */}
          <input
            type="file"
            className="input input-bordered join-item h-10 pt-0.5 text-lg rounded-lg "
            id="file_input"
            name="file"
            onChange={(e) => setFile(e.target.files?.[0])}
          />

          <button
            className="btn btn-sm h-10 btn-primary join-item"
            type="submit"
          >
            Upload
          </button>
        </div>
        <p
          class="mt-2 mb-10 text-md  text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          PNG, JPEG (MAX. 800x400px).
        </p>
      </form>
      {landmark ? (
        <div className="max-w-2xl">
          <Image
            src={result.url}
            width={500}
            height={500}
            className="w-64 h-64 rounded-lg shadow-lg mb-4"
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
