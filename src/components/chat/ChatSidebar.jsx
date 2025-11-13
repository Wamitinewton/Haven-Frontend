import { LoadingSpinner } from '../common/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export const ChatSidebar = ({
  selectedSessionId,
  sessions,
  isLoading,
  isCreating,
  onNewChat,
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full sm:w-1/3 md:w-1/4 h-full border-r border-white/20 flex flex-col">
      <div className="p-4 border-b border-white/20">
        <button
          className="btn-primary w-full text-sm"
          onClick={onNewChat}
          disabled={isCreating}
        >
          {isCreating ? 'Starting...' : '+ New Chat'}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
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
              onClick={() => navigate(`${ROUTES.CHAT}/${session.sessionId}`)}
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
      className={`w-full text-left p-3 rounded-xl transition-colors ${
        isSelected ? 'bg-primary-100/80' : 'hover:bg-white/50'
      }`}
    >
      <h3 className="text-sm font-semibold text-gray-800 truncate">
        {session.title}
      </h3>
      <p className="text-xs text-gray-500">
        {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
      </p>
    </button>
  );
};