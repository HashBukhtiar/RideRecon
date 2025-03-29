import BackButton from '@/components/BackButton'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import React, { useState } from 'react'
import { Alert, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import Typo from '@/components/Typo'
import Header from '@/components/Header'
import Input from '@/components/Input'
import ImageUpload from '@/components/ImageUpload'
import * as ImagePicker from 'expo-image-picker';
import { IdentificationType } from '@/types'
import Button from '@/components/Button'
import { router } from 'expo-router'

const Home = () => {

    const [identification, setIdentification] = useState<IdentificationType>({
        name: "",
        image: null
    })

    const[loading, setLoading] = useState(false)

    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            aspect: [4, 3],
            quality: 0.5,
        })
    }

    const onSubmit = async() => {
        let{name, image} = identification;
        if(!name.trim() && !image){
            Alert.alert('User', 'Please fill all the fields')
            return
        }
    }

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Header 
                    title='Fill out information below to proceed with identification' 
                    style={{marginVertical: spacingY._30, paddingHorizontal: spacingY._30}}
                />

                <ScrollView contentContainerStyle={styles.form}>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Collection Icon</Typo>
                        <ImageUpload 
                            file={identification.image} 
                            onClear={()=> setIdentification({...identification, image: null})}
                            onSelect={file=> setIdentification({...identification, image: file})} 
                            placeholder='Upload Image'
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Relevant Information</Typo>
                        <Input
                            placeholder='Description'
                            value={identification.name}
                            onChangeText={(value) => setIdentification({...identification, name: value})} 
                        />
                    </View>
                </ScrollView>
            </View>

            {/* footer */}
            <View style = {styles.footer}> 
                
                <View style={styles.buttonContainer}>
                    <Button onPress={()=> router.push('/(auth)/register')}>
                        <Typo size={20} color={colors.neutral900} fontWeight={"600"}>
                            Identify
                        </Typo>
                    </Button>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15,
    },
    inputContainer: {
        gap: spacingY._15,
    },
    footer: {
        backgroundColor: colors.neutral900,
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: verticalScale(110),
        gap: spacingY._20,
    },
    buttonContainer: {
        width: "100%",
        paddingHorizontal: spacingX._25,
    }
    
})
