import { LoadingSpinner } from "../common/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

export const ChatSidebar = ({
  selectedSessionId,
  sessions,
  isLoading,
  isCreating,
  onNewChat,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleSessionClick = (sessionId) => {
    navigate(`${ROUTES.CHAT}/${sessionId}`);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="w-full sm:w-80 md:w-64 h-full border-r border-gray-200 flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <button
          className="w-full text-sm font-medium py-2 px-4 border-2 border-black rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onNewChat}
          disabled={isCreating}
        >
          {isCreating ? "Starting..." : "+ New Chat"}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <LoadingSpinner />
          </div>
        ) : (
          sessions.map((session) => (
            <SessionItem
              key={session.sessionId}
              session={session}
              isSelected={session.sessionId === selectedSessionId}
              onClick={() => handleSessionClick(session.sessionId)}
            />
          ))
        )}
        {sessions.length === 0 && !isLoading && (
          <p className="text-center text-gray-500 text-sm p-4">
            No chat history.
          </p>
        )}
      </div>
    </div>
  );
};

const SessionItem = ({ session, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-colors ${
        isSelected ? "bg-gray-100 text-black" : "hover:bg-gray-50 text-gray-700"
      }`}
    >
      <h3 className="text-sm font-semibold truncate">{session.title}</h3>
      <p className="text-xs text-gray-500 mt-1">
        {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
      </p>
    </button>
  );
};
