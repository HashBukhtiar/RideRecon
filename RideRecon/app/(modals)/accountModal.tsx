import BackButton from '@/components/BackButton'
import ModalWrapper from '@/components/ModalWrapper'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import { Image } from 'expo-image'
import React, { useEffect, useState } from 'react'
import { ScrollView, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getAccountImage } from '@/services/imageServices'
import * as Icons from 'phosphor-react-native'
import Typo from '@/components/Typo'
import InputSmaller from '@/components/InputSmaller'
import { UserDataType } from '@/types'
import Button from '@/components/Button'
import Header from '@/components/Header'
import { initializeApp } from 'firebase/app'
import { getAuth, updateProfile, updateEmail } from 'firebase/auth'
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const AccountModal = () => {
    const [userData, setUserData] = useState({
        name: "",
        username: "",
        email: "",
        image: null,
        photoURL: null
    });

    const [loading, setLoading] = useState(false);
    const [initialEmail, setInitialEmail] = useState("");

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const user = auth.currentUser;
                if (!user) {
                    Alert.alert("Error", "User not authenticated");
                    router.back();
                    return;
                }

                // Get additional user data from Firestore
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const firestoreData = userDoc.data();
                    setUserData({
                        name: user.displayName || firestoreData.name || "",
                        username: firestoreData.username || "",
                        email: user.email || "",
                        image: null,
                        photoURL: user.photoURL || firestoreData.photoURL
                    });
                    setInitialEmail(user.email || "");
                } else {
                    // If no Firestore doc exists, use only Auth data
                    setUserData({
                        name: user.displayName || "",
                        username: "",
                        email: user.email || "",
                        image: null,
                        photoURL: user.photoURL
                    });
                    setInitialEmail(user.email || "");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                Alert.alert("Error", "Failed to load user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const pickImage = async () => {
        // Request permissions first
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }
        
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setUserData({...userData, image: result.assets[0]});
        }
    };

    const uploadImage = async () => {
        if (!userData.image) return null;
        
        try {
            const user = auth.currentUser;
            if (!user) return null;
            
            // Convert image to blob
            const response = await fetch(userData.image.uri);
            const blob = await response.blob();
            
            // Upload to Firebase Storage
            const imagePath = `profile_pictures/${user.uid}/${Date.now()}.jpg`;
            const storageRef = ref(storage, imagePath);
            await uploadBytes(storageRef, blob);
            
            // Get download URL
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    };

    const onSubmit = async() => {
        let {name, username, email, image} = userData;
        
        if (!name.trim() || !username.trim() || !email.trim()) {
            Alert.alert('Update Profile', 'Please fill all the fields');
            return;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Update Profile', 'Please enter a valid email address');
            return;
        }
        
        setLoading(true);
        
        try {
            const user = auth.currentUser;
            if (!user) {
                Alert.alert("Error", "User not authenticated");
                return;
            }
            
            // Update profile data in batch
            const updates = [];
            
            // Upload image if changed
            let photoURL = userData.photoURL;
            if (image) {
                const downloadURL = await uploadImage();
                if (downloadURL) {
                    photoURL = downloadURL;
                }
            }
            
            // Update Auth profile
            updates.push(
                updateProfile(user, {
                    displayName: name,
                    photoURL: photoURL
                })
            );
            
            // Update email if changed
            if (email !== initialEmail) {
                updates.push(updateEmail(user, email));
            }
            
            // Update Firestore document
            updates.push(
                updateDoc(doc(db, "users", user.uid), {
                    name: name,
                    username: username,
                    email: email,
                    photoURL: photoURL,
                    updatedAt: new Date()
                })
            );
            
            // Execute all updates
            await Promise.all(updates);
            
            Alert.alert(
                "Success", 
                "Profile updated successfully",
                [{ text: "OK", onPress: () => router.back() }]
            );
        } catch (error) {
            console.error("Error updating profile:", error);
            let errorMessage = "Failed to update profile";
            
            // Handle specific Firebase errors
            if (error.code === 'auth/requires-recent-login') {
                errorMessage = "This operation requires recent authentication. Please sign out and sign in again.";
            } else if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Email is already in use by another account";
            }
            
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper>
            <View style={styles.container}>
                <Header
                    title='Update Profile' 
                    leftIcon={<BackButton />}
                    style={{ marginBottom: spacingY._10 }}
                />

                {/* form */}
                <ScrollView contentContainerStyle={styles.form}>
                    <View style={styles.avatarContainer}>
                        <Image
                            style={styles.avatar}
                            source={userData.image ? {uri: userData.image.uri} : getAccountImage(userData.photoURL)}
                            contentFit='cover'
                            transition={100}
                        />

                        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
                            <Icons.Pencil
                                size={verticalScale(20)}
                                color={colors.neutral800}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Name</Typo>
                        <InputSmaller
                            placeholder='Enter your name'
                            value={userData.name}
                            onChangeText={(value) => setUserData({...userData, name: value})} 
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Username</Typo>
                        <InputSmaller
                            placeholder='Enter your username'
                            value={userData.username}
                            onChangeText={(value) => setUserData({...userData, username: value})} 
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Email</Typo>
                        <InputSmaller
                            placeholder='Enter your email'
                            value={userData.email}
                            onChangeText={(value) => setUserData({...userData, email: value})} 
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </ScrollView>
                <View style={styles.footer}>
                    <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
                        <Typo color={colors.black} fontWeight={'700'}>
                            Update
                        </Typo>
                    </Button>
                </View>
            </View>
        </ModalWrapper>
    )
}

export default AccountModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacingY._10,
    },
    footer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: spacingX._20,
        gap: scale(12),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral700,
        marginBottom: spacingY._5,
        borderTopWidth: 1,
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15,
    },
    avatarContainer: {
        position: 'relative',
        alignSelf: 'center',
    },
    avatar: {
        alignSelf:'center',
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: colors.neutral500,
    },
    editIcon: {
        position: 'absolute',
        bottom: spacingY._5,
        right: spacingY._7,
        borderRadius: 100,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: spacingY._7,
    },
    inputContainer: {
        gap: spacingY._5,
    }
})