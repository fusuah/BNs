"use client";
import { Star } from "lucide-react";
import { useGetFeedBackQuery } from "@/service/feedback/feedbackApiSlice";

export default function ServiceSatisfactionCard() {
  const { data, isLoading } = useGetFeedBackQuery();

  if (isLoading)
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 w-full h-full min-h-[300px] border border-gray-100 flex items-center justify-center">
        Loading...
      </div>
    );

  const feedbacks = data || [];
  // console.log(feedbacks);
  // Calculate average rating
  const totalRatings = feedbacks.length;
  const averageRating =
    totalRatings > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rate, 0) / totalRatings).toFixed(
          1
        )
      : 0;

  // Calculate star breakdown
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  feedbacks.forEach((f) => {
    const rounded = Math.round(f.rate); // e.g., 4.6 → 5
    if (counts[rounded] !== undefined) counts[rounded]++;
  });

  const ratings = Object.keys(counts)
    .reverse()
    .map((star) => {
      const count = counts[star];
      return {
        stars: Number(star),
        count,
        percent:
          totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0,
      };
    });

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full h-full min-h-[300px] border border-gray-100 flex flex-col justify-between">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Service Satisfaction
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Based on {totalRatings} parent feedback ratings
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center h-full justify-center">
        {/* Average Rating - Left Side */}
        <div className="text-center min-w-[120px]">
          <div className="text-5xl font-bold text-gray-900 flex justify-center items-center gap-1 mb-2">
            {averageRating}
          </div>
          <div className="flex justify-center mb-1">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            <Star className="w-6 h-6 text-gray-200 fill-gray-200" />
          </div>
          <p className="text-sm text-gray-500">Average rating</p>
        </div>

        {/* Bar breakdown - Right Side (Expanded) */}
        <div className="flex-1 w-full space-y-3">
          {ratings.map(({ stars, percent, count }) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="w-6 text-sm font-medium text-gray-700 flex items-center gap-1">
                {stars}{" "}
                <Star className="w-3.5 h-3.5 text-gray-400 fill-gray-400" />
              </span>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-12 text-right">
                {percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}