import { ImageUploadProps } from '@/types'
import React from 'react'
import { Dimensions, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import * as Icons from 'phosphor-react-native'
import { colors, radius } from '@/constants/theme';
import Typo from './Typo';
import { Image } from 'expo-image'
import { scale, verticalScale } from '@/utils/styling';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

const ImageUpload = ({
    file=null,
    onSelect,
    onClear,
    containerStyle,
    imageStyle,
    placeholder = ''
}: ImageUploadProps) => {

    const pickImage = async ()=>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            aspect: [4, 3],
            quality: 0.5,
        })
        if (!result.canceled) {
            onSelect(result.assets[0]);
        }
    }
    return (
        <View>
            {!file && (
                <TouchableOpacity onPress={pickImage} style={[styles.inputContainer, containerStyle && containerStyle]}>
                    
                    <Icons.UploadSimple color={colors.neutral200}/>
                    {placeholder && <Typo size={15}>{placeholder}</Typo>}
                </TouchableOpacity>
            )}

            {file && (
                <View style={[styles.image, imageStyle && imageStyle] }>
                    <Image
                        style={{flex: 1}}
                        source={'../../(assets)/images/design/logo.png'}
                        contentFit='cover'
                        transition={100}
                    /> 
                       
                    <TouchableOpacity style={styles.deleteIcon} onPress={onClear}>
                        <Icons.XCircle
                        size={verticalScale(24)}
                        weight='fill'
                        color={colors.white}
                        />
                    
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

export default ImageUpload

const styles = StyleSheet.create({
    inputContainer: {
        width: height*0.2,
        height: height*0.2,
        backgroundColor: colors.neutral700,
        borderRadius: radius._15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: colors.neutral500,
        borderStyle: 'dashed',
    },
    image: {
        height: scale(150),
        width: scale(150),
        borderRadius: radius._15,
        borderCurve: 'continuous',
        overflow: 'hidden',
    },
    deleteIcon: {
        position: 'absolute',
        top: scale(6),
        right: scale(6),
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 10,
    }
})
