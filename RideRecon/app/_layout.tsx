import React from 'react'
import { View, Text } from 'react-native'
import { Tabs } from 'expo-router'
import TabBar from '../components/TabBar'

const _layout = () => {
    return (
        <Tabs
            tabBar={props=> <TabBar{...props} />}
        >
            <Tabs.Screen
                name="(auth)"
                options={{
                    title: "Account",
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="collection"
                options={{
                    title: "Collection",
                    headerShown: false,
                }}
            />

        </Tabs>
        
    )
}

export default _layout
