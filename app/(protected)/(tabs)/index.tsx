import { Button, Surface, TextInput, SegmentedButtons } from 'react-native-paper'
import { FIREBASE_APP } from "../../../firebaseConfig"
import React, { useState,useRef, useContext, useEffect } from 'react'
import { AuthContext } from "../../utils/authContext"
import { View, Text } from 'react-native'
import styles from '../../utils/styles'
import { collection, doc, getFirestore, setDoc, getDocs, Timestamp, query, where, onSnapshot, deleteDoc } from 'firebase/firestore'
import { ScrollView, Swipeable } from "react-native-gesture-handler"
// https://www.youtube.com/watch?v=nZwrxeUHtOQ&ab_channel=MissCoding
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
interface Todo {
  description: string;
    title: string;
    completed: boolean;
    deadline: Timestamp,
    createdAt: Timestamp,
    priority:string
}
export default function TodoScreen() {

    const dateToday = new Date().getDate()
    const monthToday = new Date().getMonth()
    const yearToday = new Date().getFullYear()

    const today = new Date(yearToday, monthToday, dateToday)

    
    const [todo, setTodo] = useState('')
    const [description, setDescription] = useState('')
    const authState = useContext(AuthContext)
    const [deadline, setDeadline] = useState(new Date())
    const [show, setShow] = useState(false)
    const username = authState.email?.split('@')[0]
    const [priority, setPriority] = useState("")
    const [displayAddButtons, setDisplayAddButtons] = useState(false)
    const [todos, setTodos] = useState<Todo[]>([])
    

    const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({})

    const onChange = (event: any, selectedDate: any) => {
        setDeadline(selectedDate)
        setShow(false)
    }

    const db = getFirestore(FIREBASE_APP)

    const addTodo = async () => {
        try {
            console.log("Adding todo:", todo, description, deadline)
        
            const docData = {
                description: description,
                completed: false,
                createdAt: new Date().toISOString(),
                deadline: deadline.toISOString(),
                title: todo,
                priority:priority
            }
            const todoCollectionRef = doc(db, 'users', username!, 'todos', todo)
            await setDoc(todoCollectionRef, docData)
            alert("task added succesfully")
        }
        catch (error: any) {
            alert(error)

        }
    }
    const fetchTodos = async () => {
        try {
            const todos = await getDocs(collection(db, "users", authState.displayName, "todos"))
            const items: Todo[] = todos.docs.map(doc => ({
                ...doc.data()
            })) as Todo[]
            setTodos(items)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        try {
            const q = query(collection(db, "users", authState.displayName, "todos"), where("completed", "==", false));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        console.log("NEW ADD:", change.doc.data())
                        fetchTodos()
                    }
                    if (change.type === "modified") {
                        console.log("NEW modify:", change.doc.data())
                        fetchTodos()
                    }
                    if (change.type === "removed") {
                        console.log("NEW remove:", change.doc.data())
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
    }, [authState])
    const handleDeleteAction = async (name:string) => {
        try {
            await deleteDoc(doc(db, "users", authState.displayName, "todos", name))
        } catch (error: any) {
            console.log(error)
        }
        
    }
    const handleCompleteAction = async (name:string) => {
        try {
            await deleteDoc(doc(db, "users", authState.displayName, "todos", name))
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
        const renderLeftActions= () => {
            return <View style={ styles.swipeActionLeft }>
            <MaterialCommunityIcons name="trash-can-outline"
                size={32}
            color={"#fff"}>
            </MaterialCommunityIcons>
        </View>
    }
    return (
        <SafeAreaProvider >
        <SafeAreaView style={styles.container}>
            {!displayAddButtons && (<Button onPress={() => {
                    if (displayAddButtons)
                        setDisplayAddButtons(false)
                    else
                        setDisplayAddButtons(true)
                    }}>
                    <Text>Add Task for Today!</Text>
                </Button>)}
                {displayAddButtons && (<Button onPress={() => {
                    if (displayAddButtons)
                        setDisplayAddButtons(false)
                    else
                        setDisplayAddButtons(true)
                    }}>
                    <Text>See today&apos;s tasks</Text>
                </Button>)}
            {displayAddButtons && (
                <View style={[styles.container, { alignItems: "center" }]}>
                <TextInput style={styles.input} mode="outlined" label = "title" onChangeText={setTodo}/>
                <TextInput style={styles.input} mode="outlined" label="description" onChangeText={setDescription} />
                {/* <Text>hello {authState.email}</Text> */}
                
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
                                    label:"Low"
                                },
                                
                                {
                                    value: "Medium",
                                    label:"Medium",
                                },
                                {
                                    value: "High",
                                    label: "High"
                                },]}>
                        </SegmentedButtons>
                        <Button style={styles.loginButton} onPress={() => { setShow(true) }}>
                    <Text style={styles.startText}>Add Deadline</Text>
                </Button>
                {show && (
                    <DateTimePicker minimumDate={today}
                        style={{ alignSelf: "center" }}
                        value={deadline} mode="date"
                        onChange={onChange}
                    />
                )} 
                <Button onPress={addTodo} style={styles.loginButton} mode = "contained" disabled={!todo || !description || !deadline}>
                <Text style={styles.startText}>Add Task</Text>
                </Button>
                </View>
                 )}
 
                {!displayAddButtons && (
                <ScrollView showsVerticalScrollIndicator={false}>        
                {todos.length === 0 ? (
                    <Text>No todos</Text>
                ) : (
                    todos?.map((todo, key) => (
                    <Swipeable
                        ref={(ref) => {
                            swipeableRefs.current[todo.title]=ref
                        }}
                        key={key}
                        overshootLeft={false}
                        overshootRight={false}
                        renderLeftActions={ renderLeftActions}
                        renderRightActions={renderRightActions}
                        onSwipeableOpen={(direction) => {
                            if (direction === "left") {
                                handleDeleteAction(todo.title)
                            }
                            if (direction === "right")
                                handleCompleteAction(todo.title)
                            swipeableRefs.current[todo.title]?.close( )
                            }}>
                        <Surface  style = {styles.surfaceCard}>
                            <View style = {styles.cardContent}>
                            <Text style = {styles.cardTitle}>{todo.title}</Text>
                            <Text style= {styles.cardDescription}>{todo.description}</Text> 
                             {/* <View style={styles.frequencyBadge}>
                                        if (todo.freqency === )
                                        <Text style={styles.frequencyText}>
                        {" "}
                        {habit.frequency.charAt(0).toUpperCase() +
                          habit.frequency.slice(1)}
                      </Text>
                    </View> */}
                                </View>
                        </Surface>
                    </Swipeable>
                )))}
                </ScrollView>
                )} 
            </SafeAreaView>
        </SafeAreaProvider>
  )
}