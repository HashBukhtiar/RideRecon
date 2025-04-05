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
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            setIdentification({...identification, image: result.assets[0]});
        }
    }
    
    const onTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Camera access is needed to take a photo');
            return;
        }
        
        let result = await ImagePicker.launchCameraAsync({
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
                <View style={styles.topSection}>
                    <View style={styles.titleContainer}>
                        <BackButton onPress={() => router.back()} />
                        <Typo size={22} fontWeight="600" style={{ marginLeft: spacingX._10 }}>
                            Car Identification
                        </Typo>
                    </View>
                    
                    <Button 
                        onPress={onSubmit} 
                        loading={loading}
                        style={styles.identifyButton}
                    >
                        <Typo size={16} color={colors.neutral900} fontWeight={"600"}>
                            Identify
                        </Typo>
                    </Button>
                </View>
                <ScrollView 
                    contentContainerStyle={styles.form}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200} style={{marginLeft:spacingX._15}}>Vehicle Image</Typo>
                        
                        {identification.image ? (
                            <View style={styles.imagePreviewContainer}>
                                <ImageUpload 
                                    file={identification.image} 
                                    onClear={()=> setIdentification({...identification, image: null})}
                                    onSelect={onPickImage} 
                                    placeholder='Upload Image'
                                />
                            </View>
                        ) : (
                            <View style={styles.imageButtonsContainer}>
                                <Button style={styles.imageButton} onPress={onPickImage}>
                                    <Typo color={colors.neutral900} fontWeight="500">Gallery</Typo>
                                </Button>
                                <Button style={styles.imageButton} onPress={onTakePhoto}>
                                    <Typo color={colors.neutral900} fontWeight="500">Camera</Typo>
                                </Button>
                            </View>
                        )}
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
        </ScreenWrapper>
    )
}

export default Home

const styles = StyleSheet.create({
    topSection: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: spacingY._20,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    identifyButton: {
        paddingHorizontal: spacingX._15,
        height: 45,
        marginRight: spacingX._12
    },
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
    imageButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacingX._10,
    },
    imageButton: {
        flex: 1,
        height: verticalScale(52),
    },
    imagePreviewContainer: {
        width: '100%',
    },
    footer: {
        backgroundColor: colors.neutral900,
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: verticalScale(110),
        gap: spacingY._20,
    },
})