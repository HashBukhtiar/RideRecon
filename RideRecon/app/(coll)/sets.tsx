import Button from '@/components/Button'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const sets = () => {
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.buttonContainer}>
                        <Button onPress={()=> router.push('/(auth)/register')}>
                            <Typo size={22} color={colors.neutral900} fontWeight={"600"}>
                                Add New Collection
                            </Typo>
                        </Button>
                    </View>

                    <View>
                        <Typo size={25} fontWeight={"600"}>
                            Personal Collections
                        </Typo>
                    </View>
                </View>
        


            </View>
        </ScreenWrapper>
    )
}

export default sets

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between", 
    },
    header: {
        backgroundColor: colors.neutral900,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingVertical: spacingY._15,
        gap: spacingY._20,
    },
    buttonContainer: {
        width: "100%",
        paddingHorizontal: spacingX._25,
    },
    flexRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacingY._10,
    },
    collections: {
        flex: 1,
        backgroundColor: colors.neutral900,
        borderTopRightRadius: radius._30,
        borderTopLeftRadius: radius._30,
        padding: spacingX._20,
        paddingTop: spacingX._25,
    },
    listStyle: {
        paddingVertical: spacingY._25,
        paddingTop: spacingY._15,
    }
});
