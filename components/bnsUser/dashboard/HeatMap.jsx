"use client";

import { useMemo } from "react";
import Chart from "react-apexcharts";
import { useGetChildrenNutritionDataQuery } from "@/service/childrenNutritionData/childrenNurtritionDataApiSlice";

const HeatMap = () => {
  const {
    data: cnData,
    isLoading,
    isError,
  } = useGetChildrenNutritionDataQuery();

  // Define malnourished statuses
  const malnourishedStatuses = [
    "underweight",
    "severely underweight",
    "wasted",
    "stunted",
  ];

  // Process data into ApexCharts heatmap format
  const heatmapData = useMemo(() => {
    if (!cnData || !Array.isArray(cnData)) return [];

    // Group by address
    const addressCounts = {};
    cnData.forEach((child) => {
      const address = child.address || "Unknown";

      const hasMalnutrition = child.information?.some((info) =>
        malnourishedStatuses.includes(info.status?.toLowerCase())
      );

      if (hasMalnutrition) {
        addressCounts[address] = (addressCounts[address] || 0) + 1;
      }
    });

    // Convert to ApexCharts heatmap series
    return Object.entries(addressCounts).map(([town, count]) => ({
      name: town,
      data: [{ x: town, y: count }],
    }));
  }, [cnData]);

  const chartOptions = {
    chart: {
      type: "heatmap",
    },
    dataLabels: {
      enabled: true,
    },
    colors: ["#FF5733"],
    title: {
      text: "Malnutrition Heatmap by Address",
      align: "center",
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 1,
              color: "#FFDDC1",
              name: "Low",
            },
            {
              from: 2,
              to: 4,
              color: "#FF5733",
              name: "Medium",
            },
            {
              from: 5,
              to: 100,
              color: "#C70039",
              name: "High",
            },
          ],
        },
      },
    },
  };

  function generateData(count, { min, max }) {
    const series = [];
    for (let i = 0; i < count; i++) {
      series.push({
        x: (i + 1).toString(),
        y: Math.floor(Math.random() * (max - min + 1)) + min,
      });
    }
    return series;
  }

  const series = {
    series: [
      {
        name: "Net Profit",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: "Revenue",
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        name: "Free Cash Flow",
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
        ],
      },
      yaxis: {
        title: {
          text: "$ (thousands)",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          },
        },
      },
    },
  };

  if (isLoading) return <div>Loading heatmap...</div>;
  if (isError) return <div>Failed to load heatmap data</div>;

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow">
      <Chart
        options={series?.options}
        series={series?.series}
        type="bar"
        height={400}
      />
    </div>
  );
};

export default HeatMap;
