import { View, Text, Image, ImageBackground, Alert, Modal, Pressable } from "react-native"
import { Button, SegmentedButtons } from "react-native-paper"
import styles from '../../utils/styles'
import images from "../../utils/images"

import React, { useState, useContext, useEffect } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'

import { FIREBASE_APP } from "../../../firebaseConfig"
import { collection, doc, getFirestore, updateDoc, setDoc, getDocs, query, onSnapshot, deleteDoc, getDoc, increment } from 'firebase/firestore'

import { AuthContext } from "../../utils/authContext"
// https://jennpixel.itch.io/free-flower-pack-12-icons?download
// https://anokolisa.itch.io/free-pixel-art-asset-pack-topdown-tileset-rpg-16x16-sprites

function getTreePicture(label: string, remainingTime: number, startTime: number) {
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


	const [displayBadge, setDisplayBadge] = useState("AfirstSeed")


	const [succesful, setSuccesful] = useState(false)
	const db = getFirestore(FIREBASE_APP)
	const authState = useContext(AuthContext)
	const [treesAvailable, setTreesAvailable] = useState<Tree[]>([])
	const getTrees = async () => {
		try {
			const treesList = await getDocs(collection(db, "users", authState.displayName, "trees", "ownedTrees", 'ownedTreesList'))
			if (treesList.empty) {
				// console.log("No purchased trees yet")
			} else {
				// console.log("purchased trees:")
				const items: Tree[] = treesList.docs.map(doc => {
					const data = doc.data()
					return {
						name: data.name,
					} as Tree
				})
				setTreesAvailable(items)
				// console.log(treesAvailable)
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
	})
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
					authState.xp += xp

					const dateToday = new Date().getDate()
					const monthToday = new Date().getMonth() + 1
					const yearToday = new Date().getFullYear()
					const todayString = dateToday + "-" + monthToday + "-" + yearToday

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
					authState.xp += xp

					const dateToday = new Date().getDate()
					const monthToday = new Date().getMonth() + 1
					const yearToday = new Date().getFullYear()
					const todayString = dateToday + "-" + monthToday + "-" + yearToday

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
	
	const completedPlant = async (duration: number, choiceTree: string) => {
		try {
			setDurations("60")
			setModalVisible(true)
			setSuccesful(true)
			authState.xp += duration
			setIsPlaying(false)


			const countRef = doc(db, "users", authState.displayName, "trees", "stats")
			const countSnap = await getDoc(countRef)
			if (!countSnap.exists()) {
				return
			}
			const treesPlanted = countSnap.data().treesPlanted
			const totalFocusedTime = countSnap.data().totalFocusedTime
			// check achievements for: first tree planted, 5th tree 20th tree and 100th tree
			checkAchievementUnlocked(treesPlanted, "AfirstSeed", 0)
			checkAchievementUnlocked(treesPlanted, "BgrowingTree", 4)
			checkAchievementUnlocked(treesPlanted, "CdeepRoots", 9)
			checkAchievementUnlocked(treesPlanted, "DforestGuardian", 99)

			checkTimeAchievementUnlocked(totalFocusedTime + duration, "focusBunny", 9)
			checkTimeAchievementUnlocked(totalFocusedTime + duration, "clockWizzard", 99)
			checkTimeAchievementUnlocked(totalFocusedTime+ duration, "concentrationMaster", 299)

			// receive achievement for 
			await updateDoc(countRef,
				{
					treesPlanted: increment(1),
					totalFocusedTime: increment(duration)

				}
			)
			// const treeRef = doc(db, "users", authState.displayName, "trees", "treesPlanted", todayString, "tree" + countTrees.toString())

			// const statsRef = doc(db, 'users', authState.displayName, 'trees', 'stats')
			// await updateDoc(statsRef, {
			// 	totalFocusedTime: increment(duration),
			// 	treesPlanted: increment(1),
			// })
			// const xpRef = doc(db, "users", authState.displayName)
			// await updateDoc(xpRef, {
			// 	xp: increment(duration)
			// })
		} catch (error) {
			console.log(error)
		}
	}
	function formatCamelCase(str: string): string {
		const withoutPrefix = str.slice(1);
		const spaced = withoutPrefix.replace(/([A-Z])/g, ' $1').trim();
		return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
	}
	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				{/* display today's trees  */}
				{showForest && (
					<View>
						<View style={[
							styles.box,
							{
								alignContent: "center", alignSelf: "center",
								transform: [{ rotateX: '60deg' }, { rotateZ: '40deg' }],
							},
						]}>
						</View>
						<Button icon={"pine-tree"} onPress={() => {
							setShowForest(false)
						}}>
							<Text>Plant another tree to today&apos;s forest</Text>
						</Button>
					</View>
				)}
				{/* select how the next tree will look like */}
				{!showForest &&
					<ScrollView showsVerticalScrollIndicator={false}>
						{/* render the choices for the trees and the time */}
						{!isPlaying && (
							<View>
								<Button>
									<Text onPress={() => { setShowForest(true) }}>Show today&apos;s forest!</Text>
								</Button>

								<Button style={styles.loginButton} onPress={() => {
									if (showTreesOptionssOptions)
										setshowTreesOptionssOptions(false)
									else
										setshowTreesOptionssOptions(true)

								}}>
									<Text style={styles.startText}>Choose Tree!</Text>
								</Button>

								{showTreesOptionssOptions && (
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
									if (showTimeOptions)
										setshowTimeOptions(false)
									else
										setshowTimeOptions(true)
								}}>
									<Text style={styles.startText}>Choose Time</Text>
								</Button>
								{showTimeOptions && (
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

						{/* if the tree is being planted, only display the timer */}
						<View
							style={{ alignSelf: 'center', marginTop: 20 }}>
							<CountdownCircleTimer
								size={250}
								isPlaying={isPlaying}
								duration={parseInt(duration)}
								colors={['#004777', '#F7B801', '#A30000', '#A30000']}
								onComplete={
									() => {
										completedPlant(parseInt(duration), choiceTree)
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
										onPress: () => {
											setModalVisible(true)
											setSuccesful(false)
										},
										style: 'cancel',
									},
									{
										text: 'Confirm',
										onPress: () => {
											// console.log('OK Pressed')
											setIsPlaying(false)
											setWasStopped(true)
										}
									},
								])
							}}>
								<Text style={styles.startText}>Stop</Text>
							</Button>
						)}
					</ScrollView>
				}
				{/* modal for when a tree is succesfully planted */}
				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						setModalVisible(!modalVisible);
					}}>
					<View style={styles.centeredView}>
						{/* the tree is succesfully planted */}
						{succesful && (<View style={styles.modalView}>
							<Text style={styles.modalText}>Congratulations! You planted a tree</Text>
							<ImageBackground
								source={getTreePicture(choiceTree, -1, -1)}
								style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}
								resizeMode="stretch">
							</ImageBackground>
							<Text style={styles.modalText}>You earned {duration} coins</Text>
							<Pressable
								style={[styles.button, styles.buttonClose]}
								onPress={() => {
									setChoiceTree("treeModel1Green")
									setSuccesful(false)
									setModalVisible(!modalVisible)
								}}>
								<Text style={styles.textStyle}>Dismiss</Text>
							</Pressable>
						</View>)}
						{/* the tree dies */}
						{!succesful && (<View style={styles.modalView}>
							<Text style={styles.modalText}>Your tree died!</Text>
							<ImageBackground
								source={images.treeModel1Dead}
								style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}
								resizeMode="stretch">
							</ImageBackground>
							<Pressable
								style={[styles.button, styles.buttonClose]}
								onPress={() => {
									setSuccesful(false)
									setChoiceTree("treeModel1Green")
									setModalVisible(!modalVisible)
								}}>
								<Text style={styles.textStyle}>Dismiss</Text>
							</Pressable>
						</View>)}
					</View>
				</Modal>
				{/* modal for displaying a congratulations message for achieving an award */}
				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisibleAchievement}
					onRequestClose={() => {
						setModalVisible(!modalVisibleAchievement);
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

