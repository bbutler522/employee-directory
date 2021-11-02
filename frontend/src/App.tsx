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
        <div className="bg-gray-50">

          <div className="flex flex-row p-5">
            <nav className="w-32 mt-5 flex flex-col">
              <ul className="w-full flex flex-col justify-center items-center">

                <li className="bg-white p-5 rounded-l-full selected-li shadow-md">
                  <div>
                    <Link to="/" className="text-white text-xs bg-blue-600 w-24 h-24 rounded-full flex flex-col justify-center items-center bg-white"> <IconUsers></IconUsers> Directory</Link>
                  </div>
                </li>
              </ul>
            </nav>


            <Switch>
              <div className=" w-full bg-white px-10 pb-10 mt-5 shadow-md">
                <Route path="/">
                  <DirectoryPage />
                </Route>
              </div>
            </Switch>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

function IconUsers() {
  return (
  <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>)
}

export default App;
