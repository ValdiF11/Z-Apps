import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider, gql } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import * as SecureStore from "expo-secure-store";

const httpLink = createHttpLink({
  uri: "https://z.valdifirstianto.online",
});

const authLink = setContext(async (_, { headers }) => {
  const tokenExists = await SecureStore.isAvailableAsync();
  console.log(tokenExists);
  if (tokenExists) {
    // Retrieve the authentication token from local storage
    let token = await SecureStore.getItemAsync("access_token");
    console.log(token, "ini diauth");
    // Check if token is retrieved successfully
    if (token) {
      // Return the headers with the authorization token
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${token}`,
        },
      };
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
