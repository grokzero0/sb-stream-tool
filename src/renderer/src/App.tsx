import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { Route, Router, Switch } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import { useSettingsStore } from './lib/zustand-store/store'
import { ThemeProvider } from './lib/providers'
import Layout from './layout'
import NavigationHandler from './components/NavigationHandler'
import { Toaster } from './components/ui/sonner'
import ToastHandler from './components/ToastHandler'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.start.gg/gql/alpha',
    headers: {
      Authorization: '', // initiated upon the store being created
      'Content-Type': 'application/json'
    }
  }),
  cache: new InMemoryCache()
})

useSettingsStore.subscribe((state) =>
  client.setLink(
    new HttpLink({
      uri: 'https://api.start.gg/gql/alpha',
      headers: {
        Authorization: `Bearer ${state.apiKey}`, // initiated upon the store being created
        'Content-Type': 'application/json'
      }
    })
  )
)

function App(): React.JSX.Element {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider defaultTheme="dark">
        <Layout>
          <Router hook={useHashLocation}>
            <NavigationHandler>
              <Toaster />
              <ToastHandler />
              <Switch>
                <Route></Route>
              </Switch>
            </NavigationHandler>
          </Router>
        </Layout>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default App
