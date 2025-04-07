import BackButton from '@/components/BackButton'
import Input from '@/components/Input'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import React, { useRef, useState } from 'react'
import { Pressable, Alert, StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard } from 'react-native'
import * as Icons from 'phosphor-react-native'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import InputSmaller from '@/components/InputSmaller'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Login = () => {
    const emailRef = useRef("")
    const passwordRef = useRef("")
    const[isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async() => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert("Login", "Please fill all the fields");
            return;
        }
        
        setIsLoading(true);
        setError("");
        
        try {
            // Sign in with Firebase
            const userCredential = await signInWithEmailAndPassword(
                auth, 
                emailRef.current, 
                passwordRef.current
            );
            
            // User signed in successfully
            const user = userCredential.user;
            console.log("User logged in:", user.uid);
            
            // Navigate to home screen or dashboard
            router.push("/(tabs)");
        } catch (error) {
            console.error("Login error:", error);
            
            // Handle specific Firebase auth errors
            if (error.code === 'auth/invalid-email') {
                setError("Invalid email address");
            } else if (error.code === 'auth/user-not-found') {
                setError("No account found with this email");
            } else if (error.code === 'auth/wrong-password') {
                setError("Incorrect password");
            } else if (error.code === 'auth/too-many-requests') {
                setError("Too many failed login attempts. Try again later");
            } else {
                setError("Failed to login. Please try again");
            }
            
            Alert.alert("Login Failed", error.message || "Failed to login");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <ScreenWrapper style={styles.wrapper}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <BackButton iconSize={28} />

                    <View style={{gap: 5, marginTop: spacingY._20}}>
                        <Typo size = {30} fontWeight={"800"}>
                            Welcome!
                        </Typo>
                    </View>

                    {/* form */}
                    <View style={styles.form}>
                        <Typo size={16} color={colors.textLighter}>
                            Login now to track identifications and create collections
                        </Typo>
                        <InputSmaller 
                            placeholder="Enter your email" 
                            onChangeText={value=> emailRef.current = value}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            icon={
                            <Icons.At 
                                size={verticalScale(26)} 
                                color={colors.neutral300} 
                                weight="fill"
                            />}
                        />
                        <View style={styles.passwordContainer}>
                            <InputSmaller 
                                placeholder="Enter your password" 
                                secureTextEntry={!showPassword}
                                onChangeText={value => passwordRef.current = value}
                                icon={
                                    <Icons.Lock 
                                        size={verticalScale(26)} 
                                        color={colors.neutral300} 
                                        weight="fill"
                                    />
                                }
                            />
                            <Pressable 
                                style={styles.eyeIcon} 
                                onPress={() => setShowPassword(prev => !prev)}
                                hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}
                            >
                                {showPassword ? (
                                    <Icons.Eye size={verticalScale(22)} color={colors.neutral300} />
                                ) : (
                                    <Icons.EyeClosed size={verticalScale(22)} color={colors.neutral300} />
                                )}
                            </Pressable>
                        </View>
                        
                        {error ? (
                            <Typo size={14} color={colors.error} style={{marginTop: -10}}>
                                {error}
                            </Typo>
                        ) : null}
                        
                        <Typo size={14} color={colors.text} style={{alignSelf: "flex-end"}}>
                            Forgot Password?
                        </Typo>

                        <Button loading={isLoading} onPress={handleSubmit}>
                            <Typo fontWeight={"700"} color={colors.black} size={21}>
                                Login
                            </Typo>
                        </Button>
                    </View>

                    {/* footer */}
                    <View style={styles.footer}>
                        <Typo size={15}>Don't have an account?</Typo>
                        <Pressable onPress={()=> router.push("/(auth)/register")}> 
                            <Typo size={15} fontWeight={"700"} color={colors.primary}>Sign up</Typo>
                        </Pressable>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </ScreenWrapper>
    )
}

export default Login

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.neutral900,
    },
    container: {
        flex: 1,
        gap: spacingY._30,
        paddingHorizontal: spacingX._20,
        backgroundColor: colors.neutral900,
    },
    welcomeText: {
        fontSize: verticalScale(20),
        fontWeight: "bold",
        color: colors.text,
    },
    form: {
        gap: spacingY._20,
    },
    forgotPassword: {
        textAlign: "right",
        fontWeight: "500",
        color: colors.text,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        marginBottom: spacingY._20,
    },
    footerText: {
        textAlign: "center",
        color: colors.text,
        fontSize: verticalScale(15),
    },
    error: {
        color: 'red',
        marginBottom: spacingY._10,
    },
    passwordContainer: {
        position: 'relative',
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
})