import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { REACT_APP_API_URL } from '@env';

export const identifyCar = async (imageUri: string) => {
  try {
    // Read the image as base64
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Call the API
    const response = await fetch(`${REACT_APP_API_URL}/api/identify`, {
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