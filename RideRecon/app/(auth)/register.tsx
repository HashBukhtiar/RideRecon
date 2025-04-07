import BackButton from '@/components/BackButton'
import Input from '@/components/Input'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import React, { useRef, useState } from 'react'
import { Pressable, Alert, StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native'
import * as Icons from 'phosphor-react-native'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import InputSmaller from '@/components/InputSmaller'
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

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
const db = getFirestore(app);

const Register = () => {
    const emailRef = useRef("")
    const passwordRef = useRef("")
    const nameRef = useRef("")
    const usernameRef = useRef("")
    const[isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async() => {
        if (!nameRef.current || !emailRef.current || !usernameRef.current || !passwordRef.current) {
            Alert.alert("Sign up", "Please fill all the fields");
            return;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailRef.current)) {
            Alert.alert("Sign up", "Please enter a valid email address");
            return;
        }
        
        // Basic password validation
        if (passwordRef.current.length < 6) {
            Alert.alert("Sign up", "Password must be at least 6 characters long");
            return;
        }
        
        setIsLoading(true);
        setError("");
        
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                emailRef.current,
                passwordRef.current
            );
            
            const user = userCredential.user;
            
            // Update the user's display name
            await updateProfile(user, {
                displayName: nameRef.current
            });
            
            // Store additional user data in Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: nameRef.current,
                email: emailRef.current,
                username: usernameRef.current,
                createdAt: new Date(),
                // Add any other user properties you want to store
            });
            
            console.log("User registered:", user.uid);
            
            // Navigate to home or onboarding
            router.push("/login");
        } catch (error) {
            console.error("Registration error:", error);
            
            // Handle specific Firebase auth errors
            if (error.code === 'auth/email-already-in-use') {
                setError("Email already in use. Try another one.");
            } else if (error.code === 'auth/invalid-email') {
                setError("Invalid email address");
            } else if (error.code === 'auth/weak-password') {
                setError("Password is too weak");
            } else {
                setError("Failed to register. Please try again");
            }
            
            Alert.alert("Registration Failed", error.message || "Failed to register");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScreenWrapper>
                    <View style={styles.container}>
                        <BackButton iconSize={28} />

                        <View style={{gap: 5, marginTop: spacingY._20}}>
                            <Typo size = {30} fontWeight={"800"}>
                                Let's Get Started
                            </Typo>
                        </View>

                        {/* form */}
                        <View style={styles.form}>
                            <Typo size={16} color={colors.textLighter}>
                                Please fill all fields below to create an account
                            </Typo>
                            <InputSmaller
                                placeholder="Enter your name" 
                                onChangeText={value=> nameRef.current = value}
                                icon={
                                <Icons.User
                                    size={verticalScale(26)} 
                                    color={colors.neutral300} 
                                    weight="fill"
                                />}
                            />
                            <InputSmaller 
                                placeholder="Enter your email" 
                                onChangeText={value=> emailRef.current = value}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                icon={
                                <Icons.Envelope 
                                    size={verticalScale(26)} 
                                    color={colors.neutral300} 
                                    weight="fill"
                                />}
                            />
                            <InputSmaller 
                                placeholder="Enter your username" 
                                onChangeText={value=> usernameRef.current = value}
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
                                    onChangeText={value=> passwordRef.current = value}
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
                                    onPress={() => setShowPassword(!showPassword)}
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

                            <Button loading={isLoading} onPress={handleSubmit}>
                                <Typo fontWeight={"700"} color={colors.black} size={21}>
                                    Sign up
                                </Typo>
                            </Button>
                        </View>

                        {/* footer */}
                        <View style = {styles.footer}>
                            <Typo size={15}>Already have an account?</Typo>
                            <Pressable onPress={()=> router.push("/(auth)/login")}> 
                                <Typo size={15} fontWeight={"700"} color={colors.primary}>Login</Typo>
                            </Pressable>
                        </View>
                    </View>
                </ScreenWrapper>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: spacingY._30,
        paddingHorizontal: spacingX._20,
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
    }
})