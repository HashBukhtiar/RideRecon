import Header from '@/components/Header'
import ModalWrapper from '@/components/ModalWrapper'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import React, { useEffect, useState, useCallback } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, StatusBar } from 'react-native';
import { Image } from 'expo-image'
import { getAccountImage } from '@/services/imageServices'
import { accountOptionType } from '@/types'
import * as Icons from 'phosphor-react-native'
import { verticalScale } from '@/utils/styling';
import { router, useRouter, useFocusEffect } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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
const db = getFirestore(app);

const Account = () => {
    const router = useRouter();
    const [userData, setUserData] = useState({
        name: "Loading...",
        email: "Loading...",
        username: "",
        photoURL: null
    });
    
    // Function to fetch user data
    const fetchUserData = useCallback(async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.log("No user is signed in");
                return;
            }

            // Get additional user data from Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const firestoreData = userDoc.data();
                setUserData({
                    name: user.displayName || firestoreData.name || "User",
                    email: user.email || "No email",
                    username: firestoreData.username || "",
                    photoURL: user.photoURL || firestoreData.photoURL
                });
            } else {
                setUserData({
                    name: user.displayName || "User",
                    email: user.email || "No email",
                    username: "",
                    photoURL: user.photoURL
                });
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            Alert.alert("Error", "Failed to load user data");
        }
    }, []);
    
    // Fetch data whenever screen comes into focus
    useFocusEffect(
        useCallback(() => {
            console.log("Account screen is focused - refreshing data");
            fetchUserData();
            return () => {}; // cleanup function
        }, [fetchUserData])
    );
    
    // Also fetch on initial mount
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

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
        },
        {
            title: 'FAQ',
            icon: <Icons.Question size={26} color={colors.white} />,
            routeName: '/faq',
        }
    ]

    // Sign out function
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("User signed out successfully");
            router.replace("../(auth)/login");
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
        <View style={styles.outerContainer}>
            <StatusBar backgroundColor={colors.neutral900} barStyle="light-content" />
            <SafeAreaView style={styles.safeArea}>
                <ModalWrapper style={styles.modalWrapper}>
                    <View style={styles.container}>
                        <Header title='Account Details' style={{marginVertical: spacingY._30}}/>

                        {/* user info */}
                        <View style={styles.userInfo}>

                            {/* avatar */}
                            <View>
                                <Image
                                    source={getAccountImage(userData.photoURL)}
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
            </SafeAreaView>
        </View>
    )
}

export default Account

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: colors.neutral900, // This will extend to the entire screen
    },
    safeArea: {
        flex: 1, 
        backgroundColor: colors.neutral900, // Ensures safe area has the correct background
    },
    modalWrapper: {
        backgroundColor: colors.neutral900, // Set background color for modal wrapper
    },
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