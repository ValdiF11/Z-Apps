import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from "react-native";
import Header from "../components/header";
import Footer from "../components/footer";
import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";

const MUTATION_REGISTER = gql`
  mutation AddUser($newUser: PostUser) {
    addUser(newUser: $newUser) {
      _id
      email
      name
      password
      username
      imgUrl
    }
  }
`;

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [displayError, setDisplayError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();

  const [registerHandler, { loading, error, data }] = useMutation(MUTATION_REGISTER, {
    onCompleted: (mutationResult) => {
      if (mutationResult) {
        navigation.navigate("Landing");
      }
    },
  });

  const handleRegister = () => {
    registerHandler({
      variables: {
        newUser: {
          email,
          name: fullName,
          password,
          username,
          imgUrl,
        },
      },
    }).catch((error) => {
      setErrorMessage(error.message);
      setDisplayError(true);
    });
  };
  console.log(loading, error, data);
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container2}>
          <Header />

          <View style={styles.container}>
            <Text style={styles.title}>Create an Account</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput style={styles.input} placeholder="Username" onChangeText={(text) => setUsername(text)} value={username} />
              <TextInput style={styles.input} placeholder="Full Name" onChangeText={(text) => setFullName(text)} value={fullName} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
              />
              <TextInput // New input field for imgUrl
                style={styles.input}
                placeholder="Image URL"
                onChangeText={(text) => setImgUrl(text)}
                value={imgUrl}
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
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
    </>
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

export default RegisterScreen;
