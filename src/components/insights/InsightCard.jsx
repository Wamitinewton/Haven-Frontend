import { formatDistanceToNow } from 'date-fns';

export const InsightCard = ({
  insight,
  onClick,
  formatDate,
  getInsightTypeIcon,
  getInsightTypeColor,
}) => {
  return (
    <button
      onClick={() => onClick(insight)}
      className="bg-white rounded-2xl border border-gray-200 p-6 text-left hover:border-gray-300 hover:shadow-md transition-all group w-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${getInsightTypeColor(
            insight.type
          )}`}
        >
          {getInsightTypeIcon(insight.type)}
        </div>
        <span className="text-xs text-gray-400">
          {formatDate(insight.created_at)}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700">
        {insight.title || 'Insight'}
      </h3>

      <p className="text-sm text-gray-500 line-clamp-3 mb-4">
        {insight.content}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${getInsightTypeColor(
            insight.type
          )}`}
        >
          {insight.type}
        </span>
        <span className="text-xs text-gray-400 group-hover:text-gray-600 flex items-center gap-1">
          View details
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </button>
  );
};