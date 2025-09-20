import * as React from 'react';
import { View } from 'react-native';
import { RadioButton, Text } from 'react-native-paper';
import styles from '../../utils/styles';
import { useState, useEffect, useContext } from 'react';
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { AuthContext } from "../../utils/authContext";

export default function Theme() {
	const [value, setValue] = useState('default');
	const {theme, chooseTheme} = useContext(AuthContext)

	const handleChange = (newValue: string) => {
		console.log(newValue)
		setValue(newValue);
		chooseTheme(newValue)
	};
	return <View style={{
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-start',
		padding: 20,
	}}>
		<Text style={styles.title}>Choose App Theme</Text>
		<RadioButton.Group onValueChange={handleChange} value={value}>
			<View style={styles.radioRow}>
				<RadioButton value="default" />
				<MaterialCommunityIcons
					name="theme-light-dark"
					size={20}
					color="black"
				/>
				<Text>Default</Text>

			</View>
			<View style={styles.radioRow}>
				<RadioButton value="light" />
				<MaterialCommunityIcons
					name="lightbulb-on"
					size={20}
					color="black"
				/>
				<Text>Light</Text>
			</View>
			<View style={styles.radioRow}>
				<RadioButton value="dark" />
				<MaterialCommunityIcons
					name="lightbulb-outline"
					size={20}
					color="black"
				/>
				<Text>Dark</Text>
			</View>
		</RadioButton.Group>
	</View>
}