import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
import HomeBrand from "../components/homeBrand";
import ThemedBackground from "../components/radial";
import { How_To_Play } from "../data";
import { calculateGridLayout } from "../helper";
import { useTimerStore } from "../store";
import { ThemeId, THEMES, useTheme } from "../theme";

/**
 * Index Component
 *
 * Main landing page of the Tambola Timer app.
 * Displays the app title, logo, and navigation buttons.
 */
const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  :
   "ca-app-pub-2097672905689831/3538055833";

const LANGUAGE_LABEL: Record<string, string> = {
  "en-US": "English",
  "hi-IN": "हिंदी",
};

const Index = () => {
  const theme = useTheme();
  const themeId = useTimerStore((state) => state.themeId);
  const setTheme = useTimerStore((state) => state.setTheme);
  const seenHowTo = useTimerStore((state) => state.seenHowTo);
  const setSeenHowTo = useTimerStore((state) => state.setSeenHowTo);
  const [modalVisible, setModalVisible] = useState<boolean>(!seenHowTo);

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
  const timerInterval = useTimerStore((state) => state.timerInterval);
  const language = useTimerStore((state) => state.language);
  const games = useTimerStore((state) => state.games);
  const resetStore = useTimerStore.getState().resetStore;
    const insets = useSafeAreaInsets();

  const closeHowTo = () => {
    setModalVisible(false);
    if (!seenHowTo) setSeenHowTo();
  };

  // Calculate grid layout based on safe area insets
  useEffect(() => {
  calculateGridLayout({top:insets.top,bottom:insets.bottom});
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ThemedBackground />
      <View style={styles.container}>

        {/* Info Icon (top left corner) */}
      <TouchableOpacity
        style={[styles.infoIcon, { top: insets.top + hp(2), left: insets.left + wp(3) }]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="information-circle-outline" size={hp(3.6)} color={theme.textDim} />
      </TouchableOpacity>

        {/* Theme swatches (top right corner) */}
        <View style={[styles.themeSwitcher, { top: insets.top + hp(2), right: insets.right + wp(3) }]}>
          {(Object.keys(THEMES) as ThemeId[]).map((id) => {
            const t = THEMES[id];
            const active = themeId === id;
            return (
              <Pressable
                key={id}
                onPress={() => setTheme(id)}
                hitSlop={8}
                style={[
                  styles.themeDot,
                  {
                    backgroundColor: t.accent,
                    borderColor: active ? theme.text : "transparent",
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Brand */}
        <View>
          <Animated.View entering={BounceIn}>
            <HomeBrand theme={theme} />
          </Animated.View>

          {theme.id !== "stage" && (
            <View style={styles.chipRow}>
              <View style={[styles.chip, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
                <Text style={[styles.chipText, { color: theme.textDim }]}>
                  Voice: {LANGUAGE_LABEL[language] ?? language}
                </Text>
              </View>
              <View style={[styles.chip, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
                <Text style={[styles.chipText, { color: theme.textDim }]}>Every {timerInterval}s</Text>
              </View>
              <View style={[styles.chip, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
                <Text style={[styles.chipText, { color: theme.textDim }]}>{games.length} patterns</Text>
              </View>
            </View>
          )}
        </View>

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
                {
                  backgroundColor: theme.accent,
                  borderRadius: theme.radius.button * 1.6,
                },
                pressed && { transform: [{ translateY: -2 }] },
              ]}
            >
              <View>
                <Text
                  style={[
                    styles.text,
                    { color: theme.accentOn, fontFamily: theme.font.display },
                  ]}
                >
                  Start New Game
                </Text>
                <Text style={[styles.subline, { color: theme.accentOn, opacity: 0.75 }]}>
                  Board resets · 90 numbers shuffled
                </Text>
              </View>
            </Pressable>
          </Animated.View>

          {/* Continue Button  */}
          {previousNumber !== null && (
            <Pressable
              style={({ pressed }) => [
                styles.settingsButton,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.surfaceBorder,
                  borderRadius: theme.radius.button,
                },
                pressed && { transform: [{ translateY: -2 }] },
              ]}
              onPress={() => router.push("/gamescreen")}
            >
              <Text style={[styles.text, { color: theme.text, fontFamily: theme.font.body }]}>
                Continue
              </Text>
            </Pressable>
          )}

          {/* Settings Button  */}
          <Animated.View entering={BounceIn}>
            <Pressable
              style={({ pressed }) => [
                styles.settingsButton,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.surfaceBorder,
                  borderRadius: theme.radius.button,
                },
                pressed && { transform: [{ translateY: -2 }] },
              ]}
              onPress={() => router.push("/settingscreen")}
            >
              <Text style={[styles.text, { color: theme.text, fontFamily: theme.font.body }]}>
                Settings
              </Text>
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
        onRequestClose={closeHowTo}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.popupSurface, borderRadius: theme.radius.card }]}>
            <Text style={[styles.modalTitle, { color: theme.accent, fontFamily: theme.font.display }]}>How to Play</Text>

            <Text style={{flex:1}}>
              <FlatList

                data={How_To_Play}
                renderItem={({ item,index }) => (
                  <Text style={[styles.modalText, { color: theme.text }]}>{index+1}. {item}</Text>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </Text>

            <Pressable style={[styles.closeButton, { backgroundColor: theme.accent }]} onPress={closeHowTo}>
              <Text style={[styles.closeText, { color: theme.accentOn }]}>Got it</Text>
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
    paddingBottom: hp("9%"),
  },
 infoIcon: {
    position: "absolute",
    zIndex: 10,
  },
  themeSwitcher: {
    position: "absolute",
    zIndex: 10,
    flexDirection: "row",
    gap: wp(1.4),
  },
  themeDot: {
    width: hp(2.4),
    height: hp(2.4),
    borderRadius: hp(1.2),
    borderWidth: 2,
  },

  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: hp("2.5%"), // consistent spacing between buttons
    maxWidth: wp("55%"),
  },

  startButton: {
    width: wp("40%"),
    minHeight: hp("17%"),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("2%"),
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
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    // Elevation / Shadow
    elevation: 8, // Android shadow
    shadowColor: "#000", // iOS shadow color
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  text: {
    fontWeight: "bold", // Button text weight
    fontSize: hp("5%"), // Responsive font size
    textAlign: "center",
    textTransform: "uppercase",
  },
  subline: {
    fontSize: hp(1.6),
    textAlign: "center",
    marginTop: hp(0.5),
    textTransform: "none",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(1.5),
    marginTop: hp(2.8),
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: hp(1),
    paddingHorizontal: wp(2.2),
  },
  chipText: {
    fontSize: hp(1.6),
    fontWeight: "500",
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
    width: "82%",
    maxHeight: "78%",
    padding: wp(2.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalTitle: {
    fontSize: hp(3.6),
    fontWeight: "bold",
    marginBottom: hp(1.5),
    textAlign: "center",
  },
  modalText: {
    fontSize: hp(2),
    lineHeight: hp(2.6),
    marginBottom: hp(1.8),
  },
  closeButton: {
    borderRadius: 10,
    alignSelf: "center",
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3.5),
  },
  closeText: {
    fontWeight: "bold",
    fontSize: hp(2),
  },
});
