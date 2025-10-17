import { Tabs } from "expo-router"
import { View, Text } from 'react-native'
import { AuthContext } from "../../utils/authContext"
import {useContext, useState} from 'react'
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useEffect } from "react"
import { doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore'
import { FIREBASE_APP } from "../../../firebaseConfig"
// styling
import styles from "../../utils/styles"
import { Colors } from '../../utils/colors'
export default function TabsLayout() {
	const authState = useContext(AuthContext)
	const [xp, setXp] = useState(0)
	const [streak, setStreak] = useState(0)
	const db = getFirestore(FIREBASE_APP)
	
	const { theme } = useContext(AuthContext)
	const currentTheme = (theme === "default" ? "light" : theme) as "light" | "dark"
	
	const setTheStreak = async () => {
		try {
			const statsRef = doc(db, 'users', authState.displayName, 'trees', 'stats')
            const docSnap = await getDoc(statsRef)
            if (docSnap.exists()) {
                setStreak(docSnap.data().streaks)
			}
		} catch (error) {
			console.log(error)
		}
	}
	const setTheXp = async () => {
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
				listenXp()
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
						backgroundColor: Colors[currentTheme].colorTabsTop
					},
					headerShadowVisible: true,
					tabBarStyle: {
						backgroundColor: Colors[currentTheme].colorTabsBottom
					},
					tabBarActiveTintColor: Colors[currentTheme].tabsActive,
					tabBarInactiveTintColor: Colors[currentTheme].tabsInactive,
				}
		}>    
			<Tabs.Screen name="index" options={{
				title: "today's tasks", 
				headerTintColor:Colors[currentTheme].colorTitleTab,
				tabBarIcon: ({ focused}) => (
					<MaterialCommunityIcons 
						name="checkbox-marked-outline" 	
						size={24}
						color={focused ? Colors[currentTheme].tabsActive : Colors[currentTheme].tabsInactive}>
					</MaterialCommunityIcons>)
				}}>
			</Tabs.Screen>

			<Tabs.Screen name="forest" options={{ 
				headerRight: () => (
					<View style={styles.moneyDisplay}>
						<Text style= {styles.streakText}>{xp} </Text>
						<MaterialCommunityIcons
							name="currency-usd"
							size={18}
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
				headerTintColor: Colors[currentTheme].colorTitleTab,
				 tabBarIcon: ({ focused }) => (
					<MaterialCommunityIcons 
						name="forest" 	
						size={24}
						color={focused ? Colors[currentTheme].tabsActive : Colors[currentTheme].tabsInactive}>
					</MaterialCommunityIcons>)
				}}>
			</Tabs.Screen>

			<Tabs.Screen name="profile" options={{
				title: "profile",
				headerTintColor:Colors[currentTheme].colorTitleTab,
				tabBarIcon: ({ focused }) => (
					<MaterialCommunityIcons
						name="face-man" 	
						size={24}
						color={focused ? Colors[currentTheme].tabsActive : Colors[currentTheme].tabsInactive}>
					</MaterialCommunityIcons>)
				}}>
			</Tabs.Screen>
		
	</Tabs>
	)
}
