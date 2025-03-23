import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { App, Credentials } from "realm-web";
import { APP_ID } from "../realm/constants";

// Erstellen einer Realm App-Instanz
const app = new App(APP_ID);

export const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};


export class UserProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
    };
  }

  emailPasswordLogin = async (email, password) => {
    const credentials = Credentials.emailPassword(email, password);
    const authenticatedUser = await app.logIn(credentials);
    this.setState({ user: authenticatedUser });
    this.saveUserToLocalStorage(authenticatedUser);
    return authenticatedUser;
  };

  emailPasswordSignup = async (email, password) => {
    try {
      await app.emailPasswordAuth.registerUser(email, password);
      return this.emailPasswordLogin(email, password);
    } catch (error) {
      throw error;
    }
  };

  fetchUser = async () => {
    if (!app.currentUser) return false;
    try {
      await app.currentUser.refreshCustomData();
      this.setState({ user: app.currentUser });
      this.saveUserToLocalStorage(app.currentUser);
      return app.currentUser;
    } catch (error) {
      throw error;
    }
  };

  logOutUser = async () => {
    if (!app.currentUser) return false;
    try {
      this.removeUserFromLocalStorage();
      this.setState({ user: null });
      await app.currentUser.logOut();
      return true;
    } catch (error) {
      throw error;
    }
  };

  saveUserToLocalStorage = (user) => {
    localStorage.setItem("realm-user", JSON.stringify(user));
  };

  getUserFromLocalStorage = () => {
    const userJSON = localStorage.getItem("realm-user");
    return userJSON ? JSON.parse(userJSON) : null;
  };

  removeUserFromLocalStorage = () => {
    localStorage.removeItem("realm-user");
  };

  async componentDidMount() {
    try {
      const storedUser = this.getUserFromLocalStorage();

      if (storedUser) {
        this.setState({ user: storedUser });
      } else {
        await this.fetchUser();
      }
    } catch (error) {
      // Handle error while fetching user data
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    return (
      <UserContext.Provider
        value={{
          user: this.state.user,
          setUser: (user) => this.setState({ user }),
          fetchUser: this.fetchUser,
          emailPasswordLogin: this.emailPasswordLogin,
          emailPasswordSignup: this.emailPasswordSignup,
          logOutUser: this.logOutUser,
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default UserProvider;