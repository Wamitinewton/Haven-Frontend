import { useState, useEffect, useCallback, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { WS_BASE_URL } from '../utils/constants';
import tokenService from '../services/token.service';

const STREAMING_ID = 'ai-streaming-message';

export const useChatSocket = (sessionId, onStreamComplete) => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingContentRef = useRef('');

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    sessionId ? WS_BASE_URL : null,
    {
      onOpen: () => {
        console.log('WebSocket connected');
        setError(null);
      },
      onClose: () => {
        console.log('WebSocket disconnected');
      },
      onError: (err) => {
        console.error('WebSocket error:', err);
        setError('Connection failed. Please check if the server is running.');
      },
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
      retryOnError: true,
    }
  );

  useEffect(() => {
    if (lastJsonMessage !== null) {
      const data = lastJsonMessage;

      if (data.type === 'chunk') {
        setIsStreaming(true);

        streamingContentRef.current += data.content;

        setMessages((prevMessages) => {
          const streamingMsgIndex = prevMessages.findIndex(
            (msg) => msg.id === STREAMING_ID
          );

          if (streamingMsgIndex === -1) {
            const newMessage = {
              id: STREAMING_ID,
              role: 'ASSISTANT',
              content: streamingContentRef.current,
              createdAt: new Date().toISOString(),
              isStreaming: true,
            };
            return [...prevMessages, newMessage];
          } else {
            const updatedMessages = [...prevMessages];
            updatedMessages[streamingMsgIndex] = {
              ...updatedMessages[streamingMsgIndex],
              content: streamingContentRef.current,
            };
            return updatedMessages;
          }
        });
      } else if (data.type === 'complete') {
        setIsStreaming(false);

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === STREAMING_ID
              ? { 
                  ...msg, 
                  id: `ai-msg-${Date.now()}`,
                  isStreaming: false 
                }
              : msg
          )
        );

        streamingContentRef.current = '';

        if (onStreamComplete) {
          onStreamComplete();
        }
      } else if (data.type === 'error') {
        setIsStreaming(false);
        setError(data.message || 'An unknown WebSocket error occurred');
        
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== STREAMING_ID)
        );

        streamingContentRef.current = '';
      }
    }
  }, [lastJsonMessage, onStreamComplete]);

  const sendMessage = useCallback((message) => {
    if (readyState === ReadyState.OPEN) {
      const token = tokenService.getAccessToken();
      const payload = {
        token,
        sessionId,
        message,
      };

      const userMessage = {
        id: `user-${Date.now()}`,
        role: 'USER',
        content: message,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      sendJsonMessage(payload);
    } else {
      setError('WebSocket is not connected. Please wait...');
    }
  }, [readyState, sessionId, sendJsonMessage]);

  const isConnected = readyState === ReadyState.OPEN;
  const isConnecting = readyState === ReadyState.CONNECTING;

  return {
    messages,
    setMessages,
    isConnected,
    isConnecting,
    isStreaming,
    error,
    sendMessage,
  };
};