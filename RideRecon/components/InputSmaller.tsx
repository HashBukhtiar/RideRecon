import { colors, radius, spacingX } from '@/constants/theme'
import { InputProps } from '@/types'
import { scale, verticalScale } from '@/utils/styling'
import React from 'react'
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native'

const { width, height } = Dimensions.get('window');

const InputSmaller = (props: InputProps) => {
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

export default InputSmaller

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: verticalScale(54),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.neutral300,
        borderRadius: radius._17,
        borderCurve: "continuous",
        paddingHorizontal: spacingX._15,
        gap: spacingX._10,
    },
    input: {
        flex: 1,
        color: colors.white,
        fontSize: verticalScale(14),
    },
    
})
