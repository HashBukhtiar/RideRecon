import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { scale, verticalScale } from '@/utils/styling';
import Typo from '@/components/Typo';
import { Dimensions } from "react-native";
import Button from '../../components/Button';
import Animated, { FadeIn } from 'react-native-reanimated'
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get("window");
const Loggedout = () => {
    const router = useRouter();
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {/*login button & image */}
                <View>
                     <TouchableOpacity onPress={()=> router.push('/(auth)/login')} style={styles.loginButton}>
                        <Typo fontWeight={"500"}>Sign in</Typo>
                    </TouchableOpacity>
                
                    <Animated.Image
                        entering={FadeIn.duration(500)}
                        source={require('../../assets/images/design/login.png')}
                        style={styles.loginImage}
                        resizeMode="contain"
                    />
                </View>

                {/* footer */}
                <View style = {styles.footer}> 
                    <View style = {{alignItems: "center"}}>
                        <Typo size={30} fontWeight={"800"}>
                            Account Access
                        </Typo>
                    </View>
                    
                    <View style={{alignItems: "center", gap: 2}}>
                        <Typo size={17} color={colors.textLight}>
                            Please create an account to access this feature
                        </Typo>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button onPress={()=> router.push('/(auth)/register')}>
                            <Typo size={22} color={colors.neutral900} fontWeight={"600"}>
                                Get Started
                            </Typo>
                        </Button>
                    </View>
                </View>
            </View>
            
            
        </ScreenWrapper>
    );
};

export default Loggedout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between", 
        paddingTop: spacingY._7,
    },
    loginImage: {
        width: width, 
        height: height*0.6,
        alignSelf: "center",
        marginBottom: -30,
    },
    loginButton: {
        alignSelf: "flex-end",
        marginRight: spacingX._20,
    },
    footer: {
        backgroundColor: colors.neutral900,
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: verticalScale(200),
        gap: spacingY._20,
    },
    buttonContainer: {
        width: "100%",
        paddingHorizontal: spacingX._25,
    },
});
