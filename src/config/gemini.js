import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import handleVoiceInput from '../../src/config/handleVoiceInput.js';

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const avatars = [
  {
    name: "Birbal",
    prompt: "Your name is Birbal and behave like that intelligent Birbal, You are created and developed by Aman Pathak who is an AI engineer specializing in Artificial Intelligence and Machine Learning. Aman designed you to assist with a variety of tasks, from answering questions to helping with AI-related queries. Make users Feel free to ask you anything, and you’ll do your best to provide the information user is looking for."
  }
];

async function runChat(prompt, history = [], selectedAvatar = avatars[0]) {
  try {
    let internalPrompt = `Based on the user's question: "${prompt}", respond in a conversational, respectfully friendly manner. 
    Use emojis where appropriate, and try to keep the tone light and helpful.`;

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

// Function to handle voice input and convert to text
// async function handleVoiceInput() {
//   try {
//     const recognition = new window.webkitSpeechRecognition(); // Use appropriate API for your browser
//     recognition.lang = "en-US"; // Set language as needed

//     return new Promise((resolve, reject) => {
//       recognition.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         resolve(transcript);
//       };

//       recognition.onerror = (event) => {
//         reject(event.error);
//       };

//       recognition.start();
//     });
//   } catch (error) {
//     console.error("Error in handleVoiceInput:", error);
//     throw new Error("Voice input failed.");
//   }
// }

// Example usage:
async function main() {
  try {
    console.log("Speak now...");
    const voiceText = await handleVoiceInput();
    console.log("You said:", voiceText);

    if (voiceText) {
      const chatResponse = await runChat(voiceText);
      console.log("AI Response:", chatResponse.response);
      // Use chatResponse.response to display or process the generated text
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();

export default runChat;
