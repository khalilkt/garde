import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios, { Axios, AxiosError } from "axios";
import { rootUrl } from "./models/constants";
import {
  BrowserRouter,
  Navigate,
  Route,
  Router,
  Routes,
  Outlet,
} from "react-router-dom";
import LoginPage from "./ROUTES/login_page";
import { AdminProtectedLayout } from "./components/admin_layout";
import AdminAgentsPage from "./ROUTES/admin/admin_agents_page";
import AdminAgentPiroguesPage from "./ROUTES/admin/agent&admin_pirogues_page";
import AdminAgentImmigrantsPage from "./ROUTES/admin/agent&admin_immigrants_page";
import AdminStatsPage from "./ROUTES/admin/admin_stats_page";
import MigrationIrregulierePage from "./ROUTES/admin/migration_irreguliere";
import AdminReportPage from "./ROUTES/admin/admin_report_page";
import AdminComparaisonPage from "./ROUTES/admin/admin_comparaison_page";

interface UserInterface {
  id: number;
  username: string;
  name: string;
  is_admin: boolean;
  is_superuser: boolean;
}
export interface AuthData {
  token: string;
  user: UserInterface;
}
export const AuthContext = React.createContext<{
  inited: boolean;
  authData: AuthData | null;
  logIn: (username: string, password: string) => void;
  logOut: () => void;
}>({
  inited: false,
  authData: null,
  logIn: () => {},
  logOut: () => {},
});

function AgentProtectedLayout() {
  const authContext = React.useContext(AuthContext);
  if (!authContext.authData) {
    return <Navigate to="/login" />;
  } else if (
    authContext.authData.user.is_admin ||
    authContext.authData.user.is_superuser
  ) {
    return <Navigate to="/admin" />;
  }
  return (
    <div className=" px-8 pb-12 pt-12 lg:px-10 lg:pb-0 lg:pt-20">
      <Outlet />
    </div>
  );
}

function App() {
  const [inited, setInited] = React.useState(false);
  const [authData, setAuthData] = React.useState<AuthData | null>(null);

  async function logIn(username: string, password: string) {
    try {
      const response = await axios.post(rootUrl + "auth/login/", {
        username: username,
        password: password,
      });
      if (response.data) {
        localStorage.setItem("token", response.data.token);
        setAuthData(response.data);
      }
    } catch (e) {
      console.log(e);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    }
  }

  function logOut() {
    localStorage.removeItem("token");
    setAuthData(null);
  }

  async function init() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.post(rootUrl + "auth/token/", {
          token: token,
        });
        if (response.data) {
          setAuthData(response.data);
        } else {
          localStorage.removeItem("token");
        }
      } catch (e) {
        console.log(e);
      }
    }
    setInited(true);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <BrowserRouter>
      <div className="text-black">
        <AuthContext.Provider
          value={{
            inited: inited,
            authData: authData,
            logIn: logIn,
            logOut: logOut,
          }}
        >
          {!inited ? (
            <div>Chargement...</div>
          ) : (
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route path="/" element={<AgentProtectedLayout />}>
                <Route path="/" element={<AdminAgentPiroguesPage />} />
                <Route
                  path="immigrants"
                  element={<AdminAgentImmigrantsPage />}
                />
              </Route>
              <Route path="/admin" element={<AdminProtectedLayout />}>
                <Route path="" element={<AdminStatsPage />} />
                <Route path="agents" element={<AdminAgentsPage />} />
                <Route path="pirogues" element={<AdminAgentPiroguesPage />} />
                <Route
                  path="immigrants"
                  element={<AdminAgentImmigrantsPage />}
                />
                <Route
                  path="migration_irreguliere"
                  element={<MigrationIrregulierePage />}
                />
                <Route path="rapports" element={<AdminReportPage />} />
                <Route path="comparaison" element={<AdminComparaisonPage />} />
              </Route>
            </Routes>
          )}
        </AuthContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
