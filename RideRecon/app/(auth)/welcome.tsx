import Button from '@/components/Button'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Welcome = () => {
    const router = useRouter();
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                
                <View style={styles.buttonContainer}>
                    <Button onPress={()=> router.push('../(tabs)')}>
                        <Typo size={22} color={colors.neutral900} fontWeight={"600"}>
                            Account Access
                        </Typo>
                    </Button>

                    <Image
                    style={styles.logo}
                    resizeMode="contain"
                    source={require("../../assets/images/design/logo.png")}
                    />

                    <Button onPress={()=> router.push('../(guest)')}>
                        <Typo size={22} color={colors.neutral900} fontWeight={"600"}>
                            Guest Access
                        </Typo>
                    </Button>
                </View>

            </View>
            
        </ScreenWrapper>
    )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center", 
        alignItems: "center"

    },
    buttonContainer: {
        width: "100%",
        paddingHorizontal: spacingX._25,
        gap: spacingY._3,
        marginVertical: 30
    },
    logo: {
        height: 250,
        aspectRatio: 1,
        alignSelf: "center",
    },
})
