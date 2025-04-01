import React, { useState, useEffect } from 'react';
import { Image, Pressable, StyleSheet, View, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import Typo from './Typo';

const { width: screenWidth } = Dimensions.get('window');
const MAX_HEIGHT = 400; // Maximum height constraint
const MAX_WIDTH = screenWidth - 40; // Maximum width (accounting for padding)

const ImageUpload = ({ file, onSelect, onClear, placeholder }) => {
  console.log("Image file in ImageUpload:", file);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    if (file && file.uri) {
      // Get image dimensions from the file if available
      if (file.width && file.height) {
        calculateDimensions(file.width, file.height);
      } else {
        // Or fetch them if not available
        Image.getSize(file.uri, (width, height) => {
          calculateDimensions(width, height);
        }, (error) => {
          console.error("Failed to get image dimensions:", error);
          // Fallback to default dimensions
          setImageDimensions({ width: MAX_WIDTH, height: 200 });
        });
      }
    }
  }, [file]);
  
  // Calculate dimensions maintaining aspect ratio
  const calculateDimensions = (originalWidth, originalHeight) => {
    let newWidth = originalWidth;
    let newHeight = originalHeight;
    
    // Scale down if wider than screen
    if (newWidth > MAX_WIDTH) {
      const ratio = MAX_WIDTH / newWidth;
      newWidth = MAX_WIDTH;
      newHeight = newHeight * ratio;
    }
    
    // Scale down if too tall
    if (newHeight > MAX_HEIGHT) {
      const ratio = MAX_HEIGHT / newHeight;
      newHeight = MAX_HEIGHT;
      newWidth = newWidth * ratio;
    }
    
    setImageDimensions({ width: newWidth, height: newHeight });
  };

  return (
    <View style={styles.container}>
      {file ? (
        <View style={[
          styles.imageContainer, 
          { 
            width: imageDimensions.width || '100%', 
            height: imageDimensions.height || 200,
            alignSelf: 'center'
          }
        ]}>
          <Image 
            source={{ uri: file.uri }} 
            style={styles.image} 
            resizeMode="contain"
          />
          <Pressable style={styles.clearButton} onPress={onClear}>
            <Ionicons name="close-circle" size={24} color={colors.error} />
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.uploadButton} onPress={onSelect}>
          <Ionicons name="cloud-upload-outline" size={24} color={colors.text} />
          <Typo>{placeholder || 'Upload Image'}</Typo>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  uploadButton: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.neutral600,
    borderRadius: radius._10,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral800,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: radius._10,
    overflow: 'hidden',
    marginVertical: spacingY._10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  clearButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
  },
});

export default ImageUpload;