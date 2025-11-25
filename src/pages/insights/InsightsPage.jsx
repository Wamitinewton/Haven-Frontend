import { useEffect, useState } from "react";
// import { Navbar } from '../../components/layout/Navbar'; // <-- This is correctly commented/removed
import { useToast } from "../../context/ToastContext";
import { usePaginate } from "../../hooks/usePaginate";
import insightService from "../../services/insight.service";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Pagination } from "../../components/common/Pagination";
import { InsightList } from "../../components/insights/InsightList";
import { InsightDetailModal } from "../../components/insights/InsightDetailModal";

export const InsightsPage = () => {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);
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
      addToast("Failed to load insights", "error");
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
      addToast(response.message || "New insight generated!", "success");
    } catch (error) {
      addToast(
        error.response?.data?.message || "Failed to generate insight",
        "error"
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
        addToast("Failed to mark insight as read", "error");
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
      addToast(response.message || "Thank you for your feedback!", "success");
    } catch (error) {
      addToast("Failed to submit feedback", "error");
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* <Navbar /> */} {/* <-- THIS LINE IS NOW REMOVED */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold gradient-text">
                Your Insights
              </h1>
              <button
                className="btn-primary"
                onClick={handleGenerateInsight}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate New Insight"}
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            ) : (
              <InsightList
                insights={insights}
                onViewInsight={handleViewInsight}
              />
            )}

            {!isLoading && insights.length === 0 && (
              <p className="text-center text-gray-500 text-lg p-10 card">
                No insights found. Start chatting with Haven to generate new
                insights!
              </p>
            )}

            <Pagination pagination={pagination} />
          </div>
        </main>
      </div>
      {selectedInsight && (
        <InsightDetailModal
          insight={selectedInsight}
          onClose={() => setSelectedInsight(null)}
          onFeedback={handleFeedback}
        />
      )}
    </>
  );
};
