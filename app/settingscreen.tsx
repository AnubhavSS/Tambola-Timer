import AntDesign from "@expo/vector-icons/AntDesign";
import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { MultiSelect } from 'react-native-element-dropdown';
import { RadioButton, TextInput } from "react-native-paper";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import RadialBackground from "../components/radial";
import { data, DataItem } from "../data";
import { useTimerStore } from "../store";



const Settingscreen = () => {
  const [timerInterval, setTimerInterval] = useState<number>(
    useTimerStore((state) => state.timerInterval)
  );
  const [soundVolume, setSoundVolume] = useState<number>(5);
  const [rate, setRate] = useState<number>(5);
  const [checked, setChecked] = useState<string>(
    useTimerStore((state) => state.language)
  );
const [selected, setSelected] = useState<string[]>([]);
 const [text, setText] = useState<string>("");

 const [newData, setnewData] = useState<DataItem[]>(data)

 function handleSubmit(){
  if (text.trim() === "") return;

    const newGame = { label: text.trim(), value: text.trim() };

    // Add to data only if not already present
    if (!newData.find(item => item.value === newGame.value)) {
      setnewData(prev => [...prev, newGame]);
    }

    // Update selected
    const updatedSelected = [...selected, newGame.value];
    setSelected(updatedSelected);

    // Update store
    useTimerStore.getState().setGames(updatedSelected);

    setText("");
 }

  return (
    <View style={styles.safeArea}>
      <RadialBackground/>
      <Text style={styles.title}>Settings</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>

     {/*Games*/}
      <View  style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>Games</Text>
                </View>
                  <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          containerStyle={{backgroundColor:"rgba(255,255,255,0.7)",height:hp(75)}}
          itemTextStyle={{fontWeight:"bold",fontSize:hp(3)}}
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
              color="white"
              name="safety"
              size={20}
            />
          )}
          selectedStyle={styles.selectedStyle}
        />
    <TextInput
      textColor="white"
      value={text}
      onChangeText={text => setText(text)}
      placeholder="Enter game"
      placeholderTextColor="white"
      underlineColor="white"
      style={styles.textInput}
      activeUnderlineColor="white" 
      onSubmitEditing={() => handleSubmit()}
  
    />

   
      </View>

      {/* Timer Interval */}
      <View  style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>Timer Interval</Text>
          <Text style={styles.numberText}>
            {Math.round(timerInterval)} <Text style={{fontSize:hp(3)}}>seconds</Text>
          </Text>
        </View>

          <Slider
            style={styles.slider}
            minimumValue={3}
            maximumValue={15}
            minimumTrackTintColor="white"
            maximumTrackTintColor="#000000"
            thumbTintColor="white"
            value={timerInterval}
            onValueChange={(value) => {
              setTimerInterval(value);
              useTimerStore.setState({ timerInterval: Math.round(value) });
            }}
          />
      </View>

      {/*Sound Volume*/}
      <View  style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>Sound Volume</Text>
          <Text style={styles.numberText}>{Math.round(soundVolume)} </Text>
        </View>
        
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            minimumTrackTintColor="white"
            maximumTrackTintColor="#000000"
            thumbTintColor="white"
            value={soundVolume}
            onValueChange={(value) => {
              setSoundVolume(value);
              useTimerStore.setState({ soundVolume: Math.round(value) / 10 });
            }}
          />
       
      </View>

      {/*Language*/}
      <View style={styles.card}>
        <Text style={[styles.cardTitle, styles.cardTitleRow]}>Language</Text>
        <View style={styles.radioContainer}>
          {/*English*/}
          <View style={styles.radioButton}>
            <RadioButton
              value="en-US"
              status={checked === "en-US" ? "checked" : "unchecked"}
              onPress={() => {
                setChecked("en-US");
                useTimerStore.setState({ language: "en-US" });
              }}
              color="white"
            />
            <Text style={styles.radioText}>English</Text>
          </View>

          {/*Hindi*/}
          <View style={styles.radioButton}>
            <RadioButton
              value="hi-IN"
              status={checked === "hi-IN" ? "checked" : "unchecked"}
              onPress={() => {
                setChecked("hi-IN");
                useTimerStore.setState({ language: "hi-IN" });
              }}
              color="white"
            />
            <Text style={styles.radioText}>हिंदी</Text>
          </View>
        </View>
      </View>

      {/*Rate*/}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>Rate</Text>
          <Text style={styles.numberText}>{Math.round(rate)} </Text>
        </View>
      
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            minimumTrackTintColor="white"
            maximumTrackTintColor="#000000"
            thumbTintColor="white"
            value={rate}
            onValueChange={(value) => {
              setRate(value);
              useTimerStore.setState({ rate: Math.round(value) / 10 });
            }}
          />
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
  title: {
    fontSize: hp(7),
    fontWeight: "bold",
    color: "rgba(255,255,255,0.8)",
   alignSelf: "center",
   paddingTop: hp(2),
  },
  scrollView: {
    display: "flex",
      flexDirection: "row",
    flexWrap: "wrap", // wraps to the next line
    justifyContent: "space-evenly", // spacing between items
    padding: 10,
    marginLeft: wp(4),
    
   
  },
  card: {
    marginHorizontal: "auto",
    width: "40%",
    borderRadius: 40,
    padding: 5,
    marginVertical: wp(2),
    backgroundColor: "rgba(255, 255, 255, 0.09)", // translucent layer
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between", // or "space-between" or whatever you want
    alignItems: "center",
    padding: hp(2),
  },
  cardTitle: {
    fontSize: hp(6),
    fontWeight: "bold",
    color: "rgba(255,255,255,0.8)",
  },
  numberText: {
    fontSize: hp(5.7),
    fontWeight: "bold",
    color: "#ffffff", // needs '#' prefix
  },
  slider: {
    width: wp(35),
    height: wp(10),
    alignSelf: "center",
  },
  radioContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  radioButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: wp(3),
  },
  radioText: {
    fontSize: hp(5),
    fontWeight: "bold",
    color: "white",
    fontStyle: "italic",
    paddingRight: wp(3),
  },
    dropdown: {
      height: hp(9),
      backgroundColor: 'transparent',
      borderBottomColor: 'gray',
      borderBottomWidth: 0.5,
      width: wp(33),
      alignSelf:"center",
      marginBottom: wp(2),
      
    },
    textInput:{
      backgroundColor:"transparent",
      marginBottom:hp(2),
      width:wp(33),
      marginHorizontal:"auto",
      fontSize:hp(4)
    },
    placeholderStyle: {
      fontSize: 15,
      color: "white",
    },
    selectedTextStyle: {
      fontSize: 14,
      color: "white",
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
    },
});
