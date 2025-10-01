import { View, Text } from "react-native"
import { Surface } from "react-native-paper"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthContext } from "../../utils/authContext" 
import React, { useState, useContext, useEffect } from "react"
import { ImageBackground } from "expo-image"
import { FIREBASE_APP } from "../../../firebaseConfig"
import {collection, getFirestore, getDocs, query, onSnapshot} from 'firebase/firestore'
import { ScrollView } from "react-native-gesture-handler"

import styles from '../../utils/styles'
import images from "../../utils/images"
import { Colors } from '../../utils/colors'

function getBadgePicture(label: string, done:boolean) {
    // focus
    if (label === "firstSeed") {
        if (done)
            return images.firstSeed
        return images.firstSeedNotDone
    }
    if (label === "growingTree") {
        if (done)
            return images.growingTree
        return images.growingTreeNotDone
    }
    if (label === "deepRoots") {
        if(done)
            return images.deepRoots
        return images.deepRootsNotDone
    }
    if (label === "forestGuardian") {
        if(done)
            return images.forestGuardian
        return images.forestGuardianNotDone
    }
    // hour focus
    if (label === "focusBunny") {
         if(done)
            return images.focusBunny
        return images.focusBunnyNotDone
    }
    if (label === "clockWizzard") {
        if (done)
            return images.clockWizzard
        return images.clockWizzardNotDone
    }
    if (label === "concentrationMaster") {
        if(done)
            return images.concentrationMaster
        return images.concentrationMasterNotDone
    }
    // friends
    if (label === "makingFriends") {
        if(done)
            return images.makingFriends
        return images.makingFriendsNotDone
    }
    if (label === "socialButterfly") {
        if(done)
            return images.socialButterfly
        return images.socialButterflyNotDone
    }
    if (label === "tree-mendousFriends") {
        if(done)
            return images.treeMendousFriends
        return images.treeMendousFriendsNotDone
    }
    // streak
    if (label === "babyStreak") {
        if(done)
            return images.babyStreak
        return images.babyStreakNotDone
    }
    if (label === "discipled") {
        if(done)
            return images.discipled
        return images.discipledNotDone
    }
    if (label === "masterOfHabbit") {
        if (done)
            return images.masterOfHabbit
        return images.masterOfHabbitNotDone
    }
    if (label === "legendaryStreak") {
        if(done)
            return images.legendaryStreak
        return images.legendaryStreakNotDone
    }
}

interface Achievement{
    name: string,
    description: string
}
function formatCamelCase(str: string): string {
  const withoutPrefix = str.slice(1)
  const spaced = withoutPrefix.replace(/([A-Z])/g, ' $1').trim()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase()
}
export default function Achievements() {

    const db = getFirestore(FIREBASE_APP)
    const authState = useContext(AuthContext)
    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [achievementsCompleted, setAchievementsCompleted] = useState<Achievement[]>([])
    
    
    const { theme } = useContext(AuthContext)
    const currentTheme = (theme === "default" ? "light" : theme) as "light" | "dark"
            
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
            <SafeAreaView style={[styles.container, {
				backgroundColor: Colors[currentTheme].backgroundColor,
			}]}>
                <Text  style={[ styles.text, {color:  Colors[currentTheme].colorTitleTab} ]}>Complete achievements to earn xp!</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {achievements.length == 0 ? (
                        <View>
                            <Text  style={[ styles.text, {color:  Colors[currentTheme].colorTitleTab} ]}>No more achievements to complete! Congratulations</Text>
                        </View>
                    ) : (
                            achievements?.map((achievement, key) => (
                                <Surface key={key}  style={styles.card}>
                                    <View style={styles.cardRowAchievements}>
                                    <ImageBackground
                                    source={getBadgePicture(achievement.name.slice(1), false)}
                                    style={{ width: 70, height: 70, justifyContent: 'center', alignItems: 'center', marginRight:10 }}
                                    resizeMode="stretch">
                                    </ImageBackground>
                                    <View style={styles.cardTextAchievements}>
                                        <Text style = {styles.cardTitleAchievements}>{formatCamelCase(achievement.name)}</Text>
                                        <Text style ={styles.cardDescriptionAchievements} >{achievement.description}</Text>
                                    </View>
                                </View>
                                </Surface>
                            ))
                    )
                    }
                    {achievementsCompleted.length == 0 ? (
                        <View>
                            <Text  style={[ styles.text, {color:  Colors[currentTheme].colorTitleTab} ]}>No achievments completed yet!</Text>
                        </View>
                    ) : (
                            achievementsCompleted?.map((achievement, key) => (
                                <Surface key={key}  style={styles.card}>
                                    <View style={styles.cardRowAchievements}>
                                    <ImageBackground
                                    source={getBadgePicture(achievement.name.slice(1), true)}
                                    style={{ width: 70, height: 70, justifyContent: 'center', alignItems: 'center', marginRight:10 }}
                                    resizeMode="stretch">
                                    </ImageBackground>
                                    <View style={styles.cardTextAchievements}>
                                        <Text style = {styles.cardTitleAchievements}>{formatCamelCase(achievement.name)}</Text>
                                        <Text style ={styles.cardDescriptionAchievements} >{achievement.description}</Text>
                                    </View>
                                </View>
                                </Surface>
                            ))
                    )
                    }
                </ScrollView>
    
                {/* {achievements.length === 0 ?
                    (<View>
                        <Text style = {styles.text}>No more achievments to complete! Congratulations</Text>
                    </View>) :
                    (<FlatList
                        data = {achievements}
                        renderItem={({ item }) =>
                            <Surface style={styles.card}>
                            <View style={styles.cardRowAchievements}>
                                    <ImageBackground
                                    source={getBadgePicture(item.name.slice(1), false)}
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
                    (<View>
                        <Text style={styles.text}>No achievments Completed</Text>
                    </View>) :
                    (<FlatList
                        data = {achievementsCompleted}
                        renderItem={({ item }) =>
                            <Surface style={styles.card}>
                            <View style={styles.cardRowAchievements}>
                                <ImageBackground
                                    source={getBadgePicture(item.name.slice(1), true)}
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
                } */}


            </SafeAreaView>
        </SafeAreaProvider>
    )
}