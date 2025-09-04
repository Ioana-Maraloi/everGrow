import { View, Text } from "react-native"
import { Button } from "react-native-paper"
import  {Stack} from "expo-router"
export default function Shop() {
    return (

       <Stack.Screen
        options={{
            headerBackTitle: "Profile",   // textul butonului de back
            headerBackVisible:true
            }}
    />
    )
}