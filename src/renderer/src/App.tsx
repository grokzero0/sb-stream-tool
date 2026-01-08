/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { Route, Router, Switch } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import { useSettingsStore } from './lib/zustand-store/store'
import { PlayerFormFieldArrayProvider, ThemeProvider } from './lib/providers'
import Layout from './layout'
import Settings from './components/settings/Settings'
import Tournament from './components/Tournament'
import Obs from './components/settings/obs/Obs'
import Startgg from './components/settings/startgg/Startgg'
import Slippi from './components/settings/slippi/Slippi'
import { useForm } from 'react-hook-form'
import { TournamentDefaultValues } from './lib/form'
import { Form } from './components/ui/form'
import Toast from './components/Toast'
import Handlers from './components/Handlers'

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
  const methods = useForm({ defaultValues: TournamentDefaultValues })

  return (
    <ApolloProvider client={client}>
      <ThemeProvider defaultTheme="dark">
        <Layout>
          <Form {...methods}>
            {/* Both Header and Teams require the SAME playerinfo field arrays (different arrays = different scopes, so appending or removing inputs will not be reflected in the ui), so its wrapped in a context */}
            {/* see https://github.com/react-hook-form/react-hook-form/issues/1561#issuecomment-623398286 for more details */}
            <PlayerFormFieldArrayProvider>
              <Router hook={useHashLocation}>
                {/* this component is how the slippi data is processed and received, and how navigation to settings/etc happens */}
                <Handlers>
                  <Toast />
                  <Switch>
                    <Route path="/" component={Tournament}></Route>
                    <Route path="/settings" nest>
                      <Settings>
                        <Switch>
                          <Route path="/" component={Obs}></Route>
                          <Route path="/obs" component={Obs}></Route>
                          <Route path="/slippi" component={Slippi}></Route>
                          <Route path="/startgg" component={Startgg}></Route>
                        </Switch>
                      </Settings>
                    </Route>
                    {/* fallback route (route does not exist) */}

                    <Route>
                      {(params) => (
                        <center>
                          <b>404:</b> Sorry, this page{' '}
                          <code>&quot;{params['*' as any]}/&quot;</code> does not exist!
                        </center>
                      )}
                    </Route>
                  </Switch>
                </Handlers>
              </Router>
            </PlayerFormFieldArrayProvider>
          </Form>
        </Layout>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default App
