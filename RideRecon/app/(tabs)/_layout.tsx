import TabBar from '@/components/TabBar'
import { Tabs } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'


const _layout = () => {

    return (
        <Tabs tabBar={TabBar} screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="account" options={{ title: "Account" }}/>
            <Tabs.Screen name="index" options={{ title: "Home" }}/>
            <Tabs.Screen name="collections" options={{ title: "Collections" }} />
        </Tabs>
    )
}

export default _layout

const styles = StyleSheet.create({})
