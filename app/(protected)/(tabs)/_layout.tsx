import { Tabs } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabsLayout() {
  return (
    <Tabs>    
      <Tabs.Screen name="index" options={{
        title: "TODO",
        tabBarIcon: () => (
        <Feather name="check-square" size={24} color="black" />
      ) }}>
      </Tabs.Screen>

      <Tabs.Screen name="forest" options={{ 
        title: "forestt",
         tabBarIcon:()=>(
         <MaterialIcons name="forest" size={24} color="black" />) 
          
       }}>
      </Tabs.Screen>

      <Tabs.Screen name="profile" options={{
        title: "profilll",
        tabBarIcon: () => (
          <MaterialIcons name="account-circle" size={24} color="black" />
        )
      }}>
      </Tabs.Screen>
	  
	</Tabs>
  )
}
