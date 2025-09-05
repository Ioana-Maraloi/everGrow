import { View, Text, TouchableOpacity } from "react-native"
import {createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import React from "react"
import {TextInput} from "react-native-paper"
import styles from './utils/styles'
import { FIREBASE_AUTH, FIREBASE_APP } from "../firebaseConfig"
import { doc, getFirestore, setDoc } from 'firebase/firestore'
// interface Tree{
// 	name:string
// }
interface Achievement{
    name: string,
	description: string,
	xp: number
}

let basicTrees = ["treeModel1Green", "treeModel1LightGreen", "treeModel1Orange", "treeModel1Yellow"]
let trees = ["treeModel2Blue", "treeModel2Green", "treeModel2Turquoise",
	"treeModel3Green", "treeModel3LightGreen", "treeModel3Orange", "treeModel3Red"]
let plants = ["redMushroom", "blueMushroom", "flower", "greenBush", "orangeBush"]
let achievements: Achievement[] =
	[
	// focus achievements
		{
			name: "AfirstSeed",
			description: "Complete your first focus session",
			xp: 20,
		}, 
		{
			name: "BgrowingTree",
			description: "Complete 5 focus sessions",
			xp:30,
		},
		{
			name: "CdeepRoots",
			description: "Complete 20 focus sessions",
			xp: 50,
		}, 
		{
			name: "DforestGuardian",
			description: "Complete 100 focus sessions",
			xp: 100,
		},
		// streak achievements
		{
			name: "EbabyStreak",
			description: "Plant 3 days in a row",
			xp: 20,
		}, 
		{
			name: "Fdiscipled",
			description: "Plant 7 days in a row",
			xp: 100,
		},
		{
			name: "GmasterOfHabbit",
			description: "Plant 30 days in arow",
			xp: 500,
		}, 
		{
			name: "HlegendaryStreak",
			description: "Reach 100 day streak",
			xp:1000,
		},
		// friend achievements
		{
			name: "ImakingFriends",
			description: "Add your first friend",
			xp: 20,
		}, 
		{
			name: "JsocialButterfly",
			description: "Add 5 friends",
			xp:50,
		},
		{
			name: "Ktree-mendousFriends",
			description: "Add 10 friends",
			xp: 100,
		},
] 
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
			// adaug copacii disponibili
			for (let i = 0; i < basicTrees.length; i++) {
				console.log("adding:" ,basicTrees[i])
				const treeRef = doc(db, "users", email.toLowerCase().split('@')[0], "trees", "ownedTrees", "ownedTreesList", basicTrees[i])
				const treeObj = {
					name: basicTrees[i],
				}
				await setDoc(treeRef, treeObj)
			}

			for (let i = 0; i < trees.length; i++) {
				console.log("adding:" ,trees[i])
				const treeRef = doc(db, "users", email.toLowerCase().split('@')[0], "trees", "notOwnedTrees", "notOwnedTreesList", trees[i])
				const treeObj = {
					name: trees[i],
					price: 200
				}
				await setDoc(treeRef, treeObj)
			}
			for (let i = 0; i < plants.length; i++) {
				console.log("adding:" ,plants[i])
				const plantRef = doc(db, "users", email.toLowerCase().split('@')[0], "trees", "notOwnedTrees", "notOwnedTreesList", plants[i])
				const plantObj = {
					name: plants[i],
					price: 300
				}
				await setDoc(plantRef, plantObj)
			}
			for (let i = 0; i < achievements.length; i++) {
				console.log("adding:" ,achievements[i].name)
				const achievementRef = doc(db, "users", email.toLowerCase().split('@')[0], "achievements", "notDone", "notDoneList", achievements[i].name)
				await setDoc(achievementRef, achievements[i])
			}
		} catch (error: any) {
			console.log(error.code) 
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
