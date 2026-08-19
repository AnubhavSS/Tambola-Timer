import AntDesign from "@expo/vector-icons/AntDesign";
import * as Speech from "expo-speech";
import React from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useTimerStore } from "../store";
import { Theme } from "../theme";

/**
 * PreviousModal
 *
 * "Called so far" bottom sheet: lists every number called this game
 * (newest first, newest tile filled with the accent color), with quick
 * actions to repeat the last call or dismiss back to the board.
 */
const PreviousModal = ({ theme }: { theme: Theme }) => {
  const showPreviousModal = useTimerStore((state) => state.showPreviousModal);
  const setShowPreviousModal = useTimerStore(
    (state) => state.setShowPreviousModal,
  );
  const previousArray = useTimerStore((state) => state.previousArray);
  const currentNumber = useTimerStore((state) => state.currentNumber);
  const language = useTimerStore((state) => state.language);
  const rate = useTimerStore((state) => state.rate);
  const soundVolume = useTimerStore((state) => state.soundVolume);

  const repeatLastCall = () => {
    if (!currentNumber) return;
    Speech.speak(currentNumber.toString(), { language, rate, volume: soundVolume });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showPreviousModal}
      onRequestClose={() => setShowPreviousModal()}
    >
      <Pressable style={styles.scrim} onPress={() => setShowPreviousModal()}>
        <Pressable
          style={[styles.sheet, { backgroundColor: theme.popupSurface, borderColor: theme.surfaceBorder }]}
          onPress={() => {}}
        >
          <View style={[styles.grabHandle, { backgroundColor: theme.surfaceBorder }]} />

          <Text style={[styles.title, { color: theme.text, fontFamily: theme.font.display }]}>Called so far</Text>
          <Text style={[styles.subtitle, { color: theme.textDim, fontFamily: theme.font.body }]}>
            newest first · {previousArray.length} numbers
          </Text>

          <FlatList
            data={previousArray}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tileRow}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => {
              const newest = index === 0;
              return (
                <View
                  style={[
                    styles.tile,
                    {
                      backgroundColor: newest ? theme.accent : theme.cell.idleBg,
                      borderColor: theme.surfaceBorder,
                    },
                  ]}
                >
                  <Text style={[styles.tileText, { color: newest ? theme.accentOn : theme.text }]}>{item}</Text>
                </View>
              );
            }}
          />

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.secondaryButton, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}
              onPress={repeatLastCall}
            >
              <AntDesign name="sound" size={hp(2.4)} color={theme.text} />
              <Text style={[styles.secondaryButtonText, { color: theme.text, fontFamily: theme.font.body }]}>
                Repeat last call
              </Text>
            </Pressable>
            <Pressable
              style={[styles.primaryButton, { backgroundColor: theme.accent }]}
              onPress={() => setShowPreviousModal()}
            >
              <Text style={[styles.primaryButtonText, { color: theme.accentOn, fontFamily: theme.font.body }]}>
                Back to board
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default PreviousModal;

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(4,7,16,0.6)",
  },
  sheet: {
    width: "100%",
    maxHeight: hp("70%"),
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    paddingHorizontal: wp("4%"),
    paddingTop: hp("1.5%"),
    paddingBottom: hp("3%"),
    alignItems: "center",
  },
  grabHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    marginBottom: hp("2%"),
  },
  title: {
    fontSize: hp("3%"),
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: hp("1.6%"),
    marginTop: hp("0.5%"),
    marginBottom: hp("2%"),
  },
  tileRow: {
    gap: wp("2%"),
    paddingVertical: hp("1%"),
  },
  tile: {
    width: hp("7%"),
    height: hp("7%"),
    borderRadius: hp("1%"),
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tileText: {
    fontSize: hp("2.4%"),
    fontWeight: "700",
  },
  buttonRow: {
    flexDirection: "row",
    gap: wp("3%"),
    marginTop: hp("2.5%"),
    width: "100%",
    justifyContent: "center",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1.5%"),
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("3%"),
  },
  secondaryButtonText: {
    fontSize: hp("1.8%"),
    fontWeight: "600",
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("4%"),
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: hp("1.8%"),
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
