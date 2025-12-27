import AntDesign from '@expo/vector-icons/AntDesign';
import React from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useTimerStore } from '../store';



const PreviousModal = () => {

  const showPreviousModal = useTimerStore((state) => state.showPreviousModal);
  const setShowPreviousModal = useTimerStore((state) => state.setShowPreviousModal);
  const previousArray = useTimerStore((state) => state.previousArray);
  

  return (
   <Modal
      animationType="slide"
      transparent={true}
      visible={showPreviousModal}
      onRequestClose={() => setShowPreviousModal()}
    >
      <View style={styles.overlay}>
        <View style={styles.modalView}>
          <FlatList
            data={previousArray}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.modalText}>{item}</Text>
            )}
          />
          <Pressable style={styles.buttonClose} onPress={() => setShowPreviousModal()}>
            <AntDesign name="close-circle" size={hp("6%")} color="#20BD61" />
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

export default PreviousModal

const styles = StyleSheet.create({
   overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)", // slight dim behind modal
  },
  modalView: {
    width: wp("70%"),
    height: hp("30%"),
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    position: "absolute",
    top: hp("2%"),
    right: hp("2%"),
  },
  modalText: {
    marginVertical: hp("2%"),
    marginHorizontal: hp("4%"),
    fontSize: hp("8%"),
    color: "black",
    fontWeight: "bold",
  },
})