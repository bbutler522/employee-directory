import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

import DirectoryPage from './pages/Directory';

function App() {

  const client = new ApolloClient({
    uri: 'http://localhost:3000/api/graphql',
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Router>
        <div>

          <div className="flex flex-row">
            <nav>
              <ul>
                <li>
                  <Link to="/" className="h-8 w-48">Directory</Link>
                </li>
              </ul>
            </nav>


            <Switch>
              <Route path="/">
                <DirectoryPage />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}



export default App;
