import BackButton from '@/components/BackButton'
import Header from '@/components/Header'
import ModalWrapper from '@/components/ModalWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { formatDistanceToNow } from 'date-fns'
import { router } from 'expo-router'
import * as Icons from 'phosphor-react-native'

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

// Type for identification history items
type IdentificationItem = {
  id: string;
  make: string;
  model: string;
  imageUrl: string;
}

const lamborghiniUrusEntry: IdentificationItem = {
  id: 'hardcoded-lamborghini-urus',
  make: 'Lamborghini',
  model: 'Urus',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Lamborghini_Urus_19.09.20_JM_%282%29_%28cropped%29.jpg',
};

const porscheGT3RSEntry: IdentificationItem = {
  id: 'hardcoded-porsche-gt3rs',
  make: 'Porsche',
  model: '911 GT3 RS',
  imageUrl: 'https://images-porsche.imgix.net/-/media/AE9CF9F9832D44728135C55791B7B670_3948F4B822D04726BAAE3F0FDFF46DE5_CZ23V20OX0009-911-gt3-rs-front?w=999&ar=647%3A440&q=85&auto=format',
};

const HistoryModal = () => {
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<IdentificationItem[]>([]);

    useEffect(() => {
        fetchIdentificationHistory();
    }, []);

    const fetchIdentificationHistory = async () => {
        setLoading(true);
        try {
            const user = auth.currentUser;
            if (!user) {
                console.log("No user is signed in");
                // Even if user is not signed in, show the hardcoded entries
                setHistory([lamborghiniUrusEntry, porscheGT3RSEntry]);
                return;
            }

            // Query Firestore for identification history
            const identificationsRef = collection(db, "identifications");
            const q = query(
                identificationsRef, 
                where("userId", "==", user.uid),
                orderBy("timestamp", "desc")
            );

            const querySnapshot = await getDocs(q);
            // Start with both hardcoded entries
            const identifications: IdentificationItem[] = [lamborghiniUrusEntry, porscheGT3RSEntry]; 
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                identifications.push({
                    id: doc.id,
                    make: data.make || "Unknown Make",
                    model: data.model || "Unknown Model",
                    imageUrl: data.imageUrl,
                });
            });

            setHistory(identifications);
        } catch (error) {
            console.error("Error fetching identification history:", error);
            // Even on error, show the hardcoded entries
            setHistory([lamborghiniUrusEntry, porscheGT3RSEntry]);
        } finally {
            setLoading(false);
        }
    };

    const formatTimestamp = (timestamp: Date) => {
        return formatDistanceToNow(timestamp, { addSuffix: true });
    };

    const renderItem = ({ item }: { item: IdentificationItem }) => (
        <TouchableOpacity style={styles.historyItem} onPress={() => {
            // Optional: navigate to detail view of this identification
            // router.push(`(details)/${item.id}`);
        }}>
            <View style={styles.imageContainer}>
                {item.imageUrl ? (
                    <Image 
                        source={{ uri: item.imageUrl }} 
                        style={styles.image} 
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Icons.Car size={30} color={colors.neutral400} />
                    </View>
                )}
            </View>
            
            <View style={styles.contentContainer}>
                <View style={styles.carInfoContainer}>
                    <Typo size={18} fontWeight="600">
                        {item.make} {item.model}
                    </Typo>
                </View>
            </View>
        </TouchableOpacity>
    );

    const EmptyState = () => (
        <View style={styles.emptyContainer}>
            <Icons.MagnifyingGlass size={60} color={colors.neutral500} />
            <Typo size={18} fontWeight="500" style={{marginTop: spacingY._20}}>
                No identifications yet
            </Typo>
            <Typo size={14} color={colors.neutral400} style={{textAlign: 'center', marginTop: spacingY._5}}>
                Start identifying vehicles to see your history here
            </Typo>
            <TouchableOpacity 
                style={styles.identifyButton}
                onPress={() => router.push("../(tabs)")}
            >
                <Typo size={16} fontWeight="500" color={colors.neutral900}>
                    Identify a Vehicle
                </Typo>
            </TouchableOpacity>
        </View>
    );

    return (
        <ModalWrapper>
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Header
                        title='Identification History' 
                        leftIcon={<BackButton />}
                        style={styles.header}
                    />
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Typo size={16} color={colors.neutral300} style={{marginTop: spacingY._10}}>
                            Loading history...
                        </Typo>
                    </View>
                ) : history.length === 0 ? (
                    <EmptyState />
                ) : (
                    <FlatList
                        data={history}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                )}
            </SafeAreaView>
        </ModalWrapper>
    )
}

export default HistoryModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._15,
    },
    headerContainer: {
        paddingTop: verticalScale(10),
        marginBottom: spacingY._20,
        marginLeft: spacingX._10,
    },
    header: {
        marginBottom: spacingY._5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listContainer: {
        paddingBottom: spacingY._20
    },
    historyItem: {
        flexDirection: 'row',
        padding: spacingY._10,
        backgroundColor: colors.neutral800,
        borderRadius: radius._15,
        borderCurve: 'continuous',
    },
    imageContainer: {
        width: verticalScale(80),
        height: verticalScale(80),
        borderRadius: radius._10,
        overflow: 'hidden',
        marginRight: spacingX._15,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.neutral700,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    carInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingY._5,
    },
    timestampContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: spacingY._5,
    },
    separator: {
        height: spacingY._10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacingX._20,
    },
    identifyButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacingY._12,
        paddingHorizontal: spacingX._20,
        borderRadius: radius._12,
        marginTop: spacingY._25,
    }
})