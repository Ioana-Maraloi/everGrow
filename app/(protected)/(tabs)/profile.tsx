import {Text, Alert, View, Modal, Pressable, TouchableOpacity} from "react-native"
import { Button, Avatar, TextInput } from "react-native-paper"
import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../../utils/authContext"
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context"
import styles from "../../utils/styles"
import images from "../../utils/images"

import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
// import { FIREBASE_APP } from "../../../firebaseConfig"
// import { collection, doc, getFirestore, setDoc, getDocs, query, where, onSnapshot, deleteDoc, getDoc, addDoc } from 'firebase/firestore'
// import { launchImageLibrary } from "react-native-image-picker"
// import { getStorage, ref } from "firebase/storage"
import { FIREBASE_APP } from "../../../firebaseConfig"
import { collection, doc, getDoc, getFirestore, setDoc, getDocs, Timestamp, query, where, onSnapshot, deleteDoc, updateDoc, increment } from 'firebase/firestore'
import { ImageBackground } from "expo-image"


// https://www.freepik.com/serie/133741891
export default function ProfileScreen() {
	// const db = getFirestore(FIREBASE_APP)

	const [visible, setVisible] = useState(false)
	// const containerStyle = {backgroundColor: 'white', padding: 20}

	const authState = useContext(AuthContext)
	const router = useRouter()
	// const [newUsername, setNewUsername] = useState("")

	// const changeUsername = async (username:string) => {
	//     authState.displayName = username

	// }

	const dateToday = new Date().getDate()
	const monthToday = new Date().getMonth() + 1
	const yearToday = new Date().getFullYear()

	// const today = new Date(yearToday, monthToday, dateToday)
	const todayString = dateToday.toString().padStart(2, "0") + "-" + monthToday.toString().padStart(2, "0") + "-" + yearToday.toString().padStart(2, "0")



	const [oneHourFocusDone, setOneHourFocusDone] = useState(false)
	const [threeHourFocusDone, setThreeHourFocusDone] = useState(false)
	const [threeTasksDone, setThreeTasksDone] = useState(false)
	const [fiveTasksDone, setFiveTasksDone] = useState(false)
	const [taskBefore12Done, setTaskBefore12Done] = useState(false)

	const [dailyAchievementModal, setdailyAchievementModal] = useState(false)
	const [pictureDisplayModal, setPictureDisplayModal] = useState("")
	const db = getFirestore(FIREBASE_APP)


	const checkTasks = async () => {
		try {
			const tasksStatsRef = doc(db, "users", authState.displayName, "tasks", "stats", todayString, "statsToday")
			const tasksStatsSnap = await getDoc(tasksStatsRef)
			if (!tasksStatsSnap.exists()) {
				setThreeTasksDone(false)
				setFiveTasksDone(false)
				setTaskBefore12Done(false)
			} else {
				const tasksCompleted = tasksStatsSnap.data().tasksCompleted
				if (tasksCompleted >= 3) {
					setThreeTasksDone(true)
				}
				if (tasksCompleted >= 5) {
					setFiveTasksDone(true)
				}
				const firstCompleted = tasksStatsSnap.data().firstCompleted
				if (firstCompleted <= 12) {
					setTaskBefore12Done(true)
				}
			}

			const treesStatsRef = doc(db, "users", authState.displayName, "trees", "stats", todayString, "statsToday")
			const treesStatsSnap = await getDoc(treesStatsRef)
			if (!treesStatsSnap.exists()) {
				setOneHourFocusDone(false)
				setThreeHourFocusDone(false)
			} else {
				const timeCompleted = treesStatsSnap.data().todayCompleted
				if (timeCompleted >= 60) {
					setOneHourFocusDone(true)
				}
				if (timeCompleted >= 180) {
					setThreeHourFocusDone(true)
				}
			}
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		try {
			const listen1 = onSnapshot(doc(db, "users", authState.displayName, "tasks", "stats", todayString, "statsToday"), (doc) => {
				checkTasks()
			})
			const listen2 = onSnapshot(doc(db, "users", authState.displayName, "trees", "stats", todayString, "statsToday"), (doc) => {
				checkTasks()
			})
			return () => {
				listen1()
				listen2()
			}
			
		} catch (error) {
			console.log(error)
		}
	})
	


	const getOneHourFocusPicture = () => {
		if (oneHourFocusDone === true) {
			return images.oneHourFocus
		}
		return images.oneHourFocusNotDone
	}
	const getThreeHoursFocusPicture = () => {
		if (threeHourFocusDone)
			return images.threeHourFocus
		return images.threeHourFocusNotDone
	}
	const getThreeTasksDonePicture = () => {
		if (threeTasksDone)
			return images.taskStreak3
		return images.taskStreak3NotDone
	}
	const getFiveTasksDonePicture = () => {
		if (fiveTasksDone)
			return images.taskStreak5
		return images.taskStreak5NotDone
	}
	const getTaskBefore12DonePicture = () => {
		if (taskBefore12Done)
			return images.taskBefore12
		return images.taskBefore12NotDone
	}
	const getPictureForModal = (namePicture: string) => {
		if (namePicture === "oneHourFocus")
			return getOneHourFocusPicture()
		if (namePicture === "threeHourFocus")
			return getThreeHoursFocusPicture()
		if (namePicture === "taskStreak3")
			return getThreeTasksDonePicture()
		if (namePicture === "taskStreak5")
			return getFiveTasksDonePicture()
		if (namePicture === "taskBefore12")
			return getTaskBefore12DonePicture()
	}
	const getTextforModal = (namePicture: string) => {
		if (namePicture === "oneHourFocus")
			return "Little Oak"
		if (namePicture === "threeHourFocus")
			return "Deep Roots"
		if (namePicture === "taskStreak3")
			return "Mini Checklist"
		if (namePicture === "taskStreak5")
			return "Task Master"
		if (namePicture === "taskBefore12")
			return "Early Bird"
	}
	const getDescriptionModal = (namePicture: string) => {
		if (namePicture === "oneHourFocus") {
			if (oneHourFocusDone)
				return "You earned this badge"
			return "Focus for one hour to earn this badge"
		}
		if (namePicture === "threeHourFocus") {
			if (oneHourFocusDone)
				return "You earned this badge"
			return "Focus for three hours to earn this badge"
		}
		if (namePicture === "taskStreak3") {
			if (oneHourFocusDone)
				return "You earned this badge"
			return "Complete 3 tasks today to earn this badge"
		}
		if (namePicture === "taskStreak5") {
			if (oneHourFocusDone)
				return "You earned this badge"
			return "Complete 5 tasks today to earn this badge"
		}
		if (namePicture === "taskBefore12") {
			if (taskBefore12Done)
				return "You earned this badge"
			return "Complete a task before 12AM to earn this badge"
		}
	}
	return (
		<SafeAreaProvider>
			<SafeAreaView>
				<View style={styles.header}>
					<View style={styles.headerContent}>
						<TouchableOpacity>
							<Avatar.Image
								size={100}
								source={require("../../../assets/trees/logo.png")}
							/>
						</TouchableOpacity>
						<View style={[styles.cardRow, { marginTop: 5 }]}>
							<Button
								onPress={() => {
									setVisible(true)
									console.log("apas")
								}}
							>
								<Text style={styles.name}>{authState.displayName} </Text>
								<MaterialCommunityIcons
									name="lead-pencil"
									size={20}
									color="black"
								/>
							</Button>
						</View>
						<Text style={styles.userInfo}>{authState.email} </Text>
						<View style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							paddingTop: 10
						}}>

							{/* daily achievements
							60min focus
							180 min focus
							3 tasks
							5 tasks
							one task before 12
							 */}

							<Button onPress={() => {
								setPictureDisplayModal("oneHourFocus")
								setdailyAchievementModal(true)
							}}>
								<ImageBackground
									source={getOneHourFocusPicture()}
									style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}
									resizeMode="stretch"></ImageBackground>
							</Button>
							<Button onPress={() => {
								setPictureDisplayModal("threeHourFocus")
								setdailyAchievementModal(true)
							}}>
								<ImageBackground
									source={getThreeHoursFocusPicture()}
									style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}
									resizeMode="stretch"></ImageBackground>
							</Button>
							<Button onPress={() => {
								setPictureDisplayModal("taskStreak3")
								setdailyAchievementModal(true)
							}}>
								<ImageBackground
									source={getThreeTasksDonePicture()}
									style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}
									resizeMode="stretch"></ImageBackground>
							</Button>
							<Button onPress={() => {
								setPictureDisplayModal("taskStreak5")
								setdailyAchievementModal(true)
							}}>
								<ImageBackground
									source={getFiveTasksDonePicture()}
									style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}
									resizeMode="stretch"></ImageBackground>
							</Button>
							<Button onPress={() => {
								setPictureDisplayModal("taskBefore12")
								setdailyAchievementModal(true)
							}}>
								<ImageBackground
									source={getTaskBefore12DonePicture()}
									style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}
									resizeMode="stretch"></ImageBackground>
							</Button>
						</View>
					</View>
				</View>
				{/* <Modal
		  animationType="slide"
		  transparent={true}
		  visible={visible}
		  onRequestClose={() => {
			setVisible(!visible)
		  }}>
		  <View style={styles.centeredView}>
			<View style={styles.modalView}>
				<Text style={styles.modalText}>Change username:</Text>
				<TextInput style={styles.input} mode="outlined" label = "new username" onChangeText={setNewUsername}></TextInput>             */}

				{/* <Pressable
				style={[styles.button, styles.buttonClose]}
				onPress={() => setVisible(!visible)}>
				<Text style={styles.textStyle}>Confirm</Text> */}

				{/* </Pressable>
			</View>
		  </View>
		</Modal>                */}

				<Modal
					animationType="slide"
					transparent={true}
					visible={dailyAchievementModal}
					onRequestClose={() => {
						setdailyAchievementModal(!dailyAchievementModal);
					}}>
					<View style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
						<View style={{
							width: 250,
							backgroundColor: 'white',
							justifyContent: 'center',
							alignItems: 'center',
							height: 250,
							borderRadius: 10
						}}>

							<ImageBackground
								source={getPictureForModal(pictureDisplayModal)}
								style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}
								resizeMode="stretch">
							</ImageBackground>
							<Text style={styles.modalText}>{getTextforModal(pictureDisplayModal)}</Text>
							<Text style={styles.modalText}>{getDescriptionModal(pictureDisplayModal)}</Text>
							<Pressable
								style={[styles.button, styles.buttonClose]}
								onPress={() => {
									setdailyAchievementModal(!dailyAchievementModal)
								}}>
								<Text style={styles.textStyle}>Dismiss</Text>
							</Pressable>
						</View>
					</View>
				</Modal>


				<Button icon={"logout"} onPress={authState.logOut}>
					<Text>Log out</Text>
				</Button>
				<Button icon={"account-group"}
					onPress={() => {
						router.push("../screens/friends")
					}}
				>
					Friends
				</Button>
				<Button icon={"shopping-outline"}
					onPress={() => {
						router.push("../screens/shop")
					}}
				>
					Shop
				</Button>
				<Button icon={"medal-outline"}
					onPress={() => {
						router.push("../screens/achievements")
					}}
				>
					Achievements
				</Button>
				<Button icon={"table-eye"}
					onPress={() => {
						router.push("../screens/stats")
					}}
				>
					Stats
				</Button>

				<Button onPress={() => {
						router.push("../screens/theme")
					}}>Theme</Button>
				<Button icon={"delete"}
					onPress={function () {
						Alert.alert(
							"Are u sure u want to delete this account?",
							"This cannot be undone",
							[
								{
									text: "Cancel",
									onPress: () => console.log("Cancel Pressed"),
									style: "cancel",
								},
								{
									text: "Confirm",
									onPress: () => {
										console.log("OK Pressed")
										authState.deleteAccount()
									},
								},
							]
						)
					}}
				>
					<Text>Delete Account</Text>
				</Button>
			</SafeAreaView>
		</SafeAreaProvider>
	)
}
