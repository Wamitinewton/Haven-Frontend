import React from "react";
import { Card } from "../common/Card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useInsights } from "../../hooks/useInsights";
import { LoadingSpinner } from "../common/LoadingSpinner";

function InsightChart() {
  const { insights, isLoading, error } = useInsights();

  if (isLoading) {
    return (
      <div className="w-full md:w-2/3 h-72 flex items-center justify-center">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 w-full md:w-2/3 ">{error.message}</div>;
  }

  return (
    <div className="rounded-3xl w-full md:w-2/3 bg-gray-50 p-4 border border-gray-200">
      <h1>Insight Chart</h1>
    </div>
  );
}

export default InsightChart;
