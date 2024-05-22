import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Alert } from "react-native";
import Header from "../components/header";
import Footer from "../components/footer";
import { gql, useMutation } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import AuthContext from "../context/auth";

const MUTATION_LOGIN = gql`
  mutation Login($newLogin: Login) {
    login(newLogin: $newLogin) {
      access_token
      email
    }
  }
`;

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayError, setDisplayError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const auth = useContext(AuthContext);

  const [loginHandler, { loading, error, data }] = useMutation(MUTATION_LOGIN, {
    onCompleted: async (mutationResult) => {
      if (mutationResult?.login?.access_token) {
        await SecureStore.setItemAsync("access_token", mutationResult?.login?.access_token);
        let token = await SecureStore.getItemAsync("access_token");
        console.log(token, "ini token");
        auth.setIsSignedIn(true);
      }
    },
  });

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleLogin = () => {
    loginHandler({
      variables: {
        newLogin: {
          email,
          password,
        },
      },
    }).catch((error) => {
      setErrorMessage(error.message);
      setDisplayError(true);
    });
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container2}>
        <Header />
        <View style={styles.container}>
          <Text style={styles.title}>Welcome Back!</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Email" onChangeText={(text) => setEmail(text)} value={email} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin} // Call handleLogin function on button press
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
        <Footer />
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#000000" />
          </View>
        )}
        {displayError && Alert.alert("Error", errorMessage, [{ text: "OK", onPress: () => setDisplayError(false) }], { cancelable: false })}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  container2: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    width: "100%",
  },
  button: {
    padding: 15,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
});

export default LoginScreen;
