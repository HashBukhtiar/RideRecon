import React, { useRef} from 'react';
import { Alert, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import {  useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import BackButton from '@/components/BackButton';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import Header from '@/components/Header'
import { useRoute } from '@react-navigation/native';

const IMG_HEIGHT = 300;

const CarDetails = () => {
    const route = useRoute();
    const params = useLocalSearchParams();
    const imageUri = params.imageUri;
    const make = params.make;
    const model = params.model;
    const confidence = params.confidence;
    const funFact = params.funFact;
    const purchaseLinks = params.purchaseLinks ? JSON.parse(params.purchaseLinks as string) : [];

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
            title='Past Results' 
            leftIcon={<BackButton />}
            style={{ marginBottom: spacingY._10 }}
        />
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
                            <Typo size={18} fontWeight="600">{make}</Typo>
                        </View>
                        <View style={styles.resultItem}>
                            <Typo size={16} color={colors.textLighter}>Model:</Typo>
                            <Typo size={18} fontWeight="600">{model}</Typo>
                        </View>
                        <View style={styles.resultItem}>
                            <Typo size={16} color={colors.textLighter}>Confidence:</Typo>
                            <Typo size={18} fontWeight="600">{confidence}</Typo>
                        </View>
                    </View>
        
                    <View style={styles.card}>
                        <Typo size={22} fontWeight="700">Fun Fact</Typo>
                        <Typo size={16} style={{marginTop: spacingY._10}}>
                            {funFact}
                        </Typo>
                    </View>
                    
                    <View style={styles.card}>
                      <Typo size={22} fontWeight="700">Where to Buy</Typo>
                      {Array.isArray(purchaseLinks) ? (
                      purchaseLinks.map((link, index) => (
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
                      )) 
                      ) : (
                        <Typo size={16} color={colors.textLighter}>
                          No purchase links available.
                        </Typo>
                      )}
                  </View>
                    
                </Animated.View>
            </Animated.ScrollView>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default CarDetails;

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