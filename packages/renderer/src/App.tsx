import { Route, Router, Switch } from "wouter";
import { PlayerFormFieldArrayProvider, ThemeProvider } from "./hooks/providers";
import { useHashLocation } from "wouter/use-hash-location";
import Match from "./components/Match";
import Layout from "./layout";
import Settings from "./components/settings/Settings";
import Startgg from "./components/settings/startgg/Startgg";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { useSettingsStore } from "./zustand/store";
import { ApolloProvider } from "@apollo/client/react";
import { FormProvider, useForm } from "react-hook-form";
import { Tournament } from "@app/common";
import { TournamentDefaultValues } from "./utils/form";
import Obs from "./components/settings/obs/Obs";
import Slippi from "./components/slippi/Slippi";

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
        Authorization: `Bearer ${state.startggApiKey}`, // initiated upon the store being created
        "Content-Type": "application/json",
      },
    }),
  ),
);

function App() {
  const methods = useForm<Tournament>({
    defaultValues: TournamentDefaultValues,
  });
  return (
    <ThemeProvider defaultTheme="dark">
      <ApolloProvider client={client}>
        <FormProvider {...methods}>
          <PlayerFormFieldArrayProvider>
            <Router hook={useHashLocation}>
              <Layout>
                <Switch>
                  <Route path="/" component={Match}></Route>
                  <Route path="/settings" nest>
                    <Settings>
                      <Switch>
                        <Route path="/" component={Obs}></Route>
                        <Route path="/obs" component={Obs}></Route>
                        <Route path="/startgg" component={Startgg}></Route>
                        <Route path="/slippi" component={Slippi}></Route>
                      </Switch>
                    </Settings>
                  </Route>
                </Switch>
              </Layout>
            </Router>
          </PlayerFormFieldArrayProvider>
        </FormProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
}

export default App;
