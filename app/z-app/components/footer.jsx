// Footer.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© 2024 Z Apps. All rights reserved.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  footerText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
});

export default Footer;
