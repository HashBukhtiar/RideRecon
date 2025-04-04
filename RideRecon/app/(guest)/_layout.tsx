import TabBarGuest from '@/components/TabBarGuest'
import { Tabs } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'


const _layout = () => {

    return (
        <Tabs tabBar={TabBarGuest} screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="loggedout" options={{ title: "Account" }}/>
            <Tabs.Screen name="index" options={{ title: "Home" }}/>
        </Tabs>
    )
}

export default _layout

const styles = StyleSheet.create({})
