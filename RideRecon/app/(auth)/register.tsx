import BackButton from '@/components/BackButton'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import React, { useRef, useState } from 'react'
import { Pressable, Alert, StyleSheet, Text, View } from 'react-native'
import * as Icons from 'phosphor-react-native'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import InputSmaller from '@/components/InputSmaller'

const Register = () => {

    const emailRef = useRef("")
    const passwordRef = useRef("")
    const nameRef = useRef("")
    const usernameRef = useRef("")
    const[isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async()=> {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert("Sign up", "Please fill all the fields")
            return;
        }
        console.log("name: ", nameRef.current)
        console.log("username: ", usernameRef.current)
        console.log("email: ", emailRef.current)
        console.log("password: ", passwordRef.current)
        console.log("good to go");
    }

    return (
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
                        icon={
                        <Icons.User 
                            size={verticalScale(26)} 
                            color={colors.neutral300} 
                            weight="fill"
                        />}
                    />
                    <InputSmaller 
                        placeholder="Enter your username" 
                        onChangeText={value=> usernameRef.current = value}
                        icon={
                        <Icons.At 
                            size={verticalScale(26)} 
                            color={colors.neutral300} 
                            weight="fill"
                        />}
                    />
                    <InputSmaller 
                        placeholder="Enter your password" 
                        secureTextEntry
                        onChangeText={value=> passwordRef.current = value}
                        icon={
                            <Icons.Lock 
                              size={verticalScale(26)} 
                              color={colors.neutral300} 
                              weight="fill"
                            />
                        }
                    />

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
    }
})