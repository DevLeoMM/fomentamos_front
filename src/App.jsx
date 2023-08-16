import React from "react";
import { AuthProvider } from "./AuthContext/AuthContext";
import Login from "./Pages/Login";
import dashboard from "./Pages/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { HashRouter, Route, Switch } from "react-router-dom";
import PublicRoute from "./Components/PublicRoute/PublicRoute";
import PrivateRouteAdmin from "./Components/PrivateRouteAdmin/PrivateRouteAdmin";
import NotFounPage from "./Components/NotFounPage/NotFounPage";

//ok
function App() {
  return (
    <>
      <AuthProvider>
        <ToastContainer />
          <HashRouter>
            <Switch>
            <PublicRoute exact path="/" component={Login} />
            <PrivateRouteAdmin exact path="/dashboard" component={dashboard} />

            <Route path="*" component={NotFounPage} />
            </Switch>
          </HashRouter>
      </AuthProvider>

      
    </>
  );
}

export default App;
