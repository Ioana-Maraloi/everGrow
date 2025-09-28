import { View, Text, Modal, Pressable } from "react-native"
import { Button, TextInput, List, Surface, IconButton } from "react-native-paper"
import styles from '../../utils/styles'
import { Colors } from '../../utils/colors'

import { FIREBASE_APP } from "../../../firebaseConfig"
import { collection, doc, getFirestore,updateDoc, increment, setDoc, getDocs, query, onSnapshot, deleteDoc, getDoc } from 'firebase/firestore'
import { AuthContext } from "../../utils/authContext"
import React, {useContext, useState, useEffect } from 'react'
import { ScrollView } from "react-native-gesture-handler"
import { MaterialIcons } from "@expo/vector-icons"
import { ImageBackground } from "expo-image"
import images from "../../utils/images"

interface Friend{
    username: string,
    streak: number,
    xp: number
}
 function getBadgePicture(label: string) {
    if (label === "makingFriends") {
        return images.makingFriends
    }
    if (label === "socialButterfly") {
        return images.socialButterfly
    }
    if (label === "tree-mendousFriends") {
        return images.treeMendousFriends
    }
}
function formatCamelCase(str: string): string {
  const withoutPrefix = str.slice(1)
  const spaced = withoutPrefix.replace(/([A-Z])/g, ' $1').trim()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase()
}
export default function Friends() {
    const db = getFirestore(FIREBASE_APP)
    const authState = useContext(AuthContext)

    const [friends, setFriends] = useState<Friend[]>([])
    const [addFriend, setAddFriend] = useState(false)
    const [friendUsername, setFriendUsername] = useState("")

    // send requests    
    const [friendReqestsSend, setFriendRequestsSend] = useState<Friend[]>([])
    const [expandedSend, setExpandedSend] = useState(false)
    const handlePressSend = () => setExpandedSend(!expandedSend)
    // received requests
    const [friendReqestsReceived, setFriendRequestsRecived] = useState<Friend[]>([])
    const [expandedReceived, setExpandedReceived] = useState(false)
    const handlePressReceived = () => setExpandedReceived(!expandedReceived)
    

    const [modalVisible, setModalVisible] = useState(false)
    const [displayBadge, setDisplayBadge] = useState("ImakingFriends")
    
    const { theme } = useContext(AuthContext)
    const currentTheme = (theme === "default" ? "light" : theme) as "light" | "dark"
        
    
    const addingFriend = async (username:string) => {
        try {
            const friendDoc = doc(db, "users", username)
            const friendDocSnap = await getDoc(friendDoc)
            if (friendDocSnap.exists()) {
                const myFriendRef = doc(db, "users", authState.displayName, "friends", "friendRequestsSend", "requestsSend", username)
                const friend = {
                    username: username
                }
                await setDoc(myFriendRef, friend)
                const myRef = doc(db, "users", username, "friends", "friendRequestsReceived", "requestsReceived", authState.displayName)
                const me = {
                    username: authState.displayName
                }
                await setDoc(myRef, me)
            } else {
                alert("no such user")
            }
        } catch (error) {
            console.log(error)
        }
    }
    
        const addXp = async (xp: number) => {
            try {
                authState.xp += xp
                const userRef = doc(db, "users", authState.displayName)
                await updateDoc(userRef,
                    {
                    xp:increment(xp)
                })
            
            } catch (error) {
                console.log(error)
            }
        }
        
    const getFriendList = async () => {
        try {
            const friendList = await getDocs(collection(db, "users", authState.displayName, "friends", "actualFriends", "friendList"))
            if (friendList.empty) {
                return
            } else {
                const items: Friend[] = friendList.docs.map(doc => {
                    const data = doc.data()
                    return {
                        username: data.username,                        
                    } as Friend
                })
                setFriends(items)
                if (friends.length === 1) {
                    const badgeFriendDoc = doc(db, "users", authState.displayName, "achievements", "notDone", 'notDoneList', "ImakingFriends")
                    const badgeMakingFriendsSnap = await getDoc(badgeFriendDoc)
                    if (badgeMakingFriendsSnap.exists()) {
                        setModalVisible(true)
                        addXp(20)
                        setDisplayBadge("ImakingFriends")
                        await deleteDoc(badgeFriendDoc)

                        const badgeFriendDone = doc(db, "users", authState.displayName, "achievements", "done", 'doneList', "ImakingFriends")
                        const badgeFriendInfo = {
                			name: "ImakingFriends",
			                description: "Add your first friend",
			                xp: 20,
                        }
                        await setDoc(badgeFriendDone, badgeFriendInfo)
                    }
                }
                if (friends.length === 5) {
                    const badgeFriendDoc = doc(db, "users", authState.displayName, "achievements", "notDone", 'notDoneList', "JsocialButterfly")
                    const badgeMakingFriendsSnap = await getDoc(badgeFriendDoc)
                    if (badgeMakingFriendsSnap.exists()) {
                        setModalVisible(true)
                        addXp(50)
                        setDisplayBadge("JsocialButterfly")
                        await deleteDoc(badgeFriendDoc)

                        const badgeFriendDone = doc(db, "users", authState.displayName, "achievements", "done", 'doneList', "JsocialButterfly")
                        const badgeFriendInfo = {
                			name: "JsocialButterfly",
			                description: "Add 5 friends",
			                xp: 50,
                        }
                        await setDoc(badgeFriendDone, badgeFriendInfo)
                    }
                }
                if (friends.length === 10) {
                    const badgeFriendDoc = doc(db, "users", authState.displayName, "achievements", "notDone", 'notDoneList', "Ktree-mendousFriends")
                    const badgeMakingFriendsSnap = await getDoc(badgeFriendDoc)
                    if (badgeMakingFriendsSnap.exists()) {
                        setModalVisible(true)
                        addXp(100)
                        setDisplayBadge("Ktree-mendousFriends")
                        await deleteDoc(badgeFriendDoc)

                        const badgeFriendDone = doc(db, "users", authState.displayName, "achievements", "done", 'doneList', "Ktree-mendousFriends")
                        const badgeFriendInfo = {
                			name: "Ktree-mendousFriends",
			                description: "Add 10 friends",
			                xp: 100,
                        }
                        await setDoc(badgeFriendDone, badgeFriendInfo)
                    }
                }
                

            }
        } catch (error) {
            console.log(error)
        }
    }
    const getFriendRequestsSend = async () => {
        try {
            const requestsList = await getDocs(collection(db, "users", authState.displayName, "friends", "friendRequestsSend", "requestsSend"))
            if (!requestsList.empty) {
                const items: Friend[] = requestsList.docs.map(doc => {
                    const data = doc.data()
                    return {
                        username: data.username,                        
                    } as Friend
                })
                setFriendRequestsSend(items)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getFriendRequestsRecived = async () => {
        try {
            const requestsList = await getDocs(collection(db, "users", authState.displayName, "friends", "friendRequestsReceived", "requestsReceived"))
            if (!requestsList.empty) {
                const items: Friend[] = requestsList.docs.map(doc => {
                    const data = doc.data()
                    return {
                        username: data.username,                        
                    } as Friend
                })
                setFriendRequestsRecived(items)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
            try {
                const q = query(collection(db, "users", authState.displayName, "friends", "actualFriends", "friendList"))
                const listenFriends = onSnapshot(q, (snapshot) => {
                    getFriendList()
                })
                const qReqSend = query(collection(db, "users", authState.displayName, "friends", "friendRequestsSend", "requestsSend"))
                const listenSend = onSnapshot(qReqSend, (snapshot) => {
                    getFriendRequestsSend()
                })
                const qReqRecived = query(collection(db, "users", authState.displayName, "friends", "friendRequestsReceived", "requestsReceived"))
                const listenReceived = onSnapshot(qReqRecived, (snapshot) => {
                    getFriendRequestsRecived()
                })
                return () => {
                    listenSend()
                    listenFriends()
                    listenReceived()
                }  
            }
            catch (error) {
                console.log(error)
            }
     }, )
    
    const confirmFriendRequest = async (username: string) => {
        try {
            await deleteDoc(doc(db, "users", authState.displayName, "friends", "friendRequestsReceived", "requestsReceived", username))
            await deleteDoc(doc(db, "users", username, "friends", "friendRequestsSend", "requestsSend", authState.displayName))

            const friendDoc = doc(db, "users", username)
            const friendDocSnap = await getDoc(friendDoc)
            if (friendDocSnap.exists()) {
                const myFriendRef = doc(db, "users", authState.displayName, "friends", "actualFriends", "friendList", username)
                const friend = {
                    username: username
                }
                await setDoc(myFriendRef, friend)
                const myRef = doc(db, "users", username, "friends", "actualFriends", "friendList", authState.displayName)
                const me = {
                    username: authState.displayName
                }
                await setDoc(myRef, me)
                setFriendRequestsRecived((prev) => prev.filter((f) => f.username !== username))
            } 
        } catch (error) {
            console.log(error)
        }
    }
    const deleteFriendRequest = async (username: string) => {
        try {
            await deleteDoc(doc(db, "users", authState.displayName, "friends", "friendRequestsReceived", "requestsReceived", username))
            await deleteDoc(doc(db, "users", username, "friends", "friendRequestsSend", "requestsSend", authState.displayName))
            setFriendRequestsRecived((prev) => prev.filter((f) => f.username !== username))

        } catch (error) {
            console.log(error)
        }
    }
    const deleteFriendRequestSent = async (username: string) => {
        try {
            await deleteDoc(doc(db, "users", authState.displayName, "friends", "friendRequestsSend", "requestsSend", username))
            await deleteDoc(doc(db, "users", username, "friends", "friendRequestsReceived", "requestsReceived", authState.displayName))
            setFriendRequestsRecived((prev) => prev.filter((f) => f.username !== username))

        } catch (error) {
            console.log(error)
        }
    }
        return (
            <View  style={[styles.container, {
				backgroundColor: Colors[currentTheme].backgroundColor,
			}]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* prieteniii */}
                     <View>
                        <Text style={styles.text}>Friends:</Text>
                    </View>
                    {
                        friends.length === 0 ?
                            (
                                <View style={{ flex: 1, alignItems: "center" }}>
                                    <Text>No friends yet! Send friend requests to connect</Text>
                                </View>) : (
                                friends?.map((friend, key) => (
                                    <View key={key}>
                                        <Surface style={styles.surfaceCard}>
                                            <View style={styles.cardContent}>
                                                <Text style={styles.cardTitle}>{friend.username}</Text>
                                            </View>
                                        
                                        </Surface>
                                    </View>
                                ))
                            )}

                    <View>
                        <List.Section title="">
                            <List.Accordion title='Sent Requests'
                                expanded={expandedSend}
                                onPress={handlePressSend}>
                                {
                                    friendReqestsSend.length === 0 ?
                                        (
                                            <View style={{ flex: 1, alignItems: "center" }}>
                                                <Text>No requests sent</Text>
                                            </View>) :
                                        (friendReqestsSend?.map((friend, key) => (
                                            <View key={key}>
                                        <Surface style={styles.surfaceCard}>
                                        <View style={styles.cardRow}>
                                            <Text style={styles.cardTitle}>{friend.username}</Text>
                                            <View style={styles.confirmDelete}>
                                            <IconButton
                                                icon={() => (
                                                    <MaterialIcons name="delete" size={32} color="red" />
                                                )}
                                                size={32}
                                                onPress={() => deleteFriendRequestSent(friend.username)} />
                                            </View>
                                        </View>
                                </Surface>
                                </View>
                                )))
                                    }
                            </List.Accordion>
                        </List.Section>
                    </View>

                     <View>
                        <List.Section title="">
                            <List.Accordion title='Received Requests'
                                expanded={expandedReceived}
                                onPress={handlePressReceived}>
                                {friendReqestsReceived.length === 0 ? 
                                    (
                                        <View style={{ flex: 1, alignItems: "center" }}>
                                            <Text>No friend requests received</Text>
                                        </View>) :
                                    (friendReqestsReceived?.map((friend, key) => (
                                    <View key={key}>
                                    <Surface style={styles.surfaceCard}>
                                        <View style={styles.cardRow}>
                                            <Text style={styles.cardTitle}>{friend.username}</Text>
                                            <View style={styles.confirmDelete}>
                                            <IconButton
                                                icon={() => (
                                                    <MaterialIcons name="check-circle-outline" size={32} color="green" />
                                                )}
                                                size={32}
                                                onPress={() => confirmFriendRequest(friend.username)} />
                                            <IconButton
                                                icon={() => (
                                                    <MaterialIcons name="clear" size={32} color="red" />
                                                )}
                                                size={32}
                                                onPress={() => deleteFriendRequest(friend.username)}/>
                                            </View>
                                        </View>
                                </Surface>
                                </View>)))}
                            </List.Accordion>
                        </List.Section>
                    </View>

                    {/* adaug prieteni */}
                    <Button style={[styles.loginButton, {
                        backgroundColor: Colors[currentTheme].addTaskButton
                    }]}
                        icon={() => <MaterialIcons name="person-add" size={24} color={Colors[currentTheme].addTask} />}
                        onPress={() => { setAddFriend(!addFriend) }}>
                        <Text style={{ color: Colors[currentTheme].addTask }}> Add new friend</Text>
                       </Button>
                    {addFriend && (
                        <View>
                            <TextInput style = {styles.input} mode = "outlined" label ="username" onChangeText={setFriendUsername}></TextInput>
                            <Button disabled={!friendUsername} onPress={() => {
                                setAddFriend(false)
                                addingFriend(friendUsername)
                            }}>add</Button>
                        </View>  
                    )}
                </ScrollView>
                {/* <Button onPress={() => {
                    setModalVisible(true)
                }}>
                    <Text>show modal</Text>
                </Button> */}
                
                
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible)
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Achievement unlocked!</Text>
                            <ImageBackground
                                source={getBadgePicture(displayBadge.slice(1))}
                                style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center', marginRight:10 }}
                                resizeMode="stretch">
                            </ImageBackground>  
                            <Text style = {styles.modalText}>{formatCamelCase(displayBadge)}</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Dismiss</Text>
                        </Pressable>
                        </View>
                    </View>
                </Modal>
        </View>
        )
}