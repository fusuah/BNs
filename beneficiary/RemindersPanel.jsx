"use client";
import { reminders } from "@/data/bnsUserSampleData";
import useAuth from "@/hooks/useAuth";
import { useGetEventQuery } from "@/service/eventSched/eventApiSlice";
import { Bell, Calendar, Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { differenceInCalendarDays, startOfDay } from "date-fns";
import Link from "next/link";

function getDaysLeft(targetDate) {
  if (!targetDate) return null;
  const dateObj =
    typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  if (isNaN(dateObj)) return null;

  const today = startOfDay(new Date());
  const target = startOfDay(dateObj);

  const diff = differenceInCalendarDays(target, today);

  if (diff >= 0) {
    return `${diff} day(s) left`;
  } else {
    return `${Math.abs(diff)} day(s) ago`;
  }
}

const getReminderTypeColor = () => {
  const typeIndex = Math.floor(Math.random() * 4) + 1;
  switch (typeIndex) {
    case 1:
      return "border-blue-500";
    case 2:
      return "border-amber-500";
    case 3:
      return "border-green-500";
    case 4:
      return "border-purple-500";
    default:
      return "border-gray-500";
  }
};

export const getUrgencyBadge = (targetDate) => {
  if (!targetDate) return null;
  const dateObj =
    typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  if (isNaN(dateObj)) return null;

  const today = startOfDay(new Date());
  const target = startOfDay(dateObj);

  const diff = differenceInCalendarDays(target, today);

  if (diff < 0) {
    return (
      <div className="bg-gray-400 px-2 rounded-3xl text-white">Passed</div>
    );
  } else if (diff === 0) {
    return (
      <div className="bg-green-600 px-2 rounded-3xl text-white">Today</div>
    );
  } else if (diff === 1) {
    return (
      <div className="bg-red-500 px-2 rounded-3xl text-white">Tomorrow</div>
    );
  } else if (diff <= 3) {
    return <div className="bg-amber-500 px-2 rounded-3xl text-white">Soon</div>;
  } else {
    return (
      <div className="bg-blue-500 px-2 rounded-3xl text-white">Upcoming</div>
    );
  }
};

function formatDateTime(date) {
  if (!(date instanceof Date)) return { date: "-", time: "-" };

  const optionsDate = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const optionsTime = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = date.toLocaleDateString(undefined, optionsDate);
  const formattedTime = date.toLocaleTimeString(undefined, optionsTime);

  return {
    date: formattedDate,
    time: formattedTime,
  };
}

function RemindersPanel() {
  const { id } = useAuth();

  const data = useGetEventQuery();

  const [joinedEvents, setJoinedEvents] = useState([]);

  useEffect(() => {
    if (data?.data && id) {
      // filter only events where user joined
      const filtered = data.data.filter((event) =>
        event.joined?.some((j) => j.user?._id === id)
      );
      setJoinedEvents(filtered);
    }
  }, [data, id]);

  return (
    <div className="bg-white rounded-xl shadow-md p-5 space-y-4 border-none w-full">
      <div className="pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
          <Bell className="h-5 w-5 text-green-500" />
          Upcoming Reminders
        </div>
      </div>

      {/* LIST */}
      <div className="">
        <div className="space-y-3 w-full ">
          {data?.data?.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No upcoming reminders</p>
            </div>
          ) : (
            data?.data?.slice(0, 3)?.map((reminder) => (
              <div
                key={reminder._id}
                className="p-3 rounded-lg border border-gray-200 bg-gray-50 w-full"
              >
                <div
                  className={`flex gap-3 items-center  border-l-[4px] px-1  ${getReminderTypeColor(
                    reminder.type
                  )}`}
                >
                  <div className="w-full">
                    {/* TITLE CONTAINER */}
                    <div className="flex justify-between items-start w-full">
                      <h4 className="font-medium w-full   text-sm flex items-center justify-between ">
                        {reminder.title}
                        <span className="text-[10px]">
                          {getUrgencyBadge(reminder?.eventDate)}
                        </span>
                      </h4>
                    </div>

                    {/* INFORMATION */}
                    <div className="flex flex-col  w-full gap-2 text-xs text-muted-foreground mt-1">
                      <div className="w-full flex gap-4">
                        <div className="flex items-center w-1/2 whitespace-nowrap">
                          <Calendar className="h-3 w-3 mr-1" />
                          <p>{getDaysLeft(reminder?.eventDate)}</p>
                        </div>
                        <div className="flex items-center w-1/2 whitespace-nowrap">
                          <Clock className="h-3 w-3 mr-1" />
                          <p>{reminder?.eventStart}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <p>{reminder.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center items-center mt-3 gap-2 font-semibold w-full">
          <Link
            href={"/beneficiary/appointments"}
            className=" w-1/2 bg-gray-300 rounded py-2 px-3 text-xs text-center"
          >
            View All
          </Link>
          <button className=" w-1/2 bg-green-500 flex py-2 px-3 text-xs rounded text-white justify-center items-center">
            <Calendar className="mr-2 h-3 w-3" />
            Schedule New
          </button>
        </div>
      </div>
    </div>
  );
}

export default RemindersPanel;
