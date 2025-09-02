import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from "firebase/auth";

type AuthState = {
    isLoggedIn: boolean;
    isReady: boolean;
    logIn: (email: string, password:string) => void;
    logOut: () => void;
    deleteAccount: () => void;
    email: string;
    password: string;
    photoURL: string;
    displayName: string;
    uid: string;
    // providerId: string;
    xp: number;
};

export const AuthContext = createContext<AuthState>({
    isLoggedIn: false,
    isReady: false,
    xp: 0,
    email: '',
    password: '',
    photoURL: '',
    displayName: '',
    uid: '',
    // providerId: '',
    logIn: (email : string, password: string) => {},
    logOut: () => { },
    deleteAccount: () => {},
});

const authStoageKey = 'authState';

export function AuthProvider({ children }: PropsWithChildren) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [uid, setUid] = useState('');
    // const [providerId, setProviderId] = useState('');
    const [xp, setXp] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();
    const storeAuthState = async (newState: { isLoggedIn: boolean }) => {
        try {
            const jsonValue = JSON.stringify(newState);
            await AsyncStorage.setItem(authStoageKey, jsonValue);
        } catch (error) {
            console.error('Failed to store auth state:', error);
            
        }
    }
    const logIn = function(email: string, password: string) {
        setIsLoggedIn(true);
        setEmail(email);
        setPassword(password);
        setXp(xp);
        storeAuthState({ isLoggedIn: true });
        setDisplayName(email.split('@')[0]);
        
        router.replace("/(protected)/(tabs)");
    }

    const logOut = () => {
        setIsLoggedIn(false);
        storeAuthState({ isLoggedIn: false });
        router.replace("/login");
    }
    const deleteAccount = async () => {
        alert("Deleting account...");
            const auth = getAuth();
        const user = auth.currentUser;
        console.log("Deleting account for user:", user?.email);
            user?.delete().then(() => {
                console.log("Account deleted successfully");
                logOut();
            }).catch((error) => {
                console.error("Error deleting account:", error);
            });
        // Note: Firebase does not allow deleting an account while the user is logged in.
        // Implement account deletion logic here
        // After deletion, log out the user
        logOut();
    }
    useEffect(() => {
        const getAuthFromStorage = async () => {
            try {
                const value = await AsyncStorage.getItem(authStoageKey);
                if (value !== null) {
                    const authState = JSON.parse(value);
                    setIsLoggedIn(authState.isLoggedIn);
                }
            } catch (error) {
                console.error('Failed to retrieve auth state:', error);
            }
            setIsReady(true);
        }
        getAuthFromStorage();
        }, []);
    
    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            isReady,
            email,
            password,
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