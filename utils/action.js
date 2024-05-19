"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

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
