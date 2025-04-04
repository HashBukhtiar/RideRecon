
import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'
import { CarProvider } from '@/context/CarContext'; 
import { CollectionProvider } from '@/context/CollectionContext';


const _layout = () => {
    return (
        <CarProvider>
            <CollectionProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen
                            name="(modals)/accountModal"
                            options={{
                                presentation: "modal"
                            }}
                        />
                        <Stack.Screen
                            name="(modals)/collectionModal"
                            options={{
                                presentation: "modal"
                            }}
                        />
                    </Stack>
                </CollectionProvider>
        </CarProvider>
        
    )  
        
}

export default _layout

const styles = StyleSheet.create({})



