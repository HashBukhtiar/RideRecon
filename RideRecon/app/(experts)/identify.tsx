import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import Button from '@/components/Button';
import BackButton from '@/components/BackButton';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';

const Identify = () => {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Mock identification for demo purposes
  // In production, this would call your Python backend
  useEffect(() => {
    const identifyCar = async () => {
      try {
        // In a real implementation, you would:
        // 1. Send the image to your backend
        // 2. The backend would run finalizer.py
        // 3. Return the identification results
        
        // Simulating API call delay
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Mock result (in production, this would come from your API)
        const mockResult = {
          identification: {
            make: "Porsche",
            model: "911 GT3 RS",
            confidence: "87.5%"
          },
          funFact: "The Porsche 911 GT3 RS is named after the GT3 category of racing, and the 'RS' stands for 'Rennsport', which is German for 'racing sport'. It features a naturally aspirated engine that can rev up to 9,000 RPM!",
          purchaseLinks: [
            "https://www.autotrader.com/cars-for-sale/Porsche+911+GT3+RS",
            "https://www.cars.com/shopping/results/?stock_type=all&makes%5B%5D=Porsche&models%5B%5D=911+GT3+RS",
            "https://www.cargurus.com/Cars/l-Used-Porsche-911+GT3+RS-d138"
          ]
        };
        
        setResults(mockResult);
      } catch (err) {
        setError("Failed to identify vehicle. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    identifyCar();
  }, []);

  const openUrl = (url) => {
    Linking.openURL(url).catch((err) => {
      Alert.alert('Error', 'Could not open URL');
    });
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} onPress={() => router.back()} />
        
        <Typo size={30} fontWeight="800" style={styles.title}>
          Vehicle Identification
        </Typo>
        
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
          <ScrollView style={styles.resultsContainer}>
            <View style={styles.card}>
              <Typo size={22} fontWeight="700">
                Identification Results
              </Typo>
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
                <Button 
                  key={index}
                  variant="secondary" 
                  onPress={() => openUrl(link)}
                  style={{marginTop: spacingY._10}}
                >
                  <Typo size={16} color={colors.primary}>
                    {index === 0 ? "AutoTrader" : index === 1 ? "Cars.com" : "CarGurus"}
                  </Typo>
                </Button>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default Identify;

const styles = StyleSheet.create({
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
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacingY._15,
  },
  image: {
    width: '100%',
    height: verticalScale(200),
    borderRadius: radius._10,
    marginBottom: spacingY._20,
  },
});