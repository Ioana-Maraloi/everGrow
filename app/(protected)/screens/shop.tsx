import { View, Text, FlatList, Alert } from "react-native"
import { Button } from "react-native-paper"
import styles from '../../utils/styles'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
// import { ScrollView} from "react-native-gesture-handler"
import { AuthContext } from "../../utils/authContext" 
import React, { useState, useContext, useEffect } from "react"

import { FIREBASE_APP } from "../../../firebaseConfig"
import { collection, doc, getFirestore, setDoc, getDocs, query, onSnapshot, deleteDoc } from 'firebase/firestore'
import { ImageBackground } from "expo-image"

const treeModel2Blue = require("../../../assets/trees/model2/blue/Size_05.png")
const treeModel2Green = require("../../../assets/trees/model2/green/Size_05.png")
const treeModel2Turquoise = require("../../../assets/trees/model2/turquoise/Size_05.png")
const treeModel3Green = require("../../../assets/trees/model3/green/Size_05.png")
const treeModel3LightGreen = require("../../../assets/trees/model3/lightGreen/Size_05.png")
const treeModel3Orange = require("../../../assets/trees/model3/orange/Size_05.png")
const treeModel3Red = require("../../../assets/trees/model3/red/Size_05.png")


const redMushroom = require("../../../assets/trees/plants/mushrooms/red.png")
const blueMushroom = require("../../../assets/trees/plants/mushrooms/blue.png")
const flower = require("../../../assets/trees/plants/flower/big.png")
const greenBush = require("../../../assets/trees/plants/green/big.png")
const orangeBush = require("../../../assets/trees/plants/orange/big.png")


function getTreePicture(label: string) {
    // trees
	if (label === "treeModel2Blue") {
		return treeModel2Blue
	}
	if (label === "treeModel2Green") {
		return treeModel2Green
	}
	if (label === "treeModel2Turquoise") {
	    return treeModel2Turquoise
	}
	if (label === "treeModel3Green") {
		return treeModel3Green
    }
    if (label === "treeModel3LightGreen") {
		return treeModel3LightGreen
	}
	if (label === "treeModel3Orange") {
	    return treeModel3Orange
	}
	if (label === "treeModel3Red") {
		return treeModel3Red
    }
    // plants
    if (label === "redMushroom") {
	    return redMushroom
	}
	if (label === "blueMushroom") {
		return blueMushroom
    }
    if (label === "flower") {
		return flower
	}
	if (label === "greenBush") {
	    return greenBush
	}
	if (label === "orangeBush") {
		return orangeBush
	}
	return treeModel2Blue
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
             }, [authState])
    return (
        <SafeAreaProvider >
            <SafeAreaView style={styles.container}>
                <Text style = {styles.text}>Buy new trees:</Text>
                {treesAvailable.length === 0 ?
                    (<View>
                        <Text>No more trees to buy!</Text>
                    </View>)
                    :
                    (<FlatList numColumns={2}
                            data={treesAvailable}
                        renderItem={({ item }) => 
                            <View style = {styles.shopContainer}>
                                <Button
                                    style={{ justifyContent: "center",}}
                                    onPress={() => {
                                        buyProduct(item)
                                        console.log(item.name)
                                    }}>
                                    <View style={{alignItems:"center"}}>
                                        <ImageBackground
                                            source={getTreePicture(item.name)}
                                            style={{ width: 90, height: 90, justifyContent: 'center', alignItems: 'center' }}
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