import BackButton from '@/components/BackButton'
import ModalWrapper from '@/components/ModalWrapper'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import React, { useState } from 'react'
import { ScrollView, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Typo from '@/components/Typo'
import InputSmaller from '@/components/InputSmaller'
import Button from '@/components/Button'
import Header from '@/components/Header'
import { CollectionType } from '@/types'
import * as ImagePicker from 'expo-image-picker'
import ImageUpload from '@/components/ImageUpload'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

const CollectionModal = () => {
    const [collection, setCollection] = useState<CollectionType>({
        name: "",
        image: null
    })

    const [loading, setLoading] = useState(false)

    const onPickImage = async () => {
        // Request permissions first
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }
        
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setCollection({...collection, image: result.assets[0]});
        }
    }

    const onSubmit = async() => {
        let { name, image } = collection;
        
        if (!name.trim()) {
            Alert.alert('Create Collection', 'Please enter a collection name');
            return;
        }
        
        setLoading(true);
        
        try {
            // Create a new collection object
            const newCollection = {
                id: Date.now().toString(), // Use timestamp as ID
                name: name,
                imageUri: image ? image.uri : null,
                createdAt: new Date().toISOString()
            };
            
            // Get existing collections from AsyncStorage
            const existingCollectionsString = await AsyncStorage.getItem('collections');
            const existingCollections = existingCollectionsString 
                ? JSON.parse(existingCollectionsString) 
                : [];
            
            // Add new collection to the array
            const updatedCollections = [newCollection, ...existingCollections];
            
            // Save back to AsyncStorage
            await AsyncStorage.setItem('collections', JSON.stringify(updatedCollections));
            
            // Success message and navigation
            Alert.alert(
                "Success", 
                "Collection created successfully",
                [{ text: "OK", onPress: () => router.back() }]
            );
            
        } catch (error) {
            console.error("Error creating collection:", error);
            Alert.alert("Error", "Failed to create collection");
        } finally {
            setLoading(false);
        }
    }

    return (
        <ModalWrapper>
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
                            placeholder='Collection Name'
                            value={collection.name}
                            onChangeText={(value) => setCollection({...collection, name: value})} 
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Collection Icon</Typo>
                        {collection.image ? (
                            <View style={styles.imagePreviewContainer}>
                                <ImageUpload 
                                    file={collection.image} 
                                    onClear={() => setCollection({...collection, image: null})}
                                    onSelect={onPickImage} 
                                    placeholder='Upload Image'
                                />
                            </View>
                        ) : (
                            <TouchableOpacity 
                                style={styles.imagePickerButton}
                                onPress={onPickImage}
                            >
                                <Typo color={colors.neutral400}>Select an image</Typo>
                            </TouchableOpacity>
                        )}
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
        justifyContent: 'space-between',
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
    imagePreviewContainer: {
        width: '100%',
    },
    imagePickerButton: {
        height: verticalScale(120),
        borderWidth: 1,
        borderColor: colors.neutral600,
        borderStyle: 'dashed',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        gap: spacingY._5,
    }
})