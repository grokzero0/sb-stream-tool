import { Route, Router, Switch } from "wouter";
import { ThemeProvider } from "./hooks/providers";
import { useHashLocation } from "wouter/use-hash-location";
import Tournament from "./components/Tournament";
import Layout from "./layout";
function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Router hook={useHashLocation}>
        <Layout>
          <Switch>
            <Route path="/" component={Tournament}></Route>
          </Switch>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
