import Header from '@/components/Header'
import ModalWrapper from '@/components/ModalWrapper'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image'
import { getAccountImage } from '@/services/imageServices'
import { accountOptionType } from '@/types'
import * as Icons from 'phosphor-react-native'
import { verticalScale } from '@/utils/styling';
import { router, useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Initialize Firebase (if not done elsewhere)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Account = () => {
    const router = useRouter();
    const [userData, setUserData] = useState({
        name: "Loading...",
        email: "Loading..."
    });
    
    // Get user data on component mount
    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUserData({
                name: user.displayName || "User",
                email: user.email || "No email"
            });
        }
    }, []);

    const accountOptions: accountOptionType[] = [
        {
            title: 'Sign Out',
            icon: <Icons.SignOut size={26} color={colors.white} />,
        },
        {
            title: 'Edit Account',
            icon: <Icons.User size={26} color={colors.white} />,
            routeName: '(modals)/accountModal',
        },
        {
            title: 'Identification History',
            icon: <Icons.ClockCounterClockwise size={26} color={colors.white}/>,
            routeName: '(modals)/historyModal',
        }
    ]

    // Sign out function
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("User signed out successfully");
            // Navigate to login screen after successful sign out
            router.replace("../");
        } catch (error) {
            console.error("Error signing out: ", error);
            Alert.alert("Error", "Failed to sign out. Please try again.");
        }
    };

    const showLogoutAlert = () => {
        Alert.alert(
            "Confirm", 
            "Are you sure you want to sign out?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log('cancel sign out'),
                    style: 'cancel'
                },
                {
                    text: "Logout",
                    onPress: handleSignOut,
                    style: 'destructive' // Red text on iOS
                }
            ]
        );
    }

    const handlePress = async (item: accountOptionType) => {
        if (item.title === 'Sign Out'){
            showLogoutAlert();
        } else if(item.routeName) {
            router.push(item.routeName);
        }
    }

    return (
    <ModalWrapper>
        <View style={styles.container}>
            <Header title='Account Details' style={{marginVertical: spacingY._30}}/>

            {/* user info */}
            <View style={styles.userInfo}>

                {/* avatar */}
                <View>
                    <Image
                        source={getAccountImage(auth.currentUser?.photoURL)}
                        style={styles.avatar}
                        contentFit='cover'
                        transition={100}
                    />
                </View>

                {/* user info */}
                <View style={styles.nameContainer}>
                    <Typo size={24} fontWeight={'600'} color={colors.neutral100}>
                        {userData.name}
                    </Typo>
                    <Typo size={15} color={colors.neutral400}>
                        {userData.email}
                    </Typo>
                </View>  
            </View>

            {/* account options */}
            <View style={styles.accountOptions}>
                {
                    accountOptions.map((item, index) => {
                        return(
                            <View key={index} style={styles.listItem}>
                                <TouchableOpacity style={styles.flexRow} onPress={() => handlePress(item)}>
                                    {/* icon */}
                                    <View style={[styles.listIcon]}>
                                        {item.icon && item.icon}
                                    </View>
                                    <Typo size={16} style={{ flex: 1 }} fontWeight={'500'}>
                                        {item.title}
                                    </Typo>
                                    <Icons.CaretRight
                                        size={verticalScale(20)}
                                        weight="bold"
                                        color={colors.white}
                                    />
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
            </View>
        </View>
    </ModalWrapper>
    )
}

export default Account

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._20,
        backgroundColor: colors.neutral900
    },
    userInfo: {
        marginTop: verticalScale(30),
        alignItems: 'center',
        gap: spacingY._15,
    },
    avatarContainer: {
        position: 'relative',
        alignSelf: 'center',
    },
    avatar: {
        alignSelf: 'center',
        backgroundColor: colors.neutral300,
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
    },
    editIcon: {
        position: 'absolute',
        bottom: 5,
        right: 8,
        borderRadius: 50,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: 5,
    },
    nameContainer: {
        gap: verticalScale(4),
        alignItems: 'center',
    },
    listIcon: {
        height: verticalScale(44),
        width: verticalScale(44),
        backgroundColor: colors.neutral500,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius._15,
        borderCurve: 'continuous',
    },
    listItem: {
        marginBottom: verticalScale(17),
    },
    accountOptions: {
        marginTop: spacingY._35,
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingX._10,
    }
})