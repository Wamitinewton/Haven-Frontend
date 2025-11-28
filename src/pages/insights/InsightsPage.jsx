import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { usePaginate } from '../../hooks/usePaginate';
import insightService from '../../services/insight.service';
import { Pagination } from '../../components/common/Pagination';
import { InsightDetailModal } from '../../components/insights/InsightDetailModal';
import { ROUTES } from '../../utils/constants';

export const InsightsPage = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToast } = useToast();
  const pagination = usePaginate({ initialSize: 9 });

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const response = await insightService.getInsights(
        pagination.pageParams.page,
        pagination.pageParams.size
      );
      setInsights(response.data.content || []);
      pagination.setPaginationData(response.data);
    } catch (error) {
      addToast('Failed to load insights', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [pagination.pageParams.page]);

  const handleGenerateInsight = async () => {
    setIsGenerating(true);
    try {
      const response = await insightService.generateInsight();
      setInsights([response.data, ...insights]);
      addToast(response.message || 'New insight generated!', 'success');
    } catch (error) {
      addToast(
        error.response?.data?.message || 'Failed to generate insight',
        'error'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewInsight = async (insight) => {
    setSelectedInsight(insight);
    if (!insight.isRead) {
      try {
        const response = await insightService.markInsightAsRead(insight.id);
        const updatedInsight = response.data;
        setInsights((prev) =>
          prev.map((i) => (i.id === insight.id ? updatedInsight : i))
        );
        setSelectedInsight(updatedInsight);
      } catch (error) {
        addToast('Failed to mark insight as read', 'error');
      }
    }
  };

  const handleFeedback = async (id, helpful, feedbackText) => {
    try {
      const response = await insightService.provideInsightFeedback(
        id,
        helpful,
        feedbackText
      );
      const updatedInsight = response.data;
      setInsights((prev) =>
        prev.map((i) => (i.id === id ? updatedInsight : i))
      );
      setSelectedInsight(updatedInsight);
      addToast(response.message || 'Thank you for your feedback!', 'success');
    } catch (error) {
      addToast('Failed to submit feedback', 'error');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInsightTypeIcon = (type) => {
    const icons = {
      mood: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      pattern: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      suggestion: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      summary: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    };
    return icons[type?.toLowerCase()] || icons.summary;
  };

  const getInsightTypeColor = (type) => {
    const colors = {
      mood: 'bg-purple-50 text-purple-600 border-purple-200',
      pattern: 'bg-blue-50 text-blue-600 border-blue-200',
      suggestion: 'bg-amber-50 text-amber-600 border-amber-200',
      summary: 'bg-green-50 text-green-600 border-green-200',
    };
    return colors[type?.toLowerCase()] || colors.summary;
  };

  // Filter insights based on search and type filter
  const filteredInsights = Array.isArray(insights) 
    ? insights.filter((insight) => {
        const matchesFilter = filter === 'all' || insight.type?.toLowerCase() === filter;
        const matchesSearch =
          searchQuery === '' ||
          insight.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          insight.content?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      })
    : [];

  const insightTypes = ['all', 'mood', 'pattern', 'suggestion', 'summary'];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                Insights
              </h1>
              <p className="text-gray-500 mt-1">
                AI-generated insights from your conversations
              </p>
            </div>
            <button
              onClick={handleGenerateInsight}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Generate Insight
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl overflow-x-auto">
            {insightTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all whitespace-nowrap ${
                  filter === type
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2 mt-2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded"></div>
                  <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-100 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredInsights.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No insights found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {searchQuery || filter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start a conversation to generate insights'}
            </p>
            {!searchQuery && filter === 'all' && (
              <button
                onClick={() => navigate(ROUTES.CHAT)}
                className="mt-6 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Start Chatting
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInsights.map((insight) => (
                <button
                  key={insight.id}
                  onClick={() => handleViewInsight(insight)}
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
                    <div className="flex items-center gap-2">
                      {!insight.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      )}
                      <span className="text-xs text-gray-400">
                        {formatDate(insight.createdAt || insight.created_at)}
                      </span>
                    </div>
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
                      {insight.type || 'summary'}
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
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <Pagination pagination={pagination} />
            </div>
          </>
        )}
      </div>

      {/* Insight Detail Modal */}
      {selectedInsight && (
        <InsightDetailModal
          insight={selectedInsight}
          onClose={() => setSelectedInsight(null)}
          onFeedback={handleFeedback}
        />
      )}
    </div>
  );
};