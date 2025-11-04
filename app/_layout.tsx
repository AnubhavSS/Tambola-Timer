import { Stack } from "expo-router";
import "react-native-reanimated";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://20fac55634de47e6e9233b06d422649f@o4510305534803968.ingest.de.sentry.io/4510305537359952',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

/**
 * Root Layout Component
 * 
 * Defines the navigation structure for the Tambola Timer app.
 * Uses Expo Router's Stack navigation with hidden headers.
 */
export default Sentry.wrap(function RootLayout() {
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
});