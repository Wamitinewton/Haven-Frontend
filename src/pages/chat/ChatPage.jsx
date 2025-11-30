import { ChatLayout } from "../../components/chat/ChatLayout";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Sidebar, { AppSidebar } from "../../components/layout/Sidebar";
import { ROUTES } from "../../utils/constants";

export const ChatPage = () => {
  const { sessionId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onToggle={setIsSidebarOpen}>
        <AppSidebar activeRoute={ROUTES.CHAT} />
      </Sidebar>

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-72" : "ml-20"
        }`}
      >
        <ChatLayout key={sessionId} selectedSessionId={sessionId} />
      </div>
    </div>
  );
};
