"use client";
import {
	AreaChart,
	Area,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import { useState } from "react";
import { nutritionData } from "@/data/bnsUserSampleData"; // Adjust path as needed

export default function GrowthCharts() {
	const getFilteredData = () => {
		return nutritionData.measurements
			.map((entry) => ({
				date: new Date(entry.date).toLocaleDateString("en-US", {
					month: "short",
					year: "numeric",
				}),
				weight: parseFloat(entry.weight),
				height: parseFloat(entry.height),
			}))
			.reverse();
	};

	const chartData = getFilteredData();

	const renderChart = (type) => {
		const color = type === "weight" ? "#3b82f6" : "#22c55e";
		const label = type === "weight" ? "Weight Progress" : "Height Progress";
		const fillId = `${type}Fill`;
		const unit = type === "weight" ? " kg" : " cm";

		const Chart = (
			<AreaChart data={chartData}>
				<defs>
					<linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor={color} stopOpacity={0.3} />
						<stop offset="95%" stopColor={color} stopOpacity={0} />
					</linearGradient>
				</defs>
				<XAxis dataKey="date" />
				<YAxis unit={unit} domain={["auto", "auto"]} />
				<CartesianGrid strokeDasharray="3 3" />
				<Tooltip />
				<Legend />
				<Line
					type="monotone"
					dataKey={type}
					name={type === "weight" ? "Weight" : "Height"}
					stroke={color}
					strokeWidth={3}
					dot={{ r: 4, strokeWidth: 2, fill: color, stroke: "#fff" }}
				/>
				<Area
					type="monotone"
					dataKey={type}
					stroke={color}
					fillOpacity={1}
					fill={`url(#${fillId})`}
				/>
			</AreaChart>
		);

		return (
			<div className="mb-10 ">
				<p className="mb-2 text-sm font-semibold text-gray-700">{label}</p>

				<ResponsiveContainer width="100%" height={280}>
					{Chart}
				</ResponsiveContainer>
			</div>
		);
	};

	return (
		<div className="space-y-10 bg-white p-6">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-bold text-gray-800">Growth Charts</h2>
				{/* <select
					value={range}
					onChange={(e) => setRange(e.target.value)}
					className="rounded-md border border-gray-300 text-sm p-2"
				>
					{RANGE_OPTIONS.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select> */}
			</div>

			{renderChart("weight")}
			{renderChart("height")}
		</div>
	);
}
