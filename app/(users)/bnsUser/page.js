"use client";

import useAuth from "@/hooks/useAuth";
import { useGetChildrenNutritionDataQuery } from "@/service/childrenNutritionData/childrenNurtritionDataApiSlice";
import { useGetEventQuery } from "@/service/eventSched/eventApiSlice";
import Link from "next/link";
import { useState, useEffect } from "react";

// 🔹 NEW OPERATIONS WIDGETS
import TimeLogWidget from "@/components/bnsUser/dashboard/TimeLogWidget";
import RequestSupplyWidget from "@/components/bnsUser/dashboard/RequestSupplyWidget";
import FormUploadWidget from "@/components/bnsUser/dashboard/FormUploadWidget";

const BnsUser = () => {
  const { name, barangay } = useAuth();
  // Hydration fix: Add mounted state
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getTodayFormatted = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  const { data: eventData } = useGetEventQuery();
  const { data: childrenData } = useGetChildrenNutritionDataQuery();

  const getMalnourishedCountThisMonth = (data) => {
    const malnourishedStatuses = ["underweight", "severely underweight"];

    if (!data || !Array.isArray(data)) return 0;

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthIndex = lastMonth.getMonth();
    const lastMonthYear = lastMonth.getFullYear();

    let count = 0;

    data.forEach((child) => {
      child?.information?.forEach((info) => {
        const status = (info?.status || "").toLowerCase();
        const date = new Date(info.date);
        if (
          malnourishedStatuses.includes(status) &&
          date.getMonth() === lastMonthIndex &&
          date.getFullYear() === lastMonthYear
        ) {
          count++;
        }
      });
    });

    return count;
  };
  const getUpcomingEventsCount = (events) => {
    if (!events || !Array.isArray(events)) return 0;

    const today = new Date();

    const count = events.filter((event) => {
      const eventDate = new Date(event.eventDate);
      // Compare only the date (not the time)
      return eventDate >= today;
    }).length;

    return count;
  };

  return (
    <div className="h-full w-full max-w-[1220px] mx-auto px-4 py-6 ">
      {/* Welcome Box */}
      <div className="w-full flex justify-between mb-[32px] ">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-[16px] text-[#64748b] mb-2 ">
            {getTodayFormatted()}
          </p>
        </div>

        <div>
          <h4 className="text-xl font-regular text-gray-900">
            {/* Hydration Fix: Only show name when mounted */}
            Welcome back, <b> {mounted && name ? name : ""}</b>
          </h4>
          <p className="text-[16px] text-[#64748b] text-right ">
            {" "}
            {mounted && barangay ? barangay : ""} • BNS
          </p>
        </div>
      </div>

      {/* MINI DASHBOARD BOX */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-[32px]">
        <div className="w-full">
          <div className="rounded-lg border border-gray-200 bg-white text-card-foreground shadow-sm p-6 space-y-2 h-full">
            <h3 className="text-sm font-medium text-gray-500">
              Total Children
            </h3>
            <div className="text-3xl font-bold text-[#4CAF50]">
              {childrenData?.data?.length || childrenData?.length || 0}
            </div>
            <p className="text-xs text-gray-400">
              Registered children under 5 years
            </p>
          </div>
        </div>

        <div className="w-full">
          <div className="rounded-lg border border-gray-200 bg-white text-card-foreground shadow-sm p-6 space-y-2 h-full">
            <h3 className="text-sm font-medium text-gray-500">
              Undernourished
            </h3>
            <div className="text-3xl font-bold text-[#EF5350]">
              {getMalnourishedCountThisMonth(childrenData?.data || childrenData) || 0}
            </div>
            <p className="text-xs text-gray-400">
              Children requiring nutritional intervention
            </p>
          </div>
        </div>

        <div className="w-full">
          <div className="rounded-lg border border-gray-200 bg-white text-card-foreground shadow-sm p-6 space-y-2 h-full">
            <h3 className="text-sm font-medium text-gray-500">
              Upcoming Events
            </h3>
            <div className="text-3xl font-bold text-[#FFC107]">
              {getUpcomingEventsCount(eventData?.data || eventData) || 0}
            </div>
            <p className="text-xs text-gray-400">
              Events in the next 7 days
            </p>
          </div>
        </div>

        <div className="w-full">
          <div className="rounded-lg border border-gray-200 bg-white text-card-foreground shadow-sm p-6 space-y-2 h-full">
            <h3 className="text-sm font-medium text-gray-500">
              Total Event
            </h3>
            <div className="text-3xl font-bold text-[#4CAF50]">
              {eventData?.data?.length || eventData?.length || 0}
            </div>
            <p className="text-xs text-gray-400">
              Program participation rate
            </p>
          </div>
        </div>
      </div>

      {/* 🔹 NEW OPERATIONS GRID (Time In, Request, Upload) */}
      <div className="mb-[32px]">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Operations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-full">
                <TimeLogWidget />
            </div>
            <div className="h-full">
                <RequestSupplyWidget />
            </div>
            <div className="h-full">
                <FormUploadWidget />
            </div>
        </div>
      </div>

      {/* Lower Dash */}
      <div className="w-full flex flex-col lg:flex-row gap-6">
        {/* Task & Schedule */}
        <div className="w-full lg:w-[60%] border border-gray-200 rounded-lg bg-white">
          <div className="w-full p-4 flex justify-between items-center">
            <h3 className="text-[20px] font-semibold text-gray-900">Task & Schedule</h3>

            <Link
              href={"/bnsUser/taskandschedule"}
              className="px-[12px] py-1 flex justify-center items-center cursor-pointer text-[14px] border border-gray-200 gap-2 rounded-md duration-200  hover:bg-[#FFC105]  hover:text-black text-gray-600"
            >
              <i className="bi bi-calendar"></i> View All
            </Link>
          </div>

          <div className="w-full p-[12px] bg-[#F5F5F5]">
            <p className="text-[14px] text-gray-700"> Today&lsquo;s Task (0)</p>
          </div>

          <div className="w-full p-[12px] py-8">
            <p className="text-[14px] w-full text-center text-[#64748b] ">
              No tasks scheduled for today
            </p>
          </div>

          <div className="w-full p-[12px]  bg-[#F5F5F5]">
            <p className="text-[14px] text-gray-700"> Upcoming Task</p>
          </div>

          <div className="w-full p-[12px] text-[#4CAF50] ">
            <button className="text-[14px] py-2 rounded-sm w-full text-center cursor-pointer duration-200  hover:bg-[#FFC105]  hover:text-black font-medium">
              <i className="bi bi-check"></i> Mark as Complete
            </button>
          </div>
        </div>

        {/* Quick Action */}
        <div className="w-full lg:w-[40%] p-6 border border-gray-200 rounded-lg bg-white h-fit">
          <h3 className="text-[18px] font-semibold mb-[24px] text-gray-900">Quick Links</h3>

          <div className="w-full flex gap-3 mb-3">
            {/* Action List */}
            <Link
              href={"/bnsUser/voiceReport"}
              className="flex flex-col justify-center items-center w-[33.33%] border border-gray-200 py-[16px] rounded-md hover:bg-gray-50 transition-colors"
            >
              <span className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#4CAF50]">
                <i className="bi bi-mic text-[12px] text-white"></i>
              </span>
              <p className="text-[11px] text-wrap text-center mt-2 text-gray-600 font-medium">Record Report</p>
            </Link>

            <div className="flex flex-col justify-center items-center w-[33.33%] border border-gray-200 py-[16px] rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
              <span className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#2196F3]">
                <i className="bi bi-file-earmark text-[12px] text-white"></i>
              </span>
              <p className="text-[11px] text-wrap text-center mt-2 text-gray-600 font-medium">
                Add Nutrition Data
              </p>
            </div>

            <Link
              href={"/bnsUser/taskandschedule"}
              className="flex flex-col justify-center items-center w-[33.33%] border border-gray-200 py-[16px] rounded-md hover:bg-gray-50 transition-colors"
            >
              <span className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#FFC107]">
                <i className="bi bi-calendar text-[12px] text-white"></i>
              </span>
              <p className="text-[11px] text-wrap text-center mt-2 text-gray-600 font-medium">Schedule Task</p>
            </Link>
          </div>

          <div className="w-full flex gap-3 ">
            {/* Action List Row 2 */}
            <Link
              href={"/bnsUser/nutritionData"}
              className="flex flex-col justify-center items-center w-[33.33%] border border-gray-200 py-[16px] rounded-md hover:bg-gray-50 transition-colors"
            >
              <span className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#2196F3]">
                <i className="bi bi-person text-[12px] text-white"></i>
              </span>
              <p className="text-[11px] text-wrap text-center mt-2 text-gray-600 font-medium">
                Add Beneficiary
              </p>
            </Link>

            <Link
              href={"/bnsUser/voiceReport"}
              className="flex flex-col justify-center items-center w-[33.33%] border border-gray-200 py-[16px] rounded-md hover:bg-gray-50 transition-colors"
            >
              <span className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#4CAF50]">
                <i className="bi bi-clipboard text-[12px] text-white"></i>
              </span>
              <p className="text-[11px] text-wrap text-center mt-2 text-gray-600 font-medium">
                Record Attendance
              </p>
            </Link>

            <Link
              href={"/bnsUser/reminders"}
              className="flex flex-col justify-center items-center w-[33.33%] border border-gray-200 py-[16px] rounded-md hover:bg-gray-50 transition-colors"
            >
              <span className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#EF5350]">
                <i className="bi bi-plus text-[12px] text-white"></i>
              </span>
              <p className="text-[11px] text-wrap text-center mt-2 text-gray-600 font-medium">New Feeding</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="h-[24px]"></div>
    </div>
  );
};

export default BnsUser;