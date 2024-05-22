import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../App";
import React from "react";
import {
  AgentsIcon,
  ImmigrantIcon,
  LeftArrow,
  MigrationIrregulierIcon,
  PiroguesIcon,
  StatsIcon,
} from "./icons";
import { DisconnectButton } from "./buttons";

function NavItem({
  to,
  children,
  icon,
  isOpen,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
}) {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <li>
      <Link
        className={`flex flex-row gap-x-2 overflow-x-clip text-ellipsis rounded-md p-3 text-sm font-semibold transition-all duration-100 ${isActive ? "bg-[#E5EEFF] text-primary" : "bg-transparent text-gray"}`}
        to={to}
      >
        <span className={` ${isActive ? "fill-primary " : "fill-gray"}`}>
          {icon}
        </span>
        {isOpen && children}
      </Link>
    </li>
  );
}

export function AdminProtectedLayout() {
  const authContext = React.useContext(AuthContext);
  const [isOpen, setIsOpen] = React.useState(true);

  if (!authContext.authData || !authContext.authData.user.is_admin) {
    return <Navigate to="/" />;
  }
  return (
    <div className="flex h-screen flex-row">
      <ul
        className={
          "relative flex flex-col gap-y-2 border-r-2 border-r-primaryBorder bg-white px-6 pt-20 transition-all duration-150 " +
          (isOpen ? "w-[14%]" : "w-[100px]")
        }
      >
        <button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className={`absolute right-0 flex h-10 w-10 translate-x-1/2 items-center justify-center rounded-full bg-primaryBorder p-3 transition-all ${isOpen ? "" : "rotate-180"}`}
        >
          {/* arrow icon */}
          <LeftArrow className="h-3 w-3 fill-black" />
        </button>
        <h3
          onClick={() => {
            // authContext.logOut();
          }}
          className="mb-10 font-semibold text-gray"
        >
          Menu
        </h3>
        <NavItem isOpen={isOpen} to="/admin" icon={<StatsIcon />}>
          Statistiques
        </NavItem>
        <NavItem isOpen={isOpen} to="/admin/agents" icon={<AgentsIcon />}>
          Agents
        </NavItem>
        <NavItem isOpen={isOpen} to="/admin/pirogues" icon={<PiroguesIcon />}>
          Pirogues
        </NavItem>
        <NavItem
          isOpen={isOpen}
          to="/admin/immigrants"
          icon={<ImmigrantIcon />}
        >
          Migrants
        </NavItem>
        <NavItem
          isOpen={isOpen}
          to="/admin/migration_irreguliere"
          icon={<MigrationIrregulierIcon />}
        >
          Migration Irrégulière
        </NavItem>
        <NavItem
          isOpen={isOpen}
          to="/admin/general_rapports"
          icon={<StatsIcon />}
        >
          Rapports Généraux
        </NavItem>
        <NavItem isOpen={isOpen} to="/admin/rapports" icon={<StatsIcon />}>
          Rapports
        </NavItem>
        <NavItem isOpen={isOpen} to="/admin/comparaison" icon={<StatsIcon />}>
          Comparaison
        </NavItem>
        <NavItem
          isOpen={isOpen}
          to="/admin/liberation"
          icon={<ImmigrantIcon />}
        >
          Libération
        </NavItem>
        <NavItem
          isOpen={isOpen}
          to="/admin/criminals"
          icon={
            <svg
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="m 2 0 c -0.550781 0 -1 0.449219 -1 1 v 8 c 0 2.5 1.816406 4.246094 3.445312 5.332031 c 1.628907 1.085938 3.238282 1.617188 3.238282 1.617188 c 0.207031 0.070312 0.425781 0.070312 0.632812 0 c 0 0 1.609375 -0.53125 3.238282 -1.617188 c 1.628906 -1.085937 3.445312 -2.832031 3.445312 -5.332031 v -8 c 0 -0.550781 -0.449219 -1 -1 -1 z m 1 2 h 10 v 7 c 0 1.5 -1.183594 2.753906 -2.554688 3.667969 c -1.214843 0.808593 -2.179687 1.128906 -2.445312 1.226562 c -0.265625 -0.097656 -1.230469 -0.417969 -2.445312 -1.226562 c -1.371094 -0.914063 -2.554688 -2.167969 -2.554688 -3.667969 z m 0 0"
                  fill="#2e3436"
                ></path>{" "}
              </g>
            </svg>
          }
        >
          Criminels
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
      <section className="h-screen flex-1 overflow-y-auto px-10  pt-10">
        <Outlet />
      </section>
    </div>
  );
}
