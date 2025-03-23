import React, { Component, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import Works from './Work';
import Statistic from './Statistic';
import Account from './Account';
import Login from './Login';
import Signup from './Signup';
import { UserProvider, UserContext } from "./contexts/user.context";
import FileProvider from "./contexts/filescontext";
import { store } from './files/store';
import { Provider } from 'react-redux';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const { user } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        user && restricted ? (
          <Redirect to="/home" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

class App extends Component {
  render() {
    return (
      <Router>
        <Provider store={store}>
          <UserProvider>
            <FileProvider>
              <Switch>
                <PublicRoute restricted={true} component={Login} path="/" exact />
                <PublicRoute restricted={true} component={Login} path="/login" />
                <PublicRoute restricted={true} component={Signup} path="/signup" />
                <PrivateRoute path="/home" component={Home} />
                <PrivateRoute path="/work" component={Works} />
                <PrivateRoute path="/account" component={Account} />
                <PrivateRoute path="/statistic" component={Statistic} />
              </Switch>
            </FileProvider>
          </UserProvider>
        </Provider>
      </Router>
    );
  }
}

export default App;
