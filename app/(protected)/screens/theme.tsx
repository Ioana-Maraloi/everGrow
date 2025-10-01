import * as React from 'react'
import { View } from 'react-native'
import { RadioButton, Text } from 'react-native-paper'
import { Colors } from '../../utils/colors'
import { useState, useEffect, useContext } from 'react' 
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { AuthContext } from "../../utils/authContext"
import styles from '../../utils/styles'
export default function Theme() {
	const [value, setValue] = useState('default')
	const {theme, chooseTheme} = useContext(AuthContext)	  
	const currentTheme = (theme === "default" ? "light" : theme) as "light" | "dark"
		
	const handleChange = (newValue: string) => {
		setValue(newValue)
		chooseTheme(newValue)
	}
	return <View style={{
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		backgroundColor: Colors[currentTheme].backgroundColor,	
	}}>
		<Text style={[styles.title,
				{ color: Colors[currentTheme].colorTitleTab }]}>Choose App Theme</Text>
		<RadioButton.Group onValueChange={handleChange} value={value}>
			<View style={styles.radioRow}>
				<RadioButton value="default" />
				<MaterialCommunityIcons
					name="theme-light-dark"
					size={20}
					color={Colors[currentTheme].colorTitleTab}
				/>
				<Text style={{ color: Colors[currentTheme].colorTitleTab }}>Default</Text>

			</View>
			<View style={styles.radioRow}>
				<RadioButton value="light" />
				<MaterialCommunityIcons
					name="lightbulb-on"
					size={20}
					color={Colors[currentTheme].colorTitleTab}
				/>
				<Text style={{ color: Colors[currentTheme].colorTitleTab }}>Light</Text>
			</View>
			<View style={styles.radioRow}>
				<RadioButton value="dark" />
				<MaterialCommunityIcons
					name="lightbulb-outline"
					size={20}
					color={Colors[currentTheme].colorTitleTab}
				/>
				<Text style={{ color: Colors[currentTheme].colorTitleTab }}>Dark</Text>
			</View>
		</RadioButton.Group>
	</View>
}