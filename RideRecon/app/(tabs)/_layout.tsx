import TabBar from '@/components/TabBar'
import { router, Tabs, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const _layout = () => {
    return (
        <Tabs 
            tabBar={TabBar} 
            screenOptions={{ 
                headerShown: false,
                animation: 'none',
            }}
        >
            <Tabs.Screen name="account" options={{ title: "Account" }}/>
            <Tabs.Screen name="index" options={{ title: "Home" }}/>
            <Tabs.Screen name="collections" options={{ title: "Collections" }} />
        </Tabs>
    )
}

export default _layout

const styles = StyleSheet.create({})