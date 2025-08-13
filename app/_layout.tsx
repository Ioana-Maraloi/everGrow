import { Stack } from "expo-router";
import { AuthProvider } from "./utils/authContext";

// let isSignedIn = false;
export default function RootLayout() {
	return (
		<AuthProvider>
			<Stack>
				<Stack.Screen name="(protected)" options={{ headerShown: true }} />
			</Stack>
		</AuthProvider>
	)
}
