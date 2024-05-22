import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { StyleSheet, View, Image, Text, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const GET_USERLOGIN = gql`
  query Query {
    getUserLogin {
      _id
      name
      username
      imgUrl
      email
      password
      followers {
        details {
          name
          username
          _id
          imgUrl
        }
      }
      following {
        details {
          _id
          name
          username
          imgUrl
        }
      }
    }
  }
`;

const ProfileScreen = () => {
  const { loading, error, data, refetch } = useQuery(GET_USERLOGIN);
  const [refreshing, setRefreshing] = useState(false);
  const [showFollowingList, setShowFollowingList] = useState(true);
  const [showFollowersList, setShowFollowersList] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const refreshProfile = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
      };
      refreshProfile();
    }, [])
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
    <FlatList
      style={styles.container}
      data={[null]} // Dummy data for FlatList, as we're not using the data for rendering the main content
      refreshControl={<RefreshControl refreshing={refreshing} />}
      renderItem={() => (
        <>
          {/* Banner Section */}
          <View style={styles.bannerContainer}>
            <Image source={{ uri: `https://picsum.photos/200/150` }} style={styles.bannerImage} />
          </View>

          {/* Profile Picture */}
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: `${data.getUserLogin.imgUrl}` }} style={styles.profileImage} />
          </View>

          {/* User Information */}
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{data.getUserLogin.name}</Text>
            <Text style={styles.userHandle}>@{data.getUserLogin.username}</Text>
            <Text style={styles.userBio}>
              Welcome to my profile! Hi my name is {data.getUserLogin.name} you can call me {data.getUserLogin.username}. I'm here to share stories,
              insights, and thoughts in this vast world of words.
            </Text>

            {/* Following and Followers Count */}
            <View style={styles.followCounts}>
              <View style={styles.countContainer}>
                <Text style={styles.countText}>{data.getUserLogin.following.length}</Text>
                <Text style={styles.countLabel}>Following</Text>
              </View>
              <View style={styles.countContainer}>
                <Text style={styles.countText}>{data.getUserLogin.followers.length}</Text>
                <Text style={styles.countLabel}>Followers</Text>
              </View>
            </View>

            {/* Following List */}
            <View style={styles.followListContainer}>
              {showFollowingList && (
                <FlatList
                  style={styles.followList}
                  data={data?.getUserLogin?.following}
                  renderItem={({ item }) => (
                    <View style={styles.followItem}>
                      <Image source={{ uri: item.details.imgUrl }} style={styles.followItemImage} />
                      <Text style={styles.followItemText}>{item.details.username}</Text>
                    </View>
                  )}
                  keyExtractor={(item) => item.details._id.toString()}
                />
              )}
              {/* Garis Pembatas */}
              <View style={styles.separator} />
              {/* Followers List */}
              {showFollowersList && (
                <FlatList
                  style={styles.followList2}
                  data={data?.getUserLogin?.followers}
                  renderItem={({ item }) => (
                    <View style={styles.followItem}>
                      <Image source={{ uri: item.details.imgUrl }} style={styles.followItemImage} />
                      <Text style={styles.followItemText}>{item.details.username}</Text>
                    </View>
                  )}
                  keyExtractor={(item) => item.details._id.toString()}
                />
              )}
            </View>
          </View>
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bannerContainer: {
    height: 150,
    backgroundColor: "#ddd", // Placeholder color
  },
  bannerImage: {
    flex: 1,
    resizeMode: "cover",
  },
  profileImageContainer: {
    position: "absolute",
    top: 100, // Half of the banner height
    left: 20, // Adjust as needed
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginTop: 20, // Adjust as needed
    padding: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userHandle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 10,
  },
  userBio: {
    fontSize: 16,
    marginBottom: 10,
  },
  followCounts: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  countContainer: {
    alignItems: "center",
  },
  countText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  countLabel: {
    fontSize: 16,
    color: "#888",
  },
  followListContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "flex-start", // Mengatur penempatan daftar following dan followers ke atas
  },
  followList: {
    flex: 1,
    marginLeft: 10, // Menggeser daftar following ke kiri
  },
  followList2: {
    flex: 1,
    marginLeft: 10, // Menggeser daftar following ke kiri
  },
  followItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  followItemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  followItemText: {
    fontSize: 16,
  },
  separator: {
    width: 1,
    height: "100%",
    backgroundColor: "#ccc",
    marginLeft: 10,
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

export default ProfileScreen;
