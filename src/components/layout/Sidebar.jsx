import React, { useState, createContext, useContext } from "react";
import { LOGO } from "../../assets";
import { IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react";
import { useAuth } from "../../hooks/useAuth";
import {
  IconUserFilled,
  IconLayout2Filled,
  IconMessage2Filled,
  IconChartAreaFilled,
  IconLogout2,
} from "@tabler/icons-react";
import { ROUTES } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

const SidebarContext = createContext();

export default function Sidebar({
  children,
  isOpen: controlledIsOpen,
  onToggle,
}) {
  const { user, logout } = useAuth();
  const [internalIsOpen, setInternalIsOpen] = useState(true);

  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const toggleSidebar = () => {
    if (onToggle) {
      onToggle(!isOpen);
    } else {
      setInternalIsOpen(!isOpen);
    }
  };
  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-in-out ${
        isOpen ? "w-72" : "w-20"
      }`}
    >
      <nav className="h-full flex flex-col bg-white border-r border-gray-50 shadow-xs">
        <div
          className={`p-4 pb-2 mt-4 flex items-center justify-between overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "flex-row" : "flex-col-reverse gap-4"
          }`}
        >
          <div className={`flex items-center gap-2 `}>
            <img src={LOGO} alt="Haven" className="w-10 h-10" />
            <span
              className={`${
                isOpen ? "block" : "hidden"
              } text-xl font-semibold lowercase`}
            >
              Haven
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300 ease-in-out"
          >
            {isOpen ? (
              <IconChevronsLeft className="w-6 h-6" />
            ) : (
              <IconChevronsRight className="w-6 h-6" />
            )}
          </button>
        </div>

        <SidebarContext.Provider
          value={{ isOpen, sidebarWidth: isOpen ? 288 : 80 }}
        >
          <ul className="flex-1 px-3 mt-4 overflow-hidden">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t border-gray-200 my-1 flex p-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold">
            {user?.full_name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              isOpen ? "w-52 ml-3 " : "w-0"
            }`}
          >
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">
                {user?.full_name}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <IconLogout2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function AppSidebar({ activeRoute }) {
  return (
    <div className="flex flex-col items-center justify-between gap-1">
      <SidebarItem
        icon={<IconLayout2Filled className="w-6 h-6" />}
        label="Dashboard"
        active={activeRoute === ROUTES.DASHBOARD}
        alert={false}
        route={ROUTES.DASHBOARD}
      />
      <SidebarItem
        icon={<IconMessage2Filled className="w-6 h-6" />}
        label="Chat"
        active={activeRoute === ROUTES.CHAT}
        alert={true}
        route={ROUTES.CHAT}
      />
      <SidebarItem
        icon={<IconChartAreaFilled className="w-6 h-6" />}
        label="Insights"
        active={activeRoute === ROUTES.INSIGHTS}
        alert={false}
        route={ROUTES.INSIGHTS}
      />
      <SidebarItem
        icon={<IconUserFilled className="w-6 h-6" />}
        label="Profile"
        active={activeRoute === ROUTES.PROFILE}
        alert={true}
        route={ROUTES.PROFILE}
      />
    </div>
  );
}

export function SidebarItem({ icon, label, active, alert, route }) {
  const { isOpen } = useContext(SidebarContext);
  const navigate = useNavigate();
  return (
    <li
      className={`
    relative group flex items-center py-2 my-2 gap-1 pl-1 font-medium cursor-pointer transition-colors
    ${
      active
        ? "border-l-3 border-primary-500"
        : "text-gray-600 hover:text-gray-900"
    }
    `}
      onClick={() => navigate(route)}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all duration-300 ease-in-out font-normal text-sm ${
          isOpen ? "w-52 ml-3" : "w-0"
        }`}
      >
        {label}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-primary-500 ${
            isOpen ? "" : "top-2"
          }`}
        ></div>
      )}
      {!isOpen && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-primary-100 z-40 text-primary-500 text-xs font-medium invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {label}
        </div>
      )}
    </li>
  );
}
