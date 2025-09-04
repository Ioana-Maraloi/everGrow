import {Text, Alert, View } from "react-native"
import {Button, Avatar} from 'react-native-paper'
import { useContext } from "react"
import { AuthContext } from "../../utils/authContext" 
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import styles from '../../utils/styles'
import { useRouter } from "expo-router"

// import { Button } from '@react-navigation/elements';
// https://www.freepik.com/serie/133741891
export default function ProfileScreen() {
    const authState = useContext(AuthContext)
    const router = useRouter()
    return (
        <SafeAreaProvider>
            <SafeAreaView >
                <View style={styles.header}>
        <View style={styles.headerContent}>
            <Avatar.Image size={100} source={require("../../../assets/trees/logo.png")} />

          <Text style={styles.name}>{authState.displayName} </Text>
          <Text style={styles.userInfo}>{authState.email} </Text>
        </View>
      </View>

                <Button icon={"logout"} onPress={authState.logOut} ><Text>Log out</Text></Button>
                <Button onPress={() => { router.push("../friends") }}>Friends</Button>
                <Button onPress={() => { router.push("../shop") }}>Shop</Button>
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
                },
            ])}}> <Text>Delete Account</Text></Button>
        </SafeAreaView>
    </SafeAreaProvider>
    )
}