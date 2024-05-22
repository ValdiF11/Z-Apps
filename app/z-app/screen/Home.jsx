import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, Image } from "react-native"; // Import TouchableOpacity and Image
import Foundation from "@expo/vector-icons/Foundation";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CreatePostScreen from "./home/createPost";
import SearchScreen from "./home/search";
import ProfileScreen from "./home/userProfile";
import HomeScreen from "./home/home";
import Logo from "../assets/logo.png";
import AuthContext from "../context/auth";
import * as SecureStore from "expo-secure-store";

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  const auth = useContext(AuthContext);

  const handleLogout = async () => {
    const token = await SecureStore.deleteItemAsync("access_token");
    console.log(token);
    auth.setIsSignedIn(false);
  };
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerTintColor: "black",
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "grey",
        tabBarStyle: {
          display: "flex",
        },
        headerTitle: () => (
          <Image
            source={Logo}
            style={{ width: 120, height: 40 }} // Adjust width and height as needed
            resizeMode="contain" // Ensure the logo fits within the header
          />
        ),
        headerTitleAlign: "center",
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
            <FontAwesome name="sign-out" size={24} color="black" />
          </TouchableOpacity>
        ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => <Foundation name="home" size={size} color={focused ? "black" : "grey"} />,
        }}
      />

      <Tab.Screen
        name="Search User"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => <FontAwesome name="search" size={size} color={focused ? "black" : "grey"} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => <FontAwesome name="user" size={size} color={focused ? "black" : "grey"} />,
        }}
      />
    </Tab.Navigator>
  );
}
