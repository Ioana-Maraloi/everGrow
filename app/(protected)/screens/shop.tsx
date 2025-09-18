import { View, Text, FlatList, Alert } from "react-native"
import { Button } from "react-native-paper"
import styles from '../../utils/styles'
import images from "../../utils/images"

import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthContext } from "../../utils/authContext" 
import React, { useState, useContext, useEffect } from "react"

import { FIREBASE_APP } from "../../../firebaseConfig"
import { collection, doc, getFirestore,getDoc, updateDoc,increment, setDoc, getDocs, query, onSnapshot, deleteDoc } from 'firebase/firestore'
import { ImageBackground } from "expo-image"

function getTreePicture(label: string) {
    // trees
	if (label === "treeModel2Blue") {
		return images.treeModel2Blue5
	}
	if (label === "treeModel2Green") {
		return images.treeModel2Green5
	}
	if (label === "treeModel2Turquoise") {
	    return images.treeModel2Turquoise5
	}
	if (label === "treeModel3Green") {
		return images.treeModel3Green5
    }
    if (label === "treeModel3LightGreen") {
		return images.treeModel3LightGreen5
	}
	if (label === "treeModel3Orange") {
	    return images.treeModel3Orange5
	}
	if (label === "treeModel3Red") {
		return images.treeModel3Red5
    }
    // plants
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
	return images.treeModel2Blue5
}
interface Tree{
    name: string,
    price:number
}
export default function Shop() {

    const db = getFirestore(FIREBASE_APP)
    const authState = useContext(AuthContext)
    const [treesAvailable, setTreesAvailable] = useState<Tree[]>([])

    const buyProduct = async (tree: Tree) => {
        if (tree.price > authState.xp) {
            alert("You don`t have enough coins!")
        } else {
            Alert.alert('Are you sure you want to buy this?', 'You will spend ' + tree.price + " coins", [
                {
                    text: "Cancel",
                    style:"cancel"
                },
                {
                    text: "Confirm",
                    onPress: () =>
                    {
                        deleteProduct(tree)
                    }
                }
            ])
        }
    }
    const deleteProduct = async (tree: Tree)=>{
        try {
            authState.xp -= tree.price
            const userRef = doc(db, "users", authState.displayName)
                        const userSnap = await getDoc(userRef)
                        if (!userSnap.exists()) {
                            return
                        }
                        await updateDoc(userRef, {
                            xp: increment(-tree.price)
                        })
            await deleteDoc(doc(db, "users", authState.displayName, "trees", "notOwnedTrees", "notOwnedTreesList", tree.name))
            const myFriendRef = doc(db, "users", authState.displayName, "trees", "ownedTrees", "ownedTreesList", tree.name)
            await setDoc(myFriendRef, tree)
        } catch (error) {
            console.log(error)
        }
    }
    const getTrees = async () => {
            try {
                const treesList = await getDocs(collection(db, "users", authState.displayName, "trees", "notOwnedTrees", 'notOwnedTreesList'))
                if (treesList.empty) {
                    console.log("Nothing to purchase yet")
                } else {
                    console.log("not purchased trees:")
                    const items: Tree[] = treesList.docs.map(doc => {
                        const data = doc.data()
                        return {
                            name: data.name,
                            price: data.price
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
                const q = query(collection(db, "users", authState.displayName, "trees", "notOwnedTrees", "notOwnedTreesList"))
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
    const getPictureSize = (name: string) =>{
        if (name === "redMushroom" || name ==="blueMushroom" || name ==="flower")
            return 50
        if (name === "greenBush" || name ==="orangeBush")
            return 75
        return 100
        
    }
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text style = {styles.text}>Buy new trees:</Text>
                {treesAvailable.length === 0 ?
                    (<View>
                        <Text>No more trees to buy!</Text>
                    </View>)
                    :
                    (<FlatList
                        numColumns={2}
                        data={treesAvailable}
                        renderItem={({ item }) => 
                            <View style = {styles.shopContainer}>
                                <Button
                                    style={{ justifyContent: "center",}}
                                    onPress={() => {
                                        buyProduct(item)
                                        console.log(item.name)
                                    }}>
                                    
                                    <View style={{  width: 100, height: 100, justifyContent: 'center',alignItems: "center" }}>
                                            <ImageBackground
                                                source={getTreePicture(item.name)}
                                                style={{ width: getPictureSize(item.name), height: getPictureSize(item.name), justifyContent: 'center', alignItems: 'center' }}
                                                resizeMode="stretch">
                                            </ImageBackground>
                                            <Text>{item.price}</Text>
                                        </View>
                                </Button>
                            </View>
                    }>
                    </FlatList>)
                }
            </SafeAreaView>
        </SafeAreaProvider>

    )
}