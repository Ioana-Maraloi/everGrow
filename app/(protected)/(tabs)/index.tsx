import { ScrollView, Text } from 'react-native';
import { Appbar, TextInput, Button, PaperProvider, useTheme } from 'react-native-paper';
import { FIREBASE_APP } from "../../../firebaseConfig";
import React, { useState, useContext } from 'react';
import { AuthContext } from "../../utils/authContext";

import { doc, getFirestore, setDoc } from 'firebase/firestore';
export default function TodoScreen() {
    const [todo, setTodo] = useState('');
    const authState = useContext(AuthContext);
    

    const db = getFirestore(FIREBASE_APP);
    const todos = doc(db, 'users', authState.displayName); // Adjust the path as needed
    function addCollection() {
        
    }
    function writeTodo(todo: string, completed: boolean) {
        const docData = {
            description: todo,
            completed: completed,
            createdAt: new Date().toISOString(),
        }
        setDoc(todos, docData, { merge: true });
    }


    // const ref = firestore().collection('todos');
    const theme = useTheme();
    return (
        <PaperProvider theme={theme}>
            <Appbar>
            <Appbar.Content title={'TODOs List'} />
            </Appbar>

            <ScrollView style={{ flex: 1 }}>
                <Text>List of TODOs!</Text>
            </ScrollView>

            <TextInput label={'New Todo'} value='todo' onChangeText={setTodo} />
           
            <Button onPress={() => }>Add TODO</Button>
        
        </PaperProvider>
  );
}