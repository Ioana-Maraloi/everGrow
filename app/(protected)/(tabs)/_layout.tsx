import { Tabs } from "expo-router"
import Feather from '@expo/vector-icons/Feather'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { View, Text } from 'react-native'
import styles from "../../utils/styles"
import { AuthContext } from "../../utils/authContext"
import {useContext} from 'react'
import { MaterialCommunityIcons } from "@expo/vector-icons"

export default function TabsLayout() {
	const authState = useContext(AuthContext)
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
						<Text style= {styles.streakText}>{authState.xp} </Text>
						<MaterialCommunityIcons name = "currency-usd" size={18}
							color={"#66ff00ff"}>
						</MaterialCommunityIcons>
					</View>
				),
				headerLeft: () => (
					// https://reactnavigation.org/docs/native-stack-navigator/
					<View style = {styles.moneyDisplay}>
						<Text style={styles.streakText}>0</Text>
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
