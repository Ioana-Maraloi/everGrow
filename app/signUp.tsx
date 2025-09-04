import { View, Text, TouchableOpacity } from "react-native"
import {createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import React from "react"
import {TextInput} from "react-native-paper"
import styles from './utils/styles'
import { FIREBASE_AUTH, FIREBASE_APP } from "../firebaseConfig"
import { doc, getFirestore, setDoc } from 'firebase/firestore'

export default function SignUpScreen() {
	const db = getFirestore(FIREBASE_APP)
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [confirmPassword, setConfirmPassword] = React.useState('')
	const handleSignUp = async () => {
		try {
			if (password !== confirmPassword) {
				alert("Passwords do not match")
				return
			}
			if (password.length < 6) {
				alert("Password must be at least 6 characters long")
				return
			}
			const userCredentials = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
			await sendEmailVerification(userCredentials.user)
			alert("Account created!")
			await setDoc(doc(db, "users", email.toLowerCase().split('@')[0]), {
				email: email.toLowerCase(),
				username: email.toLowerCase().split('@')[0],
				xp: 0,
				uid: FIREBASE_AUTH.currentUser?.uid,
			})
		} catch (error: any) {
			console.log(error.code) 
			const code = error.code.split("/")[1] 
			alert(`Sign up failed: ${code}`)
		}
	}
	return (
		<View style={[styles.container, { alignItems: "center" }]}>
			<Text style={styles.title}>Create an account</Text>
			<TextInput
				mode="outlined"
				label="Email"
				placeholderTextColor={"gray"}
				value={email}
				onChangeText={(text) => setEmail(text)}
				style={styles.input}
			/>
			<TextInput
				mode="outlined"
				label="Password"
				placeholderTextColor={"gray"}
				value={password}
				onChangeText={(text) => setPassword(text)}
				secureTextEntry={true}
				style={styles.input}
			/>
			<TextInput
				mode="outlined"
				label="Reconfirm Password"
				placeholderTextColor={"gray"}
				value={confirmPassword}
				onChangeText={(text) => setConfirmPassword(text)}
				secureTextEntry={true}
				style={styles.input}
			/>
			<TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
			<Text style={styles.text}>Sign Up</Text>
		</TouchableOpacity>
		</View>
	)
}
