import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "../../components/common/Card";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import Sidebar, { AppSidebar } from "../../components/layout/Sidebar";
import {
  IconAi,
  IconChartAreaFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import InsightChart from "../../components/insights/InsightChart";
import { DashboardCard } from "../../components/user/DashboardCard";
import { EMERGENCY_IMAGE } from "../../assets";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const features = [
    {
      title: "AI Chat Support",
      description: "Talk to our AI therapist anytime you need support",
      icon: <IconAi />,
      color: "from-blue-500 to-blue-600",
      action: "Start Chat",
      link: ROUTES.CHAT,
    },
    // {
    //   title: "Insights",
    //   description: "Get personalized insights based on your conversations",
    //   icon: <IconChartAreaFilled />,
    //   color: "from-purple-500 to-purple-600",
    //   action: "View Insights",
    //   link: ROUTES.INSIGHTS,
    // },
    {
      title: "Your Profile",
      description: "Manage your account settings and preferences",
      icon: <IconUserFilled />,
      color: "from-green-500 to-green-600",
      action: "View Profile",
      link: ROUTES.PROFILE,
    },
  ];

  return (
    <div className="flex overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onToggle={setIsSidebarOpen}>
        <AppSidebar activeRoute={ROUTES.DASHBOARD} />
      </Sidebar>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-72" : "ml-20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Hello,{user?.full_name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-sm text-gray-600">Great to see you again!</p>
          </div>

          <div className="my-16 flex flex-col md:flex-row gap-6">
            <InsightChart />
            <DashboardCard user={user} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {features.map((feature, index) => (
              <Link to={feature.link} key={index} className="">
                <Card className="h-64 flex flex-col justify-between">
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 border border-gray-400`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                    {feature.action}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Card>
              </Link>
            ))}
            <Card className="h-64 flex flex-col justify-between">
              <div className="flex-1 flex flex-col items-between justify-center">
                <img
                  src={EMERGENCY_IMAGE}
                  alt="Emergency"
                  className="w-20 h-20 rounded-lg"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Need immediate help?
                </h3>
                <p className="text-gray-700 mb-3 text-sm">
                  Experiencing a mental health emergency? Reach out to a crisis
                  helpline below.
                </p>
                <div className="flex items-center justify-between gap-3">
                  <a
                    href="tel:988"
                    className="inline-flex items-center gap-2 px-4  w-1/2 py-2 bg-black text-white font-semibold rounded-xl transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Call
                  </a>
                  <a
                    href="sms:741741"
                    className="inline-flex items-center gap-2 px-4  w-1/2 py-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    Text
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
