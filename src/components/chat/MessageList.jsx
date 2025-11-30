import { useEffect, useRef } from "react";
import { MarkdownRenderer } from "../common/MarkdownRenderer";
import { useAuth } from "../../hooks/useAuth";
import { format } from "date-fns";
import { LOGO } from "../../assets";
export const MessageList = ({ messages }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const userInitial = user?.full_name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-4 md:space-y-6">
      {messages.map((msg, index) => (
        <MessageItem
          key={msg.id || index}
          message={msg}
          isUser={msg.role === "USER"}
          userInitial={userInitial}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

const MessageItem = ({ message, isUser, userInitial }) => {
  const isStreaming = message.id === "ai-streaming-message";

  const Avatar = () => (
    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border border-gray-400 bg-white text-black font-semibold text-xs md:text-sm shrink-0">
      {isUser ? (
        userInitial
      ) : (
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border border-gray-400 bg-white text-black font-semibold text-xs md:text-sm shrink-0">
          <img src={LOGO} alt="Haven" className="w-6 h-6 md:w-8 md:h-8" />
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`flex gap-2 md:gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && <Avatar />}
      <div className="flex flex-col">
        <div
          className={`w-auto max-w-[85%] sm:max-w-xs md:max-w-md lg:max-w-2xl rounded-lg p-3 md:p-4 ${
            isUser ? "bg-gray-100" : "bg-white"
          }`}
        >
          <div className="text-black">
            <MarkdownRenderer>{message.content}</MarkdownRenderer>
            {isStreaming && (
              <span className="inline-block w-2 h-2 ml-1 bg-black rounded-full animate-pulse" />
            )}
          </div>
        </div>
        <p
          className={`text-xs text-gray-500 mt-1 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {format(new Date(message.createdAt), "p")}
        </p>
      </div>
      {isUser && <Avatar />}
    </div>
  );
};
