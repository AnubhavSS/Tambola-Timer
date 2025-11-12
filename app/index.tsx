import RadialBackground from "@/components/radial";
import { calculateGridLayout } from "@/helper";
import { useTimerStore } from "@/store";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import mobileAds, {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";
import Animated, { BounceIn } from "react-native-reanimated";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Index Component
 *
 * Main landing page of the Tambola Timer app.
 * Displays the app title, logo, and navigation buttons.
 */
const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : "ca-app-pub-2097672905689831/6487545007";

const Index = () => {

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    mobileAds().initialize();
  }, []);

  const bannerRef = useRef<BannerAd>(null);

  // (iOS) WKWebView can terminate if app is in a "suspended state", resulting in an empty banner when app returns to foreground.
  // Therefore it's advised to "manually" request a new ad when the app is foregrounded (https://groups.google.com/g/google-admob-ads-sdk/c/rwBpqOUr8m8).
  useForeground(() => {
    Platform.OS === "ios" && bannerRef.current?.load();
  });

  // Initialize router for navigation between screens
  const router = useRouter();
  const previousNumber = useTimerStore((state) => state.previousNumber);
  const resetStore = useTimerStore.getState().resetStore;
    const insets = useSafeAreaInsets();


  // Calculate grid layout based on safe area insets
  useEffect(() => {
  calculateGridLayout({top:insets.top,bottom:insets.bottom});
  }, []);

  return (
    <View style={{ flex: 1, paddingBottom: 20 }}>
      <RadialBackground />
      <View style={styles.container}>

        {/* Info Icon (top right corner) */}
      <TouchableOpacity style={styles.infoIcon} onPress={() => setModalVisible(true)}>
        <Ionicons name="information-circle-outline" size={32} color="#ffffffcc" />
      </TouchableOpacity>
      
        {/* App Logo */}
        <Animated.View entering={BounceIn}>
          <Image
            source={require("../assets/images/logoo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Main Navigation Card*/}
        <View style={styles.card}>
          {/* Start Game Button */}
          <Animated.View entering={BounceIn}>
            <Pressable
              onPress={() => {
                resetStore();
                router.push("/gamescreen");
              }}
              style={({ pressed }) => [
                styles.startButton,
                pressed && styles.pressed,
              ]}
            >
              {({ pressed }) => (
                <Text style={[styles.text, pressed && { color: "#20BD61" }]}>
                  Start New Game
                </Text>
              )}
            </Pressable>
          </Animated.View>

          {/* Continue Button  */}
          {previousNumber !== null && (
            <Pressable
              style={({ pressed }) => [
                styles.settingsButton,
                pressed && styles.pressed,
              ]}
              onPress={() => router.push("/gamescreen")}
            >
              {({ pressed }) => (
                <Text style={[styles.text, pressed && { color: "#20BD61" }]}>
                  Continue
                </Text>
              )}
            </Pressable>
          )}

          {/* Settings Button  */}
          <Animated.View entering={BounceIn}>
            <Pressable
              style={({ pressed }) => [
                styles.settingsButton,
                pressed && styles.pressed,
              ]}
              onPress={() => router.push("/settingscreen")}
            >
              {({ pressed }) => (
                <Text style={[styles.text, pressed && { color: "#20BD61" }]}>
                  Settings
                </Text>
              )}
            </Pressable>
          </Animated.View>
        </View>
      </View>

      <View style={styles.bannerStyle}>
        <BannerAd
          ref={bannerRef}
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </View>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>How to Play</Text>

            <Text style={styles.modalText}>
              1. Tap <Text style={styles.highlight}>“Start New Game”</Text> to begin the timer.{"\n\n"}
              2. Numbers will be called automatically at your chosen interval.{"\n\n"}
              3. You can adjust the Call Interval, Rate, Volume, Language in{" "}
              <Text style={styles.highlight}>Settings</Text>.{"\n\n"}
              4. You can also add game names in <Text style={styles.highlight}>Settings</Text>.{"\n\n"}
                5. Pause the timer at any time by tapping the Number.{"\n\n"}
                  6. Can also view the called numbers in the history.{"\n\n"}
                  7. Previous number is displayed in red color.{"\n\n"}
            </Text>

            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Got it</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default Index;

/**
 * Component Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("6%"),
  },
 infoIcon: {
    position: "absolute",
    top: 45,
    right: 25,
    zIndex: 10,
  },
  logo: {
    width: wp("35%"),
    aspectRatio: 0.7, // maintains original shape automatically
    resizeMode: "contain", // ensures full image visibility
  },

  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: hp("3%"), // consistent spacing between buttons
    maxWidth: wp("55%"),
  },

  startButton: {
    width: wp("40%"),
    height: hp("17%"),
    backgroundColor: "#20BD61",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    // Elevation / Shadow
    elevation: 8, // Android shadow
    shadowColor: "#000", // iOS shadow color
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  settingsButton: {
    width: wp("25%"),
    height: hp("15%"),
    backgroundColor: "rgba(32,189,97,0.2)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    // Elevation / Shadow
    elevation: 8, // Android shadow
    shadowColor: "#000", // iOS shadow color
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  text: {
    fontWeight: "bold", // Button text weight
    fontSize: hp("7%"), // Responsive font size
    color: "#ffffff", // Light gray text color
    textTransform: "uppercase",
  },
  pressed: {
    backgroundColor: "#ffffff", // Background color when button is pressed
    color: "#20BD61",
    fontWeight: "bold",
  },
  bannerStyle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center", // this centers the child horizontally
  },
    modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007a63",
    marginBottom: 15,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#003b2e",
    marginBottom: 20,
  },
  highlight: {
    fontWeight: "600",
    color: "#20BD61",
  },
  closeButton: {
    backgroundColor: "#20BD61",
    borderRadius: 10,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
