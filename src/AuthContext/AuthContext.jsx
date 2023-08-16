/* eslint-disable eqeqeq */
import React, { useState } from "react";

const AuthContext = React.createContext();

let initialAuth = {}

if ((process.env.NODE_ENV || '').trim() == 'production') {
  initialAuth = {
    login: false,
    jwt : null,
    username: null,
  };
}

if ((process.env.NODE_ENV || '').trim() !== 'production') {
  initialAuth = {
      login: false,
      username: null,
      jwt : null,
  };
};

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialAuth);

  const data = { auth, setAuth };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
export default AuthContext;