import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
} from "react-native";
import { gql, useQuery } from "@apollo/client";

const GET_SEARCH = gql`
  query SearchUser($searchTerm: String!) {
    searchUser(searchTerm: $searchTerm) {
      _id
      name
      username
      email
      password
      imgUrl
    }
  }
`;

const SearchScreen = () => {
  const [searchText, setSearchText] = useState("");
  const { loading, error, data } = useQuery(GET_SEARCH, {
    variables: {
      searchTerm: searchText,
    },
  });
  // Dummy data for user profiles
  const profiles = [
    { id: 1, username: "user1", profileImage: "https://picsum.photos/200/300", followed: false },
    { id: 2, username: "user2", profileImage: "https://picsum.photos/200/300", followed: true },
    { id: 3, username: "user3", profileImage: "https://picsum.photos/200/300", followed: false },
    // Add more dummy data as needed
  ];

  const handleFollowToggle = (id) => {
    // Implement follow toggle logic here
    console.log(`Toggle follow for user with id ${id}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Something went wrong!</Text>
      </View>
    );
  }

  const filteredProfiles = profiles.filter((profile) => profile.username.toLowerCase().includes(searchText.toLowerCase()));

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const renderProfileItem = ({ item }) => (
    <View style={styles.profileContainer}>
      <Image source={{ uri: `${item.imgUrl}` }} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <TouchableOpacity style={[styles.followButton, { backgroundColor: "#ccc" }]} onPress={() => handleFollowToggle(item.id)}>
          <Text style={styles.followButtonText}>Following</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <TextInput style={styles.searchInput} placeholder="Search..." value={searchText} onChangeText={(text) => setSearchText(text)} />
        {searchText !== "" && (
          <FlatList
            data={data.searchUser}
            renderItem={renderProfileItem}
            keyExtractor={(item) => item._id.toString()}
            contentContainerStyle={styles.flatListContainer}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  searchInput: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  flatListContainer: {
    flexGrow: 1,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  followButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  followButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SearchScreen;
