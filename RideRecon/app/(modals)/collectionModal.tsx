import BackButton from '@/components/BackButton'
import ModalWrapper from '@/components/ModalWrapper'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import React, { useState } from 'react'
import { ScrollView, Alert, StyleSheet, View } from 'react-native'
import Typo from '@/components/Typo'
import InputSmaller from '@/components/InputSmaller'
import Button from '@/components/Button'
import Header from '@/components/Header'
import { CollectionType } from '@/types';
import * as ImagePicker from 'expo-image-picker';
import ImageUpload from '@/components/ImageUpload'
import { router } from 'expo-router'
import { useCollectionContext } from '@/context/CollectionContext'

const CollectionModal = () => {
    const { addCollection } = useCollectionContext();
    const [collection, setCollection] = useState<CollectionType>({
        name: "",
        imageUri: null
    })

    const[loading, setLoading] = useState(false)

    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            setCollection({...collection, imageUri: result.assets[0]});
        }
    }

    
    const onSubmit = async() => {
        let {name, imageUri} = collection;
        if(!imageUri || !name) {
            Alert.alert('Collection Creation', 'Please upload an image and name for the collection')
            return
        }

        setLoading(true);
        
        try {
            addCollection({ name, imageUri: imageUri.uri});
            router.back();
        } catch (error) {
            console.error("Navigation error:", error);
            Alert.alert("Error", "Could not navigate to results screen");
        } finally {
            setLoading(false);
        }
    }

    return (
        <ModalWrapper style={{ backgroundColor: colors.neutral900}}>
            <View style={styles.container}>
                <Header
                    title='New Collection' 
                    leftIcon={<BackButton />}
                    style={{ marginBottom: spacingY._10 }}
                />

                {/* form */}
                <ScrollView contentContainerStyle={styles.form}>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Name</Typo>
                        <InputSmaller
                            placeholder='Name'
                            value={collection.name}
                            onChangeText={(value) => setCollection({...collection, name: value})} 
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Collection Icon</Typo>
                        <ImageUpload 
                            file={collection.imageUri} 
                            onClear={()=> setCollection({...collection, imageUri: null})}
                            onSelect={onPickImage} 
                            placeholder='Upload Image'
                        />
                    </View>
 
                </ScrollView>
                <View style={styles.footer}>
                    <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
                        <Typo color={colors.black} fontWeight={'700'}>
                            Create New Collection
                        </Typo>
                    </Button>
                </View>
            </View>
        </ModalWrapper>
    )
}

export default CollectionModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingY._10,
    },
    footer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: spacingX._20,
        gap: scale(12),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral700,
        marginBottom: spacingY._5,
        borderTopWidth: 1,
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15,
    },
    avatarContainer: {
        position: 'relative',
        alignSelf: 'center',
    },
    avatar: {
        alignSelf:'center',
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: colors.neutral500,
    },
    editIcon: {
        position: 'absolute',
        bottom: spacingY._5,
        right: spacingY._7,
        borderRadius: 100,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: spacingY._7,
    },
    inputContainer: {
        gap: spacingY._5,
    }
})