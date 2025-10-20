import { useTimerStore } from '@/store';
import AntDesign from '@expo/vector-icons/AntDesign';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const PreviousModal = () => {

  const showPreviousModal = useTimerStore((state) => state.showPreviousModal);
  const setShowPreviousModal = useTimerStore((state) => state.setShowPreviousModal);
  const previousArray = useTimerStore((state) => state.previousArray);
  

  return (
  <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showPreviousModal}
          onRequestClose={() => {
            setShowPreviousModal();
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <FlatList
                data={previousArray}
                scrollEnabled={true}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Text style={styles.modalText}>{item}</Text>
                )}
              />
              <Pressable
               style={styles.buttonClose}
                onPress={() => setShowPreviousModal()}>
              <AntDesign name="close-circle" size={hp('6%')} color="#20BD61" />
              </Pressable>
            </View>
          </View>
        </Modal>
       
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default PreviousModal

const styles = StyleSheet.create({
    centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    width: wp('70%'),
    height: hp('30%'),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
   zIndex:1000,

  },
  buttonClose: {
   position:'absolute',
   top:hp('2%'),
   right:hp('2%'),
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginVertical: hp('2%'),
    marginHorizontal:hp('4%'),
    fontSize: hp('6%'),
    color: 'black',
    fontWeight: 'bold',
  },
})