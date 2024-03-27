import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const TabLayout = () => {

  return (
    <Tabs 
        screenOptions={{
            tabBarActiveTintColor: "#db0202",
            headerShown: false,
        }}
    >
            <Tabs.Screen
                    name="index"
                    options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                    }}
                />
                
                <Tabs.Screen
                    name="donor"
                    options={{
                    title: 'Search Donor',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="search" color={color} />,
                    }}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
                    }}
                />
    </Tabs>
  )
}

export default TabLayout

const styles = StyleSheet.create({})