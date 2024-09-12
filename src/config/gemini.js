import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const avatars = [
  {
    name: "Birbal",
    prompt: "Your name is Birbal, You are made and developed by Developer Aman Pathak, You are very smart enough to answer every question asked to you, be polite and friendly."
  }
];

async function runChat(prompt, history = [], selectedAvatar = avatars[0]) {
  try {
    let internalPrompt = `Based on the user's question: "${prompt}", respond in a conversational, friendly manner. 
    Be concise, use emojis where appropriate, and try to keep the tone light and helpful.`;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2000
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    // Chat history and context setup
    const userMessage = {
      role: "user",
      parts: [{ text: prompt }]
    };

    const chatHistory = [...history, userMessage];

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: chatHistory,
      context: internalPrompt, 
    });

    const result = await chat.sendMessage(internalPrompt);
    const response = result.response;

    return { response: response.text() };
  } catch (error) {
    console.error("Error in runChat:", error);
    throw new Error("Failed to generate response from the AI model.");
  }
}

export default runChat;
