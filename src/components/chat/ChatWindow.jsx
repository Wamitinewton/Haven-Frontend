import { useEffect, useState, useCallback } from "react";
import chatService from "../../services/chat.service";
import { useChatSocket } from "../../hooks/useChatSocket";
import { useToast } from "../../context/ToastContext";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

export const ChatWindow = ({ sessionId, onStreamComplete, onMenuClick }) => {
  const [sessionDetails, setSessionDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialMessages, setInitialMessages] = useState([]);
  const { addToast } = useToast();

  const fetchSessionDetails = useCallback(async () => {
    if (!sessionId) return;
    setIsLoading(true);
    try {
      const response = await chatService.getSessionDetails(sessionId, 0, 50);
      setSessionDetails(response.data.session);
      setInitialMessages(response.data.messages || []);
    } catch {
      addToast("Failed to load session details", "error");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, addToast]);

  const silentRefreshSessionDetails = useCallback(async () => {
    if (!sessionId) return;
    try {
      const response = await chatService.getSessionDetails(sessionId, 0, 50);
      setSessionDetails(response.data.session);
    } catch {
      addToast("Failed to refresh session title", "error");
    }
  }, [sessionId, addToast]);

  useEffect(() => {
    fetchSessionDetails();
  }, [fetchSessionDetails]);

  const handleStreamComplete = useCallback(() => {
    if (onStreamComplete) {
      onStreamComplete();
    }
    silentRefreshSessionDetails();
  }, [onStreamComplete, silentRefreshSessionDetails]);

  const {
    messages,
    setMessages,
    isConnected,
    isConnecting,
    isStreaming,
    error,
    sendMessage,
  } = useChatSocket(sessionId, handleStreamComplete);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages, setMessages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  const getStatusMessage = () => {
    if (error) return "Disconnected";
    if (isConnecting) return "Connecting...";
    if (isStreaming) return "Haven is typing...";
    if (isConnected) return "Connected";
    return "Disconnected";
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      <div className="px-4 md:px-6 py-[14px] border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* Back/Menu Button for Mobile */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-black truncate">
              {sessionDetails?.title || "New Chat"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{getStatusMessage()}</p>
          </div>
        </div>
        {error && (
          <div className="mt-2 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-2">
            {error}
          </div>
        )}
      </div>

      <MessageList messages={messages} />

      <MessageInput
        onSend={sendMessage}
        disabled={!isConnected || isStreaming}
      />
    </div>
  );
};
