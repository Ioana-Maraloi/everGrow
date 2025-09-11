import { View, Text, FlatList } from "react-native"
import { Surface } from "react-native-paper"
import styles from '../../utils/styles'
import images from "../../utils/images"

import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthContext } from "../../utils/authContext" 
import React, { useState, useContext, useEffect } from "react"
import { ImageBackground } from "expo-image"

import { FIREBASE_APP } from "../../../firebaseConfig"
import {collection, getFirestore, getDocs, query, onSnapshot} from 'firebase/firestore'
// https://www.flaticon.com/packs/awards-129?k=1757068106473&log-in=google

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
    // friends
    if (label === "makingFriends") {
        return images.makingFriends
    }
    if (label === "socialButterfly") {
        return images.socialButterfly
    }
    if (label === "tree-mendousFriends") {
        return images.treeMendousFriends
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
}

interface Achievement{
    name: string,
    description: string
}
function formatCamelCase(str: string): string {
  const withoutPrefix = str.slice(1);
  const spaced = withoutPrefix.replace(/([A-Z])/g, ' $1').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}
export default function Achievements() {

    const db = getFirestore(FIREBASE_APP)
    const authState = useContext(AuthContext)
    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [achievementsCompleted, setAchievementsCompleted] = useState<Achievement[]>([])
    
    const getAchievements = async () => {
        try {
            const achievementsList = await getDocs(collection(db, "users", authState.displayName, "achievements", "notDone", 'notDoneList'))
            if (!achievementsList.empty) {
                const items: Achievement[] = achievementsList.docs.map(doc => {
                    const data = doc.data()
                    return {
                        name: data.name,
                        description: data.description
                    }as Achievement
                })
                setAchievements(items)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getAchievementsCompleted = async () => {
        try {
            const achievementsDoneList = await getDocs(collection(db, "users", authState.displayName, "achievements", "done", 'doneList'))
            if (!achievementsDoneList.empty) {
                const items: Achievement[] = achievementsDoneList.docs.map(doc => {
                    const data = doc.data()
                    return {
                        name: data.name,
                        description: data.description
                    }as Achievement
                })
                setAchievementsCompleted(items)
                console.log(achievementsCompleted)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        try {
            const q = query(collection(db, "users", authState.displayName, "achievements", "notDone", "notDoneList"))
            const listenAchievements = onSnapshot(q, (snapshot) => {
                getAchievements()
            })
            const qCompleted = query(collection(db, "users", authState.displayName, "achievements", "done", "doneList"))
            const listenAchievementsCompleted = onSnapshot(qCompleted, (snapshot) => {
                getAchievementsCompleted()
            })
            return () => {
                listenAchievements()
                listenAchievementsCompleted()
            }  
        }
        catch (error) {
            console.log(error)
        }
    })
    return (
        <SafeAreaProvider >
            <SafeAreaView style={styles.container}>
                <Text style = {styles.text}>Complete achievements to earn xp!</Text>
                {achievements.length === 0 ?
                    (<View><Text>No more achievments to complete! Congratulations</Text></View>): 
                    (<FlatList
                        data = {achievements}
                        renderItem={({ item }) => 
                            <Surface style={styles.card}>
                            <View style={styles.cardRowAchievements}>
                                    <ImageBackground
                                    source={getBadgePicture(item.name.slice(1))}
                                    style={{ width: 70, height: 70, justifyContent: 'center', alignItems: 'center', marginRight:10 }}
                                    resizeMode="stretch">
                                    </ImageBackground>  
                                    <View style={styles.cardTextAchievements}>
                                <Text style = {styles.cardTitleAchievements}>{formatCamelCase(item.name)}</Text>
                                        <Text style ={styles.cardDescriptionAchievements} >{item.description}</Text>
                                        </View>
                                </View>
                        </Surface>

                        }>
                    </FlatList>)
                }

                {achievementsCompleted.length === 0 ?
                    (<View><Text>No achievments Completed</Text></View>): 
                    (<FlatList
                        data = {achievementsCompleted}
                        renderItem={({ item }) => 
                            <Surface style={styles.card}>
                            <View style={styles.cardRowAchievements}>
                                <ImageBackground
                                    source={getBadgePicture(item.name.slice(1))}
                                    style={{ width: 70, height: 70, justifyContent: 'center', alignItems: 'center', marginRight:10 }}
                                    resizeMode="stretch">
                                </ImageBackground>  
                                <View style={styles.cardTextAchievements}>
                                    <Text style = {styles.cardTitleAchievements}>{formatCamelCase(item.name)}</Text>
                                    <Text style ={styles.cardDescriptionAchievements} >{item.description}</Text>
                                </View>
                            </View>
                        </Surface>
                        }>
                    </FlatList>)
                }


            </SafeAreaView>
        </SafeAreaProvider>
    )
}