import { View, Text } from "react-native"
import { Button, TextInput, List, Surface, IconButton } from "react-native-paper"
import styles from '../utils/styles'
import { FIREBASE_APP } from "../../firebaseConfig"
import { collection, doc, getFirestore, setDoc, getDocs, query, where, onSnapshot, deleteDoc, getDoc, addDoc } from 'firebase/firestore'
import { AuthContext } from "../utils/authContext"
import React, {useContext, useState, useEffect } from 'react'
import { ScrollView } from "react-native-gesture-handler"
import { MaterialIcons } from "@expo/vector-icons"

interface Friend{
    username: string,
    streak: number,
    xp: number
 }
export default function Friends() {
    const db = getFirestore(FIREBASE_APP)
    const authState = useContext(AuthContext)

    const [friends, setFriends] = useState<Friend[]>([])
    const [addFriend, setAddFriend] = useState(false)
    const [friendUsername, setFriendUsername] = useState("")

    // send requests    
    const [friendReqestsSend, setFriendRequestsSend] = useState<Friend[]>([])
    const [expandedSend, setExpandedSend] = useState(false);
    const handlePressSend = () => setExpandedSend(!expandedSend);
    // received requests
    const [friendReqestsReceived, setFriendRequestsRecived] = useState<Friend[]>([])
    const [expandedReceived, setExpandedReceived] = useState(false);
    const handlePressReceived = () => setExpandedReceived(!expandedReceived);
    
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
    const getFriendList = async () => {
        try {
            const friendList = await getDocs(collection(db, "users", authState.displayName, "friends", "actualFriends", "friendList"))
            if (friendList.empty) {

            } else {
                console.log("PRIETENI",friendList.docs)
                const items: Friend[] = friendList.docs.map(doc => {
                    const data = doc.data()
                    return {
                        username: data.username,                        
                    } as Friend
                })
                setFriends(items)
                console.log("LISTA",friends)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getFriendRequestsSend = async () => {
        try {
            const requestsList = await getDocs(collection(db, "users", authState.displayName, "friends", "friendRequestsSend", "requestsSend"))
            if (requestsList.empty) {
                console.log("FARA CERERI")

            } else {
                const items: Friend[] = requestsList.docs.map(doc => {
                    const data = doc.data()
                    return {
                        username: data.username,                        
                    } as Friend
                })
                setFriendRequestsSend(items)
                console.log("LISTAREQ",friendReqestsSend)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getFriendRequestsRecived = async () => {
        try {
            const requestsList = await getDocs(collection(db, "users", authState.displayName, "friends", "friendRequestsReceived", "requestsReceived"))
            if (requestsList.empty) {
                console.log("FARA CERERI PRIMITE")

            } else {
                const items: Friend[] = requestsList.docs.map(doc => {
                    const data = doc.data()
                    return {
                        username: data.username,                        
                    } as Friend
                })
                setFriendRequestsRecived(items)
                console.log("LISTAREQ",friendReqestsReceived)
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
     }, [authState])
    
    const confirmFriendRequest = async (username: string) => {
        try {
            console.log("dece nu merge")
            await deleteDoc(doc(db, "users", authState.displayName, "friends", "friendRequestsReceived", "requestsReceived", username))
            await deleteDoc(doc(db, "users", username, "friends", "friendRequestsSend", "requestsSend", authState.displayName))
            console.log("friend ???")

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
                console.log("friend confirmed")
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

            console.log("request deleted")
                setFriendRequestsRecived((prev) => prev.filter((f) => f.username !== username))

        } catch (error) {
            console.log(error)
        }
    }
        const deleteFriendRequestSent = async (username: string) => {
        try {
            await deleteDoc(doc(db, "users", authState.displayName, "friends", "friendRequestsSend", "requestsSend", username))
            await deleteDoc(doc(db, "users", username, "friends", "friendRequestsReceived", "requestsReceived", authState.displayName))

            console.log("request deleted")
                setFriendRequestsRecived((prev) => prev.filter((f) => f.username !== username))

        } catch (error) {
            console.log(error)
        }
    }
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* prieteniii */}
                     <View>
                        <Text style={styles.text}>Friends:</Text>
                    </View>
                    {
                        friends.length === 0 ?
                            (<Text>No friends yet! Send friend requests to connect</Text>) : (
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
                                        (<Text>No requests sent</Text>) :
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
                                (<Text>No friend requests received</Text>):
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
                    <Button onPress={() => { setAddFriend(!addFriend)}}>Add new friend</Button>
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
                    
            </View>

        )
    
}