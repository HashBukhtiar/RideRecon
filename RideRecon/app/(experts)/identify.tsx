import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import Button from '@/components/Button';
import BackButton from '@/components/BackButton';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { identifyCar } from '@/services/api';

const Identify = () => {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

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

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <BackButton iconSize={28} onPress={() => router.back()} />
          <Typo size={24} fontWeight="700" style={styles.headerTitle}>
            Vehicle Identification
          </Typo>
        </View>
        
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