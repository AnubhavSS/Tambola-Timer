import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Header Component
 * 
 * Displays the app header with navigation controls and title.
 * Includes a back button and settings button for navigation.
 */
const Header = () => {
    // Initialize router for navigation
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Back button */}
            <AntDesign 
                name="arrow-left" 
                size={34} 
                color="black" 
                onPress={() => router.back()}
            />
            
            {/* App title */}
            <Text style={styles.text}>Tambola Timer</Text>
            
            {/* Settings button */}
            <Ionicons 
                name="settings" 
                size={34} 
                color="black" 
                onPress={() => router.push("/settingscreen")} 
                style={{paddingRight: 10}} 
            />
        </View>
    )
}

export default Header

/**
 * Component Styles
 */
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 14
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    }
})