import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Icons from 'phosphor-react-native';

import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import Button from '@/components/Button';
import BackButton from '@/components/BackButton';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';

// Types
type Car = {
  id: string;
  make: string;
  model: string;
  imageUri: string | null;
  createdAt: string;
};

type Collection = {
  id: string;
  name: string;
  imageUri: string | null;
  createdAt: string;
  cars: Car[];
};

const CollectionDetail = () => {
  const { id } = useLocalSearchParams();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingCar, setAddingCar] = useState(false);
  const [newCar, setNewCar] = useState<{make: string; model: string; imageUri: string | null}>({
    make: '',
    model: '',
    imageUri: null
  });

  useEffect(() => {
    fetchCollection();
  }, [id]);

  const fetchCollection = async () => {
    setLoading(true);
    try {
      const collectionsString = await AsyncStorage.getItem('collections');
      if (collectionsString) {
        const collections: Collection[] = JSON.parse(collectionsString);
        const foundCollection = collections.find(c => c.id === id);
        if (foundCollection) {
          // Ensure cars array exists
          if (!foundCollection.cars) {
            foundCollection.cars = [];
          }
          setCollection(foundCollection);
        }
      }
    } catch (error) {
      console.error('Error fetching collection:', error);
      Alert.alert('Error', 'Failed to load collection');
    } finally {
      setLoading(false);
    }
  };

  const saveCollection = async (updatedCollection: Collection) => {
    try {
      const collectionsString = await AsyncStorage.getItem('collections');
      if (collectionsString) {
        const collections: Collection[] = JSON.parse(collectionsString);
        const updatedCollections = collections.map(c => 
          c.id === updatedCollection.id ? updatedCollection : c
        );
        await AsyncStorage.setItem('collections', JSON.stringify(updatedCollections));
      }
    } catch (error) {
      console.error('Error saving collection:', error);
      Alert.alert('Error', 'Failed to save changes');
    }
  };

  const handleAddCar = async () => {
    if (!newCar.make || !newCar.model) {
      Alert.alert('Error', 'Please enter both make and model');
      return;
    }

    if (collection) {
      const updatedCollection = { ...collection };
      const newCarWithId: Car = {
        id: Date.now().toString(),
        make: newCar.make,
        model: newCar.model,
        imageUri: newCar.imageUri,
        createdAt: new Date().toISOString()
      };

      updatedCollection.cars = [...(updatedCollection.cars || []), newCarWithId];
      
      await saveCollection(updatedCollection);
      setCollection(updatedCollection);
      setAddingCar(false);
      setNewCar({ make: '', model: '', imageUri: null });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewCar({...newCar, imageUri: result.assets[0].uri});
    }
  };

  const renderCarItem = ({ item }: { item: Car }) => (
    <View style={styles.carItem}>
      <View style={styles.carImageContainer}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.carImage} resizeMode="cover" />
        ) : (
          <View style={styles.carPlaceholder}>
            <Icons.Car size={40} color={colors.neutral400} />
          </View>
        )}
      </View>
      <View style={styles.carInfo}>
        <Typo size={18} fontWeight="600">{item.make}</Typo>
        <Typo size={16} color={colors.neutral300}>{item.model}</Typo>
      </View>
    </View>
  );

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Typo size={16} color={colors.neutral300} style={{marginTop: spacingY._10}}>
            Loading collection...
          </Typo>
        </View>
      </ScreenWrapper>
    );
  }

  if (!collection) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <BackButton onPress={() => router.back()} />
          <View style={styles.emptyContainer}>
            <Icons.FolderSimple size={60} color={colors.neutral500} />
            <Typo size={18} fontWeight="500" style={{marginTop: spacingY._20}}>
              Collection not found
            </Typo>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Typo size={24} fontWeight="600" style={styles.title}>
            {collection.name}
          </Typo>
        </View>

        {addingCar ? (
          <View style={styles.addCarForm}>
            <Typo size={20} fontWeight="600" style={styles.formTitle}>
              Add New Car
            </Typo>
            
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {newCar.imageUri ? (
                <Image source={{ uri: newCar.imageUri }} style={styles.pickedImage} />
              ) : (
                <View style={styles.imagePickerPlaceholder}>
                  <Icons.Camera size={30} color={colors.neutral400} />
                  <Typo size={14} color={colors.neutral400} style={{marginTop: 8}}>
                    Tap to select an image
                  </Typo>
                </View>
              )}
            </TouchableOpacity>
            
            <TextInput
              style={styles.input}
              placeholder="Make (e.g., Toyota)"
              placeholderTextColor={colors.neutral400}
              value={newCar.make}
              onChangeText={(text) => setNewCar({...newCar, make: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Model (e.g., Corolla)"
              placeholderTextColor={colors.neutral400}
              value={newCar.model}
              onChangeText={(text) => setNewCar({...newCar, model: text})}
            />
            
            <View style={styles.buttonGroup}>
              <Button 
                style={styles.cancelButton} 
                onPress={() => {
                  setAddingCar(false);
                  setNewCar({ make: '', model: '', imageUri: null });
                }}
              >
                <Typo size={16} fontWeight="600">Cancel</Typo>
              </Button>
              
              <Button style={styles.saveButton} onPress={handleAddCar}>
                <Typo size={16} color={colors.black} fontWeight="600">Save Car</Typo>
              </Button>
            </View>
          </View>
        ) : (
          <>
            <Button 
              onPress={() => setAddingCar(true)} 
              style={styles.addButton}
            >
              <Typo size={16} color={colors.black} fontWeight="600">
                Add New Car
              </Typo>
            </Button>

            {collection.cars && collection.cars.length > 0 ? (
              <FlatList
                data={collection.cars}
                renderItem={renderCarItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.carList}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Icons.Car size={60} color={colors.neutral500} />
                <Typo size={18} fontWeight="500" style={{marginTop: spacingY._20}}>
                  No cars in this collection
                </Typo>
                <Typo size={14} color={colors.neutral400} style={{textAlign: 'center', marginTop: spacingY._5}}>
                  Add a car to start building your collection
                </Typo>
              </View>
            )}
          </>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default CollectionDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacingY._20,
    marginBottom: spacingY._10,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    marginRight: 35, // Account for back button on left side
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacingX._30,
  },
  addButton: {
    marginBottom: spacingY._20,
  },
  carList: {
    paddingBottom: spacingY._20,
  },
  carItem: {
    flexDirection: 'row',
    backgroundColor: colors.neutral800,
    borderRadius: radius._10,
    borderCurve: 'continuous',
    marginBottom: spacingY._15,
    overflow: 'hidden',
  },
  carImageContainer: {
    width: verticalScale(80),
    height: verticalScale(80),
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  carPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.neutral700,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carInfo: {
    flex: 1,
    padding: spacingX._15,
    justifyContent: 'center',
  },
  addCarForm: {
    flex: 1,
    paddingBottom: spacingY._20,
  },
  formTitle: {
    marginBottom: spacingY._20,
    textAlign: 'center',
  },
  imagePicker: {
    height: verticalScale(200),
    backgroundColor: colors.neutral800,
    borderRadius: radius._10,
    borderCurve: 'continuous',
    overflow: 'hidden',
    marginBottom: spacingY._20,
  },
  imagePickerPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  input: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._10,
    borderCurve: 'continuous',
    padding: spacingY._15,
    fontSize: verticalScale(16),
    color: colors.white,
    marginBottom: spacingY._15,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacingY._10,
  },
  cancelButton: {
    flex: 1,
    marginRight: spacingX._10,
    backgroundColor: colors.neutral700,
  },
  saveButton: {
    flex: 1,
    marginLeft: spacingX._10,
  },
});