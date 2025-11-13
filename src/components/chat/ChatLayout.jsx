import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatSidebar } from './ChatSidebar';
import { ChatWindow } from './ChatWindow';
import { WelcomePlaceholder } from './WelcomePlaceholder';
import chatService from '../../services/chat.service';
import { useToast } from '../../context/ToastContext';
import { ROUTES } from '../../utils/constants';

export const ChatLayout = ({ selectedSessionId }) => {
  const [sessions, setSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchSessions = useCallback(async () => {
    try {
      const response = await chatService.getChatSessions(0, 20);
      setSessions(response.data.content || []);
    } catch (error) {
      addToast('Failed to refresh chat history', 'error');
    }
  }, [addToast]);

  const initialFetchSessions = useCallback(async () => {
    setIsLoadingSessions(true);
    try {
      const response = await chatService.getChatSessions(0, 20);
      setSessions(response.data.content || []);
    } catch (error) {
      addToast('Failed to load chat history', 'error');
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
      addToast(response.message || 'New chat started!', 'success');
      navigate(`${ROUTES.CHAT}/${newSession.sessionId}`);
    } catch (error) {
      addToast('Failed to start new chat', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-1 w-full h-full">
      <div className="flex h-[calc(100vh-10rem)] rounded-2xl glass-effect overflow-hidden">
        <ChatSidebar
          selectedSessionId={selectedSessionId}
          sessions={sessions}
          isLoading={isLoadingSessions}
          isCreating={isCreating}
          onNewChat={handleNewChat}
        />
        <div className="flex-1 flex flex-col h-full">
          {selectedSessionId ? (
            <ChatWindow
              key={selectedSessionId}
              sessionId={selectedSessionId}
              onStreamComplete={fetchSessions}
            />
          ) : (
            <WelcomePlaceholder />
          )}
        </div>
      </div>
    </div>
  );
};