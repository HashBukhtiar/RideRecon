import BackButton from '@/components/BackButton'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import React from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import Typo from '@/components/Typo'
import Header from '@/components/Header'
import ScreenWrapper from '@/components/ScreenWrapper'
import Animated, {interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset} from 'react-native-reanimated';
import { verticalScale } from '@/utils/styling'

const { width, height } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const IdentifiedModal = () => {
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollRef);

	const imageAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{translateY: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.5])},
				{scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1])}
			]
		}
	})

    const textAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {translateY: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.5]) }
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
                <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
                    <Animated.Image
                        source={require('../../assets/images/design/login.png')}
                        style={[styles.image, imageAnimatedStyle]}
                    />
                    <Animated.View style={[textAnimatedStyle, { marginTop: spacingY._20 }]}>
                        <Header
                            title="Name of Car"
                            style={{ marginBottom: spacingY._10 }}
                        />
                        <View style={styles.subtitle}>
                            <Typo size={18} fontWeight={'600'}>
                                Details
                            </Typo>
                        </View>
                        <View style={styles.information}>
                            <Typo size={16} fontWeight={'700'}>Manufacturer</Typo>
                            <Typo size={16} fontWeight={'500'} style={{ position: 'absolute', left: 170}}>Sign Out</Typo>
                        </View>
                        <View style={styles.information}>
                            <Typo size={16} fontWeight={'700'}>Make</Typo>
                            <Typo size={16} fontWeight={'500'} style={{ position: 'absolute', left: 170}}>Sign Out</Typo>
                        </View>
                        <View style={styles.information}>
                            <Typo size={16} fontWeight={'700'}>Model</Typo>
                            <Typo size={16} fontWeight={'500'} style={{ position: 'absolute', left: 170}}>Sign Out</Typo>
                        </View>

                        <View style={styles.subtitle}>
                            <Typo size={18} fontWeight={'600'}>
                                URL to Purchase Information
                            </Typo>
                        </View>
                        <View style={styles.information}>
                            <Typo size={16} fontWeight={'500'}>insert purchase url</Typo>
                        </View>
    

                        <View style={styles.subtitle}>
                            <Typo size={18} fontWeight={'600'}>
                                Fun Fact
                            </Typo>
                        </View>
                        <View style={[styles.information, { paddingBottom: 180 }]}>
                            <Typo size={16} fontWeight={'700'}>insert fun fact</Typo>
                        </View>
                    </Animated.View>
                    
                </Animated.ScrollView>
            </View>

        </ScreenWrapper>
		
	);
};

export default IdentifiedModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingY._10,
        paddingTop: spacingX._40,
    },
    image: {
        width: width, 
        height: IMG_HEIGHT,
    },
    subtitle: {
        height: verticalScale(44),
        backgroundColor: colors.neutral700,
        borderRadius: radius._15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: spacingY._10,
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: colors.neutral500,
        marginTop: verticalScale(17),
        marginBottom: verticalScale(17),
    },
    information: {
        flexDirection: 'row',
        paddingHorizontal: spacingY._10,
        paddingVertical: spacingX._3,
    }

})