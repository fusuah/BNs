"use client";
import AddingNotif from "@/components/bnsUser/eventnNotif/AddingNotif";
import AddScheduleEventForm from "@/components/bnsUser/nutritionData/AddScheduleEventForm";
import CalendarWithEvents from "@/components/bnsUser/eventnNotif/CalendarWithEvents ";
import { useGetEventQuery } from "@/service/eventSched/eventApiSlice";
import React from "react";

const Reminders = () => {
  const data = useGetEventQuery();

  return (
    <div className="h-full w-full max-w-[1220px] max-h-[1000px]  mx-auto px-4 py-6 ">
      <div className="w-full flex flex-col mb-[32px] ">
        <h1 className="text-3xl font-bold "> Event and Notification</h1>
        <p className="text-[16px] text-[#64748b] mb-2 ">
          Reminders for all user for Event Schedule and for notification
        </p>
      </div>

      <div className="w-full flex felx-col gap-4 mb-[32px]">
        <div
          className="w-full  border border-gray-200 rounded-md p-6
            mb-[24px] flex gap-[44px] relative"
        >
          {/*  <button className="absolute text-3xl text-[#EF5350] px-3 border border-gray-[#EF5350] rounded-md top-2 right-4 cursor-pointer">
                -
              </button> */}
          <AddScheduleEventForm />

          {/* LIST OF USER REMINDER */}
          <div className="w-1/2 ">
            <h3 className="text-[16px] font-semibold mb-[12px]">
              Beneficiary Reminder
            </h3>
            <div className=" flex flex-col gap-[12px] overflow-auto rounded-md mb-4"></div>
            <AddingNotif />
          </div>
        </div>
      </div>

      <div className="w-full">
        <CalendarWithEvents data={data?.data} />
      </div>
    </div>
  );
};

export default Reminders;
