import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useLocation
} from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

import DirectoryPage from './pages/Directory';
import EmployeeCreatePage from './pages/EmployeeCreate';
import EmployeePage from './pages/Employee'
import Nav from './components/Nav';

function App() {

  const client = new ApolloClient({
    uri: 'http://localhost:3000/api/graphql',
    cache: new InMemoryCache(),
  });

  return (
    <Router>
      <ApolloProvider client={client}>
        <div className="bg-gray-50">

          <div className="flex flex-row p-5">
            <Nav></Nav>
            
            <div className=" w-full bg-white px-10 pb-10 mt-5 shadow-md">
              <Switch>
                  <Route exact path="/">
                    <DirectoryPage />
                  </Route>
                  <Route exact path="/employee/create">
                    <EmployeeCreatePage></EmployeeCreatePage>
                  </Route>
                  <Route exact path="/employee/*">
                    <EmployeePage></EmployeePage>
                  </Route>
                  <Route path="*">
                    <Redirect to="/" />
                  </Route>
              </Switch>
            </div>
          </div>
        </div>
      </ApolloProvider>
    </Router>
  );
}

export default App;
