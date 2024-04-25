import { useContext } from "react";
import { AuthContext } from "../App";
import { Navigate } from "react-router-dom";
import { Input } from "../components/comps";
import { FilledButton } from "../components/buttons";
import logo from "../assets/logo.jpeg";
import { rootUrl } from "../models/constants";

export default function LoginPage() {
  const authContext = useContext(AuthContext);

  if (authContext.authData) {
    if (
      authContext.authData.user.is_admin ||
      authContext.authData.user.is_superuser
    ) {
      return <Navigate to="/admin" />;
    }
    return <Navigate to="/" />;
  }

  function logIn() {
    const username = document.getElementById(
      "username_input",
    ) as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    authContext.logIn(username.value, password.value);
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex w-[90%] flex-col md:w-[400px] ">
        <img src={logo} alt="logo" className="mb-6 h-24 w-24 self-center" />
        <h1 className="mb-9 self-center text-3xl font-semibold">
          Connectez Vous
        </h1>
        <Input
          id="username_input"
          className="mb-6 text-xl"
          placeholder="Nom d'utilisateur"
        />
        <Input
          id="password"
          type="password"
          className="mb-9 text-xl"
          placeholder="Mot de passe"
        />
        <FilledButton onClick={logIn}>Se connecter</FilledButton>
      </div>
    </div>
  );
}
