import { View, Text, TextInput, StyleSheet, TouchableOpacity, Button  } from "react-native";
import React, {useContext} from "react";
import { FIREBASE_AUTH, FIREBASE_APP } from "../firebaseConfig";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { AuthContext } from "./utils/authContext";
import * as AppleAuthentication from 'expo-apple-authentication';
import { doc, getFirestore, addDoc, setDoc, collection } from 'firebase/firestore';


const Separator = () => <View style={styles.separator} />;

const LoginScreen = () => {
	const authState = useContext(AuthContext);
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	
	const db = getFirestore(FIREBASE_APP);
	const usersCollectionRef = collection(db, 'users');

	
	const handleLogin = async () => {
		try {
	  		await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
			alert('Login successful!');
			console.log('Login successful!');
			authState.email = email;
			authState.password = password;
			authState.uid = FIREBASE_AUTH.currentUser?.uid;
			authState.providerId = FIREBASE_AUTH.currentUser?.providerData[0].providerId
			authState.displayName = email.split('@')[0]; // Use email prefix as displayName
			const myDoc = {
				email: email,
				username: email.split('@')[0], // Use email prefix as username
				uid: FIREBASE_AUTH.currentUser?.uid,
			}
			const myDocRef = doc(usersCollectionRef, email.split('@')[0]); // Use email prefix as document ID
			await setDoc(myDocRef, myDoc);
			const myDocJSON = myDocRef.toJSON();
			if (!myDocJSON.hasOwnProperty("xp")) {
				authState.xp = 0;
				const updateDoc = {
					xp: 0,
				}
				await setDoc(myDocRef, updateDoc, { merge: true });
			}
			authState.logIn();
	
	} catch (error: any) {
		console.log(error.code);
		const code = error.code.split("/")[1]; 
		alert(`Login failed: ${code}`);
	}
	};
	const handleSignUp = async () => {
	try {
	  	const userCredentials = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
		await sendEmailVerification(userCredentials.user);
		alert('check your email for verification');
		const myDoc = await addDoc(usersCollectionRef, {
				email: email,
				username: email.split('@')[0], // Use email prefix as username
				xp: 0,
				uid: FIREBASE_AUTH.currentUser?.uid,
		});
		const myDocRef = doc(usersCollectionRef, email.split('@')[0]); // Use email prefix as document ID
		await setDoc(myDocRef, myDoc);


	} catch (error: any) {
		console.log(error.code); 
		const code = error.code.split("/")[1]; 
		alert(`Sign up failed: ${code}`);
	}
	};
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
		<TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
			<Text style={styles.text}>Log in</Text>
		</TouchableOpacity>
		{/* <Button onPress={handleLogin} title="Log in" color={"blue"}></Button> */}
		
		{/* <Button onPress={handleSignUp} title="Don't have an account yet? Sign up" color={"blue"}></Button> */}
		<TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
			<Text style={styles.text} >Don&apos;t have an account yet? Sign up! </Text>
		</TouchableOpacity>
		<Separator>
		</Separator>
		<Text style={{ textAlign: 'center', color: 'gray' }}>or</Text>
		<AppleAuthentication.AppleAuthenticationButton
			buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
			buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
			cornerRadius={5}
			style={styles.loginButton}
			onPress={async () => {
		  		try {
					const credential = await AppleAuthentication.signInAsync({
			  		requestedScopes: [
						AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
						AppleAuthentication.AppleAuthenticationScope.EMAIL,
			  		],
				});
				authState.logIn();
				// signed in
		  		} catch (error: any) {
					if (error.code === 'ERR_REQUEST_CANCELED') {
			  			// handle that the user canceled the sign-in flow
					} else {
			  			// handle other errors
			  			console.error('Apple Sign-In Error:', error);}
		  		}
			}}
		/>
	</View>	
	)
}
export default LoginScreen
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