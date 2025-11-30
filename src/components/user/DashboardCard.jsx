import { Card } from "../common/Card";

export const DashboardCard = ({ user }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="animate-fade-in w-full md:w-1/3">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
          {user?.full_name?.charAt(0).toUpperCase() || "U"}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {user?.full_name}
        </h2>

        <p className="text-gray-600 mb-4">{user?.email}</p>

        <div className="flex items-center gap-2 mb-6">
          {user?.is_email_verified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Not Verified
            </span>
          )}
        </div>

        <div className="w-full border-t border-gray-200 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm font-medium">Joined</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {user?.created_at ? formatDate(user.created_at) : "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm font-medium">Last Login</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {user?.last_login ? formatDate(user.last_login) : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
