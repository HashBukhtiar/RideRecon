import React from 'react';
import { Image, View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native';
import BackButton from '@/components/BackButton';
import { colors, spacingY } from '@/constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import * as Icons from 'phosphor-react-native';
import { verticalScale } from '@/utils/styling';
import { useCarContext } from '@/context/CarContext';
import { CarType } from '@/types';

const { width } = Dimensions.get('window');

const CollectionDetails = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const name = params.name;
    const { carsByCollection } = useCarContext();

    const cars = carsByCollection[name as string] || [];

    const handlePress = async (item: CarType) => {
        router.push({
            pathname: '../(details)/carDetails',
            params: {
                imageUri: item.imageUri || '', 
                make: item.make || 'Unknown',
                model: item.model || 'Unknown',
                confidence: item.confidence || 'N/A',
                funFact: item.funFact || 'No fun fact available.',
                purchaseLinks: JSON.stringify(item.purchaseLinks || []), 
            },
        });  
    }
    
    const renderCar = ({ item }: { item: typeof cars[0] }) => (
        
        <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
            <Image 
                source={{ uri: item.imageUri }} 
                style={styles.carImage} 
            />
            <View style={styles.carInfo}>
                <Text style={styles.carMake}>{item.make}</Text>
                <Text style={styles.carModel}>{item.model}</Text>
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
                <Header
                    title={name} 
                    leftIcon={<BackButton />}
                    style={{ marginBottom: spacingY._20 }}
                />
                <FlatList
                    data={cars}
                    renderItem={renderCar}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={<Text style={styles.emptyText}>No cars in this collection yet.</Text>}
                />
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={()=> 
                    router.push({
                        pathname: '../(modals)/historyModal',
                        params: { mode: 'select', collectionName: name },
                        })
                    }>
                    <Icons.PlusCircle
                        weight="fill"
                        color={colors.primary}
                        size={verticalScale(70)}
                    />
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
};

export default CollectionDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 20
    },
    card: {
        flexDirection: 'row', 
        alignItems: 'center',
        marginBottom: 20 
    },
    carImage: { 
        width: width * 0.3, 
        height: width * 0.3, 
        borderRadius: 10,
        marginRight: 30 
    },
    carInfo: {     
        flex: 1,
        justifyContent: 'center', 
    },
    carMake: {
        fontSize: 20, 
        fontWeight: 'bold',
        color: colors.white,
    },
    carModel: {
        fontSize: 18,
        color: colors.white,
    },
    emptyText: {
        color: colors.neutral500,
        textAlign: 'center',
        marginTop: spacingY._20,
    },
    addButton: {
        position: 'absolute', 
        bottom: spacingY._25, 
        right: spacingY._25, 
        alignItems: 'center',
        justifyContent: 'center',
    },
});
