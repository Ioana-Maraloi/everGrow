import {Text, Alert, View, Modal, Pressable } from "react-native"
import {Button, Avatar, TextInput} from 'react-native-paper'
import { useContext, useState } from "react"
import { AuthContext } from "../../utils/authContext" 
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import styles from '../../utils/styles'
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
// import { FIREBASE_APP } from "../../../firebaseConfig"
// import { collection, doc, getFirestore, setDoc, getDocs, query, where, onSnapshot, deleteDoc, getDoc, addDoc } from 'firebase/firestore'

// https://www.freepik.com/serie/133741891
export default function ProfileScreen() {
    // const db = getFirestore(FIREBASE_APP)
    
    const [visible, setVisible] = useState(false);
    // const containerStyle = {backgroundColor: 'white', padding: 20};

    const authState = useContext(AuthContext)
    const router = useRouter()
    // const [newUsername, setNewUsername] = useState("")

    // const changeUsername = async (username:string) => {
    //     authState.displayName = username

    // }
    return (
        <SafeAreaProvider>
            <SafeAreaView >
            <View style={styles.header}>
        <View style={styles.headerContent}>
            <Avatar.Image size={100} source={require("../../../assets/trees/logo.png")} />
            <View style={[styles.cardRow, {marginTop: 5}] }>
                            <Button onPress={() => {
                                setVisible(true)
                                // console.log("apas")
                            }}>
                    <Text style={styles.name}>{authState.displayName} </Text>
                    <MaterialCommunityIcons name="lead-pencil" size={20} color="black" />          
                </Button>
            </View>          
          <Text style={styles.userInfo}>{authState.email} </Text>
        </View>
                </View>
        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={() => {
            setVisible(!visible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Change username:</Text>
                <TextInput style={styles.input} mode="outlined" label = "new username" onChangeText={setNewUsername}></TextInput>             */}

              {/* <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setVisible(!visible)}>
                <Text style={styles.textStyle}>Confirm</Text> */}

              {/* </Pressable>
            </View>
          </View>
        </Modal>                */}

                <Button icon={"logout"} onPress={authState.logOut} ><Text>Log out</Text></Button>
                <Button onPress={() => { router.push("../screens/friends") }}>Friends</Button>
                <Button onPress={() => { router.push("../screens/shop") }}>Shop</Button>
                <Button onPress={() => { router.push("../screens/achievements") }}>Achievements</Button>
                <Button onPress={() => { router.push("../screens/stats") }}>Stats</Button>

                <Button>Theme</Button>
                <Button onPress={ function () {
                Alert.alert('Are u sure u want to delete this account?', 'This cannot be undone', [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: () => {
                        console.log('OK Pressed')
                        authState.deleteAccount()
                    }
                },])}}>
                <Text>Delete Account</Text>
                </Button>
        </SafeAreaView>
    </SafeAreaProvider>
    )
}