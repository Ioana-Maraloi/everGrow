import { Tabs } from "expo-router"
import Feather from '@expo/vector-icons/Feather'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { View, Text } from 'react-native'
import styles from "../../utils/styles"
import { AuthContext } from "../../utils/authContext"
import {useContext, useState} from 'react'
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useEffect } from "react"
import { doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore'
import { FIREBASE_APP } from "../../../firebaseConfig"

export default function TabsLayout() {

	const authState = useContext(AuthContext)
	const [xp, setXp] = useState(0)
	const [streak, setStreak] = useState(0)
		const db = getFirestore(FIREBASE_APP)
	
	const setTheStreak= async () => {
		try {
			const statsRef = doc(db, 'users', authState.displayName, 'trees', 'stats')
            const docSnap = await getDoc(statsRef)
            if (docSnap.exists()) {
                setStreak(docSnap.data().streak)
            }
			
		} catch (error) {
			console.log(error)
		}
	}
	const setTheXp= async () => {
		try {
			const statsRef = doc(db, 'users', authState.displayName)
            const docSnap = await getDoc(statsRef)
            if (docSnap.exists()) {
                setXp(docSnap.data().xp)
            }
			
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		try { 
			const listen = onSnapshot(doc(db, 'users', authState.displayName, "trees", "stats"), (doc) => {
				setTheStreak()
			})
			const listenXp = onSnapshot(doc(db, 'users', authState.displayName), (doc) => {
				setTheXp()
			})
			return () => {
				listen()
			}

		} catch (error) {
			console.log(error)
		}
	})
	return (
		<Tabs
			screenOptions={
				{
					headerStyle: {
						backgroundColor: "#9EBC8A"
					},
					headerShadowVisible: true,
					tabBarStyle: {
						backgroundColor: "#537D5D"
					},
					tabBarActiveTintColor: "#fff",
					tabBarInactiveTintColor: "#041d16ff",
				}
				
		}>    
			<Tabs.Screen name="index" options={{
				// headerShown: false,
				title: "today's tasks", 
				tabBarIcon: () => (
				<Feather name="check-square" size={24} color="black" />
			) }}>
			</Tabs.Screen>

			<Tabs.Screen name="forest" options={{ 
				headerRight: () => (
					<View style={styles.moneyDisplay}>
						<Text style= {styles.streakText}>{xp} </Text>
						<MaterialCommunityIcons name = "currency-usd" size={18}
							color={"#66ff00ff"}>
						</MaterialCommunityIcons>
					</View>
				),
				headerLeft: () => (
					<View style = {styles.moneyDisplay}>
						<Text style={styles.streakText}>{streak}</Text>
						<MaterialCommunityIcons name = "fire" size={18}
							color={"#ff9800"}>
						</MaterialCommunityIcons>
					</View>
				),
				title: "forest",
				 tabBarIcon:()=>(
				 <MaterialIcons name="forest" size={24} color="black" />) 
					
			 }}>
			</Tabs.Screen>

			<Tabs.Screen name="profile" options={{
				tabBarInactiveTintColor: "#003829",
				title: "profile",
				tabBarIcon: () => (
					<MaterialIcons name="account-circle" size={24} color="black" />
				)
			}}>
			</Tabs.Screen>
		
	</Tabs>
	)
}
