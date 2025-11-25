import React from "react";
import { LOGO } from "../../assets";
import { IconChevronsLeft } from "@tabler/icons-react";
import { useAuth } from "../../hooks/useAuth";
import { IconSettingsFilled } from "@tabler/icons-react";

export default function Sidebar({ children }) {
  const { user } = useAuth();
  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r border-white/20 shadow-sm">
        <div className="p-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={LOGO} alt="Haven" className="w-10 h-10" />
            <span className="text-xl font-semibold lowercase">Haven</span>
          </div>
          <button className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
            <IconChevronsLeft className="w-6 h-6" />
          </button>
        </div>
        <ul className="flex-1 px-3">{children}</ul>
        <div className="border-t border-gray-200 my-1 flex p-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold">
            {user?.full_name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className={`flex justify-between items-center w-52 ml-3`}>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">
                {user?.full_name}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
              <IconSettingsFilled className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, label, active, alert }) {
  return (
    <li
      className={`
    relative flex items-center py-2 my-4 gap-1 pl-1 font-medium cursor-pointer transition-colors
    ${
      active
        ? "border-l-3 border-primary-500"
        : "text-gray-600 hover:text-gray-900"
    }
    `}
    >
      {icon}
      <span className="font-normal w-52 ml-3">{label}</span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-primary-500`}
        ></div>
      )}
    </li>
  );
}
