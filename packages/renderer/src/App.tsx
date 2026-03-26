import { Route, Router, Switch } from "wouter";
import { ThemeProvider } from "./hooks/providers";
import { useHashLocation } from "wouter/use-hash-location";
import Tournament from "./components/Tournament";
import Layout from "./layout";
import Settings from "./components/settings/Settings";
import Startgg from "./components/settings/startgg/Startgg";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { useSettingsStore } from "./zustand/store";
import { ApolloProvider } from "@apollo/client/react";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.start.gg/gql/alpha",
    headers: {
      Authorization: "", // initiated upon the store being created
      "Content-Type": "application/json",
    },
  }),
  cache: new InMemoryCache(),
});

useSettingsStore.subscribe((state) =>
  client.setLink(
    new HttpLink({
      uri: "https://api.start.gg/gql/alpha",
      headers: {
        Authorization: `Bearer ${state.apiKey}`, // initiated upon the store being created
        "Content-Type": "application/json",
      },
    }),
  ),
);

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <ApolloProvider client={client}>
        <Router hook={useHashLocation}>
          <Layout>
            <Switch>
              <Route path="/" component={Tournament}></Route>
              <Route path="/settings" nest>
                <Settings>
                  <Switch>
                    <Route path="/startgg" component={Startgg}></Route>
                  </Switch>
                </Settings>
              </Route>
            </Switch>
          </Layout>
        </Router>
      </ApolloProvider>
    </ThemeProvider>
  );
}

export default App;
