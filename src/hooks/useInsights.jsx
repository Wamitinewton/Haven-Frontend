import { useEffect, useState } from "react";
import insightService from "../services/insight.service";
import { useToast } from "../context/ToastContext";
import { usePaginate } from "./usePaginate";

const randomNumber = () => {
  return Math.floor(Math.random() * 10) + 1;
};

export const useInsights = () => {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
      console.error("Failed to load insights", error);
      setError(error);
      addToast("Failed to load insights", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [pagination.pageParams.page]);
  const formattedInsights = insights.map((insight) => ({
    ...insight,
    index:
      insight.priority === "HIGH"
        ? 3 + randomNumber()
        : insight.priority === "MEDIUM"
        ? 2 + randomNumber()
        : 1 + randomNumber(),
  }));
  return { formattedInsights, isLoading, error };
};
