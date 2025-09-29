import { Stack } from "expo-router";
import { AuthProvider, AuthContext } from "./utils/authContext";
import { Colors } from "./utils/colors"
export default function RootLayout() {
	const currentTheme = "light"
	return (
		<AuthProvider>
			<Stack
				>
				<Stack.Screen name="login" options={{ headerShown: false }} />
				<Stack.Screen name="signUp"
					options={
					{
						headerShown: true,
                		headerBackTitle: "Log In",
                    	headerStyle: {
                    		backgroundColor: Colors[currentTheme].colorTabsTop,
                    	},
                    	headerTintColor: Colors[currentTheme].colorTitleTab,
                    	title:"Sign Up"
					}}
				/>

				<Stack.Screen name="(protected)" options={{ headerShown: false }} />
			</Stack>
		</AuthProvider>
	)
}
