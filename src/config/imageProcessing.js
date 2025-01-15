// imageProcessing.js
export async function processImage(imageFile) {
  try {
    // Create a FileReader object
    const reader = new FileReader();

    // Define the onload handler
    reader.onload = (e) => {
      const imageData = e.target.result; // Get the image data as a data URL
      return imageData; 
    };

    // Read the image file as a data URL
    reader.readAsDataURL(imageFile);

  } catch (error) {
    console.error("Error processing image:", error);
    throw error; 
  }
}
