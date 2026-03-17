"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  CalendarDays,
  CalendarCheck,
  Syringe,
  HeartPulse,
  Droplets,
  Star,
} from "lucide-react";

import ReqList from "@/components/beneficiary/ReqList";

import {
  appointments,
  nutritionData,
  portalNotifications,
} from "@/data/bnsUserSampleData";
import dayjs from "dayjs";

const colorClasses = [
  { bg: "bg-blue-100", icon: "bg-blue-500" },
  { bg: "bg-green-100", icon: "bg-green-500" },
  { bg: "bg-orange-100", icon: "bg-orange-500" },
  { bg: "bg-purple-100", icon: "bg-purple-500" },
  { bg: "bg-gray-100", icon: "bg-gray-500" },
];

const detectColor = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("immunization") || t.includes("vaccine")) return "green";
  if (t.includes("weighing") || t.includes("visit")) return "blue";
  if (t.includes("vitamin")) return "orange";
  if (t.includes("program") || t.includes("education")) return "violet";
  return "gray";
};

export default function UpcomingEvents({ data }) {
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  // Normalize date to remove time
  const normalizeDate = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = normalizeDate(new Date());
  // Build appointments from portalNotifications
  const appointmentsData = appointments.map((n) => {
    const datetime = new Date(n.datetime);
    const dateOnly = normalizeDate(datetime);

    return {
      title: n.title,
      date: dateOnly, // this stays as a Date object
      time: datetime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      color: detectColor(n.title),
    };
  });

  const appointmentsToShow = selectedDate
    ? appointmentsData.filter(
        (a) =>
          a.date.getTime() === normalizeDate(new Date(selectedDate)).getTime()
      )
    : appointmentsData
        .filter((a) => a.date.getTime() > today.getTime())
        .sort((a, b) => a.date - b.date)
        .slice(0, 3);

  const formatDate = (date) =>
    date?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const healthStats = [
    {
      label: "Visits",
      value: nutritionData.healthStats?.visits ?? 0,
      color: "text-blue-600",
      icon: <HeartPulse size={16} />,
    },
    {
      label: "Vaccines",
      value: nutritionData.healthStats?.vaccines ?? 0,
      color: "text-green-600",
      icon: <Syringe size={16} />,
    },
    {
      label: "Vitamins",
      value: nutritionData.healthStats?.vitamins ?? 0,
      color: "text-yellow-600",
      icon: <Droplets size={16} />,
    },
    {
      label: "Programs",
      value: nutritionData.healthStats?.programs ?? 0,
      color: "text-purple-600",
      icon: <Star size={16} />,
    },
  ];

  /* NEW STRUCTURE */

  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const [eventsByDate, setEventsByDate] = useState({});

  useEffect(() => {
    const grouped = {};
    data?.forEach((event) => {
      if (!grouped[event.eventDate]) grouped[event.eventDate] = [];
      grouped[event.eventDate].push(event);
    });
    setEventsByDate(grouped);
  }, [data]);

  const daysInMonth = Array.from(
    { length: currentMonth.daysInMonth() },
    (_, i) => currentMonth.date(i + 1)
  );

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => prev.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => prev.add(1, "month"));
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-300 p-6 space-y-5 w-1/2 max-[640px]:w-full">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Calendar</h2>
        <p className="text-sm text-gray-500">
          Select a date to view appointments
        </p>
      </div>

      {/*    <div className="rounded-lg border border-gray-300 p-4 w-full">
        <div className="w-full overflow-x-auto flex justify-center">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            defaultMonth={new Date(2025, 4)}
            className="w-full text-sm"
            classNames={{
              selected: "bg-green-500 text-white rounded-full",
              today: "text-green-700 font-semibold",
            }}
          />
        </div>
      </div> */}

      {/* Calendar */}
      <div className="w-full  rounded-xl shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrevMonth}
            className="text-xl font-bold  cursor-pointer"
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <h2 className="text-[16px] font-semibold">
            {currentMonth.format("MMMM YYYY")}
          </h2>
          <button
            onClick={handleNextMonth}
            className="text-xl font-bold cursor-pointer"
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-[12px] text-gray-500 font-semibold">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 mt-2 text-center">
          {Array.from({ length: currentMonth.startOf("month").day() }).map(
            (_, i) => (
              <div key={`empty-${i}`}></div>
            )
          )}
          {daysInMonth.map((day) => {
            const dateKey = day.format("YYYY-MM-DD");
            const isSelected = selectedDate === dateKey;
            const events = eventsByDate[dateKey] || [];
            return (
              <div
                key={dateKey}
                onClick={() => setSelectedDate(dateKey)}
                className={`relative cursor-pointer text-[12px]  py-4 px-4 flex justify-center items-center  rounded-lg hover:bg-green-100  hover:text-black  transition ${
                  isSelected ? "bg-green-500 text-white" : ""
                }`}
              >
                {day.date()}
                {events.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[12px] px-1 rounded-full">
                    {events.length}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          {selectedDate
            ? `Appointments on ${dayjs(selectedDate).format("MMMM D, YYYY")}	`
            : "Upcoming Appointments"}
        </h3>

        <div className="space-y-3">
          {eventsByDate[selectedDate]?.length > 0 ? (
            eventsByDate[selectedDate].map((data, index) => {
              const color = colorClasses[index] || colorClasses.gray;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-xl ${color.bg}`}
                >
                  <div className={`p-2 rounded-full text-white ${color.icon}`}>
                    <CalendarDays size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">
                      {data.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      {dayjs(selectedDate)?.format("MMMM D, YYYY")} •{" "}
                      {data?.eventStart} - {data?.eventEnd}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">No appointments.</p>
          )}
        </div>
      </div>

      {/* ✅ Health Stats */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Health Stats
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {healthStats.map((stat, index) => (
            <div
              key={index}
              className="bg-[#F5FAFF] p-3 rounded-lg flex flex-col items-start"
            >
              <div
                className={`text-xs font-semibold flex items-center gap-1 ${stat.color}`}
              >
                {stat.icon}
                {stat.label}
              </div>
              <div className="text-xl font-bold text-gray-800">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIST OF REQUESTS */}

      <div className="w-full ">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Your Requests
        </h3>

        <ReqList />
      </div>
    </div>
  );
}
