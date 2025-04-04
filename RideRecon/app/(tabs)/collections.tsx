import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useCollectionContext } from '@/context/CollectionContext';
import ScreenWrapper from '@/components/ScreenWrapper';
import { colors, spacingX, spacingY } from '@/constants/theme';
import Header from '../../components/Header';
import * as Icons from 'phosphor-react-native'
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import { CollectionType } from '@/types';

const { width } = Dimensions.get('window');

const Collections = () => {

    const { collects } = useCollectionContext();
    const router = useRouter();
    
    const handlePress = async (item: CollectionType) => {
        router.push({
            pathname: '../(details)/collectionDetails',
            params: {
                imageUri: item.imageUri || '', 
                name: item.name || 'Unknown', 
            },
        });
    }
    
    const renderCollection = ({ item }: { item: CollectionType }) => (
    
        <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
            <Image 
                source={{ uri: item.imageUri }} 
                style={styles.collectionImage} 
            />
            <View style={styles.collectionInfo}>
                <Text style={styles.collectionName}>{item.name}</Text>
            
            </View>
            <Icons.CaretRight
                size={verticalScale(20)}
                weight="bold"
                color={colors.white}
            />
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper>
            <View style={styles.container}>
            <Header title='Personal Collections' style={{marginTop: spacingY._10}}/>

                <TouchableOpacity 
                    style={styles.newImage} 
                    onPress={()=> router.push("/(modals)/collectionModal")}>
                        <Icons.Plus 
                            weight="bold"
                            color={colors.primary}
                            size={verticalScale(66)}
                        />
                </TouchableOpacity>

                <FlatList
                    data={collects.slice().reverse()}
                    renderItem={renderCollection}
                    keyExtractor={(item, index) => index.toString()}  
                />

            </View>
        </ScreenWrapper>
    )
}

export default Collections


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacingY._5,
        paddingHorizontal: spacingX._10,
        gap: spacingY._20,
        
    },
    card: { 
        flexDirection: 'row', 
        alignItems: 'center',
        marginBottom: 20 
    },
    newImage: { 
        backgroundColor: colors.neutral700,
        width: width * 0.35, 
        height: width * 0.35, 
        borderRadius: 10,
        borderColor: colors.neutral500,
        borderWidth: 1,
        marginRight: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    collectionImage: { 
        width: width * 0.35, 
        height: width * 0.35, 
        borderRadius: 10,
        borderColor: colors.neutral500,
        borderWidth: 1,
        marginRight: 30 
    },
    collectionInfo: {     
        flex: 1,
        justifyContent: 'center', 
    },
    collectionName: { 
        fontSize: 20, 
        fontWeight: 'bold',
        color: colors.white,
    },
    
})
