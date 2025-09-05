import { View, Text,Image, ImageBackground, Alert  } from "react-native"
import { Button, SegmentedButtons } from "react-native-paper"
import styles from '../../utils/styles'
import React, { useState, useContext, useEffect } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'

import { FIREBASE_APP } from "../../../firebaseConfig"
import { collection, doc, getFirestore, setDoc, getDocs, query, onSnapshot, deleteDoc, getDoc } from 'firebase/firestore'

import { AuthContext } from "../../utils/authContext" 
// https://jennpixel.itch.io/free-flower-pack-12-icons?download
// https://anokolisa.itch.io/free-pixel-art-asset-pack-topdown-tileset-rpg-16x16-sprites
const treeModel1Green3 = require("../../../assets/trees/model1/green/Size_03.png")
const treeModel1Green4 = require("../../../assets/trees/model1/green/Size_04.png")
const treeModel1Green5 = require("../../../assets/trees/model1/green/Size_05.png")

const treeModel1LightGreen3 = require("../../../assets/trees/model1/lightGreen/Size_03.png")
const treeModel1LightGreen4 = require("../../../assets/trees/model1/lightGreen/Size_04.png")
const treeModel1LightGreen5 = require("../../../assets/trees/model1/lightGreen/Size_05.png")

const treeModel1Orange3 = require("../../../assets/trees/model1/orange/Size_03.png")
const treeModel1Orange4 = require("../../../assets/trees/model1/orange/Size_04.png")
const treeModel1Orange5 = require("../../../assets/trees/model1/orange/Size_05.png")

const treeModel1Yellow3 = require("../../../assets/trees/model1/yellow/Size_03.png")
const treeModel1Yellow4 = require("../../../assets/trees/model1/yellow/Size_04.png")
const treeModel1Yellow5 = require("../../../assets/trees/model1/yellow/Size_05.png")

const treeModel1Dead = require("../../../assets/trees/model1/dead/Size_05.png")

function getTreePicture(label: string, remainingTime: number, startTime:number) {
	if (label === "treeModel1Green") {
		if (remainingTime === -1 && startTime === -1)
			return treeModel1Green5

		if (startTime - remainingTime < startTime / 3) {
			return treeModel1Green3
		}
		if (startTime - remainingTime < 2 * startTime / 3) {
			return treeModel1Green4
		}
		return treeModel1Green5
	}
	if (label === "treeModel1LightGreen") {
		if (remainingTime === -1 && startTime === -1)
			return treeModel1LightGreen5

		if (startTime - remainingTime < startTime / 3) {
			return treeModel1LightGreen3
		}
		if (startTime - remainingTime < 2 * startTime / 3) {
			return treeModel1LightGreen4
		}
		return treeModel1LightGreen5
	}
	if (label === "treeModel1Orange") {
		if (remainingTime === -1 && startTime === -1)
			return treeModel1Orange5

		if (startTime - remainingTime < startTime / 3) {
			return treeModel1Orange3
		}
		if (startTime - remainingTime < 2 * startTime / 3) {
			return treeModel1Orange4
		}
		return treeModel1Orange5
	}
	if (label === "treeModel1Yellow") {
		if (remainingTime === -1 && startTime === -1)
			return treeModel1Yellow5
		if (startTime - remainingTime < startTime / 3) {
			return treeModel1Yellow3
		}
		if (startTime - remainingTime < 2 * startTime / 3) {
			return treeModel1Yellow4
		}
		return treeModel1Yellow5
		}
	if (startTime - remainingTime < startTime / 3) {
			return treeModel1Green3
		}
		if (startTime - remainingTime < 2 * startTime / 3) {
			return treeModel1Green4
		}
		return treeModel1Green5
}

interface Tree{
	name:string
}
export default function ForestScreen() {

	const [showTree, setShowTree] = useState(false)
	const [choiceTree, setChoiceTree] = useState("Green")
	const [showTime, setShowTime] = useState(false)

	const [duration, setDuration] = useState("60")
	const [initialDuration, setInitialDuration] = useState("60") 
	const [isPlaying, setIsPlaying] = useState(false)
	const [wasStopped, setWasStopped] = useState(false)

	
	const db = getFirestore(FIREBASE_APP)
	const authState = useContext(AuthContext)
	const [treesAvailable, setTreesAvailable] = useState<Tree[]>([])
	let arr: Tree[] = [
		{ "name": "treeModel1Green" },
		{ "name": "treeModel1LightGreen" },
		{ "name": "treeModel1Orange" },
		{ "name": "treeModel1Yellow" },
	]
	const getTrees = async () => {
		try {
			const treesList = await getDocs(collection(db, "users", authState.displayName, "trees", "ownedTrees", 'ownedTreesList'))
			if (treesList.empty) {
				console.log("No purchased trees yet")
			} else {
				console.log("purchased trees:")
				const items: Tree[] = treesList.docs.map(doc => {
					const data = doc.data()
					return {
						name: data.name,
					}as Tree
				})
				setTreesAvailable(items)
				console.log(treesAvailable)
			}
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		try {
			const q = query(collection(db, "users", authState.displayName, "trees", "ownedTrees", "ownedTreesList"))
			const listenTrees = onSnapshot(q, (snapshot) => {
				getTrees()
			})
			return () => {
				listenTrees()
			}  
			}
		catch (error) {
			console.log(error)
		}
		 }, [authState])
	

	function setDurations(duration: string) {
		setInitialDuration(duration)
		setDuration(duration)
	}
	const renderTime = 
		({ remainingTime }: { remainingTime: number }) => {
			function renderTimeWithLabel(label: string) {
				const hours = Math.floor(remainingTime / 3600)
				const minutes = Math.floor((remainingTime % 3600) / 60)
				const seconds = remainingTime % 60
				let sec = seconds.toString()
				if (seconds === 0) {
					sec = "00"
				}
				if (seconds < 10) {
					sec = "0" + seconds
				}
				if (hours > 0) {
					return (
						<View style = {{alignItems: "center"}}>
							<ImageBackground
								source={getTreePicture(label, remainingTime, parseInt(initialDuration))}
								style={{ width: 90, height: 90, justifyContent: 'center', alignItems: 'center' }}
								resizeMode="stretch">
							</ImageBackground>
							<Text>{hours}:{minutes}:{sec}</Text>
						</View>
					)
				} else {
					if (minutes > 0) {
						return (<View style = {{alignItems: "center"}}>
							<ImageBackground
								source = {getTreePicture(label, remainingTime, parseInt(initialDuration))}
								style={{ width: 90, height: 90, justifyContent: 'center', alignItems: 'center' }}
								resizeMode="stretch">
							</ImageBackground>
							<Text>{minutes}:{sec}</Text>
						</View>)
					} else {
						return (<View style = {{alignItems: "center"}}>
							<ImageBackground
								source = {getTreePicture(label, remainingTime, parseInt(initialDuration))}
								style={{ width: 90, height: 90, justifyContent: 'center', alignItems: 'center' }}
								resizeMode="stretch">
							</ImageBackground>
							<Text>{sec}</Text>

						</View>
						)
					}
				}
			}
			if (wasStopped) {
				return (
					<View style = {{alignItems: "center"}}>
							<ImageBackground
								source = {treeModel1Dead}
								style={{ width: 90, height: 90, justifyContent: 'center', alignItems: 'center' }}
								resizeMode="stretch">
							</ImageBackground>
							<Text>Try better!</Text>
						</View>
				)
			}
			return renderTimeWithLabel(choiceTree)
		}


	return (
	<SafeAreaProvider>
		<SafeAreaView style={styles.container}>
				{/* DACA NU SE PLANTEAZA */}
			<ScrollView showsVerticalScrollIndicator={false}>
	  		{/* <View
          		style={[
            		styles.box,
            	{
					alignContent: "center",alignSelf:"center",
					transform: [{ rotateX: '40deg' }, { rotateZ: '30deg' }],
            	},
          		]}>
			</View> */}
     
			{!isPlaying && (
				<View>
				<Button style={styles.loginButton} onPress={() => {
					if (showTree)
						setShowTree(false)
					else
						setShowTree(true)
							
				}}>
				<Text style={styles.startText}>Choose Tree!</Text>
				</Button>
					
				{showTree && (
					<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
					<SegmentedButtons style={{
						alignContent: "center",
						width: "90%",
						alignSelf: "center",
						height: 100,
					}}
					value={choiceTree}
					onValueChange={setChoiceTree}
						buttons={treesAvailable.map((tree) => (
							{
								value: tree.name,
								icon: () => {
									return <Image source={getTreePicture(tree.name, -1, -1)}
										style={{ width: 90, height: 90, justifyContent: "center", alignItems: "center" }}
										resizeMode="stretch"
									/>
								}
								
							}))
							}
					/>
					</ScrollView>
				)}	
				<Button style={styles.loginButton} onPress={function () {
					if (showTime) 
						setShowTime(false)
					else 
						setShowTime(true)
				}}>
				<Text style={styles.startText}>Choose Time</Text>
				</Button>
				{showTime && (
					<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
						<SegmentedButtons style={{
							alignContent: "center",
							width: "90%",
							alignSelf: "center"
						}}
						value={duration}
						onValueChange={setDurations}
						buttons={[
							{ value: "10", label: "10" },
							{ value: '30', label: '30' },
							{ value: '45', label: '45' },
							{ value: '60', label: '60' },
							{ value: '90', label: '90' },
							{ value: '100', label: '100' },
							{ value: '120', label: '120' },
							{ value: '150', label: '150' },
							{ value: '180', label: '180' },
						]}
					/>
				</ScrollView>
					)}	
					</View>
				)}


				{/* DACA SE PLANTEAZA */}	
				<View
					style={{ alignSelf: 'center', marginTop: 20 }}>
					<CountdownCircleTimer
						size={250}
						isPlaying = {isPlaying}
						duration={parseInt(duration)}
						colors={['#004777', '#F7B801', '#A30000', '#A30000']}
							onComplete={function () {
								authState.xp += parseInt(duration)								
								Alert.alert("Congratulations!"," You planted a tree", [
									{text:"ok",}
								])
						}}
						colorsTime={[7, 5, 2, 0]}>	
						{renderTime}
				</CountdownCircleTimer>
				</View>


				{!isPlaying &&
					(<Button style={styles.loginButton} onPress={function () { setIsPlaying(true) }}>
						<Text style={styles.startText}>Plant Tree</Text>
					</Button>)}
				{isPlaying && (
					<Button style={styles.loginButton} onPress={function () {
						Alert.alert('Are you sure you want to stop?', 'Your tree will not grow fully', [
							{
								text: 'Cancel',
								onPress: () => console.log('Cancel Pressed'),
								style: 'cancel',
							},
							{
								text: 'Confirm',
								onPress: () => {
									console.log('OK Pressed')
									setIsPlaying(false)
									setWasStopped(true)
								}
							},	
					])}}>
						<Text style={styles.startText}>Stop</Text>
					</Button>
					)}	
					</ScrollView>
			</SafeAreaView>
		</SafeAreaProvider>
	)
}

// https://medium.com/@kalebjdavenport/how-to-create-a-grid-layout-in-react-native-7948f1a6f949

