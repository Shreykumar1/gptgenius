"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "./db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateChatResponse(textMessage) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  console.log(textMessage);
  const chat = model.startChat({
    history: textMessage,
    generationConfig: {
      maxOutputTokens: 8192,
      // responseMimeType: "application/json",
    },
  });

  const prompt = textMessage[textMessage.length - 1].parts[0].text;
  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(response);
  console.log(text);
  return text;
}

export const getExistingTour = async ({ city, country }) => {
  return  prisma.tour.findUnique({
    where : {
      city : city,
      country : country,
      city_country : {
        city,
        country
      }
    }
  })
}


export const generateTourResponse = async ({ city, country }) => {
  const query = `Find a ${city} in this ${country}.
  If ${city} in this ${country} exists, create a list of things families can do in this ${city},${country}. 
  Once you have a list, create a one-day tour. Response should be in the following JSON format: 
  {
    "tour": {
      "city": "${city}",
      "country": "${country}",
      "title": "title of the tour",
      "description": "description of the city and tour",
      "stops": ["short paragraph on the stop 1 ", "short paragraph on the stop 2","short paragraph on the stop 3"]
    }
  }
  If you can't find info on exact ${city}, or ${city} does not exist, or it's population is less than 1, or it is not located in the following ${country} return { "tour": null }, with no additional characters.`;
  try {
    const generationConfig = {
      temperature : 0
    }
    const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig});

    const prompt = query
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log("Response ", response);
    const text = response.text();
    const tour = JSON.parse(text)
    console.log("Generate Text = ",tour);
    return tour;
  } catch (error) {
    console.log(error);
    return null
  }
}
export const createNewTour = async (tour) => {
  console.log("Create Tour",tour);
  return  prisma.tour.create({
    data : tour.tour
  })
}

export const getAllTours = async (searchTerm) => {
  if (!searchTerm) {
    const tours = await prisma.tour.findMany({
      orderBy: {
        city: 'asc',
      },
    });

    return tours;
  }

  const tours = await prisma.tour.findMany({
    where: {
      OR: [
        {
          city: {
            contains: searchTerm,
          },
        },
        {
          country: {
            contains: searchTerm,
          },
        },
      ],
    },
    orderBy: {
      city: 'asc',
    },
  });
  return tours;
};

export const getSingleTour = async (id) => {
  return prisma.tour.findUnique({
    where : {
      id : id
    }
  })
}
import {promises as fs} from "fs"

// function fileToGenerativePart(path, mimeType) {
//   return {
//     inlineData: {
//       data: Buffer.from(fs.readFileSync(path)).toString("base64"),
//       mimeType
//     },
//   };
// }
import { writeFile } from 'fs/promises';
import { join } from 'path';




export async function generateLandmark({type,name}) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // const prompt = "What drink is it";

  // const imagePath = 'public/upload/computer-3.jpeg'
  const imagePath = `public/upload/${name}`
  const imageData = await fs.readFile(imagePath);
  const imageBase64 = imageData.toString('base64');
  const prompt = `Describe the landmark historical place in the image. Provide the following details:
  1. Name of the Landmark: Clearly state the name of the historical place.
  2. Description: Offer a detailed description of the landmark, including its architectural style, notable features, and any important aspects of its appearance.
  3. Historical Significance: Explain the historical importance of this landmark. Include information about its origin, historical events associated with it, and its role in history.
  4. Address: Provide the full address or location details of the landmark, including city, state/province, and country.
  5. Additional Information: Mention any interesting facts, visitor information, or current status if available.
  
  Make sure to be thorough and provide a comprehensive overview.
  Give in the form of markdown and make the label bold`;
  
  const parts = [
    { text : prompt},
    {
      inlineData : {
        mimeType : type || "image/png",
        data : imageBase64
      }
    }
  ]
  const result = await model.generateContent({ contents : [{role : 'user',parts}]});
  const response = await result.response;
  const text = response.text();
  console.log(text);
  return text
}


export async function uploadImage(data) {
  // 'use server' 

  const file = data.get('file');
  console.log(file);
  if (!file) {
    throw new Error('No file uploaded');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  console.log(__dirname);
  const path = join('C:/Users/shrey/OneDrive/Desktop/GPT Genius/gptgenius/public','/', 'upload', file.name);
  console.log(path);
  await writeFile(path, buffer);
  console.log(`open ${path} to see the uploaded file`);
  const {type,name} = file
  const landmarkInfo = await generateLandmark({type,name})
  // setLandmark(landmarkInfo)
  return { landmark: landmarkInfo };
}



