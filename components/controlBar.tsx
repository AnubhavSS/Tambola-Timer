import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { showInterstitialAd } from "@/helper";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useTimerStore } from "../store";
import { Theme } from "../theme";

/**
 * ControlBar
 *
 * Primary Pause/Resume action plus Reset/Settings/History icon buttons for
 * the game screen, replacing the old hidden-tap-only interaction and the
 * icon row that used to live in components/games.tsx.
 */
export default function ControlBar({ theme }: { theme: Theme }) {
  const router = useRouter();
  const play_pause = useTimerStore((state) => state.play_pause);
  const togglePlayPause = useTimerStore((state) => state.togglePlayPause);
  const resetStore = useTimerStore((state) => state.resetStore);
  const setShowPreviousModal = useTimerStore((state) => state.setShowPreviousModal);

  const handleReset = () => {
    Alert.alert(
      "Reset board?",
      "This clears the current call history and reshuffles all 90 numbers.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: () => resetStore() },
      ],
    );
  };

  const handleHistory = () => {
    showInterstitialAd();
    setShowPreviousModal();
  };

  return (
    <View style={styles.row}>
      <Pressable
        onPress={togglePlayPause}
        style={({ pressed }) => [
          styles.primary,
          {
            backgroundColor: theme.accent,
            borderRadius: theme.radius.button,
          },
          pressed && { opacity: 0.9 },
        ]}
      >
        <Ionicons name={play_pause ? "pause" : "play"} size={hp(3.2)} color={theme.accentOn} />
        <Text style={[styles.primaryText, { color: theme.accentOn, fontFamily: theme.font.body }]}>
          {play_pause ? "Pause" : "Resume"}
        </Text>
      </Pressable>

      <Pressable
        onPress={handleReset}
        style={({ pressed }) => [
          styles.square,
          { backgroundColor: theme.surface, borderColor: theme.surfaceBorder, borderRadius: theme.radius.button },
          pressed && { opacity: 0.85 },
        ]}
      >
        <Ionicons name="refresh" size={hp(3)} color={theme.text} />
      </Pressable>

      <Pressable
        onPress={() => router.push("/settingscreen")}
        style={({ pressed }) => [
          styles.square,
          { backgroundColor: theme.surface, borderColor: theme.surfaceBorder, borderRadius: theme.radius.button },
          pressed && { opacity: 0.85 },
        ]}
      >
        <Ionicons name="settings" size={hp(3)} color={theme.text} />
      </Pressable>

      <Pressable
        onPress={handleHistory}
        style={({ pressed }) => [
          styles.square,
          { backgroundColor: theme.surface, borderColor: theme.surfaceBorder, borderRadius: theme.radius.button },
          pressed && { opacity: 0.85 },
        ]}
      >
        <Ionicons name="time" size={hp(3)} color={theme.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: wp(1.8),
    width: "100%",
  },
  primary: {
    flex: 1,
    minHeight: hp(6.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(1.5),
  },
  primaryText: {
    fontSize: hp(2),
    fontWeight: "700",
    textTransform: "uppercase",
  },
  square: {
    width: hp(6.5),
    height: hp(6.5),
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
