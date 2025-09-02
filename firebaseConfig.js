import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence  } from "firebase/auth"
import AsyncStorage from '@react-native-async-storage/async-storage';
 
const firebaseConfig = {
  apiKey: "AIzaSyDro65NzdTA92JsIOQC1jksxAk4aLwNIg8",
  authDomain: "myforest-0704.firebaseapp.com",
  projectId: "myforest-0704",
  storageBucket: "myforest-0704.firebasestorage.app",
  messagingSenderId: "846009594142",
  appId: "1:846009594142:web:21cca3ca06365b1972590f",
  measurementId: "G-14084X9SBK"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage)
});
