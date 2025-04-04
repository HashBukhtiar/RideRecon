import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
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
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            setIdentification({...identification, image: result.assets[0]});
        }
    }

    const onSubmit = async() => {
        let {name, image} = identification;
        if(!image) {
            Alert.alert('Vehicle Identification', 'Please upload an image of the vehicle')
            return
        }
        
        setLoading(true);
        
        try {
            // Pass the image URI when navigating
            router.push({
                pathname: '/(experts)/identify',
                params: { imageUri: image.uri }
            });
        } catch (error) {
            console.error("Navigation error:", error);
            Alert.alert("Error", "Could not navigate to results screen");
        } finally {
            setLoading(false);
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
                            onSelect={onPickImage} 
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
                    <Button onPress={onSubmit} loading={loading} >
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
