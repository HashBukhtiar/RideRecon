import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl

export const identifyCar = async (imageUri: string) => {
  try {
    // Read the image as base64
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Call the API
    const response = await fetch(`${API_URL}/api/identify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Parse the response
    const data = await response.json();
    
    // Transform the API response to match the frontend's expected format
    return {
      identification: {
        make: data.make || "Unknown",
        model: data.model || "Unknown",
        confidence: data.confidence || "0%"
      },
      // Add expert data
      expertData: {
        gpt4o: {
          make: data["4o-make"] || "Unknown",
          model: data["4o-model"] || "Unknown"
        },
        gemini: {
          make: data["gemini-make"] || "Unknown",
          model: data["gemini-model"] || "Unknown"
        },
        vision: {
          make: data["ris-make"] || "Unknown",
          model: data["ris-model"] || "Unknown"
        }
      },
      funFact: data.fact || "No information available",
      purchaseLinks: data.source || [
        "https://www.autotrader.com",
        "https://www.cars.com",
        "https://www.cargurus.com"
      ]
    };
  } catch (error) {
    console.error('Error identifying car:', error);
    throw error;
  }
};