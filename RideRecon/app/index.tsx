import { colors } from '@/constants/theme'
import React from 'react'
import { Image, StyleSheet, View, Text } from 'react-native'
import { useRouter } from 'expo-router';
import Button from '@/components/Button';

const index = () => {
    const router = useRouter();
    
    const handleLogin = () => {
        router.push("/(auth)/login");
    };
    
    const handleGuestMode = () => {
        router.push("/(guest)");
    };
    
    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                resizeMode="contain"
                source={require("../assets/images/design/logo.png")}
            />
            
            <View style={styles.buttonContainer}>
                <Button 
                    style={styles.loginButton} 
                    onPress={handleLogin}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </Button>
                
                <Button 
                    style={styles.guestButton} 
                    onPress={handleGuestMode}
                >
                    <Text style={styles.buttonText}>Continue as Guest</Text>
                </Button>
            </View>
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.neutral900,
    },
    logo: {
        height: 250,
        aspectRatio: 1,
        marginBottom: 40,
    },
    buttonContainer: {
        width: '80%',
        gap: 16,
    },
    loginButton: {
        backgroundColor: colors.primary,
    },
    guestButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    }
})