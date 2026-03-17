"use client";
import { useState } from "react";
import { Download, Filter } from "lucide-react";
import ServiceSatisfactionCard from "@/components/superAdmin/ServiceSatisfactionCard";
import FeedbackRatingCharts from "@/components/superAdmin/FeedbackRatingTrends";
import SuggestionsBox from "@/components/superAdmin/SuggestionsBox";
import SurveyResponses from "@/components/superAdmin/SurveyResponses";
import { useGetFeedBackQuery } from "@/service/feedback/feedbackApiSlice";
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const TABS = ["Feedback Dashboard", "Suggestions", "Survey Responses"];
function SuperAdminFeedbackAndSurveysPage() {
  const [tab, setTab] = useState("Feedback Dashboard");
  const data = useGetFeedBackQuery();
  console.log(data);
  const suggestionSurvey = data?.data?.filter((data) => data.isProgramFeedback);
  const commentsSurvey = data?.data?.filter((data) => !data?.isProgramFeedback);
  console.log(suggestionSurvey);
  const monthlyRatings = {};

  // Group ratings by month
  data?.data?.forEach((item) => {
    const date = new Date(item.createdAt);
    const month = date.getMonth(); // 0–11

    if (!monthlyRatings[month]) {
      monthlyRatings[month] = { total: 0, count: 0 };
    }

    monthlyRatings[month].total += item.rate;
    monthlyRatings[month].count += 1;
  });

  // Build final chart data
  const trendsData = Object.keys(monthlyRatings).map((monthIndex) => {
    const m = Number(monthIndex);
    return {
      month: monthNames[m],
      rating: Number(
        (monthlyRatings[m].total / monthlyRatings[m].count).toFixed(2)
      ),
    };
  });
  console.log(trendsData);
  return (
    <div className="text-black">
      <div className="">
        <p className="text-2xl font-bold">Feedback & Surveys</p>
        <p className="text-gray-500">
          Monitor and analyze feedback from program participants
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-[#f4f6f8] px-3 py-2 rounded-lg w-fit  my-6">
        {TABS.map((t) => {
          const isActive = tab === t;

          return (
            <button
              key={t}
              onClick={() => {
                setTab(t);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                isActive ? "bg-white shadow text-black" : "text-gray-500"
              }`}
            >
              <span>{t}</span>
            </button>
          );
        })}
      </div>

      {tab === "Feedback Dashboard" && (
        <>
          <div className="my-6 flex justify-between items-center">
            <div className="">
              <p className="text-lg font-bold">Feedback Analytics</p>
              <p className="text-gray-500 text-md">
                Overview of parent/guardian feedback
              </p>
            </div>

            <div className="flex justify-center items-center gap-2"></div>
          </div>
          <div className="flex gap-6">
            <ServiceSatisfactionCard />
            <FeedbackRatingCharts category={"trends"} trendsData={trendsData} />
          </div>
        </>
      )}
      {tab === "Suggestions" && (
        <SuggestionsBox suggestions={suggestionSurvey ?? []} />
      )}
      {tab === "Survey Responses" && (
        <SurveyResponses surveyData={commentsSurvey ?? []} />
      )}
    </div>
  );
}

export default SuperAdminFeedbackAndSurveysPage;
