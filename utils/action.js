"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "./db";
import { Pinecone } from '@pinecone-database/pinecone';
import embedding from "./vectors";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});
const index = pc.index('medical-1');

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




export async function generateLandmark({type,name,base64}) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // const prompt = "What drink is it";

  // const imagePath = 'public/upload/computer-3.jpeg'
  // const imagePath = url
  // const imageData = await fs.readFile(imagePath);
  // const imageBase64 = imageData.toString('base64');
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
        data : base64
      }
    }
  ]
  try {
    const result = await model.generateContent({ contents : [{role : 'user',parts}]});
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text;
  } catch (error) {
    console.log(error);
    return null
  }
}

export async function generateMedicChatResponse(textMessage) {
  if (!Array.isArray(textMessage)) {
    throw new TypeError("textMessage must be an array");
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

  const chat = model.startChat({
    history: textMessage,
    generationConfig: {
      maxOutputTokens: 8192,
    },
    prompt: "You are a knowledgeable medical education assistant specializing in providing detailed explanations, study resources, and guidance on medical topics for students. Your primary users are medical students seeking to deepen their understanding of various medical subjects. Provide comprehensive yet concise explanations suitable for this audience, avoiding overly technical jargon unless necessary. Periodically, offer interactive elements such as quizzes or case studies to enhance the learning experience. Base your responses on the latest evidence-based medical guidelines and research. Approach sensitive medical topics with professionalism and empathy, adhering to ethical standards. For instance, if asked about the pathophysiology of a disease, provide a clear and structured explanation highlighting key mechanisms and clinical relevance.",
  });

  // Extract the latest user message to send
  const prompt = textMessage[textMessage.length - 1].parts[0].text;
const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "good day"];
  if(greetings.includes(prompt.trim().toLowerCase())){
    return "Hello! How can I assist you today? Feel free to ask any questions or discuss any topics related to medicine or medical education.";
  }

  const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const embeddingText = await embeddingModel.embedContent(prompt);
  let vecArray = [];
  if(embeddingText){
    vecArray = embeddingText.embedding.values;
  }
  else{
    vecArray = embedding.vectors;
  }

  // Query Pinecone for relevant data
  const response = await index.namespace('ns1').query({
    topK: 5,
    vector: vecArray, 
    includeValues: true,
    includeMetadata: true,
    // filter: { text: { '$eq': prompt } },
  });
  console.log(response);

  // Process the Pinecone response
  let fetchedData = "";
  if(response.matches.length > 0){
    fetchedData = response.matches.map((match) => match.metadata.text).join('\n');
  }
  else{
    fetchedData = "No relevant matches were found for the user's query in the database. Please respond politely and suggest that the user refine their query, try alternative keywords, or provide more context for better results. !important But do not say if they ask generic questions like hi, hello and so on.";
  }

  const result = await chat.sendMessage(`Use headings in your answer and dont say based on text you provided. Question: ${prompt}\n\n Context: ${fetchedData} !important if provided context is not relevant then say your answer according to prompt`);
  const aiResponse = await result.response;
  const text = await aiResponse.text();

  return text;
  
}