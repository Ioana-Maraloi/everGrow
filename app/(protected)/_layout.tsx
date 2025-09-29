import { useContext } from "react"
import { Redirect, Stack } from "expo-router"
import { AuthContext } from "../utils/authContext"
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { View, Text } from 'react-native'
import styles from "../utils/styles"
import { Colors } from '../utils/colors'
import { MaterialCommunityIcons } from "@expo/vector-icons"


export default function ProtectedLayout() {

    const authState = useContext(AuthContext)
    console.log("Auth State:", authState)
    
	const { theme } = useContext(AuthContext);
	const currentTheme = (theme === "default" ? "light" : theme) as "light" | "dark";	


    if (!authState.isReady) {
        return null 
    } 
    if (!authState.isLoggedIn) {
        return <Redirect href="/login" />
    }
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="screens/friends" options={{
                    headerShown: true,
                    headerBackTitle: "Profile",
                    headerStyle: {
                        backgroundColor: Colors[currentTheme].colorTabsTop,
                    },
                    headerTintColor: Colors[currentTheme].tabsActive,
                    title:"Friends"
                }} />
                <Stack.Screen name="screens/shop" options={{
                    headerShown: true,
                    headerBackTitle: "Profile",
                    headerStyle: {
                        backgroundColor:Colors[currentTheme].colorTabsTop
                    },
                    headerTintColor:Colors[currentTheme].tabsActive,
                    title: "Shop",
                    headerRight: () => (
					<View style={styles.moneyDisplay}>
						<Text style= {styles.streakText}>{authState.xp} </Text>
						<MaterialCommunityIcons name = "currency-usd" size={18}
							color={"black"}>
						</MaterialCommunityIcons>
					</View>
				),  
                    
                }} />
                <Stack.Screen name="screens/achievements" options={{
                    headerShown: true,
                    headerBackTitle: "Profile",
                    headerStyle: {
                        backgroundColor: Colors[currentTheme].colorTabsTop
                    },
                    headerTintColor: Colors[currentTheme].tabsActive,
                    title:"Achievements"

                }} />
                <Stack.Screen name="screens/stats" options={{
                    headerShown: true,
                    headerBackTitle: "Profile",
                    headerStyle: {
                        backgroundColor: Colors[currentTheme].colorTabsTop
                    },
                    headerTintColor: Colors[currentTheme].tabsActive,
                    title:"Stats"

                }} />
                <Stack.Screen name="screens/theme" options={{
                    headerShown: true,
                    headerBackTitle: "Profile",
                    headerStyle: {
                        backgroundColor: Colors[currentTheme].colorTabsTop
                    },
                    headerTintColor: Colors[currentTheme].tabsActive,
                    title:"Theme"

                }} />
            </Stack>
        </GestureHandlerRootView>

    )
}
