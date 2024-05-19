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
  return  prisma.task.findUnique({
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
    const text = response.text();
    console.log(text);
    const tour = JSON.parse(text)
    return tour;
  } catch (error) {
    console.log(error);
    return null
  }
}
export const createNewTour = async (tour) => {
  return  prisma.task.create({
    data : tour.tour
  })
}