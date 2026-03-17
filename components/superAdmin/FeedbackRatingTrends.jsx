"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  CartesianGrid,
} from "recharts";

const trendsData = [
  { month: "Jan", rating: 4.3 },
  { month: "Feb", rating: 4.4 },
  { month: "Mar", rating: 4.2 },
  { month: "Apr", rating: 4.5 },
  { month: "May", rating: 4.6 },
];

const categoryData = [
  { category: "Service Quality", rating: 4.6 },
  { category: "Staff Knowledge", rating: 4.5 },
  { category: "Program Timing", rating: 4.0 },
  { category: "Program Content", rating: 4.3 },
  { category: "Communication", rating: 4.2 },
  { category: "Materials", rating: 4.1 },
];

const barangayData = [
  { name: "San Antonio", rating: 4.8, responses: 30 },
  { name: "Santa Maria", rating: 4.7, responses: 35 },
  { name: "San Isidro", rating: 4.4, responses: 20 },
  { name: "Santa Maria", rating: 4.3, responses: 25 },
];

export default function FeedbackRatingCharts({ category, trendsData }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 w-full">
      {category === "trends" && (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            Feedback Rating Trends
          </h2>
          <p className="text-sm text-gray-500 mb-4">Average rating over time</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendsData}>
                <defs>
                  <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#bbf7d0" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis domain={[0, 5]} tickCount={6} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="rating"
                  stroke="#4ade80"
                  fillOpacity={1}
                  fill="url(#colorRating)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {category === "category" && (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            Ratings by Category
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Average ratings across feedback categories
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 5]} />
                <YAxis type="category" dataKey="category" />
                <Tooltip />
                <Bar dataKey="rating" fill="#22c55e" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {category === "barangay" && (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            Feedback by Barangay
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Average ratings and response counts
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barangayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" domain={[0, 5]} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 60]}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="rating"
                  fill="#22c55e"
                  name="Avg. Rating"
                  barSize={20}
                />
                <Bar
                  yAxisId="right"
                  dataKey="responses"
                  fill="#86efac"
                  name="Responses"
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
