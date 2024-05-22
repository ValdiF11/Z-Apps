import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Keyboard, TouchableWithoutFeedback, ActivityIndicator, Alert } from "react-native";

const MUTATION_CREATECOMMENT = gql`
  mutation Mutation($newComment: CommentInput) {
    addComment(newComment: $newComment) {
      _id
      authorId
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
      comments {
        content
        createdAt
        updatedAt
        username
      }
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

const CreateCommentScreen = ({ route }) => {
  const [comment, setComment] = useState("");
  const [displayError, setDisplayError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();

  const [registerHandler, { loading, error, data }] = useMutation(MUTATION_CREATECOMMENT, {
    onCompleted: (mutationResult) => {
      if (mutationResult) {
        navigation.navigate("Home");
      }
    },
    refetchQueries: [{ query: GET_POST }],
    awaitRefetchQueries: true,
  });

  const handleCommentChange = (text) => {
    setComment(text);
  };

  const handlePostComment = () => {
    registerHandler({
      variables: {
        newComment: {
          _id: route.params.postId,
          content: comment,
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
          multiline
          placeholder="Write your comment..."
          value={comment}
          onChangeText={handleCommentChange}
          textAlignVertical="top" // Center the text vertically
        />
        <Button title="Post" onPress={handlePostComment} />
        {loading && (
          <View style={styles.errorContainer}>
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
    padding: 16, // Center content vertically
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    minHeight: 600, // Adjust as per your requirement
  },
  errorContainer: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
});

export default CreateCommentScreen;
