import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Alert } from "react-native";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";

const MUTATION_CREATEPOST = gql`
  mutation AddPost($newPost: PostInput) {
    addPost(newPost: $newPost) {
      _id
      authorId
      comments {
        content
        createdAt
        updatedAt
        username
      }
      content
      createdAt
      imgUrl
      likes {
        createdAt
        updatedAt
        username
      }
      tags
      updatedAt
    }
  }
`;
const GET_POST = gql`
  query FindAllPost {
    findAllPost {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      author {
        _id
        name
        email
        username
        imgUrl
      }
    }
  }
`;

const CreatePostScreen = () => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [displayError, setDisplayError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();

  const [registerHandler, { loading, error, data }] = useMutation(MUTATION_CREATEPOST, {
    onCompleted: (mutationResult) => {
      if (mutationResult) {
        navigation.navigate("Home");
      }
    },
    refetchQueries: [{ query: GET_POST }],
    awaitRefetchQueries: true,
  });

  const handleSubmit = () => {
    registerHandler({
      variables: {
        newPost: {
          content,
          imgUrl: imageUrl,
          tags,
        },
      },
    }).catch((error) => {
      setErrorMessage(error.message);
      setDisplayError(true);
    });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="What's happening?"
          multiline
          numberOfLines={4}
          value={content}
          onChangeText={(text) => setContent(text)}
        />
        <TextInput style={styles.input} placeholder="Image URL" value={imageUrl} onChangeText={(text) => setImageUrl(text)} />
        <TextInput style={styles.input} placeholder="Tags (comma-separated)" value={tags} onChangeText={(text) => setTags(text)} />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
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
    padding: 20,
  },
  input: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#000000",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
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

export default CreatePostScreen;
