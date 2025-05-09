import { colors, radius, spacingX } from '@/constants/theme'
import { InputProps } from '@/types'
import { verticalScale } from '@/utils/styling'
import React from 'react'
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native'

const { width, height } = Dimensions.get('window');

const Input = (props: InputProps) => {
    return (
        <View
            style={[styles.container, props.containerStyle && props.containerStyle]}
        >
            {props.icon && props.icon}
            <TextInput
            style={[styles.input, props.inputStyle]}
            placeholderTextColor={colors.neutral400}
            ref={props.inputRef && props.inputRef}
            multiline={true}
            textAlignVertical="top"
            {...props}
            />
        </View>
    )
}

export default Input

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: width*0.96,
        height: height*0.2,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        borderWidth: 1,
        borderColor: colors.neutral300,
        borderRadius: radius._17,
        borderCurve: "continuous",
        paddingHorizontal: spacingX._15,
        paddingTop: spacingX._10,
        gap: spacingX._10,
    },
    input: {
        flex: 1,
        color: colors.white,
        fontSize: verticalScale(14),
    },
    
})
