import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { FIREBASE_APP } from "../../firebaseConfig"

import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAuth } from "firebase/auth"
import { doc, getFirestore, getDoc, deleteDoc, getDocs , collection} from 'firebase/firestore'
import { getFunctions, httpsCallable } from "firebase/functions";
import { useColorScheme } from "react-native";

const db = getFirestore(FIREBASE_APP)
const functions = getFunctions();

type AuthState = {
    isLoggedIn: boolean
    isReady: boolean
    logIn: (email: string, password: string, xp:number) => void
    logOut: () => void
    deleteAccount: () => void
    email: string
    photoURL: string
    displayName: string
    xp: number,
    theme: string,
    chooseTheme:(mode:string) =>void
}

export const AuthContext = createContext<AuthState>({
    isLoggedIn: false,
    isReady: false,
    xp: 0,
    email: '',
    photoURL: '',
    displayName: '',
    logIn: (email : string, password: string) => {},
    logOut: () => { },
    deleteAccount: () => { },
    theme: "",
    chooseTheme: (mode:string) =>{},
})

const authStoageKey = 'authState'
const themeStorageKey = 'appTheme'

export function AuthProvider({ children }: PropsWithChildren) {
    const [email, setEmail] = useState('')
    const [photoURL, setPhotoURL] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [xp, setXp] = useState(0)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const [theme, setTheme] = useState('light')
    const router = useRouter()
    const storeAuthState = async (newState: { isLoggedIn: boolean }) => {
        try {
            const jsonValue = JSON.stringify(newState)
            await AsyncStorage.setItem(authStoageKey, jsonValue)
        } catch (error) {
            console.error('Failed to store auth state:', error)
            
        }
    }
    const logIn = async function (email: string, password: string, xp:number) {
        const username = email.split('@')[0]
        const docRef = doc(db, "users", username)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            setIsLoggedIn(true)
            const data = docSnap.data()
            setXp(data.xp)
            setEmail(data.email)
            storeAuthState({ isLoggedIn: true })
            setDisplayName(username)
            router.replace("/(protected)/(tabs)")
        }
        setXp(xp)
    }

const chooseTheme = async (mode: string) => {
    setTheme(mode)
    try {
        await AsyncStorage.setItem(themeStorageKey, mode)
    } catch (error) {
        console.error("Failed to save theme:", error)
    }
}

    const logOut = () => {
        setIsLoggedIn(false)
        storeAuthState({ isLoggedIn: false })
        router.replace("/login")
    }
    // function deleteAtPath(path:string) {
    // const deleteFn = httpsCallable(functions, 'recursiveDelete');
    // deleteFn({ path: path })
    //     .then(function(result:any) {
    //         console.log('Delete success: ' + JSON.stringify(result));
    //     })
    //     .catch(function(err:any) {
    //         console.log('Delete failed, see console,');
    //         console.warn(err);
    //     });
    // }


    const deleteAccount = async () => {
        try {
            const auth = getAuth()
            const user = auth.currentUser
            console.log("Deleting account for user:", user?.email)
            user?.delete().then(() => {
                console.log("Account deleted successfully")
                logOut()
            }).catch((error) => {
                console.error("Error deleting account:", error)
            })
            // // achievements
            // const achievementsDoneSubcollectionSnap = await getDocs(collection(db, "users", displayName, "achievements", "done", "doneList"))
            // for (const achievementDoc of achievementsDoneSubcollectionSnap.docs) {
            //     await deleteDoc(achievementDoc.ref)
            // }


            // const achievementsNotDoneSubcollectionSnap = await getDocs(collection(db, "users", displayName, "achievements", "notDone", "notDoneList"))
            // for (const achievementDoc of achievementsNotDoneSubcollectionSnap.docs) {
            //     await deleteDoc(achievementDoc.ref)
            // }
            // // delete users/username/achievements/done
            // // and delete users/username/achievements/notDone
            // const achievementsSnap = await getDocs(collection(db, "users", displayName, "achievements"))
            // for (const achievementRef of achievementsSnap.docs) {
            //     await deleteDoc(achievementRef.ref)
            // }
            // trees
            // trees/notOwnedTrees
            const treesNotOwnedSnap = await getDocs(collection(db, "users", displayName, "trees", "notOwnedTrees", "notOwnedTreesList"))
            for (const notOwnedTree of treesNotOwnedSnap.docs) {
                await deleteDoc(notOwnedTree.ref)
            }
            // trees/ownedTrees
            const treesOwnedSnap = await getDocs(collection(db, "users", displayName, "trees", "ownedTrees", "ownedTreesList"))
            for (const ownedTree of treesOwnedSnap.docs) {
                await deleteDoc(ownedTree.ref)
            }
            // trees/treesPlanted
            const treesPlantedSnap = await getDocs(collection(db, "users", displayName, "trees", "stats", "treesPlanted"))
            for (const treePlanted of treesPlantedSnap.docs) {
                await deleteDoc(treePlanted.ref)
            }
            // trees/stats
            const statsSnap = await getDoc(doc(db, "users", displayName, "trees", "stats"))
            await deleteDoc(statsSnap.ref)
                        
            // // tasks/stats
            // const tasksDaysSnap = await getDocs(collection(db, "users", displayName, "tasks", "stats"))

            // for (const subcol of tasksDaysSnap.docs) {
            //     const subcolRef = collection(db, "users", displayName, "tasks", "stats", subcol.id)
            //     const docsSnap = await getDocs(subcolRef)
            //     await Promise.all(docsSnap.docs.map((doc) => deleteDoc(doc.ref)))

            // }        

            // tasks
            // trees
            // friends
            // await deleteDoc(doc(db, "users", displayName))
            // Note: Firebase does not allow deleting an account while the user is logged in.
            // Implement account deletion logic here
            // After deletion, log out the user
            logOut()
        } catch (error: any) {
            console.log(error)
        }
    }
    useEffect(() => {
        const getAuthFromStorage = async () => {
            try {
                const value = await AsyncStorage.getItem(authStoageKey)
                if (value !== null) {
                    const authState = JSON.parse(value)
                    setIsLoggedIn(authState.isLoggedIn)
                }
            } catch (error) {
                console.error('Failed to retrieve auth state:', error)
            }
            setIsReady(true)
        }
        const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(themeStorageKey)
            if (savedTheme) {
                setTheme(savedTheme)
            } else {
                // dacă nu există, folosim tema sistemului
                const systemTheme = useColorScheme() ?? 'light'
                setTheme(systemTheme)
            }
        } catch (error) {
            const systemTheme = useColorScheme() ?? 'light'
            setTheme(systemTheme)
            console.error("Failed to load theme from storage:", error)
        }
    }
    loadTheme()
        getAuthFromStorage()
        }, [])
    
    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            isReady,
            email,
            photoURL,
            displayName,
            xp,
            logIn,
            logOut,
            deleteAccount, 
            theme,
            chooseTheme
        }}>
            {children}
        </AuthContext.Provider>
        
    )
}