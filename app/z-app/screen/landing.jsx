import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const LandingPage = () => {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  const handleRegisterPress = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
      </View>

      <View>
        <Text style={styles.title}>Happening Now</Text>
        <Text style={styles.subtitle}>Join today.</Text>
      </View>
      {/* Main Content Section */}
      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={handleRegisterPress}>
          <Text style={styles.buttonText}>Create account</Text>
        </TouchableOpacity>
        <Text style={{ paddingTop: 30, paddingHorizontal: 10 }}>
          By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={{ paddingBottom: 10, paddingHorizontal: 10 }}>Already have an account?</Text>
        <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Section */}
      <Text style={styles.footerText}>© 2024 Z Apps. All rights reserved.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40, // Adjust this value to create space for the header
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center the logo horizontally
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 65,
    fontWeight: "bold",
    marginBottom: 20,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 26,
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: "#000000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  footerText: {
    marginTop: 20,
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
});

export default LandingPage;
