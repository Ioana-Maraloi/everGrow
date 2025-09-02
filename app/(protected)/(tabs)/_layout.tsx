import { Tabs } from "expo-router"
import Feather from '@expo/vector-icons/Feather'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { View, Text } from 'react-native'
export default function TabsLayout() {
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
					<View>
						<Text>COINS</Text>
					</View>
				),
				headerLeft: () => (
					// https://reactnavigation.org/docs/native-stack-navigator/
					<View>
						<Text>STREAK?</Text>
					</View>
				),
				title: "forestt",
				 tabBarIcon:()=>(
				 <MaterialIcons name="forest" size={24} color="black" />) 
					
			 }}>
			</Tabs.Screen>

			<Tabs.Screen name="profile" options={{
				tabBarInactiveTintColor: "#003829",
				title: "profilll",
				tabBarIcon: () => (
					<MaterialIcons name="account-circle" size={24} color="black" />
				)
			}}>
			</Tabs.Screen>
		
	</Tabs>
	)
}
