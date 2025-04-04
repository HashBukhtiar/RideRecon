import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useCarContext } from '@/context/CarContext';
import ScreenWrapper from '@/components/ScreenWrapper';
import BackButton from '@/components/BackButton';
import { colors, spacingY } from '@/constants/theme';
import Header from '../../components/Header';
import * as Icons from 'phosphor-react-native'
import { verticalScale } from '@/utils/styling';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CarType } from '@/types';

const { width, height} = Dimensions.get('window');

interface HistoryModalProps {
    mode?: 'view' | 'select'; 
    onSelectCar?: (car: CarType) => void; 
    collectionName?: string;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ mode, onSelectCar, collectionName }) => {
    const { cars, addCarToCollection } = useCarContext();
    const router = useRouter();
    const params = useLocalSearchParams();
    const currentMode = mode || params.mode;
    const currentCollectionName = collectionName || params.collectionName;

    console.log('Current Mode:', currentMode);

    const handlePress = async (item: CarType) => {
        if (currentMode === 'view') {
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
        } else if (currentMode === 'select' && currentCollectionName) {
            addCarToCollection(currentCollectionName, item);

            // Navigate back to the collection page
            router.back();
            router.replace({
                pathname: '../(details)/collectionDetails',
                params: { name: currentCollectionName },
            });
        }
        
    }

    const renderCar = ({ item }: { item: CarType }) => (
    
        <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
            <Image 
                source={{ uri: item.imageUri }} 
                style={styles.carImage} 
            />
            <View style={styles.carInfo}>
                <Text style={styles.carMake}>{item.make}</Text>
                <Text style={styles.carModel}>{item.model}</Text>
            </View>
            {currentMode === 'view' && ( 
                <Icons.CaretRight
                    size={verticalScale(20)}
                    weight="bold"
                    color={colors.white}
                />
            )}
        </TouchableOpacity>
    );
  
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Header
                    title={currentMode === 'view' ? 'Past Cars Identified' : 'Select a Car'}
                    leftIcon={<BackButton />}
                    style={{ marginBottom: spacingY._20 }}
                />
            <FlatList
                data={cars}
                renderItem={renderCar}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={<Text style={styles.emptyText}>No cars found in history.</Text>}
            />
            </View>

        </ScreenWrapper>
    );
}

export default HistoryModal

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
  });




