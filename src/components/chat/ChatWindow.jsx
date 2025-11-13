import { useEffect, useState, useCallback } from 'react';
import chatService from '../../services/chat.service';
import { useChatSocket } from '../../hooks/useChatSocket';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';
import { Alert } from '../common/Alert';

export const ChatWindow = ({ sessionId, onStreamComplete }) => {
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
    } catch (err) {
      addToast('Failed to load session details', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, addToast]);

  const silentRefreshSessionDetails = useCallback(async () => {
    if (!sessionId) return;
    try {
      const response = await chatService.getSessionDetails(sessionId, 0, 50);
      setSessionDetails(response.data.session);
    } catch (err) {
      addToast('Failed to refresh session title', 'error');
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
    if (error) return null;
    if (isConnecting)
      return <p className="text-xs text-yellow-600">Connecting...</p>;
    if (isStreaming)
      return <p className="text-xs text-primary-600">Haven is typing...</p>;
    if (isConnected) return <p className="text-xs text-green-600">Connected</p>;
    return <p className="text-xs text-red-600">Disconnected</p>;
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/20">
        <h2 className="text-lg font-semibold text-gray-900">
          {sessionDetails?.title || 'Chat'}
        </h2>
        {getStatusMessage()}
        {error && <Alert type="error" message={error} onClose={() => {}} />}
      </div>

      <MessageList messages={messages} />

      <MessageInput
        onSend={sendMessage}
        disabled={!isConnected || isStreaming}
      />
    </div>
  );
};