/* eslint-disable @typescript-eslint/no-explicit-any */
import { Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { ApolloProvider } from "@apollo/client/react";
import { ThemeProvider } from "./lib/providers";
import Layout from "./layout";
import Tournament from "./components/Tournament";
import Settings from "./components/settings/Settings";
import NavigationHandler from "./components/NavigationHandler";
import Obs from "./components/settings/obs/Obs";
import ToastHandler from "./components/ToastHandler";
import { Toaster } from "sonner";
import Startgg from "./components/settings/startgg/Startgg";
import { client } from "./client";

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider defaultTheme="dark">
        <Layout>
          <Router hook={useHashLocation}>
            <NavigationHandler>
              <Toaster />
              <ToastHandler />
              <Switch>
                <Route path="/" component={Tournament}></Route>
                <Route path="/settings" nest>
                  <Settings>
                    <Switch>
                      <Route path="/" component={Obs}></Route>
                      <Route path="/obs" component={Obs}></Route>,
                      <Route path="/startgg" component={Startgg}></Route>
                    </Switch>
                  </Settings>
                </Route>
                {/* fallback route (route does not exist) */}

                <Route>
                  {(params) => (
                    <center>
                      <b>404:</b> Sorry, this page{" "}
                      <code>&quot;{params["*" as any]}/&quot;</code> does not
                      exist!
                    </center>
                  )}
                </Route>
              </Switch>
            </NavigationHandler>
          </Router>
        </Layout>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
