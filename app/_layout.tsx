import { Stack } from "expo-router";
import "react-native-reanimated";



/**
 * Root Layout Component
 * 
 * Defines the navigation structure for the Tambola Timer app.
 * Uses Expo Router's Stack navigation with hidden headers.
 */
function RootLayout() {
  return (
    <>
      {/* <StatusBar style="auto" />   ✅ outside the Stack */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Main screens of the application */}
        <Stack.Screen name="index" />
        <Stack.Screen name="gamescreen" />
        <Stack.Screen name="settingscreen" />
      </Stack>
    </>
  );
}
export default RootLayout;