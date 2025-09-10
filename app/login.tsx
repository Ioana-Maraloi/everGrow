import { View, Text, TouchableOpacity, Image } from "react-native"
import React, {useContext, } from "react"
import { FIREBASE_AUTH, FIREBASE_APP } from "../firebaseConfig"
import { AuthContext } from "./utils/authContext"
import * as AppleAuthentication from 'expo-apple-authentication'
import { doc, getFirestore, setDoc, collection } from 'firebase/firestore'
import { Divider, Button, TextInput } from 'react-native-paper';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { navigate } from "expo-router/build/global-state/routing"
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"
import styles from './utils/styles'

const auth = getAuth()

const androidClientId = "187288304608-ikpu55agkm548m52u01th9j295bvfdbm.apps.googleusercontent.com"
const iosClientId = "187288304608-au0kbakbn5jc8bqkphqogflvk5erkg9p.apps.googleusercontent.com"
const webClientId = "187288304608-0t1uj6gslpbr6fpqtoh024vufu7d5nea.apps.googleusercontent.com"

export default function LoginScreen ()  {
	const authState = useContext(AuthContext)
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	
	const db = getFirestore(FIREBASE_APP)
	const usersCollectionRef = collection(db, 'users')
	const handleResetPassword = function () {
		try {
			sendPasswordResetEmail(auth, email).then(() => {
			alert('Password reset email sent!')
		})
			
		}catch(error: any){
			console.log(error.code)
			const code = error.code.split("/")[1] 
			alert(`Reset password failed: ${code}`)
		}
		
	}
	const handleLogin = async () => {
		try {
	  		await signInWithEmailAndPassword(FIREBASE_AUTH, email.toLowerCase(), password)
			console.log('Login successful!')
			// authState.email = email.toLowerCase()
			// authState.password = password
			// authState.displayName = email.split('@')[0].toLowerCase() // Use email prefix as displayName
			
			const myDoc = {
				email: email.toLowerCase(),
				username: email.toLowerCase().split('@')[0],
				uid: FIREBASE_AUTH.currentUser?.uid,
			}

			const myDocRef = doc(usersCollectionRef, email.toLowerCase().split('@')[0]) 
			await setDoc(myDocRef, myDoc)
			const myDocJSON = myDocRef.toJSON()
			if (!myDocJSON.hasOwnProperty("xp")) {
				authState.xp = 0
				const updateDoc = {
					xp: 0,
				}
				await setDoc(myDocRef, updateDoc, { merge: true })
			}
			authState.logIn(email.toLowerCase(), password)

		} catch (error: any) {
			console.log(error.code)
			const code = error.code.split("/")[1] 
			alert(`Login failed: ${code}`)
	}
	}

	return (
	<SafeAreaProvider >
		<SafeAreaView style={[styles.container, { alignItems: "center" }]}>
			<Image source={require("../assets/trees/logo.png")}
				style={{ width: 100, height: 100 }}>
			</Image>
			<Text style={styles.title}>Welcome</Text>
			<TextInput
				mode="outlined"
				label="Email"
				placeholderTextColor={styles.colors.shadowColor}
				onChangeText={(text) => setEmail(text)}
				style={styles.input}/>
			<TextInput
				mode="outlined"
				label="Password"
				placeholderTextColor={styles.colors.shadowColor}
				onChangeText={(text) => setPassword(text)}
				secureTextEntry={true}
				style={styles.input}/>
			<TouchableOpacity
					style={styles.loginButton}
					onPress={handleLogin}>
				<Text style={styles.startText}>Log in</Text>
			</TouchableOpacity>
			<TouchableOpacity
					style={styles.loginButton}
					onPress={function () { navigate("/signUp")}}>
			<Text style={styles.startText}>Don&apos;t have an account yet? Sign up</Text>
			</TouchableOpacity>
			<Button onPress ={handleResetPassword}>
				<Text style={styles.forgotPasswordText}>Reset password</Text>
			</Button>

			<View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, width: "80%"}}>
  				<Divider style={{ height: 1, backgroundColor: 'gray', marginVertical: 5,
					flex: 1 }} />
  				<Text style={{ marginHorizontal: 10, color: 'gray' }}>or</Text>
  				<Divider style={{ flex: 1, height: 1, backgroundColor: 'gray' }} />
			</View>
			
		<AppleAuthentication.AppleAuthenticationButton
			buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
			buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
			cornerRadius={5}
			style={styles.loginButtonApple}
			onPress={async () => {
		  		try {
					const credential = await AppleAuthentication.signInAsync({
			  		requestedScopes: [
						AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
						AppleAuthentication.AppleAuthenticationScope.EMAIL,
			  		],
					})
				console.log(credential)
				// authState.email = AppleAuthentication.AppleAuthenticationScope.EMAIL
				authState.logIn(email, password)
				// signed in
		  		} catch (error: any) {
					if (error.code === 'ERR_REQUEST_CANCELED') {
			  			// handle that the user canceled the sign-in flow
					} else {
			  			// handle other errors
			  			console.error('Apple Sign-In Error:', error)}
		  		}
			}}
		/>				 
		</SafeAreaView>
	</SafeAreaProvider>
	)
}
