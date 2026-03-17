"use client";
import React from "react";
import dynamic from "next/dynamic";

// 🔹 FIX: Dynamically import ReactApexChart with ssr: false
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function BarangayHeatmap({ rows = [] }) {
  // Safe check if rows is not an array or empty
  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 bg-white rounded-xl border border-gray-100">
        No heatmap data available
      </div>
    );
  }

  const columns = [
    "Activity %",
    "Compliance %",
    "Recency (freshness)",
    "BNS Assigned",
  ];

  // Convert data to Apex Heatmap series format
  const series = rows.map((r) => ({
    name: r.barangay || "Unknown",
    data: [
      {
        x: "Activity %",
        y: r.activityPct || 0,
        meta: `${r.last30Count || 0} task(s) in last 30d`,
      },
      {
        x: "Compliance %",
        y: r.compliancePct || 0,
        meta: `${r.completedTasks || 0}/${r.totalTasks || 0} completed`,
      },
      {
        x: "Recency (freshness)",
        y: r.recencyScore || 0,
        meta: `${r.recencyDays || 0} day(s) ago`,
      },
      {
        x: "BNS Assigned",
        y: (r.bnsAssigned || 0) * 10,
        meta: `${r.bnsAssigned || 0} BNS`,
      }, // scaled so it shows well
    ],
  }));

  const options = {
    chart: { toolbar: { show: true } },
    dataLabels: { enabled: false },
    xaxis: { type: "category", categories: columns },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            { from: 0, to: 20, color: "#e6f4ea", name: "Very Low" }, // light green
            { from: 21, to: 40, color: "#b7e1cd", name: "Low" }, // soft green
            { from: 41, to: 60, color: "#80cfa9", name: "Medium" }, // medium green
            { from: 61, to: 80, color: "#4cb684", name: "High" }, // dark green
            { from: 81, to: 100, color: "#1b5e20", name: "Very High" }, // very dark green
          ],
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (_, opts) {
          const point =
            opts?.w?.config?.series?.[opts.seriesIndex]?.data?.[
              opts.dataPointIndex
            ];
          return point?.meta || "";
        },
      },
    },
    legend: { position: "bottom" },
    title: { text: "Barangay Performance Heatmap", align: "left" },
  };

  return (
    <div className="w-full">
      <ReactApexChart
        type="heatmap"
        height={520}
        series={series}
        options={options}
      />
    </div>
  );
}