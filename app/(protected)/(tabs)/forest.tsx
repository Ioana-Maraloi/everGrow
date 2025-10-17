import { View, Text, Image, ImageBackground, Alert, Modal, Pressable, TouchableOpacity } from "react-native"
import { Button, SegmentedButtons } from "react-native-paper"
import React, { useState, useContext, useEffect } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { FIREBASE_APP } from "../../../firebaseConfig"
import { collection, doc, getFirestore, updateDoc, setDoc, getDocs, query, onSnapshot, deleteDoc, getDoc, increment } from 'firebase/firestore'
import { AuthContext } from "../../utils/authContext"
// icons
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
// styling
import styles from '../../utils/styles'
import images from "../../utils/images"
import { Colors } from '../../utils/colors'

import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated'
function getTreePicture(label: string, remainingTime: number, startTime: number) {
	// model 1
	if (label === "treeModel1Green") {
		if (remainingTime === -1 && startTime === -1)
			return images.treeModel1Green5

		if (startTime - remainingTime < startTime / 3) {
			return images.treeModel1Green3
		}
		if (startTime - remainingTime < 2 * startTime / 3) {
			return images.treeModel1Green4
		}
		return images.treeModel1Green5
	}
	if (label === "treeModel1LightGreen") {
		if (remainingTime === -1 && startTime === -1)
			return images.treeModel1LightGreen5

		if (startTime - remainingTime < startTime / 3) {
			return images.treeModel1LightGreen3
		}
		if (startTime - remainingTime < 2 * startTime / 3) {
			return images.treeModel1LightGreen4
		}
		return images.treeModel1LightGreen5
	}
	if (label === "treeModel1Orange") {
		if (remainingTime === -1 && startTime === -1)
			return images.treeModel1Orange5

		if (startTime - remainingTime < startTime / 3) {
			return images.treeModel1Orange3
		}
		if (startTime - remainingTime < 2 * startTime / 3) {
			return images.treeModel1Orange4
		}
		return images.treeModel1Orange5
	}
	if (label === "treeModel1Yellow") {
		if (remainingTime === -1 && startTime === -1)
			return images.treeModel1Yellow5
		if (startTime - remainingTime < startTime / 3) {
			return images.treeModel1Yellow3
		}
		if (startTime - remainingTime < 2 * startTime / 3) {
			return images.treeModel1Yellow4
		}
		return images.treeModel1Yellow5
	}
	// model 2
	if (label === "treeModel2Blue") {
		if (remainingTime === -1 && startTime === -1)
			return images.treeModel2Blue5

		if (startTime - remainingTime < startTime / 3) {
			return images.treeModel2Blue3
		}
		if (startTime - remainingTime < 2 * startTime / 3) {
			return images.treeModel2Blue4
		}
		return images.treeModel2Blue5
	}
	if (label === "treeModel2Green") {
		if (remainingTime === -1 && startTime === -1)
			return images.treeModel2Green5

		if (startTime - remainingTime < startTime / 3) {
			return images.treeModel2Green3
		}
		if (startTime - remainingTime < 2 * startTime / 3) {
			return images.treeModel2Green4
		}
		return images.treeModel2Green5
	}
	if (label === "treeModel2Turquoise") {
		if (remainingTime === -1 && startTime === -1)
			return images.treeModel2Turquoise5

		if (startTime - remainingTime < startTime / 3) {
			return images.treeModel2Turquoise3
		}
		if (startTime - remainingTime < 2 * startTime / 3) {
			return images.treeModel2Turquoise4
		}
		return images.treeModel2Turquoise5
	}
	// model 3
	if (label === "treeModel3Green") {
		if (remainingTime === -1 && startTime === -1)
			return images.treeModel3Green5
		if (startTime - remainingTime < startTime / 3) {
			return images.treeModel3Green3
		}
		if (startTime - remainingTime < 2 * startTime / 3) {
			return images.treeModel3Green4
		}
		return images.treeModel3Green5
	}

	if (label === "treeModel3LightGreen") {
		if (remainingTime === -1 && startTime === -1)
			return images.treeModel3LightGreen5

		if (startTime - remainingTime < startTime / 3) {
			return images.treeModel3LightGreen3
		}
		if (startTime - remainingTime < 2 * startTime / 3) {
			return images.treeModel3LightGreen4
		}
		return images.treeModel3LightGreen5
	}
	if (label === "treeModel3Orange") {
		if (remainingTime === -1 && startTime === -1)
			return images.treeModel3Orange5

		if (startTime - remainingTime < startTime / 3) {
			return images.treeModel3Orange3
		}
		if (startTime - remainingTime < 2 * startTime / 3) {
			return images.treeModel3Orange4
		}
		return images.treeModel3Orange5
	}
	if (label === "treeModel3Red") {
		if (remainingTime === -1 && startTime === -1)
			return images.treeModel3Red5

		if (startTime - remainingTime < startTime / 3) {
			return images.treeModel3Red3
		}
		if (startTime - remainingTime < 2 * startTime / 3) {
			return images.treeModel3Red4
		}
		return images.treeModel3Red5
	}
	if (label === "redMushroom") {
		return images.redMushroom
	}
	if (label === "blueMushroom") {
		return images.blueMushroom
	}
	if (label === "flower") {
		return images.flower
	}
	if (label === "greenBush") {
		return images.greenBush
	}
	if (label === "orangeBush") {
		return images.orangeBush
	}
	if (startTime - remainingTime < startTime / 3) {
		return images.treeModel1Green3
	}
	if (startTime - remainingTime < 2 * startTime / 3) {
		return images.treeModel1Green4
	}
	return images.treeModel1Green5
}
function getBadgePicture(label: string) {
	// focus
	if (label === "firstSeed") {
		return images.firstSeed
	}
	if (label === "growingTree") {
		return images.growingTree
	}
	if (label === "deepRoots") {
		return images.deepRoots
	}
	if (label === "forestGuardian") {
		return images.forestGuardian
	}
	// streak
	if (label === "babyStreak") {
		return images.babyStreak
	}
	if (label === "discipled") {
		return images.discipled
	}
	if (label === "masterOfHabbit") {
		return images.masterOfHabbit
	}
	if (label === "legendaryStreak") {
		return images.legendaryStreak
	}
	if (label === "focusBunny") {
		return images.focusBunny
	}
	if (label === "clockWizzard") {
		return images.clockWizzard
	}
	if (label === "concentrationMaster") {
		return images.concentrationMaster
	}
}
interface Tree {
	name: string
}

interface TreeLocation {
	treeName: string,
	positionX: number,
	positionY: number
}
export default function ForestScreen() {
	// show choices for tree and time
	const [showTreesOptionssOptions, setshowTreesOptionssOptions] = useState(false)
	const [showTimeOptions, setshowTimeOptions] = useState(false)

	// select what tree to plant and for how much time
	const [choiceTree, setChoiceTree] = useState("Green")
	const [duration, setDuration] = useState("60")
	const [initialDuration, setInitialDuration] = useState("60")


	// display forest
	const [showForest, setShowForest] = useState(false)
	const [isPlaying, setIsPlaying] = useState(false)
	const [wasStopped, setWasStopped] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const [modalVisibleAchievement, setModalVisibleaAchievement] = useState(false)

	const [key, setKey] = useState(0)


	const [displayBadge, setDisplayBadge] = useState("AfirstSeed")
	const [xp, SetXp] = useState(0)
	const [treeId, setTreeId] = useState(0)


	const { theme } = useContext(AuthContext)
	const currentTheme = (theme === "default" ? "light" : theme) as "light" | "dark"


	const [containerWidth, setContainerWidth] = useState(0)
	const [containerHeight, setContainerHeight] = useState(0)

	// planting a tree in the garden
	const [plantIt, setPlantIt] = useState(false)
	const translateX = useSharedValue(0)
	const translateY = useSharedValue(0)
	let square = 50
	const handlePressRight = () => {
		if (translateX.value + containerWidth / 10> containerWidth * 0.6 - containerWidth / 5) {
		} else {
			translateX.value = withSpring(translateX.value + containerWidth / 5)
		}
	}
	const handlePressLeft = () => {
		if (translateX.value - containerWidth / 10 < - containerWidth * 0.6 + containerWidth  / 5) {
		} else {
			translateX.value = withSpring(translateX.value - containerWidth / 5)
		}
	}
	const handlePressUp = () => {
		if (translateY.value - containerHeight  / 10 < - containerHeight * 0.6 + containerHeight / 5) {
		} else {
			translateY.value = withSpring(translateY.value - containerHeight / 5)
		}

	}
	const handlePressDown = () => {
		if (translateY.value + containerWidth / 10 > containerHeight * 0.5 - containerHeight / 5) {
		} else {
			translateY.value = withSpring(translateY.value + containerHeight / 5)
		}
	}

	const [succesful, setSuccesful] = useState(false)
	const db = getFirestore(FIREBASE_APP)
	const authState = useContext(AuthContext)
	const [treesAvailable, setTreesAvailable] = useState<Tree[]>([])

	

	const [treeLocations, setTreeLocations] = useState<TreeLocation[]>([])
	
	const dateToday = new Date().getDate()
	const monthToday = new Date().getMonth() + 1
	const yearToday = new Date().getFullYear()
	const todayString = dateToday.toString().padStart(2, "0") + "-" + monthToday.toString().padStart(2, "0") + "-" + yearToday.toString().padStart(2, "0")

	const getTreeLocations = async () => {
		try {
			const treesList = await getDocs(collection(db, "users", authState.displayName, "trees", "stats", todayString, "statsToday","trees"))
			if (!treesList.empty) {
				const items: TreeLocation[] = treesList.docs.map(doc => {
					const data = doc.data()
					return {
						treeName: data.treeName,
						positionX: data.positionX,
						positionY: data.positionY
					} as TreeLocation
				})
				setTreeLocations(items)
			}
		} catch (error) {
			console.log(error)
		}
	}
	const getTrees = async () => {
		try {
			const treesList = await getDocs(collection(db, "users", authState.displayName, "trees", "ownedTrees", 'ownedTreesList'))
			if (!treesList.empty) {
				const items: Tree[] = treesList.docs.map(doc => {
					const data = doc.data()
					return {
						name: data.name,
					} as Tree
				})
				setTreesAvailable(items)
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

			const q2 = query(collection(db, "users", authState.displayName, "trees", "stats", todayString, "statsToday","trees"))
			const listenTrees2 = onSnapshot(q, (snapshot) => {
				getTreeLocations()
			})
			return () => {
				listenTrees()
				listenTrees2()
			}
		}
		catch (error) {
			console.log(error)
		}
	})
	function setDurations(duration: string) {
		setInitialDuration(duration)
		setDuration(duration)
		setWasStopped(false)
	}
	const renderTime =
		({ remainingTime }: { remainingTime: number }) => {
			function renderTimeWithLabel(label: string) {
				const hours = Math.floor(remainingTime / 3600)
				const minutes = Math.floor((remainingTime % 3600) / 60)
				const seconds = remainingTime % 60
				let sec = seconds.toString()
				if (!wasStopped) {
					if (seconds === 0) {
						sec = "00"
					}
					if (seconds < 10) {
						sec = "0" + seconds
					}
					if (hours > 0) {
						return (
							<View style={{ alignItems: "center" }}>
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
							return (<View style={{ alignItems: "center" }}>
								<ImageBackground
									source={getTreePicture(label, remainingTime, parseInt(initialDuration))}
									style={{ width: 90, height: 90, justifyContent: 'center', alignItems: 'center' }}
									resizeMode="stretch">
								</ImageBackground>
								<Text>{minutes}:{sec}</Text>
							</View>)
						} else {
							return (<View style={{ alignItems: "center" }}>
								<ImageBackground
									source={getTreePicture(label, remainingTime, parseInt(initialDuration))}
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
						<View style={{ alignItems: "center" }}>
							<ImageBackground
								source={getTreePicture(label, remainingTime, parseInt(initialDuration))}
								style={{ width: 90, height: 90, justifyContent: 'center', alignItems: 'center' }}
								resizeMode="stretch">
							</ImageBackground>
							<Text>Choose a time!</Text>
						</View>
					)
				}
			}
			return renderTimeWithLabel(choiceTree)
		}
	const checkAchievementUnlocked = async (treesPlanted: number, name: string, count: number) => {
		try {
			if (treesPlanted === count) {
				const badgeDoc = doc(db, "users", authState.displayName, "achievements", "notDone", "notDoneList", name)
				const badgeSnap = await getDoc(badgeDoc)
				if (badgeSnap.exists()) {

					setModalVisibleaAchievement(true)
					setDisplayBadge("AfirstSeed")

					await deleteDoc(badgeDoc)
					const description = badgeSnap.data().description
					const xp = badgeSnap.data().xp
					SetXp(xp)
					authState.xp += xp

					const userRef = doc(db, "users", authState.displayName)
					await updateDoc(userRef, {
						xp: increment(xp)
					})

					const dateToday = new Date().getDate()
					const monthToday = new Date().getMonth() + 1
					const yearToday = new Date().getFullYear()
					const todayString = dateToday.toString().padStart(2, "0") + "-" + monthToday.toString().padStart(2, "0") + "-" + yearToday.toString().padStart(2, "0")

					const badgeDone = doc(db, "users", authState.displayName, "achievements", "done", "doneList", name)
					const badgeInfo = {
						name: name,
						description: description,
						completedAt: todayString
					}
					await setDoc(badgeDone, badgeInfo)
				}
			}

		} catch (error) {
			console.log(error)
		}
	}
	const checkTimeAchievementUnlocked = async (timePlanted: number, name: string, count: number) => {
		try {
			if (timePlanted >= count) {
				const badgeDoc = doc(db, "users", authState.displayName, "achievements", "notDone", "notDoneList", name)
				const badgeSnap = await getDoc(badgeDoc)
				if (badgeSnap.exists()) {

					setModalVisibleaAchievement(true)
					setDisplayBadge("AfirstSeed")

					await deleteDoc(badgeDoc)
					const description = badgeSnap.data().description
					const xp = badgeSnap.data().xp
					SetXp(xp)
					authState.xp += xp

					const userRef = doc(db, "users", authState.displayName)
					await updateDoc(userRef, {
						xp: increment(xp)
					})

					const dateToday = new Date().getDate()
					const monthToday = new Date().getMonth() + 1
					const yearToday = new Date().getFullYear()
					const todayString = dateToday.toString().padStart(2, "0") + "-" + monthToday.toString().padStart(2, "0") + "-" + yearToday.toString().padStart(2, "0")

					const badgeDone = doc(db, "users", authState.displayName, "achievements", "done", "doneList", name)
					const badgeInfo = {
						name: name,
						description: description,
						completedAt: todayString
					}
					await setDoc(badgeDone, badgeInfo)
				}
			}

		} catch (error) {
			console.log(error)
		}
	}
	const treeDeath = async () => {
		try {
			setKey(key + 1)
			setDurations("60")
			const countRef = doc(db, "users", authState.displayName, "trees", "stats")
			const countSnap = await getDoc(countRef)
			if (!countSnap.exists()) {
				return
			}
			await updateDoc(countRef,
				{
					treesDead: increment(1),
				}
			)

		} catch (error) {
			console.log(error)
		}
	}
	const completedPlant = async (duration: number, choiceTree: string) => {
		try {
			setKey(key + 1)
			setDurations("60")
			setModalVisible(true)
			setSuccesful(true)
			authState.xp += duration
			setIsPlaying(false)
			SetXp(duration)
			setPlantIt(true)

			const userRef = doc(db, "users", authState.displayName)
			const userSnap = await getDoc(userRef)
			if (!userSnap.exists()) {
				return
			}
			await updateDoc(userRef, {
				xp: increment(duration)
			})

			const countRef = doc(db, "users", authState.displayName, "trees", "stats")
			const countSnap = await getDoc(countRef)
			if (!countSnap.exists()) {
				return
			}
			const treesPlanted = countSnap.data().treesPlanted
			const totalFocusedTime = countSnap.data().totalFocusedTime
			// check achievements for: first tree planted, 5th tree, 20th tree and 100th tree
			checkAchievementUnlocked(treesPlanted, "AfirstSeed", 0)
			checkAchievementUnlocked(treesPlanted, "BgrowingTree", 4)
			checkAchievementUnlocked(treesPlanted, "CdeepRoots", 9)
			checkAchievementUnlocked(treesPlanted, "DforestGuardian", 99)

			checkTimeAchievementUnlocked(totalFocusedTime + duration, "focusBunny", 9)
			checkTimeAchievementUnlocked(totalFocusedTime + duration, "clockWizzard", 99)
			checkTimeAchievementUnlocked(totalFocusedTime + duration, "concentrationMaster", 299)

			// receive achievement for 
			await updateDoc(countRef,
				{
					treesPlanted: increment(1),
					totalFocusedTime: increment(duration)
				}
			)

			const dateToday = new Date().getDate()
			const monthToday = new Date().getMonth() + 1
			const yearToday = new Date().getFullYear()
			const todayString = dateToday.toString().padStart(2, "0") + "-" + monthToday.toString().padStart(2, "0") + "-" + yearToday.toString().padStart(2, "0")

			const todayRef = doc(db, "users", authState.displayName, "trees", "stats", todayString, "statsToday")
			const todaySnap = await getDoc(todayRef)
			if (!todaySnap.exists()) {
				const statsInfo = {
					treesPlantedToday: 1,
					timeFocusedToday: duration,
				}
				await setDoc(todayRef, statsInfo)
				setTreeId(1)
			} else {
				await updateDoc(todayRef,
					{
						treesPlantedToday: increment(1),
						timeFocusedToday: increment(duration)
					})
				setTreeId(treeId + 1)
			}
	
		} catch (error) {
			console.log(error)
		}
	}
	const updatePositions = async () => {
	
		const treeRef = doc(db, "users", authState.displayName, "trees", "stats", todayString, "statsToday", "trees", "tree" + treeId)
		await setDoc(treeRef,
			{
				positionX: translateX.value,
				positionY: translateY.value,
				treeName: choiceTree
			})
		console.log("updates\n")
	}
	function formatCamelCase(str: string): string {
		const withoutPrefix = str.slice(1)
		const spaced = withoutPrefix.replace(/([A-Z])/g, ' $1').trim()
		return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase()
	}
	const getPictureSize = (name: string) => {
		if (name === "redMushroom" || name === "blueMushroom" || name === "flower")
			return 0.5
		if (name === "greenBush" || name === "orangeBush")
			return 0.75
		return 1

	}
	const animatedStyles = useAnimatedStyle(() => ({
		transform: [{
			translateX: withSpring(translateX.value),
		}, { translateY: withSpring(translateY.value) },
		],
	}))
	return (
		<SafeAreaProvider>
			<SafeAreaView style={[styles.container, {
				backgroundColor: Colors[currentTheme].backgroundColor,
			}]}>
				{/* display today's trees  */}
				{!plantIt && (<View>
					{showForest && (
						<View>
							<View style={[
								styles.box,
								{
									alignContent: "center", alignSelf: "center",
									transform: [{ rotateX: '60deg' }, { rotateZ: '40deg' }],
								},
							]}>
								{treeLocations.length === 0 ? (<View></View>) : 
								(treeLocations?.map((tree, key) => (
									
										<Image key={key} source={getTreePicture(tree.treeName, -1, -1)}
											style={{												
												width: 90, height: 90,
												justifyContent: "center",
												alignItems: "center",
												transform: [
													// { rotateX: "-10deg" },
													{ rotateZ: '-40deg' },
													// {rotateY:'10deg'},
													{ scale: getPictureSize(tree.treeName) }
												],
												position: "absolute",
												top: tree.positionY + containerWidth / 5 , //90 * getPictureSize(tree.treeName) - containerHeight / 5,
												left:tree.positionX + containerHeight / 5//- 90 * getPictureSize(tree.treeName)+ containerHeight / 5
											}}
											resizeMode="stretch"
											/>
									
							
								)))}
							</View>
							
							<Button style={[
								styles.loginButton, {
									backgroundColor: Colors[currentTheme].addTaskButton
								}]}
								icon={() => <MaterialCommunityIcons name="pine-tree" size={24} color={Colors[currentTheme].addTask} />}
								onPress={() => {
									setShowForest(false)
								}}>
								<Text style={{ color: Colors[currentTheme].addTask }}>Plant another tree today</Text>
							</Button>
						</View>
					)}
					{/* select how the next tree will look like */}
					{!showForest &&
						<ScrollView showsVerticalScrollIndicator={false}>
							{/* render the choices for the trees and the time */}
							{!isPlaying && (
								<View>
									{/* button to display today's forest */}
									<Button style={[styles.loginButton, {
										backgroundColor: Colors[currentTheme].addTaskButton
									}]}
										icon={() => <MaterialCommunityIcons name="forest" size={24} color={Colors[currentTheme].addTask} />}
										onPress={() => { setShowForest(true) }}>
										<Text style={{ color: Colors[currentTheme].addTask }}>Show today&apos;s forest!</Text>
									</Button>
									{/* button to choose the type of tree */}
									<Button style={[
										styles.loginButton, {
											backgroundColor: Colors[currentTheme].addTaskButton
										}]}
										icon={() => <MaterialIcons name="photo-library" size={24} color={Colors[currentTheme].addTask} />}
										onPress={() => {
											if (showTreesOptionssOptions)
												setshowTreesOptionssOptions(false)
											else
												setshowTreesOptionssOptions(true)
										}}>
										<Text style={{ color: Colors[currentTheme].addTask }}>Choose Tree</Text>
									</Button>

									{showTreesOptionssOptions && (
										<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
											<SegmentedButtons style={{
												alignContent: "center",
												width: "90%",
												alignSelf: "center",
												height: 100,
											}}
												theme={{
														colors: {
														primary: 'green',
														secondaryContainer: '#7be08cff',
														onSecondaryContainer: Colors[currentTheme].addTask,
													}
												}}
												value={choiceTree}
												onValueChange={setChoiceTree}
												buttons={treesAvailable.map((tree) => (
													{
														value: tree.name,
														icon: () => {
															return <Image source={getTreePicture(tree.name, -1, -1)}
																style={{ width: 90, height: 90, justifyContent: "center", alignItems: "center", transform: [{ scale: getPictureSize(tree.name) }] }}
																resizeMode="stretch"
															/>
														}
													}))
												}
											/>
										</ScrollView>
									)}
									{/* button to choose the time */}
									<Button style={[
										styles.loginButton, {
											backgroundColor: Colors[currentTheme].addTaskButton
										}]}
										onPress={function () {
											if (showTimeOptions)
												setshowTimeOptions(false)
											else
												setshowTimeOptions(true)
										}}
										icon={() => <MaterialCommunityIcons name="clock-edit-outline" size={24} color={Colors[currentTheme].addTask} />}
									>
										<Text style={{ color: Colors[currentTheme].addTask }}>Choose Time</Text>
									</Button>
									{showTimeOptions && (
										<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
											<SegmentedButtons style={{
												alignContent: "center",
												width: "90%",
												alignSelf: "center"
											}}
												theme={{
														colors: {
														primary: 'green',
														secondaryContainer: '#7be08cff',
														onSecondaryContainer: Colors[currentTheme].addTask,
													}
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

							{/* if the tree is being planted, only display the timer */}
							<View
								style={{ alignSelf: 'center', marginTop: 20 }}>
								<CountdownCircleTimer
									size={250}
									key={key}
									isPlaying={isPlaying}
									duration={parseInt(duration)}
									colors={['#088308ff', '#2bad2bff', '#64c464ff', '#77d377ff']}
									onComplete={
										() => {
											completedPlant(parseInt(duration), choiceTree)
										}}
									colorsTime={[7, 5, 2, 0]}>
									{renderTime}
								</CountdownCircleTimer>
							</View>

							{!isPlaying &&
								(<Button style={[
									styles.loginButton, {
										backgroundColor: Colors[currentTheme].addTaskButton
									}]}
									onPress={function () { setIsPlaying(true) }}
									icon={() => <MaterialCommunityIcons name="seed-outline" size={24} color={Colors[currentTheme].addTask} />}
								>
									<Text style={{ color: Colors[currentTheme].addTask }}>Plant Tree</Text>
								</Button>)}
							{isPlaying && (
								<Button style={[
										styles.loginButton, {
											backgroundColor: Colors[currentTheme].addTaskButton
									}]}
									onPress={
										function () {
									Alert.alert('Are you sure you want to stop?', 'Your tree will not grow fully', [
										{
											text: 'Cancel',
											onPress: () => {
												// setModalVisible(true)
												// setSuccesful(false)
											},
											style: 'cancel',
										},
										{
											text: 'Confirm',
											onPress: () => {
												setIsPlaying(false)
												setWasStopped(true)
												setModalVisible(true)
												setSuccesful(false)
												treeDeath()
											}
										},
									])
								}}>
									<Text  style={{ color: Colors[currentTheme].addTask }}>Stop</Text>
								</Button>
							)}
						</ScrollView>
					}
					{/* modal for when a tree is succesfully planted */}

				</View>)}


				{plantIt && (
					<View style={{ flex: 1, justifyContent: 'space-between' }}					
						>
						<View style={{
							borderWidth: 2, borderColor: "blue",
							justifyContent: 'center', alignItems: 'center'
						}}
						>	
							<View
								onLayout={(event) => {
								const { width, height } = event.nativeEvent.layout
								setContainerWidth(width)
								setContainerHeight(height)

							}}
								style={[
								styles.box,
								{
									transform: [{ rotateX: '60deg' }, { rotateZ: '40deg' }],
								},
									, {
										borderWidth: 2, borderColor: "pink",
										justifyContent: 'center', alignItems: 'center',
									overflow: 'hidden',}
							]}>
								<Animated.View
									style={[
										animatedStyles, {
										height: containerHeight / 5,
										width: containerWidth / 5,
										borderWidth: 2,
										borderColor: "red",
										backgroundColor: "rgba(255,0,0,0.3)",
									}]}

								 />

							</View>
						</View>


						<View style={{
							width: 150,
							height: 150,
							alignSelf: 'center',
							// backgroundColor: 'lightgrey',
							overflow: 'hidden',
							justifyContent: 'center',
							alignItems: 'center',
						}}>

							<TouchableOpacity style={{ marginBottom: 20 }} onPress={handlePressUp}>
								<MaterialCommunityIcons name="arrow-up-thick" size={30} color={Colors[currentTheme].addTask} />
							</TouchableOpacity>
							<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 20, width: 100 }}>
								<TouchableOpacity onPress={handlePressLeft}>
									<MaterialCommunityIcons name="arrow-left-thick" size={30} color={Colors[currentTheme].addTask} />
								</TouchableOpacity>
								<TouchableOpacity style={{
									alignItems: 'center', justifyContent: 'center',
									
								}}
									onPress={() => { setPlantIt(false), updatePositions() }}>
								<View>
									<Text style = {{ fontSize:20, alignItems:"center", justifyContent: 'center'}}>Plant!</Text>
								</View>
							</TouchableOpacity>
								<TouchableOpacity onPress={handlePressRight}>
									<MaterialCommunityIcons name="arrow-right-thick" size={30} color={Colors[currentTheme].addTask} />
								</TouchableOpacity>
							</View>
							<TouchableOpacity onPress={handlePressDown}>
								<MaterialCommunityIcons name="arrow-down-thick" size={30} color={Colors[currentTheme].addTask} />
							</TouchableOpacity>
							
						</View>
					</View>)}

				{/* modal for displaying a congratulations message for achieving an award */}
				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisibleAchievement}
					onRequestClose={() => {
						setModalVisible(!modalVisibleAchievement)
					}}>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={styles.modalText}>Achievement unlocked!</Text>
							<ImageBackground
								source={getBadgePicture(displayBadge.slice(1))}
								style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}
								resizeMode="stretch">
							</ImageBackground>
							<Text style={styles.modalText}>{formatCamelCase(displayBadge)}</Text>
							<Text style={styles.modalText}>You earned {xp} coins!</Text>

							<Pressable
								style={[styles.button, styles.buttonClose]}
								onPress={() => setModalVisible(!modalVisibleAchievement)}>
								<Text style={styles.textStyle}>Dismiss</Text>
							</Pressable>
						</View>
					</View>
				</Modal>

			</SafeAreaView>
		</SafeAreaProvider>
	)
}

