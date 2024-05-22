import { gql, useQuery } from "@apollo/client";
import React from "react";
import { StyleSheet, View, Image, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

const GET_POSTBYID = gql`
  query FindPostById($id: ID!) {
    findPostById(_id: $id) {
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

const PostDetailScreen = ({ route }) => {
  const navigation = useNavigation();

  console.log(route.params.postId);
  const { loading, error, data } = useQuery(GET_POSTBYID, {
    variables: {
      id: route.params.postId,
    },
  });

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentUsername}>{item.username}</Text>
      <Text>{item.content}</Text>
    </View>
  );

  const navigateToCreateComment = () => {
    navigation.navigate("CreateComment", { postId: route.params.postId });
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

  console.log(loading, error, data);

  return (
    <View style={styles.container}>
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <Image source={{ uri: `${data.findPostById.author.imgUrl}` }} style={styles.userProfilePic} />
          <View>
            <Text style={styles.fullName}>{data.findPostById.author.name}</Text>
            <Text style={styles.username}>{data.findPostById.author.username}</Text>
          </View>
        </View>
        <Text style={styles.content}>{data.findPostById.content}</Text>
        <Image source={{ uri: `${data.findPostById.imgUrl}` }} style={styles.imageContent} />
        <View style={styles.postFooter}>
          <Text style={styles.likes}>{data.findPostById.likes.length} Likes</Text>
          <View style={styles.tagsContainer}>
            {data.findPostById.tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.commentSection}>
        <Text style={styles.commentTitle}>Comments</Text>
        <FlatList
          data={data.findPostById.comments}
          renderItem={renderCommentItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.commentsContainer}
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={navigateToCreateComment}>
        <Text style={styles.addButtonText}>Add Comment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  postContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  fullName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    fontSize: 14,
    color: "#888",
  },
  content: {
    marginBottom: 10,
  },
  imageContent: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likes: {
    fontWeight: "bold",
  },
  tagsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tag: {
    marginLeft: 5,
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  commentSection: {
    marginTop: 5,
    flex: 1,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentsContainer: {
    flexGrow: 1,
  },
  commentContainer: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  commentUsername: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default PostDetailScreen;
