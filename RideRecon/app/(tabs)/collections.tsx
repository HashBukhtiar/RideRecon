import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import { router, useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Icons from "phosphor-react-native"

const Collections = () => {

    const router = useRouter()

    return (
        <ScreenWrapper style={{ backgroundColor: colors.black}}>
            <View style={styles.container}>

                {/* collection sets */}
                <View style={styles.sets}>
                    <View style={styles.flexRow} >
                        <Typo size ={22} fontWeight={"500"} >
                            Personal Collections
                        </Typo>
                        <TouchableOpacity onPress={()=> router.push("/(modals)/collectionModal")}>
                            <Icons.PlusCircle
                                weight="fill"
                                color={colors.primary}
                                size={verticalScale(33)}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* mess with background color in sets to get it to work with the collections list */}

                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Collections

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: spacingX._20,
    },
    flexRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacingY._10,
    },
    sets: {
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
})
