import { View, Text, TouchableOpacity, Image } from "react-native"
import React, { useContext, } from "react"
import { FIREBASE_AUTH, FIREBASE_APP } from "../firebaseConfig"
import { AuthContext } from "./utils/authContext"
import * as AppleAuthentication from 'expo-apple-authentication'
import { doc, getFirestore, setDoc, collection, getDoc } from 'firebase/firestore'
import { Divider, Button, TextInput } from 'react-native-paper';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { navigate } from "expo-router/build/global-state/routing"
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithCredential } from "firebase/auth"
import styles from './utils/styles'
import { Colors } from './utils/colors'
import images from "./utils/images"
const auth = getAuth()

const androidClientId = "187288304608-ikpu55agkm548m52u01th9j295bvfdbm.apps.googleusercontent.com"
const iosClientId = "187288304608-au0kbakbn5jc8bqkphqogflvk5erkg9p.apps.googleusercontent.com"
const webClientId = "187288304608-0t1uj6gslpbr6fpqtoh024vufu7d5nea.apps.googleusercontent.com"

export default function LoginScreen() {
	const authState = useContext(AuthContext)
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')

	const db = getFirestore(FIREBASE_APP)

	const { theme } = useContext(AuthContext);
	const currentTheme = (theme === "default" ? "light" : theme) as "light" | "dark";


	const handleResetPassword = function () {
		try {
			sendPasswordResetEmail(auth, email).then(() => {
				alert('Password reset email sent!')
			})

		} catch (error: any) {
			console.log(error)
		}

	}
	const handleLogin = async () => {
		try {
			await signInWithEmailAndPassword(FIREBASE_AUTH, email.toLowerCase(), password)
			// const myDoc = {
			// 	email: email.toLowerCase(),
			// 	username: email.toLowerCase().split('@')[0],
			// 	uid: FIREBASE_AUTH.currentUser?.uid,
			// }

			// const myDocRef = doc(usersCollectionRef, email.toLowerCase().split('@')[0]) 
			// await setDoc(myDocRef, myDoc)
			// const myDocJSON = myDocRef.toJSON()
			// if (!myDocJSON.hasOwnProperty("xp")) {
			// 	authState.xp = 0
			// 	const updateDoc = {
			// 		xp: 0,
			// 	}
			// 	await setDoc(myDocRef, updateDoc, { merge: true })
			// }
			const userRef = doc(db, "users", email.toLocaleLowerCase().split('@')[0])
			const userSnap = await getDoc(userRef)
			if (!userSnap.exists()) {
				console.log("error at getting the user doc.")
				return;
			}
			const xp = userSnap.data().xp

			authState.logIn(email.toLowerCase(), password, xp)

		} catch (error: any) {
			console.log(error)
		}
	}

	return (
		<SafeAreaProvider>
			<SafeAreaView style={[styles.container, {
				alignItems: "center",
				backgroundColor: Colors[currentTheme].backgroundColor,
			}]}>
				<Image source={images.icon}
					style={{ width: 100, height: 100 }}>
				</Image>
				<Text style={[styles.title,
				{ color: Colors[currentTheme].title }]}>Welcome</Text>
				<TextInput
					mode="flat"
					label="Email"
					placeholderTextColor={Colors[currentTheme].shadowColor}
					onChangeText={(text) => setEmail(text)}
					style={[styles.input, {backgroundColor: Colors[currentTheme].inputBackgroundColor}]} />
				<TextInput
					mode="flat"
					label="Password"
					placeholderTextColor={Colors[currentTheme].shadowColor}
					onChangeText={(text) => setPassword(text)}
					secureTextEntry={true}
					style={[styles.input, {backgroundColor: Colors[currentTheme].inputBackgroundColor}]} />
				<TouchableOpacity
					style={[styles.loginButton, {backgroundColor: Colors[currentTheme].loginButton}]}
					onPress={handleLogin}>
					<Text style={{
						fontSize: 15,
						color: Colors[currentTheme].buttonText
					}}>Log in</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.loginButton, {backgroundColor: Colors[currentTheme].loginButton}]}
					onPress={function () { navigate("/signUp") }}>
					<Text style={{
						fontSize: 15,
						color: Colors[currentTheme].buttonText
					}}>Don&apos;t have an account yet? Sign up</Text>
				</TouchableOpacity>
				<Button onPress={handleResetPassword}>
					<Text style={[styles.forgotPasswordText, {color: Colors[currentTheme].forgotPassword}]}>Reset password</Text>
				</Button>

				<View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, width: "80%" }}>
					<Divider style={{
						height: 1, backgroundColor: 'gray', marginVertical: 5,
						flex: 1
					}} />
					<Text style={{ marginHorizontal: 10,  fontSize: 15,
						color: Colors[currentTheme].text }}>or</Text>
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

							// authState.email = AppleAuthentication.AppleAuthenticationScope.EMAIL


							const userRef = doc(db, "users", email.toLocaleLowerCase().split('@')[0])
							const userSnap = await getDoc(userRef)
							if (!userSnap.exists()) {
								console.log("error at getting the user doc.")
								return;
							}
							const xp = userSnap.data().xp
							authState.logIn(email, password, xp)
							// signed in
						} catch (error: any) {
							if (error.code === 'ERR_REQUEST_CANCELED') {
								// handle that the user canceled the sign-in flow
							} else {
								// handle other errors
								console.error('Apple Sign-In Error:', error)
							}
						}
					}}
				/>
			</SafeAreaView>
		</SafeAreaProvider>
	)
}
