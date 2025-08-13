import { View, Text, Button } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../../utils/authContext";  
export default function ProfileScreen() {
    const authState = useContext(AuthContext);
    return (
        <View>
            <Button onPress={authState.logOut} title="Log out"></Button>
        <Text> Hello from profile screen</Text>
    </View>
    )
}