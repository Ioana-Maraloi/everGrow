import { View, Text, TouchableOpacity, Image, TextInput } from "react-native"
import React, { useContext, } from "react"
import { FIREBASE_AUTH, FIREBASE_APP } from "../firebaseConfig"
import { AuthContext } from "./utils/authContext"
import { doc, getFirestore, getDoc } from 'firebase/firestore'
import { Button } from 'react-native-paper'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { navigate } from "expo-router/build/global-state/routing"
import {
	getAuth, signInWithEmailAndPassword, sendPasswordResetEmail
} from "firebase/auth"
import styles from './utils/styles'
import { Colors } from './utils/colors'
import images from "./utils/images"
const auth = getAuth()
export default function LoginScreen() {
	const authState = useContext(AuthContext)
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')

	const db = getFirestore(FIREBASE_APP)

	const { theme } = useContext(AuthContext)
	const currentTheme = (theme === "default" ? "light" : theme) as "light" | "dark"


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
			const userRef = doc(db, "users", email.toLocaleLowerCase().split('@')[0])
			const userSnap = await getDoc(userRef)
			if (!userSnap.exists()) {
				console.log("error at getting the user doc.")
				return
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
					// mode="flat"
					placeholder="Email"
					placeholderTextColor={Colors[currentTheme].shadowColor}
					onChangeText={(text) => setEmail(text)}
					style={[styles.input,
					{ backgroundColor: Colors[currentTheme].inputBackgroundColor}]}/>
				<TextInput
					placeholder = "Password"
					placeholderTextColor={Colors[currentTheme].shadowColor}
					onChangeText={(text) => setPassword(text)}
					secureTextEntry={true}
					style={[styles.input,
					{ backgroundColor: Colors[currentTheme].inputBackgroundColor }]} />
				<TouchableOpacity
					style={[styles.loginButton,
					{ backgroundColor: Colors[currentTheme].loginButton }]}
					onPress={handleLogin}>
					<Text style={{
						fontSize: 15,
						color: Colors[currentTheme].buttonText
					}}>Log in</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.loginButton,
					{ backgroundColor: Colors[currentTheme].loginButton }]}
					onPress={function () { navigate("/signUp") }}>
					<Text style={{
						fontSize: 15,
						color: Colors[currentTheme].buttonText
					}}>Don&apos;t have an account yet? Sign up</Text>
				</TouchableOpacity>
				<Button onPress={handleResetPassword}>
					<Text style={[styles.forgotPasswordText,
						{ color: Colors[currentTheme].forgotPassword }]}>
						Reset password</Text>
				</Button>

				<View style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginVertical: 10,
					width: "80%"
				}}>
				</View>
			</SafeAreaView>
		</SafeAreaProvider>
	)
}
