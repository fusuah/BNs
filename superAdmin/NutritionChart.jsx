"use client";

import { useGetTableNutritionDataQuery } from "@/service/childrenNutritionData/childrenNurtritionDataApiSlice";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function NutritionChart({ data: propData }) {
  // Fetch data directly in the component
  const { data: apiResponse, isLoading, error } = useGetTableNutritionDataQuery();
  
  // Use prop data if provided, otherwise use fetched data
  const chartData = propData || apiResponse?.data || [];

  console.log("Chart Data Source:", chartData);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 w-full border border-gray-100 h-[400px] flex items-center justify-center">
        <div className="text-gray-500 flex flex-col items-center">
          <i className="bi bi-arrow-repeat animate-spin text-2xl mb-2"></i>
          Loading nutrition data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 w-full border border-gray-100 h-[400px] flex items-center justify-center">
        <div className="text-red-500">Failed to load nutrition data.</div>
      </div>
    );
  }

  const hasData = chartData && Array.isArray(chartData) && chartData.some(d => d.Underweight > 0 || d.Normal > 0 || d.Overweight > 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Child Nutrition Status Trends
          </h2>
          <p className="text-sm text-gray-500">
            Children aged 0–5 years monitored monthly
          </p>
        </div>
        <div className="flex gap-4 items-center text-sm mt-1">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-gray-700">Underweight</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-gray-700">Normal</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-gray-700">Overweight</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        {!hasData ? (
          <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <i className="bi bi-bar-chart text-4xl text-gray-300 mb-2"></i>
            <p className="text-gray-500">No Data Available</p>
            <p className="text-xs text-gray-400">Add nutrition records to see trends.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="underweight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F87171" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#F87171" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="normal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ADE80" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#4ADE80" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="overweight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FACC15" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#FACC15" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="Underweight"
                stroke="#EF4444"
                fill="url(#underweight)"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="Normal"
                stroke="#22C55E"
                fill="url(#normal)"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="Overweight"
                stroke="#EAB308"
                fill="url(#overweight)"
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}