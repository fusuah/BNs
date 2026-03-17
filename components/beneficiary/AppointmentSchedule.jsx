"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  CalendarDays,
  CalendarIcon,
  Clock,
  MapPin,
  X,
  Check,
  AlertTriangleIcon,
} from "lucide-react";
import { appointment } from "@/data/bnsUserSampleData";
import dayjs from "dayjs";
import { addMonths, format, isBefore } from "date-fns";
import {
  useGetEventQuery,
  useSetRemindersMutation,
} from "@/service/eventSched/eventApiSlice";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectBeneficiary } from "@/service/beneficiaryPortal/beneficiaryPortalSlice";

const getAppointmentBgColor = (type) => {
  switch (type) {
    case 1:
      return "bg-blue-50 border-blue-200";
    case 2:
      return "bg-amber-50 border-amber-200";
    case 3:
      return "bg-green-50 border-green-200";
    case 4:
      return "bg-purple-50 border-purple-200";
    case 5:
      return "bg-sky-50 border-sky-200";
    case 6:
      return "bg-teal-50 border-teal-200";
  }
};

const getAppointmentIconColor = (type) => {
  switch (type) {
    case 1:
      return "text-blue-500 bg-blue-100";
    case 2:
      return "text-amber-500 bg-amber-100";
    case 3:
      return "text-green-500 bg-green-100";
    case 4:
      return "text-purple-500 bg-purple-100";
    case 5:
      return "text-sky-500 bg-sky-100";
    case 6:
      return "text-teal-500 bg-teal-100";
  }
};

const getStatusBadge = (status) => {
  if (status === "completed") {
    return (
      <div className="bg-green-500 text-white text-sm px-2 py-1 flex justify-between items-center rounded-2xl font-semibold">
        Completed
      </div>
    );
  }
  if (status === "missed") {
    return (
      <div className="bg-red-500 text-white text-sm px-2 py-1 flex justify-between items-center rounded-2xl font-semibold">
        Missed
      </div>
    );
  }
  return null;
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

const TABS = ["Upcoming", "My Reminder"];

export default function AppointmentSchedule({ data }) {
  const [setReminder] = useSetRemindersMutation();

  const { user_type, id } = useAuth();

  const userData = useSelector(selectBeneficiary);

  const lastPregnantInfo = Array.isArray(userData?.pregnantinformation)
    ? userData.pregnantinformation[userData.pregnantinformation.length - 1]
    : null;

  const lastChildrenInfo = Array.isArray(userData?.information)
    ? userData.information[userData.information.length - 1]
    : null;

  const lastLactatingInfo = Array.isArray(userData?.lactatinginformation)
    ? userData.lactatinginformation[userData.lactatinginformation.length - 1]
    : null;

  console.log(user_type); /* lactating | LactatingUser | children */

  const appointments = useGetEventQuery();

  console.log(appointments?.data);

  const [tab, setTab] = useState("Upcoming");
  const upcoming = appointments?.data?.filter((n) => n.datetime >= new Date());
  const past = appointments?.data?.filter((n) => n.datetime < new Date());

  const [eventsByDate, setEventsByDate] = useState({});

  useEffect(() => {
    const grouped = {};

    data?.forEach((event) => {
      const date = new Date(event.eventDate);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`; // e.g., "2025-06"

      if (!grouped[monthKey]) grouped[monthKey] = [];
      grouped[monthKey].push(event);
    });

    setEventsByDate(grouped);
  }, [data]);

  console.log(eventsByDate);

  const generateUserModel = () => {
    if (user_type === "lactating") {
      return "LactatingUser";
    } else if (user_type === "pregnant") {
      return "PregnantUser";
    } else if (user_type === "children") {
      return "ChildrenNutritionData";
    }
  };

  const setReminderSchedule = async (eventId) => {
    if (eventId && id && user_type) {
      const res = await setReminder({
        eventId,
        userId: id,
        userModel: generateUserModel(),
      });

      if (res) {
        toast.success("Reminder Set !", {
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }
    }
  };

  const upcomingEvent = Object.entries(eventsByDate).map(([date, events]) => {
    // Filter events: only keep ones that are upcoming
    const filteredEvents = events.filter((event) => {
      const eventDateTime = new Date(`${event.eventDate}T${event.eventStart}`);
      return eventDateTime > new Date(); // only keep future events
    });

    if (filteredEvents.length === 0) return null; // skip group if no upcoming

    return (
      <div key={date} className="mb-6">
        <h2 className="text-[16px] font-semibold mb-2">
          {dayjs(date)?.format("MMMM ")}
        </h2>
        {filteredEvents.map((event, index) => {
          const randomNumber = Math.floor(Math.random() * 6) + 1;

          return (
            <div
              key={index}
              className={`p-4 mb-[10px] rounded-md border flex flex-col md:flex-row md:items-center justify-between gap-4 ${getAppointmentBgColor(
                randomNumber
              )}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-full ${getAppointmentIconColor(
                    randomNumber
                  )}`}
                >
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">{event?.title}</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-[12px] text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {dayjs(event?.eventDate)?.format("MMMM D, YYYY")} •{" "}
                        {event?.eventStart} - {event?.eventEnd}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{event?.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  disabled={event?.joined.some((j) => j.user._id === id)}
                  className={` text-[12px] p-3 flex justify-between items-center rounded font-semibold  ${getAppointmentIconColor(
                    randomNumber
                  )}${
                    event?.joined.some((j) => j.user._id === id)
                      ? "" // joined
                      : "cursor-pointer" // not joined
                  }`}
                  onClick={() => setReminderSchedule(event?._id)}
                >
                  {event?.joined.some((j) => j.user._id === id) ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Reminder Set
                    </>
                  ) : (
                    <>
                      <Bell className="h-3 w-3 mr-1" />
                      Set Reminder
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  });

  const myReminders = Object.entries(eventsByDate).map(([date, events]) => {
    // Filter events: only keep ones that the user joined + upcoming
    const filteredEvents = events.filter((event) => {
      const eventDateTime = new Date(`${event.eventDate}T${event.eventStart}`);
      return (
        eventDateTime > new Date() && // future events
        event?.joined?.some((j) => j.user._id === id) // user has joined
      );
    });

    if (filteredEvents.length === 0) return null; // skip group if no joined upcoming

    return (
      <div key={date} className="mb-6">
        <h2 className="text-[16px] font-semibold mb-2">
          My Reminders — {dayjs(date)?.format("MMMM ")}
        </h2>
        {filteredEvents.map((event, index) => {
          const randomNumber = Math.floor(Math.random() * 6) + 1;

          return (
            <div
              key={index}
              className={`p-4 mb-[10px] rounded-md border flex flex-col md:flex-row md:items-center justify-between gap-4 ${getAppointmentBgColor(
                randomNumber
              )}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-full ${getAppointmentIconColor(
                    randomNumber
                  )}`}
                >
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">{event?.title}</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-[12px] text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {dayjs(event?.eventDate)?.format("MMMM D, YYYY")} •{" "}
                        {event?.eventStart} - {event?.eventEnd}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{event?.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Already joined -> always show as Reminder Set */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  disabled
                  className={`text-[12px] p-3 flex justify-between items-center rounded font-semibold ${getAppointmentIconColor(
                    randomNumber
                  )}`}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Reminder Set
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  });

  const reminderMonthlyCheckup = () => {
    let info = null;
    if (user_type === "pregnant") info = lastPregnantInfo;
    if (user_type === "children") info = lastChildrenInfo;
    if (user_type === "lactating") info = lastLactatingInfo;

    if (!info) return null; // no info to show

    // parse date
    const lastDate = new Date(info.date);
    const nextCheckup = addMonths(lastDate, 1);
    const today = new Date();

    // format nicely
    const day = format(nextCheckup, "dd");
    const month = format(nextCheckup, "MMM");
    const weekday = format(nextCheckup, "EEEE");

    // check if overdue
    const isOverdue = isBefore(nextCheckup, today);

    return (
      <div className="p-4 mb-8 rounded-md border flex flex-col md:flex-row md:items-center justify-between gap-4 border-green-200 ">
        <div className="flex items-center gap-4">
          <div className="p-4 text-[12px] text-white font-medium rounded-[8px] w-14 h-14 bg-green-500 aspect-square flex justify-center items-center flex-col">
            <span className="text-2xl">{day}</span>
            {month}
          </div>
          <div>
            <h4 className="font-medium text-lg">Your Monthly Check Up</h4>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-[12px] text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{weekday}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>Your Barangay Health Center</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {isOverdue ? (
            <button
              disabled
              className="text-[12px] p-3 flex justify-between items-center rounded font-semibold text-red-600 border border-red-300 bg-red-50"
            >
              <AlertTriangleIcon className="h-3 w-3 mr-1" />
              You missed this checkup!
            </button>
          ) : (
            <button
              disabled
              className="text-[12px] p-3 flex justify-between items-center rounded font-semibold text-green-600"
            >
              <Check className="h-3 w-3 mr-1" />
              Remember this date
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-8/12 bg-white rounded-xl shadow-md border border-gray-300 p-6 space-y-5 max-[640px]:w-full">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1  ">
        Appointment Schedule
      </h2>
      <p className="text-gray-600 mb-4">
        Track all health-related appointments for Juan
      </p>

      <div className="flex items-center gap-2 bg-[#f4f6f8]  px-3 py-2 rounded-lg w-fit  my-6">
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

      {/* YOUR MOENTHYL APPOINTMENRT CHECKUP */}
      {reminderMonthlyCheckup()}

      <div className="w-full flex flex-col ">
        {tab === "Upcoming" ? <>{upcomingEvent}</> : <>{myReminders}</>}
      </div>

      {tab === "Upcoming" ? (
        <div className="mt-6 text-center">
          <button className="text-blue-300 hover:underline font-medium text-sm">
            Load more appointments
          </button>
        </div>
      ) : (
        <div className="mt-6 text-center">
          <button className="text-blue-300 hover:underline font-medium text-sm">
            Load More Appointments
          </button>
        </div>
      )}
    </div>
  );
}
