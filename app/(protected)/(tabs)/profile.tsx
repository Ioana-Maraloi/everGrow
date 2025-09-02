import {Text, Alert } from "react-native"
import {Button} from 'react-native-paper'
import { useContext } from "react"
import { AuthContext } from "../../utils/authContext" 
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import styles from '../../utils/styles'

export default function ProfileScreen() {
    const authState = useContext(AuthContext)
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
            <Button icon={"logout"} onPress={authState.logOut} ><Text>Log out</Text></Button>
            {/* <Text> Hello from profile screen</Text> */}
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