import {
  Anton_400Regular,
} from "@expo-google-fonts/anton";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from "@expo-google-fonts/instrument-serif";
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import {
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

/**
 * Root Layout Component
 *
 * Defines the navigation structure for the Tambola Timer app.
 * Uses Expo Router's Stack navigation with hidden headers.
 * Holds the splash screen until every theme's fonts are ready, so switching
 * UI modes never shows a flash of fallback text.
 */
function RootLayout() {
  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    Anton_400Regular,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

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
