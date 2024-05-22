import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons"; // Assuming you are using Expo
import { gql, useQuery } from "@apollo/client";

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

const HomeScreen = () => {
  const navigation = useNavigation();
  const [likedPosts, setLikedPosts] = useState({});
  const { loading, error, data } = useQuery(GET_POST);

  useEffect(() => {
    if (!loading && data) {
      const initialLikedPosts = {};
      data.findAllPost.forEach((post) => {
        initialLikedPosts[post._id] = false;
      });
      setLikedPosts(initialLikedPosts);
    }
  }, [loading, data]);

  const toggleLike = (postId) => {
    setLikedPosts((prevLikedPosts) => ({
      ...prevLikedPosts,
      [postId]: !prevLikedPosts[postId],
    }));
  };

  const navigateToCreateComment = (postId) => {
    navigation.navigate("CreateComment", { postId });
  };
  const goToPostDetail = (postId) => {
    navigation.navigate("PostDetail", { postId });
  };

  const goToCreatePost = () => {
    navigation.navigate("CreatePost");
  };

  const renderPostItem = ({ item }) => (
    <TouchableOpacity onPress={() => goToPostDetail(item._id)} style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image source={{ uri: `${item.author?.imgUrl}` }} style={styles.userProfilePic} />
        <View>
          <Text style={styles.fullName}>{item.author.name}</Text>
          <Text style={styles.username}>@{item.author.username}</Text>
        </View>
      </View>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.tags}>#{item.tags}</Text>
      <Image source={{ uri: `${item.imgUrl}` }} style={styles.imageContent} />
      <View style={styles.postFooter}>
        <TouchableOpacity style={styles.footerIcon} onPress={() => navigateToCreateComment(item._id)}>
          <FontAwesome name="comment-o" size={20} color="#888" />
          <Text style={styles.iconText}>{item.comments.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIcon2} onPress={() => toggleLike(item._id)}>
          <FontAwesome name={likedPosts[item._id] ? "heart" : "heart-o"} size={20} color={likedPosts[item._id] ? "black" : "#888"} />
          <Text style={styles.iconText}>{item.likes.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIcon2}>
          <FontAwesome name="share" size={20} color="#888" />
          <Text style={styles.iconText}>0</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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

  return (
    <View style={styles.container}>
      <FlatList
        data={data.findAllPost}
        renderItem={renderPostItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.postList}
      />
      <TouchableOpacity style={styles.postButton} onPress={goToCreatePost}>
        <Text style={styles.postButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    position: "relative",
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
  postList: {
    paddingBottom: 70, // Adjusted to accommodate the floating post button
  },
  postContainer: {
    backgroundColor: "#fff",
    marginBottom: 20,
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
  tags: {
    color: "#0047AB",
    paddingBottom: 10,
  },
  imageContent: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  footerIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerIcon2: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
  },
  postButton: {
    position: "absolute",
    bottom: 10,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  postButtonText: {
    fontSize: 40,
    color: "white",
  },
  iconText: {
    paddingLeft: 5,
    color: "grey",
    fontSize: 12,
  },
});

export default HomeScreen;
