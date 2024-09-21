import React, { createContext, useState, useEffect } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [prevPrompts, setPrevPrompts] = useState([]);

  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [conversationHistory]);
  

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
      
      setConversationHistory((prevHistory) => {
        const updatedHistory = [...prevHistory];
        // Check if there is a model entry in the history to update
        if (updatedHistory.length > 0) {
          const lastEntry = updatedHistory[updatedHistory.length - 1];
          if (lastEntry.role === "model") {
            lastEntry.parts[0].text += nextWord;
          }
        }
        return updatedHistory;
      });
    }, 75 * index);
  };
  

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
    setConversationHistory([]);
    setPrevPrompts([]);
    setRecentPrompt("");
  };

  const onSent = async (prompt = input) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    try {
      const responseObj = await runChat(prompt, conversationHistory);
      const response = responseObj?.response || "";
      setRecentPrompt(prompt);

      if (response) {
        const newEntries = [
          { role: "user", parts: [{ text: prompt }] },
          { role: "model", parts: [{ text: "" }] }, // Start with empty response text
        ];

        setConversationHistory((prevHistory) => [...prevHistory, ...newEntries]);
        setPrevPrompts((prevPrompts) => [...prevPrompts, prompt]);

        let responseArray = response.split("**");
        let newResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
          if (i === 0 || i % 2 !== 1) {
            newResponse += responseArray[i];
          } else {
            newResponse += "<b>" + responseArray[i] + "</b>";
          }
        }
        let newResponse2 = newResponse.split("*").join("</br>");
        let newResponseArray = newResponse2.split(" ");
        for (let i = 0; i < newResponseArray.length; i++) {
          const nextWord = newResponseArray[i];
          delayPara(i, nextWord + " ");
        }
      } else {
        setResultData("No response was generated. Please try again.");
      }
    } catch (error) {
      console.error("Error in onSent:", error);
      setResultData("Resource exhausted or error occurred while generating the response. Please try again.");
    } finally {
      setLoading(false);
      setInput(""); 
    }
  };

  const contextValue = {
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    conversationHistory,
    setConversationHistory,
    prevPrompts,
    setPrevPrompts,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
