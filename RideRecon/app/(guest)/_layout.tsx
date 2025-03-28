import TabBarGuest from '@/components/TabBarGuest'
import { router, Tabs, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'


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
