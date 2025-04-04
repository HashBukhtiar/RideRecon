import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import Button from '@/components/Button';
import BackButton from '@/components/BackButton';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { identifyCar } from '@/services/api';
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import Header from '@/components/Header'
import { useCarContext } from '@/context/CarContext';

const IMG_HEIGHT = 300;

const Identify = () => {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const { addCar } = useCarContext();

  useEffect(() => {
    const processImage = async () => {
      try {
        setLoading(true);
        
        // Get image URI from navigation params
        const imageUri = params.imageUri as string;
        
        if (!imageUri) {
          throw new Error('No image provided');
        }
        
        // Call the API service
        const identificationResults = await identifyCar(imageUri);
        setResults(identificationResults);

        addCar({
          imageUri,
          make: identificationResults.identification.make,
          model: identificationResults.identification.model,
          confidence: identificationResults.identification.confidence,
          funFact: identificationResults.funFact,
          purchaseLinks: identificationResults.purchaseLinks,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to identify vehicle. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    processImage();
  }, [params.imageUri]);

  const openUrl = (url) => {
    Linking.openURL(url).catch((err) => {
      Alert.alert('Error', 'Could not open URL');
    });
  };

  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateY: interpolate(scrollY.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.5])},
        {scale: interpolate(scrollY.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1])}
      ]
    }
  })

  const textAnimatedStyle = useAnimatedStyle(() => {
      return {
          transform: [
              {translateY: interpolate(scrollY.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.5]) }
          ]
      };
  })

  return (
    <ScreenWrapper>
      <View style={styles.container}>

        <Header
            title='Identification Results' 
            leftIcon={<BackButton />}
            style={{ marginBottom: spacingY._10 }}
        />
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Typo size={18} style={{marginTop: spacingY._20}}>
              Analyzing vehicle...
            </Typo>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Typo size={18} color={colors.error}>
              {error}
            </Typo>
            <Button onPress={() => router.back()} style={{marginTop: spacingY._20}}>
              <Typo size={16} color={colors.neutral900}>Try Again</Typo>
            </Button>
          </View>
        ) : (
          <View style={styles.resultsContainer}>
              <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
                <Animated.View style={styles.imageContainer}>
                  <Animated.Image
                      source={require("../../assets/images/design/login.png")}
                      //source={{ uri: params.imageUri || '../../assets/images/design/login.png'}}
                      style={[styles.image, imageAnimatedStyle]}
                      resizeMode="contain"
                  />
                </Animated.View>
                <Animated.View style={[textAnimatedStyle, { marginTop: spacingY._20 }]}>
                  <View style={styles.card}>
                    <View style={styles.resultItem}>
                      <Typo size={16} color={colors.textLighter}>Make:</Typo>
                      <Typo size={18} fontWeight="600">{results.identification.make}</Typo>
                    </View>
                    <View style={styles.resultItem}>
                      <Typo size={16} color={colors.textLighter}>Model:</Typo>
                      <Typo size={18} fontWeight="600">{results.identification.model}</Typo>
                    </View>
                    <View style={styles.resultItem}>
                      <Typo size={16} color={colors.textLighter}>Confidence:</Typo>
                      <Typo size={18} fontWeight="600">{results.identification.confidence}</Typo>
                    </View>

                    <TouchableOpacity 
                      onPress={() => setDetailsExpanded(!detailsExpanded)}
                      style={[styles.detailsToggle, { alignItems: 'center' }]}
                    >
                      <View style={styles.toggleContainer}>
                        <Typo size={14} color={colors.primary}>
                          {detailsExpanded ? "▲ Hide identification details" : "▼ See identification details"}
                        </Typo>
                      </View>
                    </TouchableOpacity>
                    
                    {/* Expandable details section */}
                    {detailsExpanded && (
                      <View style={styles.detailsContainer}>
                        <View style={styles.detailsSection}>
                          <Typo size={14} color={colors.textLighter} fontWeight="600">GPT-4o</Typo>
                          <View style={styles.detailItem}>
                            <Typo size={14} color={colors.textLighter}>Make:</Typo>
                            <Typo size={14}>{results.expertData.gpt4o.make}</Typo>
                          </View>
                          <View style={styles.detailItem}>
                            <Typo size={14} color={colors.textLighter}>Model:</Typo>
                            <Typo size={14}>{results.expertData.gpt4o.model}</Typo>
                          </View>
                        </View>
                        
                        <View style={styles.detailsSection}>
                          <Typo size={14} color={colors.textLighter} fontWeight="600">Gemini</Typo>
                          <View style={styles.detailItem}>
                            <Typo size={14} color={colors.textLighter}>Make:</Typo>
                            <Typo size={14}>{results.expertData.gemini.make}</Typo>
                          </View>
                          <View style={styles.detailItem}>
                            <Typo size={14} color={colors.textLighter}>Model:</Typo>
                            <Typo size={14}>{results.expertData.gemini.model}</Typo>
                          </View>
                        </View>
                        
                        <View style={styles.detailsSection}>
                          <Typo size={14} color={colors.textLighter} fontWeight="600">Google Vision RIS</Typo>
                          <View style={styles.detailItem}>
                            <Typo size={14} color={colors.textLighter}>Make:</Typo>
                            <Typo size={14}>{results.expertData.vision.make}</Typo>
                          </View>
                          <View style={styles.detailItem}>
                            <Typo size={14} color={colors.textLighter}>Model:</Typo>
                            <Typo size={14}>{results.expertData.vision.model}</Typo>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.card}>
                    <Typo size={22} fontWeight="700">Fun Fact</Typo>
                    <Typo size={16} style={{marginTop: spacingY._10}}>
                      {results.funFact}
                    </Typo>
                  </View>
                  
                  <View style={styles.card}>
                    <Typo size={22} fontWeight="700">Where to Buy</Typo>
                    {results.purchaseLinks.map((link, index) => (
                      <TouchableOpacity 
                        key={index}
                        onPress={() => openUrl(link)}
                        style={{
                          marginTop: spacingY._10,
                          backgroundColor: colors.neutral700,
                          padding: spacingY._12,
                          borderRadius: radius._10,
                          alignItems: 'center'
                        }}
                      >
                        <Typo size={16} color={colors.primary}>
                          {index === 0 ? "AutoTrader" : index === 1 ? "Cars.com" : "CarGurus"}
                        </Typo>
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                </Animated.View>


              </Animated.ScrollView>

          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default Identify;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacingY._10,
  },
  headerTitle: {
    marginLeft: spacingX._12,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    gap: spacingY._20,
  },
  title: {
    marginTop: spacingY._10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._15,
    padding: spacingY._20,
    marginBottom: spacingY._20,
  },
  detailsToggle: {
    marginTop: spacingY._15,
    paddingHorizontal: 0,
    height: 30,
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._5,
  },
  detailsContainer: {
    marginTop: spacingY._10,
    backgroundColor: colors.neutral700,
    borderRadius: radius._10,
    padding: spacingY._15,
    gap: spacingY._15,
  },
  detailsSection: {
    gap: spacingY._5,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacingX._10,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacingY._15,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    width: '100%',      
    height: IMG_HEIGHT,   
  },
  image: {
    width: '100%', 

  },
});