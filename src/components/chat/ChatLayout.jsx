import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";
import { WelcomePlaceholder } from "./WelcomePlaceholder";
import chatService from "../../services/chat.service";
import { useToast } from "../../context/ToastContext";
import { ROUTES } from "../../utils/constants";

export const ChatLayout = ({ selectedSessionId }) => {
  const [sessions, setSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Close sidebar on mobile when a chat is selected
  useEffect(() => {
    if (selectedSessionId) {
      setIsSidebarOpen(false);
    }
  }, [selectedSessionId]);

  const fetchSessions = useCallback(async () => {
    try {
      const response = await chatService.getChatSessions(0, 20);
      setSessions(response.data.content || []);
    } catch {
      addToast("Failed to refresh chat history", "error");
    }
  }, [addToast]);

  const initialFetchSessions = useCallback(async () => {
    setIsLoadingSessions(true);
    try {
      const response = await chatService.getChatSessions(0, 20);
      setSessions(response.data.content || []);
    } catch {
      addToast("Failed to load chat history", "error");
    } finally {
      setIsLoadingSessions(false);
    }
  }, [addToast]);

  useEffect(() => {
    initialFetchSessions();
  }, [initialFetchSessions]);

  const handleNewChat = async () => {
    setIsCreating(true);
    try {
      const response = await chatService.startChatSession();
      const newSession = response.data;
      setSessions([newSession, ...sessions]);
      addToast(response.message || "New chat started!", "success");
      navigate(`${ROUTES.CHAT}/${newSession.sessionId}`);
    } catch {
      addToast("Failed to start new chat", "error");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden relative">
        <div
          className={`absolute md:relative inset-0 z-50 md:z-auto transition-transform duration-300 ease-in-out ${
            isSidebarOpen || !selectedSessionId
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          } ${selectedSessionId ? "md:block" : "block"}`}
        >
          <ChatSidebar
            selectedSessionId={selectedSessionId}
            sessions={sessions}
            isLoading={isLoadingSessions}
            isCreating={isCreating}
            onNewChat={handleNewChat}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && selectedSessionId && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full bg-white min-w-0">
          {selectedSessionId ? (
            <ChatWindow
              key={selectedSessionId}
              sessionId={selectedSessionId}
              onStreamComplete={fetchSessions}
              onMenuClick={() => setIsSidebarOpen(true)}
            />
          ) : (
            <WelcomePlaceholder />
          )}
        </div>
      </div>
    </div>
  );
};
