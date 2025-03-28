
import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const _layout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="(modals)/accountModal"
                options={{
                    presentation: "modal"
                }}
            />
        </Stack>
    )  
        
}

export default _layout

const styles = StyleSheet.create({})



