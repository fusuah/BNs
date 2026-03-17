"use client";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const CalendarWithEvents = ({ data }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
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
    <div className="flex flex-col md:flex-row gap-4 w-full p-4">
      {/* Calendar */}
      <div className="w-full md:w-1/2  rounded-xl shadow p-4">
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
                className={`relative cursor-pointer text-[12px]  py-6 px-4  rounded-lg border border-gray-200 hover:bg-green-100  hover:text-black  transition ${
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

      {/* Event Detail */}
      <div className="w-full md:w-1/2 rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4">
          Events on {dayjs(selectedDate).format("MMMM D, YYYY")}
        </h3>
        {eventsByDate[selectedDate]?.length > 0 ? (
          eventsByDate[selectedDate].map((event) => (
            <div
              key={event._id}
              className="mb-4 p-3 border border-gray-200 rounded-lg"
            >
              <h4 className="font-bold text-[24px] text-primary-color">
                {event.title}
              </h4>
              <p className="text-sm text-gray-600  mb-[12px]">
                {event.description}
              </p>
              <p className="text-[16px] mb-[12px]">
                <i className="bi bi-clock"></i> {event.eventStart} -{" "}
                {event.eventEnd}
              </p>
              <p className="text-[16px] mb-[12px]">
                {" "}
                <i className="bi bi-geo"></i> {event.location}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No events on this date.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarWithEvents;
