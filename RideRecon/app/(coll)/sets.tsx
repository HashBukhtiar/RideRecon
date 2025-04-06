import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import { router, useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { StyleSheet, View, FlatList, Image, TouchableOpacity, Text } from 'react-native'
import * as Icons from 'phosphor-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Type for collection items
type CollectionItem = {
  id: string;
  name: string;
  imageUri: string | null;
  createdAt: string;
}

const Collections = () => {
    const [collections, setCollections] = useState<CollectionItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch collections whenever screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchCollections();
            return () => {}; // Cleanup function
        }, [])
    );

    const fetchCollections = async () => {
        setLoading(true);
        try {
            // Get collections from AsyncStorage
            const collectionsString = await AsyncStorage.getItem('collections');
            const collections = collectionsString 
                ? JSON.parse(collectionsString) 
                : [];
            
            setCollections(collections);
        } catch (error) {
            console.error("Error fetching collections:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderCollectionItem = ({ item }: { item: CollectionItem }) => (
        <TouchableOpacity 
            style={styles.collectionItem}
            onPress={() => {
                // Handle collection item press
                // For example, navigate to collection details
                console.log("Pressed collection:", item.name);
            }}
        >
            <View style={styles.imageContainer}>
                {item.imageUri ? (
                    <Image 
                        source={{ uri: item.imageUri }} 
                        style={styles.collectionImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <Icons.FolderSimple 
                            size={50} 
                            color={colors.neutral400} 
                        />
                    </View>
                )}
            </View>
            
            <View style={styles.collectionInfo}>
                <Typo size={16} fontWeight="600" numberOfLines={1}>
                    {item.name}
                </Typo>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Typo size={24} fontWeight="600" style={styles.title}>
                        My Collections
                    </Typo>
                    
                    <Button 
                        onPress={() => router.push('/(modals)/collectionModal')} 
                        style={styles.addButton}
                    >
                        <Typo size={16} color={colors.neutral900} fontWeight={"600"}>
                            Add New Collection
                        </Typo>
                    </Button>
                </View>

                {collections.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Icons.FolderSimple size={60} color={colors.neutral500} />
                        <Typo size={18} fontWeight="500" style={{marginTop: spacingY._20}}>
                            No collections yet
                        </Typo>
                        <Typo size={14} color={colors.neutral400} style={{textAlign: 'center', marginTop: spacingY._5}}>
                            Create your first collection to organize your identified vehicles
                        </Typo>
                    </View>
                ) : (
                    <FlatList
                        data={collections}
                        renderItem={renderCollectionItem}
                        keyExtractor={item => item.id}
                        numColumns={2}
                        contentContainerStyle={styles.gridContainer}
                        columnWrapperStyle={styles.columnWrapper}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </ScreenWrapper>
    )
}

export default Collections

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._20,
    },
    header: {
        paddingVertical: spacingY._20,
        gap: spacingY._15,
    },
    title: {
        textAlign: 'center',
    },
    addButton: {
        marginBottom: spacingY._10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacingX._30,
    },
    gridContainer: {
        paddingBottom: spacingY._20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: spacingY._15,
    },
    collectionItem: {
        width: '48%',
        borderRadius: radius._15,
        borderCurve: 'continuous',
        backgroundColor: colors.neutral800,
        overflow: 'hidden',
    },
    imageContainer: {
        height: verticalScale(120),
        width: '100%',
    },
    collectionImage: {
        width: '100%',
        height: '100%',
    },
    placeholderContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.neutral700,
        justifyContent: 'center',
        alignItems: 'center',
    },
    collectionInfo: {
        padding: spacingY._10,
        alignItems: 'center',
    },
})