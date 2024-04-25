import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../App";
import React from "react";
import {
  AgentsIcon,
  ImmigrantIcon,
  MigrationIrregulierIcon,
  PiroguesIcon,
  StatsIcon,
} from "./icons";
import { DisconnectButton } from "./buttons";

function NavItem({
  to,
  children,
  icon,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();
  const isActive = pathname === to;
  return (
    <li>
      <Link
        className={`flex flex-row gap-x-2 rounded-md p-3 text-sm font-semibold transition-all duration-100 ${isActive ? "bg-[#E5EEFF] text-primary" : "bg-transparent text-gray"}`}
        to={to}
      >
        <span className={` ${isActive ? "fill-primary " : "fill-gray"}`}>
          {icon}
        </span>
        {children}
      </Link>
    </li>
  );
}

export function AdminProtectedLayout() {
  const authContext = React.useContext(AuthContext);
  if (!authContext.authData || !authContext.authData.user.is_admin) {
    return <Navigate to="/" />;
  }
  return (
    <div className="flex h-screen flex-row">
      <ul className="flex w-[14%] flex-col gap-y-2 border-r-2 border-r-primaryBorder bg-white px-6 pt-20">
        <h3
          onClick={() => {
            authContext.logOut();
          }}
          className="mb-10 font-semibold text-gray"
        >
          Menu
        </h3>
        <NavItem to="/admin/" icon={<StatsIcon />}>
          Statistiques
        </NavItem>
        <NavItem to="/admin/agents" icon={<AgentsIcon />}>
          Agents
        </NavItem>
        <NavItem to="/admin/pirogues" icon={<PiroguesIcon />}>
          Pirogues
        </NavItem>
        <NavItem to="/admin/immigrants" icon={<ImmigrantIcon />}>
          Immigrants
        </NavItem>
        <NavItem
          to="/admin/migration_irreguliere"
          icon={<MigrationIrregulierIcon />}
        >
          Migration Irrégulière
        </NavItem>
        <DisconnectButton
          className="text-semibold mb-20 mt-auto self-center"
          onClick={() => {
            // open this link http://127.0.0.1:8000/immigrants/pdf?created_by=1 in a new tab
            // window.open("http://127.0.0.1:8000/immigrants/pdf?created_by=1");
            authContext.logOut();
          }}
        />
      </ul>
      <section className="mx-10 h-screen flex-1 overflow-y-auto pt-10">
        <Outlet />
      </section>
    </div>
  );
}
