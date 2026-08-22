import AntDesign from "@expo/vector-icons/AntDesign";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import { TextInput } from "react-native-paper";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import ThemedBackground from "../components/radial";
import { DataItem, data } from "../data";
import { useTimerStore } from "../store";
import { THEMES, ThemeId, useTheme } from "../theme";

const Settingscreen = () => {
  const router = useRouter();
  const theme = useTheme();
  const [timerInterval, setTimerInterval] = useState<number>(
    useTimerStore((state) => state.timerInterval),
  );
  const [soundVolume, setSoundVolume] = useState<number>(5);
  const [checked, setChecked] = useState<string>(
    useTimerStore((state) => state.language),
  );
  const [selected, setSelected] = useState<string[]>(
    useTimerStore((state) => state.games),
  );
  const [text, setText] = useState<string>("");

  const rate = useTimerStore((state) => state.rate);

  const [newData, setnewData] = useState<DataItem[]>(data);
  const themeId = useTimerStore((state) => state.themeId);
  const setTheme = useTimerStore((state) => state.setTheme);

  function handleSubmit() {
    if (text.trim() === "") return;

    const newGame = { label: text.trim(), value: text.trim() };

    // Add to data only if not already present
    if (!newData.find((item) => item.value === newGame.value)) {
      setnewData((prev) => [...prev, newGame]);
    }

    // Update selected
    const updatedSelected = [...selected, newGame.value];
    setSelected(updatedSelected);

    // Update store
    useTimerStore.getState().setGames(updatedSelected);

    setText("");
  }

  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.surface,
      borderColor: theme.surfaceBorder,
      borderRadius: theme.radius.card,
    },
  ];

  return (
    <View style={styles.safeArea}>
      <ThemedBackground />

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={12}
        >
          <AntDesign name="arrow-left" size={hp(3.2)} color={theme.text} />
        </Pressable>
        <View style={styles.headerTitleBlock}>
          <Text
            style={[
              styles.title,
              { color: theme.text, fontFamily: theme.font.display },
            ]}
          >
            Settings
          </Text>
          <Text
            style={[
              styles.savedNote,
              { color: theme.textDim, fontFamily: theme.font.body },
            ]}
          >
            Saved automatically
          </Text>
        </View>
        <View style={{ width: hp(3.2) }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        {/* Play settings */}
        <View style={cardStyle}>
          <Text
            style={[
              styles.cardTitle,
              { color: theme.text, fontFamily: theme.font.display },
            ]}
          >
            Play settings
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLabelRow}>
              <Text
                style={[
                  styles.settingLabel,
                  { color: theme.textDim, fontFamily: theme.font.body },
                ]}
              >
                Call interval
              </Text>
              <Text style={[styles.settingValue, { color: theme.text }]}>
                {Math.round(timerInterval)}s
              </Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={3}
              maximumValue={15}
              minimumTrackTintColor={theme.accent}
              maximumTrackTintColor={theme.surfaceBorder}
              thumbTintColor={theme.accent}
              value={timerInterval}
              onValueChange={(value) => {
                setTimerInterval(value);
                useTimerStore.setState({ timerInterval: Math.round(value) });
              }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLabelRow}>
              <Text
                style={[
                  styles.settingLabel,
                  { color: theme.textDim, fontFamily: theme.font.body },
                ]}
              >
                Voice speed
              </Text>
              <Text style={[styles.settingValue, { color: theme.text }]}>
                {rate}
              </Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2}
              minimumTrackTintColor={theme.accent}
              maximumTrackTintColor={theme.surfaceBorder}
              thumbTintColor={theme.accent}
              value={rate}
              onValueChange={(value) => {
                useTimerStore.setState({ rate: Math.round(value * 10) / 10 });
              }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLabelRow}>
              <Text
                style={[
                  styles.settingLabel,
                  { color: theme.textDim, fontFamily: theme.font.body },
                ]}
              >
                Volume
              </Text>
              <Text style={[styles.settingValue, { color: theme.text }]}>
                {Math.round(soundVolume)}
              </Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10}
              minimumTrackTintColor={theme.accent}
              maximumTrackTintColor={theme.surfaceBorder}
              thumbTintColor={theme.accent}
              value={soundVolume}
              onValueChange={(value) => {
                setSoundVolume(value);
                useTimerStore.setState({ soundVolume: Math.round(value) / 10 });
              }}
            />
          </View>

          <View style={styles.settingRow}>
            <Text
              style={[
                styles.settingLabel,
                {
                  color: theme.textDim,
                  fontFamily: theme.font.body,
                  marginBottom: hp(1),
                },
              ]}
            >
              Announce in
            </Text>
            <View
              style={[
                styles.segmented,
                {
                  backgroundColor:
                    theme.bg.type === "solid"
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.15)",
                  borderColor: theme.surfaceBorder,
                },
              ]}
            >
              {[
                { code: "en-US", label: "English" },
                { code: "hi-IN", label: "हिंदी" },
              ].map((lang) => {
                const active = checked === lang.code;
                return (
                  <Pressable
                    key={lang.code}
                    style={[
                      styles.segment,
                      {
                        backgroundColor: active ? theme.accent : "transparent",
                      },
                    ]}
                    onPress={() => {
                      setChecked(lang.code);
                      useTimerStore.setState({ language: lang.code });
                    }}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        {
                          color: active ? theme.accentOn : theme.text,
                          fontFamily: theme.font.body,
                        },
                      ]}
                    >
                      {lang.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* Patterns in play */}
        <View style={cardStyle}>
          <View style={styles.cardTitleRow}>
            <Text
              style={[
                styles.cardTitle,
                { color: theme.text, fontFamily: theme.font.display },
              ]}
            >
              Patterns in play
            </Text>
            <Text style={[styles.countBadge, { color: theme.textDim }]}>
              {selected.length} selected
            </Text>
          </View>

          <MultiSelect
            style={[
              styles.dropdown,
              { borderBottomColor: theme.surfaceBorder },
            ]}
            placeholderStyle={[
              styles.placeholderStyle,
              { color: theme.textDim },
            ]}
            selectedTextStyle={[
              styles.selectedTextStyle,
              { color: theme.text },
            ]}
            inputSearchStyle={[
              styles.inputSearchStyle,
              { backgroundColor: theme.popupSurface, color: theme.text },
            ]}
            iconStyle={styles.iconStyle}
            containerStyle={{
              backgroundColor: theme.popupSurface,
              borderColor: theme.surfaceBorder,
              borderWidth: 1,
              height: hp(75),
            }}
            itemTextStyle={{
              fontWeight: "bold",
              fontSize: hp(2.2),
              color: theme.text,
            }}
            activeColor={theme.accentTint}
            search
            data={newData}
            labelField="label"
            valueField="value"
            placeholder="Select item"
            searchPlaceholder="Search..."
            value={selected}
            onChange={(item) => {
              setSelected(item);
              useTimerStore.getState().setGames(item);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color={theme.textDim}
                name="safety"
                size={16}
              />
            )}
            selectedStyle={[
              styles.selectedStyle,
              { backgroundColor: theme.accentTint, borderColor: theme.accent },
            ]}
          />

          <View style={styles.addRow}>
            <TextInput
              textColor={theme.text}
              value={text}
              onChangeText={(text) => setText(text)}
              placeholder="Add your own pattern…"
              placeholderTextColor={theme.textDim}
              underlineColor={theme.surfaceBorder}
              style={styles.textInput}
              activeUnderlineColor={theme.accent}
              onSubmitEditing={() => handleSubmit()}
            />
            <Pressable
              style={[styles.addButton, { backgroundColor: theme.accent }]}
              onPress={() => handleSubmit()}
            >
              <Text style={[styles.addButtonText, { color: theme.accentOn }]}>
                Add
              </Text>
            </Pressable>
          </View>
        </View>

        {/* UI mode */}
        <View style={cardStyle}>
          <Text
            style={[
              styles.cardTitle,
              { color: theme.text, fontFamily: theme.font.display },
            ]}
          >
            UI mode
          </Text>
          <View style={styles.themeRow}>
            {(Object.keys(THEMES) as ThemeId[]).map((id) => {
              const t = THEMES[id];
              const isSelected = themeId === id;
              return (
                <Pressable
                  key={id}
                  onPress={() => setTheme(id)}
                  style={[
                    styles.themeTile,
                    {
                      backgroundColor: t.bg.stops[0],
                      borderColor: isSelected ? theme.accent : "transparent",
                    },
                  ]}
                >
                  <View
                    style={[styles.themeSwatch, { backgroundColor: t.accent }]}
                  />
                  <Text style={[styles.themeTileLabel, { color: t.text }]}>
                    {t.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settingscreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: hp(2),
    paddingHorizontal: wp(4),
  },
  backButton: {
    padding: hp(0.5),
  },
  headerTitleBlock: {
    alignItems: "center",
  },
  title: {
    fontSize: hp(4.5),
    fontWeight: "bold",
  },
  savedNote: {
    fontSize: hp(1.6),
    marginTop: hp(0.3),
  },
  scrollView: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap", // wraps to the next line
    justifyContent: "space-evenly", // spacing between items
    padding: 10,
    paddingBottom: hp(4),
    marginLeft: wp(4),
  },
  card: {
    marginHorizontal: "auto",
    width: "40%",
    padding: wp(1.5),
    marginVertical: wp(2),
    borderWidth: 1.5,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: hp(1.5),
    paddingTop: hp(1.5),
  },
  cardTitle: {
    fontSize: hp(3.2),
    fontWeight: "bold",
    padding: hp(1.5),
  },
  countBadge: {
    fontSize: hp(3.5),
    fontWeight: "600",
  },
  settingRow: {
    paddingHorizontal: hp(1.5),
    marginBottom: hp(1.5),
  },
  settingLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: hp(3.5),
    fontWeight: "600",
  },
  settingValue: {
    fontSize: hp(4.4),
    fontWeight: "bold",
  },
  slider: {
    width: "100%",
    height: hp(5),
  },
  segmented: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    alignSelf: "flex-start",
  },
  segment: {
    borderRadius: 10,
    paddingVertical: hp(2.5),
    paddingHorizontal: wp(3.5),
  },
  segmentText: {
    fontSize: hp(2.8),
    fontWeight: "800",
  },
  dropdown: {
    height: hp(9),
    backgroundColor: "transparent",
    borderBottomWidth: 0.5,
    width: wp(33),
    alignSelf: "center",
    marginBottom: wp(2),
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    width: wp(33),
    alignSelf: "center",
    gap: wp(1),
  },
  textInput: {
    backgroundColor: "transparent",
    marginBottom: hp(2),
    flex: 1,
    fontSize: hp(3.5),
  },
  addButton: {
    borderRadius: 10,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(2.5),
    marginBottom: hp(2),
  },
  addButtonText: {
    fontWeight: "700",
    fontSize: hp(3.5),
  },
  placeholderStyle: {
    fontSize: 15,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  selectedStyle: {
    borderRadius: 12,
    marginHorizontal: wp(2),
    borderWidth: 1,
  },
  themeRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    paddingHorizontal: wp(2),
    paddingBottom: wp(2),
    gap: wp(2),
  },
  themeTile: {
    width: wp(10),
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    paddingVertical: hp(2),
    paddingHorizontal: wp(1),
  },
  themeSwatch: {
    width: wp(4),
    height: wp(4),
    borderRadius: wp(2),
    marginBottom: hp(1),
  },
  themeTileLabel: {
    fontSize: hp(2.6),
    fontWeight: "600",
    textAlign: "center",
  },
});
