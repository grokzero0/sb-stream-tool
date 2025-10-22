import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.start.gg/gql/alpha",
    headers: {
      Authorization: "",
      "Content-Type": "application/json",
    },
  }),
  cache: new InMemoryCache(),
});
