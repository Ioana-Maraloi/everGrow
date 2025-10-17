import { View, Text, TouchableOpacity, TextInput } from "react-native"
import {createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import {useState, useContext} from "react"
import { FIREBASE_AUTH, FIREBASE_APP } from "../firebaseConfig"
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { AuthContext } from "./utils/authContext"
import styles from './utils/styles'
import { Colors } from './utils/colors'
interface Achievement{
    name: string,
	description: string,
	xp: number
}

let basicTrees = ["treeModel1Green", "treeModel1LightGreen", "treeModel1Orange",
	"treeModel1Yellow"]
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
		// hour achievements
		{
			name: "LfocusBunny",
			description: "Focus for 10 hours",
			xp: 50,
		}, 
		{
			name: "MclockWizzard",
			description: "Focus for 100 hours",
			xp:200,
		},
		{
			name: "NconcentrationMaster",
			description: "Focus for 300 hours",
			xp: 1000,
		},

] 
export default function SignUpScreen() {
	const db = getFirestore(FIREBASE_APP)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	
	const { theme } = useContext(AuthContext)
	const currentTheme = (theme === "default" ? "light" : theme) as "light" | "dark"
	
	const handleSignUp = async () => {
		try {
			const username = email.toLowerCase().split('@')[0]
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
			await setDoc(doc(db, "users",  username), {
				email: email.toLowerCase(),
				username:  username,
				xp: 0,
				uid: FIREBASE_AUTH.currentUser?.uid,
				streak: 0,

			})
			await setDoc(doc(db, "users", username, "trees", "stats"), {
				treesPlanted: 0,
				treesDead: 0,
				totalFocusedTime: 0,
				streaks: 0,
			})
			// adaug copacii disponibili
			for (let i = 0; i < basicTrees.length; i++) {
				const treeRef = doc(db, "users", username, "trees",
					"ownedTrees", "ownedTreesList", basicTrees[i])
				const treeObj = {
					name: basicTrees[i],
				}
				await setDoc(treeRef, treeObj)
			}

			for (let i = 0; i < trees.length; i++) {
				const treeRef = doc(db, "users", username, "trees",
					"notOwnedTrees", "notOwnedTreesList", trees[i])
				const treeObj = {
					name: trees[i],
					price: 200
				}
				await setDoc(treeRef, treeObj)
			}
			for (let i = 0; i < plants.length; i++) {
				const plantRef = doc(db, "users", username, "trees",
					"notOwnedTrees", "notOwnedTreesList", plants[i])
				const plantObj = {
					name: plants[i],
					price: 300
				}
				await setDoc(plantRef, plantObj)
			}
			for (let i = 0; i < achievements.length; i++) {
				const achievementRef = doc(db, "users", username,
					"achievements", "notDone", "notDoneList", achievements[i].name)
				await setDoc(achievementRef, achievements[i])
			}
		} catch (error: any) {
			console.log(error.code) 
		}
	}
	return (
		<View style={[styles.container, {
			alignItems: "center",
			backgroundColor: Colors[currentTheme].backgroundColor,
		 }]}>
			<Text style={[styles.title,
				{ color: Colors[currentTheme].title }]}>Create an account</Text>
			<TextInput
				placeholder="Email"
				placeholderTextColor={Colors[currentTheme].shadowColor}
				value={email}
				onChangeText={(text) => setEmail(text)}
				style={[styles.input,
				{ backgroundColor: Colors[currentTheme].inputBackgroundColor }]}
			/>
			<TextInput
				placeholder="Password"
				placeholderTextColor={Colors[currentTheme].shadowColor}
				value={password}
				onChangeText={(text) => setPassword(text)}
				secureTextEntry={true}
				style={[styles.input,
				{ backgroundColor: Colors[currentTheme].inputBackgroundColor }]}
			/>
			<TextInput
				placeholder="Reconfirm Password"
				placeholderTextColor={Colors[currentTheme].shadowColor}
				value={confirmPassword}
				onChangeText={(text) => setConfirmPassword(text)}
				secureTextEntry={true}
				style={[styles.input,
				{ backgroundColor: Colors[currentTheme].inputBackgroundColor }]}
			/>
			<TouchableOpacity
				style={[styles.loginButton,
				{ backgroundColor: Colors[currentTheme].loginButton }]}
				onPress={handleSignUp}>
			<Text style={{
				fontSize: 15,
				color: Colors[currentTheme].buttonText
			}}>Sign Up</Text>
		</TouchableOpacity>
		</View>
	)
}
