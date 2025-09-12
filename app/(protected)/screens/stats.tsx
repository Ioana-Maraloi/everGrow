import { View, Text } from "react-native"
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from "../../utils/authContext"

import { Button } from "react-native-paper"
import styles from '../../utils/styles'
import { FIREBASE_APP } from "../../../firebaseConfig"

import {
	LineChart,
	BarChart,
	PieChart,
	ProgressChart,
	ContributionGraph,
	StackedBarChart
} from "react-native-chart-kit"
import { collection, doc, getDoc, getFirestore, setDoc, getDocs, Timestamp, query, where, onSnapshot, deleteDoc, updateDoc, increment } from 'firebase/firestore'

export default function Stats() {
	const db = getFirestore(FIREBASE_APP)
	const authState = useContext(AuthContext)

	const [totalTreesPlanted, setTotalTreesPlanted] = useState(0)
	const [treesDead, setTreesDead] = useState(0)
	const [totalFocusedTime, setTotalFocusedTime] = useState(0)

	const data = [
		{
			name: "trees planted",
			population: totalTreesPlanted,
			color: "rgba(140, 234, 131, 1)",
			legendFontColor: "#7F7F7F"
		},
		{
			name: "dead trees",
			population: treesDead,
			color: "rgba(103, 80, 26, 1)",
			legendFontColor: "#7F7F7F",
		}
	]
	const setTotalTrees = async () => {
		try {
			const statsRef = doc(db, 'users', authState.displayName, 'trees', 'stats')
			const docSnap = await getDoc(statsRef)
			if (docSnap.exists()) {
				setTotalTreesPlanted(docSnap.data().treesPlanted)
				setTreesDead(docSnap.data().treesDead)

}
		} catch (error) {
			console.log(error)
		}

	}
	useEffect(() => {
		try {
			const listen = onSnapshot(doc(db, "users", authState.displayName, "trees", "stats"), (doc) => {
				setTotalTrees()
			})
			return () => {
				listen()
			}
		}
		catch (error) {
			console.log(error)
		}
	})
const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
	};
	
	return (
		<View style={styles.container}>
			<PieChart
				data={data}
				width={300}
				height={220}
				chartConfig={chartConfig}
				accessor={"population"}
				backgroundColor={"transparent"}
				paddingLeft={"15"}
				// center={[10, 50]}
				absolute
			/>
			
		</View>
	)
}