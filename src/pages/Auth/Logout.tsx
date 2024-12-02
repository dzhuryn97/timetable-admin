import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Logout() {
  const authContext = useContext(AuthContext);
  authContext.setAuthUser(() => null);

  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("authName");

  return <Navigate to={"/login"}></Navigate>;
}
