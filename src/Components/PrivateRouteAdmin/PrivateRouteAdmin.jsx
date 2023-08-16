import { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import AuthContext from "../../AuthContext/AuthContext";

function PrivateRouteAdmin(props) {
  const { auth } = useContext(AuthContext);

  if (auth.login) return <Route {...props} />;

  return <Redirect to="/" />;
}

export default PrivateRouteAdmin;
