import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { FIREBASE_APP } from "../../firebaseConfig"

import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAuth } from "firebase/auth"
import { doc, getFirestore, setDoc, getDoc, deleteDoc, updateDoc, increment } from 'firebase/firestore'
const db = getFirestore(FIREBASE_APP)

type AuthState = {
    isLoggedIn: boolean
    isReady: boolean
    logIn: (email: string, password:string) => void
    logOut: () => void
    deleteAccount: () => void
    email: string
    // password: string
    photoURL: string
    displayName: string
    uid: string
    // providerId: string
    xp: number
}

export const AuthContext = createContext<AuthState>({
    isLoggedIn: false,
    isReady: false,
    xp: 0,
    email: '',
    // password: '',
    photoURL: '',
    displayName: '',
    uid: '',
    // providerId: '',
    logIn: (email : string, password: string) => {},
    logOut: () => { },
    deleteAccount: () => {},
})

const authStoageKey = 'authState'

export function AuthProvider({ children }: PropsWithChildren) {
    const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('')
    const [photoURL, setPhotoURL] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [uid, setUid] = useState('')
    // const [providerId, setProviderId] = useState('')
    const [xp, setXp] = useState(0)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const router = useRouter()
    const storeAuthState = async (newState: { isLoggedIn: boolean }) => {
        try {
            const jsonValue = JSON.stringify(newState)
            await AsyncStorage.setItem(authStoageKey, jsonValue)
        } catch (error) {
            console.error('Failed to store auth state:', error)
            
        }
    }
    const logIn = async function (email: string, password: string) {
        const username = email.split('@')[0]
        const docRef = doc(db, "users", username)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            setIsLoggedIn(true)
            console.log("CE")
            const data = docSnap.data()
            setXp(data.xp)
            setEmail(data.email)
            storeAuthState({ isLoggedIn: true })
            setDisplayName(username)
            router.replace("/(protected)/(tabs)")
        }
        // setIsLoggedIn(true)
        // setEmail(email)
        // setPassword(password)
        // setXp(xp)
        // storeAuthState({ isLoggedIn: true })
        // setDisplayName(username)
        
        // router.replace("/(protected)/(tabs)")
    }

    const logOut = () => {
        setIsLoggedIn(false)
        storeAuthState({ isLoggedIn: false })
        router.replace("/login")
    }
    const deleteAccount = async () => {
        try {
            console.log("Deleting account...")
            const auth = getAuth()
            const user = auth.currentUser
            console.log("Deleting account for user:", user?.email)
            user?.delete().then(() => {
                console.log("Account deleted successfully")
                logOut()
            }).catch((error) => {
                console.error("Error deleting account:", error)
            })
            await deleteDoc(doc(db, "users", displayName))

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
        getAuthFromStorage()
        }, [])
    
    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            isReady,
            email,
            // password,
            photoURL,
            displayName,
            uid,
            // providerId,
            xp,
            logIn,
            logOut,
            deleteAccount
        }}>
            {children}
        </AuthContext.Provider>
        
    )
}