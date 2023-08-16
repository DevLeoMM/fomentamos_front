import { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import AuthContext from "../../AuthContext/AuthContext";

function PublicRoute(props) {
  const { auth } = useContext(AuthContext);

  if (auth.login) return <Redirect to="/dashboard" />;
  return <Route {...props} />;
}

export default PublicRoute;
