import { Button, Surface, TextInput, SegmentedButtons } from 'react-native-paper'
import { FIREBASE_APP } from "../../../firebaseConfig"
import React, { useState, useRef, useContext, useEffect } from 'react'
import { AuthContext } from "../../utils/authContext"
import { View, Text, Modal, Pressable } from 'react-native'
import styles from '../../utils/styles'
import images from "../../utils/images"
import { Colors } from '../../utils/colors'

import { ImageBackground } from "expo-image"
import { collection, doc, getDoc, getFirestore, setDoc, getDocs, Timestamp, query, where, onSnapshot, deleteDoc, updateDoc, increment } from 'firebase/firestore'
import { ScrollView, Swipeable } from "react-native-gesture-handler"
// https://www.youtube.com/watch?v=nZwrxeUHtOQ&ab_channel=MissCoding
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
interface Todo {
    description: string,
    title: string,
    completed: boolean,
    deadline: Timestamp,
    createdAt: string,
    priority: string
}

function getBadgePicture(label: string) {
    if (label === "taskStreak3") {
        return images.taskStreak3
    }
    if (label === "taskStreak5") {
        return images.taskStreak5
    }
}
function getXp(label: string) {
    if (label === "taskStreak3") {
        return 20
    }
    if (label === "taskStreak5") {
        return 50
    }
    return 0
}
export default function TodoScreen() {

    const dateToday = new Date().getDate()
    const monthToday = new Date().getMonth() + 1
    const yearToday = new Date().getFullYear()

    const today = new Date(yearToday, monthToday, dateToday)
    const todayString = dateToday.toString().padStart(2, "0") + "-" + monthToday.toString().padStart(2, "0") + "-" + yearToday.toString().padStart(2, "0")

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const authState = useContext(AuthContext)
    const [deadline, setDeadline] = useState(new Date())
    const [show, setShow] = useState(false)
    const username = authState.email?.split('@')[0]
    const [priority, setPriority] = useState("")
    const [displayAddButtons, setDisplayAddButtons] = useState(false)
    const [todos, setTodos] = useState<Todo[]>([])



    const { theme } = useContext(AuthContext);
    const currentTheme = (theme === "default" ? "light" : theme) as "light" | "dark";


    const [modalVisible, setModalVisible] = useState(false);
    const [displayBadge, setDisplayBadge] = useState("ImakingFriends")


    const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({})

    const onChange = (event: any, selectedDate: any) => {
        setDeadline(selectedDate)
        setShow(false)
    }

    const db = getFirestore(FIREBASE_APP)

    const addXp = async (xp: number) => {
        try {
            authState.xp += xp
            const userRef = doc(db, "users", authState.displayName)
            await updateDoc(userRef,
                {
                    xp: increment(xp)
                })

        } catch (error) {
            console.log(error)
        }
    }

    const addTodo = async () => {
        try {

            const statsRef = doc(db, 'users', username!, 'tasks', 'stats')
            const docSnap = await getDoc(statsRef)
            // if there is no document at the location
            // exists = false
            if (docSnap.exists()) {
                let lastCheckin = docSnap.data().lastCheckin
                let streakVal = docSnap.data().streak

                const [lastCheckinDay, lastCheckinMonth, lastCheckinYear] = lastCheckin.split("-").map(Number);
                let today = new Date()
                let todayDay = today.getDate()
                let todayMonth = today.getMonth() + 1
                let todayYear = today.getFullYear()

                if (todayYear === lastCheckinYear) {
                    if (todayMonth === lastCheckinMonth) {
                        if (todayDay === lastCheckinDay + 1) {
                            streakVal++
                        } else {
                            streakVal = 0
                        }
                    } else if (todayMonth === lastCheckinMonth + 1) {
                        if (todayDay === 1) {
                            if (lastCheckinDay === 31) {
                                if (lastCheckinMonth === 1 || lastCheckinMonth === 3 || lastCheckinMonth === 5 || lastCheckinMonth === 7 || lastCheckinMonth === 8 || lastCheckinMonth === 10) {
                                    streakVal++
                                } else {
                                    streakVal = 0
                                }
                            }
                            else if (lastCheckinDay === 30) {
                                if (lastCheckinMonth === 4 || lastCheckinMonth === 6 || lastCheckinMonth === 9 || lastCheckinMonth === 11) {
                                    streakVal++
                                } else {
                                    streakVal = 0
                                }

                            } else if (lastCheckinDay === 28) {
                                if (lastCheckinMonth === 2) {
                                    streakVal++
                                } else {
                                    streakVal = 0
                                }

                            } else if (lastCheckinDay === 29) {

                            } else {
                                streakVal = 0
                            }
                        } else {
                            streakVal = 0
                        }
                    }
                } else if (todayYear === lastCheckinYear + 1) {
                    if (todayDay === 1 && lastCheckinDay === 31) {
                        streakVal++
                    } else {
                        streakVal = 0
                    }
                } else {
                    streakVal = 0
                }
                await updateDoc(statsRef, {
                    tasksBeingDone: increment(1),
                    streak: streakVal,
                    lastCheckin: todayString,
                })
            } else {
                const stats = {
                    tasksCompleted: 0,
                    tasksDeleted: 0,
                    tasksBeingDone: 1,
                    lastCheckin: todayString,
                }
                await setDoc(statsRef, stats, { merge: true })
            }

            const docData = {
                description: description,
                completed: false,
                createdAt: todayString,
                deadline: Timestamp.fromDate(deadline),
                title: title,
                priority: priority
            }

            const todoCollectionRef = doc(db, 'users', username!, 'tasks', 'stats', todayString, title)
            await setDoc(todoCollectionRef, docData)

            const todayStatsRef = doc(db, 'users', username!, 'tasks', 'stats', todayString, "statsToday")
            const todayStatsSnap = await getDoc(todayStatsRef)
            if (todayStatsSnap.exists()) {
                await updateDoc(todayStatsRef, {
                    tasksBeingDone: increment(1),
                })
            } else {
                const todayStats = {
                    tasksCompleted: 0,
                    tasksBeingDone: 1,
                    tasksDeleted: 0,
                    completed: true
                }
                await setDoc(todayStatsRef, todayStats)
            }
            alert("task added succesfully")
        }
        catch (error: any) {
            alert(error)

        }
    }
    const fetchTodos = async () => {
        try {
            const q = query(
                collection(db, "users", authState.displayName, "tasks", "stats", todayString),
                where("completed", "==", false)
            )
            const todosSnapshot = await getDocs(q)

            const items: Todo[] = todosSnapshot.docs.map(doc => ({
                ...doc.data()
            })) as Todo[]
            setTodos(items)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        try {
            const q = query(collection(db, "users", authState.displayName, "tasks", "stats", todayString), where("completed", "==", false));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        fetchTodos()
                    }
                    if (change.type === "modified") {
                        fetchTodos()
                    }
                    if (change.type === "removed") {
                        fetchTodos()
                    }
                })
            })
            // fetchTodos()
            return () => {
                unsubscribe()
            }
        }
        catch (error) {
            console.log(error)
        }
    })
    const handleDeleteAction = async (name: string) => {
        try {
            await deleteDoc(doc(db, "users", authState.displayName, "tasks", "stats", todayString, name))
            const statsRef = doc(db, 'users', username!, 'tasks', 'stats')

            await updateDoc(statsRef, {
                tasksDeleted: increment(1),
                tasksBeingDone: increment(-1)
            })
            const todayStatsRef = doc(db, 'users', username!, 'tasks', 'stats', todayString, "statsToday")
            await updateDoc(todayStatsRef, {
                tasksBeingDone: increment(-1),
            })
        } catch (error: any) {
            console.log(error)
        }
    }
    const handleCompleteAction = async (name: string) => {
        try {
            await deleteDoc(doc(db, "users", authState.displayName, "tasks", "stats", todayString, name))
            const statsRef = doc(db, 'users', username!, 'tasks', 'stats')

            await updateDoc(statsRef, {
                tasksCompleted: increment(1),
                tasksBeingDone: increment(-1)
            })
            const todayStatsRef = doc(db, 'users', username!, 'tasks', 'stats', todayString, "statsToday")
            await updateDoc(todayStatsRef, {
                tasksCompleted: increment(1),
                tasksBeingDone: increment(-1),
            })
            const todayStatsSnap = await getDoc(todayStatsRef)
            if (!todayStatsSnap.exists()) {
                return
            }
            const numberTasksToday = todayStatsSnap.data().tasksCompleted
            if (numberTasksToday === 3) {
                setModalVisible(true)
                setDisplayBadge("taskStreak3")
            }
            if (numberTasksToday === 5) {
                setModalVisible(true)
                setDisplayBadge("taskStreak5")
            }
        } catch (error: any) {
            console.log(error)
        }

    }
    const renderRightActions = () => {
        return <View style={styles.swipeActionRight}>
            <MaterialCommunityIcons name="check-circle-outline"
                size={32}
                color={"#fff"}>
            </MaterialCommunityIcons>
        </View>

    }
    const renderLeftActions = () => {
        return <View style={styles.swipeActionLeft}>
            <MaterialCommunityIcons name="trash-can-outline"
                size={32}
                color={"#fff"}>
            </MaterialCommunityIcons>
        </View>
    }
    return (
        <SafeAreaProvider>
            <SafeAreaView style={[styles.container, {
                backgroundColor: Colors[currentTheme].backgroundColor,
            }]}>
                {!displayAddButtons && (<Button
                    style={[styles.loginButton, {
                        backgroundColor: Colors[currentTheme].addTaskButton
                    }]}
                        icon={() => <MaterialCommunityIcons name="note-edit-outline" size={24} color={Colors[currentTheme].addTask} />}
                    onPress={() => {
                        if (displayAddButtons)
                            setDisplayAddButtons(false)
                        else
                            setDisplayAddButtons(true)
                    }}>
                    <Text style={{ color: Colors[currentTheme].addTask }}>Add Task for Today!</Text>
                </Button>)}
                {displayAddButtons && (<Button
                    style={[styles.loginButton, {
                        backgroundColor: Colors[currentTheme].addTaskButton
                    }]}
                        icon={() => <MaterialCommunityIcons name="order-bool-descending-variant" size={24} color={Colors[currentTheme].addTask} />}
                    onPress={() => {
                        if (displayAddButtons)
                            setDisplayAddButtons(false)
                        else
                            setDisplayAddButtons(true)
                    }}>
                    <Text style={{ color: Colors[currentTheme].addTask }}>See today&apos;s tasks</Text>
                </Button>)}
                {displayAddButtons && (
                    <View style={[styles.container, { alignItems: "center" }]}>
                        <TextInput
                            style={[styles.input,
                                { backgroundColor: Colors[currentTheme].inputBackgroundColor }]}
                            mode="flat"
                            label="title"
                            onChangeText={setTitle} />
                        <TextInput
                            style={[styles.input,
                                { backgroundColor: Colors[currentTheme].inputBackgroundColor }]}
                            mode="flat"
                            label="description"
                            onChangeText={setDescription} />

                        <SegmentedButtons style={{
                            alignContent: "center",
                            width: "80%",
                            alignSelf: "center",
                            height: 50,
                        }}
                            value={priority}
                            onValueChange={setPriority}
                            buttons={[
                                {
                                    value: "Low",
                                    label: "Low"
                                },

                                {
                                    value: "Medium",
                                    label: "Medium",
                                },
                                {
                                    value: "High",
                                    label: "High"
                                },]}>
                        </SegmentedButtons>
                        <Button style={[styles.loginButton, {
                        backgroundColor: Colors[currentTheme].addTaskButton
                    }]} onPress={() => { setShow(true) }}>
                            <Text style={[styles.startText, {
                                color: Colors[currentTheme].addTask
                            }]}>Add Deadline</Text>
                        </Button>
                        {show && (
                            <DateTimePicker minimumDate={today}
                                style={{ alignSelf: "center" }}
                                value={deadline} mode="date"
                                onChange={onChange}
                            />
                        )}
                        <Button onPress={addTodo} style={[styles.loginButton, {
                        backgroundColor: Colors[currentTheme].addTaskButton
                        }]}
                            mode="contained" disabled={!title || !description || !deadline}>
                            <Text
                                 style={[styles.startText, {
                                color: Colors[currentTheme].addTask
                            }]}>Add Task</Text>
                        </Button>
                    </View>
                )}

                {!displayAddButtons && (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {todos.length === 0 ? (
                            <Text style={styles.text}>No todos</Text>
                        ) : (
                            todos?.map((todo, key) => (
                                <Swipeable
                                    ref={(ref) => {
                                        swipeableRefs.current[todo.title] = ref
                                    }}
                                    key={key}
                                    overshootLeft={false}
                                    overshootRight={false}
                                    renderLeftActions={renderLeftActions}
                                    renderRightActions={renderRightActions}
                                    onSwipeableOpen={(direction) => {
                                        if (direction === "left") {
                                            handleDeleteAction(todo.title)
                                        }
                                        if (direction === "right")
                                            handleCompleteAction(todo.title)
                                        swipeableRefs.current[todo.title]?.close()
                                    }}>

                                    <Surface style={styles.card}>
                                        <View style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: 4,
                                        }}>
                                            <Text style={styles.cardTitle}>{todo.title}</Text>
                                            <View style={{ alignItems: "center", marginBottom: 4, flexDirection: "row" }}>
                                                <MaterialCommunityIcons name="calendar-clock"
                                                    size={20}
                                                    color={"#000000ff"}>
                                                </MaterialCommunityIcons>
                                                <Text style={styles.cardDeadline}>{todo.deadline.toDate().toLocaleDateString("en-GB")}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.cardDescription}>{todo.description}</Text>
                                    </Surface>
                                </Swipeable>
                            )))}
                    </ScrollView>
                )}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Achievement unlocked!</Text>
                            <ImageBackground
                                source={getBadgePicture(displayBadge)}
                                style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}
                                resizeMode="stretch">
                            </ImageBackground>
                            <Text style={styles.modalText}>You earned {getXp(displayBadge)} xp!</Text>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={
                                    () => {
                                        addXp(getXp(displayBadge))
                                        setModalVisible(!modalVisible)
                                    }
                                }
                            >
                                <Text style={styles.textStyle}>Dismiss</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}