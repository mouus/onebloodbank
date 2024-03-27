import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { client } from '../../utils/KindeConfig';
import services from '../../utils/services';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const LoginScreen = () => {
    const router = useRouter();

    const handleSignIn = async () => {
        const token = await client.register();

        if (token) {
            await services.storeData('login', 'true');

            // Check if the user has already registered
            const hasRegistered = await AsyncStorage.getItem('hasRegistered');
            // if (!hasRegistered) {
            //     // await AsyncStorage.setItem('hasRegistered', 'true');
            //     router.replace('/register');
            // } else {
            //     router.replace('/'); // Redirect to home page after registration
            // }
            router.replace('/register')
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/oneblood.jpg')} style={styles.logo} />
            <TouchableOpacity onPress={handleSignIn} style={styles.button}>
                <Text style={styles.buttonText}>Login / Signup</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 50,
    },
    button: {
        backgroundColor: '#db0202',
        borderRadius: 50,
        paddingVertical: 15,
        paddingHorizontal: 50,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
