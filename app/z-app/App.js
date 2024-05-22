import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import LandingPage from "./screen/landing";
import LoginScreen from "./screen/login";
import RegisterScreen from "./screen/register";
import HomeTabs from "./screen/Home";
import PostDetailScreen from "./screen/home/detailpost";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from "@apollo/client";
import client from "./configuration/apolloConnection";
import CreatePostScreen from "./screen/home/createPost";
import AuthContext from "./context/auth";
import * as SecureStore from "expo-secure-store";
import CreateCommentScreen from "./screen/home/createComment";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync("access_token")
      .then((result) => {
        if (result) {
          setIsSignedIn(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider
        value={{
          isSignedIn,
          setIsSignedIn,
        }}
      >
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator>
            {!isSignedIn ? (
              <>
                {/* Render LandingPage if user is not signed in */}
                <Stack.Screen name="Landing" component={LandingPage} options={{ headerShown: false }} />
                {/* Render LoginScreen if user is not signed in */}
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                {/* Render RegisterScreen if user is not signed in */}
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
              </>
            ) : (
              <>
                {/* Render HomeTabs if user is signed in */}
                <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
                <Stack.Screen name="PostDetail" component={PostDetailScreen} />
                <Stack.Screen name="CreatePost" component={CreatePostScreen} />
                <Stack.Screen name="CreateComment" component={CreateCommentScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}
