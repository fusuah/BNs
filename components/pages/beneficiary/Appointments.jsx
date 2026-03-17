"use client";
import AppointmentSchedule from "@/components/beneficiary/AppointmentSchedule";
import UpcomingEvents from "@/components/beneficiary/UpcomingEvents";
import useAuth from "@/hooks/useAuth";
import { useGetEventQuery } from "@/service/eventSched/eventApiSlice";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
function BeneficiaryAppointmentsPage() {
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

  console.log(joinedEvents);

  return (
    <div className="text-black">
      <div className="flex justify-between items-center max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-2">
        <div>
          <strong className="text-2xl">Appointments</strong>
          <p className="text-gray-500">
            Manage upcoming and past health appointments
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-2xl h-10 w-fit ">
          <Bell size={16} />

          <span className="font-semibold text-sm">Reminders</span>
        </div>
      </div>
      <div className="my-6 flex justify-start w-full gap-6 max-[640px]:flex-col">
        <UpcomingEvents data={data?.data} />
        <AppointmentSchedule data={data?.data} />
      </div>
    </div>
  );
}

export default BeneficiaryAppointmentsPage;
