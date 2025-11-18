import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";
import { useState } from "react";
import { LOGO } from "../../assets";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav className=" border-white/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME}
            className="flex items-center gap-2"
          >
            <div className=" rounded-xl flex items-center justify-center">
              <img src={LOGO} alt="Haven" className="w-10 h-10" />
            </div>
            <span className="text-xl font-semibold lowercase">Haven</span>
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold">
                  {user?.full_name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.full_name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 glass-effect rounded-xl shadow-xl z-20 animate-slide-up">
                    <Link
                      to={ROUTES.DASHBOARD}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/50 rounded-t-xl transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <DashboardIcon />
                      <span className="text-sm font-medium text-gray-700">
                        Dashboard
                      </span>
                    </Link>
                    <Link
                      to={ROUTES.CHAT}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <ChatIcon />
                      <span className="text-sm font-medium text-gray-700">
                        Chat
                      </span>
                    </Link>
                    <Link
                      to={ROUTES.INSIGHTS}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <InsightsIcon />
                      <span className="text-sm font-medium text-gray-700">
                        Insights
                      </span>
                    </Link>
                    <Link
                      to={ROUTES.PROFILE}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <ProfileIcon />
                      <span className="text-sm font-medium text-gray-700">
                        Profile
                      </span>
                    </Link>

                    <div className="border-t border-gray-200 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-b-xl transition-colors w-full text-left"
                    >
                      <LogoutIcon />
                      <span className="text-sm font-medium text-red-600">
                        Logout
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to={ROUTES.LOGIN}
                className="p-2 w-28 border border-gray-300 text-center rounded-xl font-semibold text-sm"
              >
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="bg-black text-white p-2 w-28 text-center rounded-xl font-semibold text-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// Icons
const DashboardIcon = () => (
  <svg
    className="w-5 h-5 text-gray-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);
const ChatIcon = () => (
  <svg
    className="w-5 h-5 text-gray-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);
const InsightsIcon = () => (
  <svg
    className="w-5 h-5 text-gray-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);
const ProfileIcon = () => (
  <svg
    className="w-5 h-5 text-gray-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const LogoutIcon = () => (
  <svg
    className="w-5 h-5 text-red-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);
