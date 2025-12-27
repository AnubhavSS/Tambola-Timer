import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Checkbox } from "react-native-paper";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTimerStore } from "../store";

/**
 * Games Component
 * 
 * Displays a modal with a list of available Tambola games.
 * Users can select games using checkboxes.
 */
const Games = () => {

  const router=useRouter();
  // State for modal visibility
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // Get games list from global store
  const games = useTimerStore((state) => state.games);
  // Track checked state for each game
  const [checked, setChecked] = useState(Array(games.length).fill(false));

  return (
    
      <SafeAreaView style={styles.centeredView}>
        {/* Games selection modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {/* List of games with checkboxes */}
              {games &&
                games.map((game, index) => (
                  <View style={styles.checkbox} key={index}>
                    <Text style={styles.modalText}>{game}</Text>
                    <Checkbox
                      color="green"
                      status={checked[index] ? "checked" : "unchecked"}
                      onPress={() => {
                        const newChecked = [...checked];
                        newChecked[index] = !newChecked[index];
                        setChecked(newChecked);
                      }}
                    />
                  </View>
                ))}

              {/* Close modal button */}
              <View>
              <Pressable
                style={[styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
              <Pressable>

              </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.buttonContainer}>
        
        {/* Button to open games modal */}
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.textStyle}>Games</Text>
        </Pressable>

        {/* Button to navigate to settings screen */}
        <Pressable  onPress={() => router.push("/settingscreen")}>
          <Ionicons name="settings" size={hp(8)} color="white" />
        </Pressable>

         {/* Button to show to previous modal */}
<Pressable
        //  style={styles.buttonOpen}
          onPress={() => useTimerStore.getState().setShowPreviousModal()}>
     <FontAwesome5 name="history" size={hp(7)} color="white" />
        </Pressable>
        </View>

      
      </SafeAreaView>
   
  );
};

export default Games;

/**
 * Component Styles
 */
const styles = StyleSheet.create({
  // Style definitions for modal and UI elements
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
  width: wp(70),
  height: hp(80),
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "flex-start",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  borderRadius: 20,
  padding: wp(2),
  margin: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 4,
},

checkbox: {
  width: "30%", // 3 columns (with a little margin)
  marginVertical: 4,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "rgba(255, 255, 255, 0.4)",
  borderRadius: 10,
  paddingHorizontal: 6,
  paddingVertical: 2,
},
button: {
  borderRadius: 20,
  padding: 4,
  elevation: 2,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#20BD61",
},
buttonContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: wp(4),
  marginTop: wp(4),
  
},
  buttonOpen: {
    backgroundColor: "#20BD61",
    width: wp(12),
    height: hp(10),
  },
  buttonClose: {
    backgroundColor: "#20BD61",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
textStyle: {
  color: "white",
  fontWeight: "600",
  textAlign: "center",
  fontSize: hp(5),
},
  modalText: {
    fontSize: wp(2),
    fontWeight: "bold",
    textAlign: "center",
  },
});
