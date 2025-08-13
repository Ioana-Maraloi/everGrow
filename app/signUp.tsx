import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { AuthContext } from "./utils/authContext";
import React, { useContext } from "react";
export default function SignUpScreen() {
    const authState = useContext(AuthContext);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    return (
        <View>
            <Text style={styles.title}>Login Screen</Text>
            <TextInput
                placeholder="Email"
                placeholderTextColor={"gray"}
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                placeholderTextColor={"gray"}
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                style={styles.input}
            />
        </View>
)
}

const styles = StyleSheet.create({
  container: {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
  },
  title: {
	fontSize: 20,
	marginBottom: 20,
	  alignItems: 'center',
	textAlign: 'center',
	},
  text: {
        fontWeight:"bold",
        textAlign:"center",
	  	fontSize: 24,
		color: 'white'
    },
  input: {
	height: 40,
	width: '80%',
	borderColor: 'gray',
	borderWidth: 1,
	marginBottom: 10,
	padding: 10,
	textAlign: 'center',
	alignSelf: 'center',
	},
	loginButton: {
		borderRadius: 15,
        flexDirection: "row",
        margin: 16,
        padding:24,
        justifyContent:"center",
		backgroundColor: 'green',
		// backgroundColor: 'blue',
	},
	separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
