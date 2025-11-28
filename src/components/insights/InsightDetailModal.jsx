import { useState, useEffect } from 'react';

export const InsightDetailModal = ({ insight, onClose, onFeedback }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!insight) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInsightTypeIcon = (type) => {
    const normalizedType = type?.toLowerCase();
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
    return icons[normalizedType] || icons.summary;
  };

  const getInsightTypeColor = (type) => {
    const normalizedType = type?.toLowerCase();
    const colors = {
      mood: 'bg-purple-50 text-purple-600 border-purple-200',
      pattern: 'bg-blue-50 text-blue-600 border-blue-200',
      suggestion: 'bg-amber-50 text-amber-600 border-amber-200',
      summary: 'bg-green-50 text-green-600 border-green-200',
    };
    return colors[normalizedType] || colors.summary;
  };

  const handleFeedbackSubmit = async (helpful) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onFeedback(insight.id, helpful, feedbackText);
      setShowFeedback(false);
      setFeedbackText('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowFeedback(false);
    setFeedbackText('');
    onClose();
  };

  const dateField = insight.createdAt || insight.created_at;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-lg transform rounded-2xl bg-white shadow-2xl transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getInsightTypeColor(insight.type)}`}
                >
                  {getInsightTypeIcon(insight.type)}
                </div>
                <div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${getInsightTypeColor(insight.type)}`}
                  >
                    {insight.type || 'summary'}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(dateField)} {dateField && `at ${formatTime(dateField)}`}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {insight.title || 'Insight Details'}
            </h2>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-6 max-h-64 overflow-y-auto">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {insight.content}
              </p>
            </div>

            {!insight.feedback && onFeedback && (
              <div className="mb-6">
                {!showFeedback ? (
                  <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-sm text-gray-600">Was this insight helpful?</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleFeedbackSubmit(true)}
                        disabled={submitting}
                        className="p-2 rounded-lg hover:bg-green-100 text-gray-500 hover:text-green-600 transition-colors disabled:opacity-50"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setShowFeedback(true)}
                        disabled={submitting}
                        className="p-2 rounded-lg hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-600 mb-3">What could be improved?</p>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Your feedback helps us improve..."
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      rows={3}
                    />
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => setShowFeedback(false)}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleFeedbackSubmit(false)}
                        disabled={submitting}
                        className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                      >
                        {submitting ? 'Submitting...' : 'Submit'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {insight.feedback && (
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">Thanks for your feedback!</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end pt-4 border-t border-gray-100">
              <button
                onClick={handleClose}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
