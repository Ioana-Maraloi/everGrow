import { useContext } from "react";
import { Redirect, Stack } from "expo-router";
import { AuthContext } from "../utils/authContext";
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
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
        </Stack>
    )
}
