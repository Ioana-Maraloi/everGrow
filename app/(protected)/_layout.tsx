import { useContext } from "react";
import { Redirect, Stack } from "expo-router";
import { AuthContext } from "../utils/authContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function ProtectedLayout() {

    const authState = useContext(AuthContext);
    console.log("Auth State:", authState);

    if (!authState.isReady) {
        return null; // or a loading spinner
    } 
    if (!authState.isLoggedIn) {
        return  <Redirect href="/login" />;
    }
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </GestureHandlerRootView>

    )
}
