async function handleVoiceInput() {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error("Speech Recognition not supported in this browser.");
      }
  
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US"; 
      recognition.interimResults = false; 
  
      return new Promise((resolve, reject) => {
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          resolve(transcript);
        };
  
        recognition.onerror = (event) => {
          reject(event.error);
        };
  
        recognition.onend = () => {
          console.log("Speech recognition ended");
        };
  
        recognition.start(); 
      });
    } catch (error) {
      console.error("Error in handleVoiceInput:", error);
      throw new Error("Voice input failed.");
    }
  }
  
  export default handleVoiceInput;
  