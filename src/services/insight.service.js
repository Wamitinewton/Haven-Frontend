import { insightAPI } from '../api/insights.api';

class InsightService {
  async getInsights(page, size) {
    const response = await insightAPI.getInsights(page, size);
    return response.data;
  }

  async generateInsight() {
    const response = await insightAPI.generateInsight();
    return response.data;
  }

  async getInsightById(id) {
    const response = await insightAPI.getInsightById(id);
    return response.data;
  }

  async markInsightAsRead(id) {
    const response = await insightAPI.markInsightAsRead(id);
    return response.data;
  }

  async deleteInsight(id) {
    const response = await insightAPI.deleteInsight(id);
    return response.data;
  }

  async provideInsightFeedback(id, helpful, feedback) {
    const response = await insightAPI.provideInsightFeedback(
      id,
      helpful,
      feedback
    );
    return response.data;
  }
}

export default new InsightService();