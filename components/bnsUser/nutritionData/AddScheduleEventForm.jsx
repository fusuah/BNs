import { useAddEventScheduleMutation } from "@/service/eventSched/eventApiSlice";
import { useState } from "react";
import toast from "react-hot-toast";

const AddScheduleEventForm = () => {
  const [addData, { isSuccess, error, isError }] =
    useAddEventScheduleMutation();

  const [data, setData] = useState({
    title: "",
    description: "",
    eventStart: "",
    eventEnd: "",
    eventDate: "",
    location: "",
  });

  const setChangeData = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const sendData = async () => {
    const isTrue = [
      data?.description,
      data?.title,
      data?.eventDate,
      data?.location,
    ]?.every(Boolean);

    if (isTrue) {
      const res = await addData({ ...data });

      if (isError && res) {
        console.log(res);

        toast.error("Somethings Wrong!", {
          duration: 3000,
        });
      } else {
        if (res?.data) {
          console.log(res?.data);

          toast.success("Succesfully Added", {
            duration: 3000,
          });

          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }
    }
  };

  console.log(data);

  return (
    <div className="w-1/2 ">
      <h3 className="text-[16px] font-semibold mb-[12px]">Event Schedules</h3>

      <div className="w-full flex gap-4 mb-4">
        {/* Remind Title */}
        <div className="w-full flex flex-col   ">
          <label
            htmlFor="title"
            className="text-sm font-medium mb-2 inline-block text-nowrap"
          >
            Event Title
          </label>
          <input
            type="text"
            id="title"
            className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
            name="title"
            placeholder="Enter Event i.e Free Haircut, Feeding ....."
            onChange={(e) => setChangeData(e)}
            value={data?.title}
          />
        </div>
      </div>

      {/* DESRIPTION*/}
      <div className="w-full mb-[12px] ">
        <label
          htmlFor="description"
          className="text-sm font-medium mb-2 inline-block"
        >
          Event Description
        </label>
        <textarea
          type="text"
          id="description"
          className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2 h-[100px] resize-none "
          name="description"
          onChange={(e) => setChangeData(e)}
          placeholder="Your Event Description"
          value={data?.description}
        ></textarea>
      </div>

      {/* TIME AND DATE */}
      <div className="w-full flex gap-4 mb-4">
        {/* Remind Title */}
        <div className="w-full flex flex-col   ">
          <label
            htmlFor="eventStart"
            className="text-sm font-medium mb-2 inline-block text-nowrap"
          >
            Time
          </label>

          <div className="w-full flex gap-4">
            <input
              type="time"
              id="eventStart"
              className="px-[8px] py-[12px] w-1/2 outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
              name="eventStart"
              placeholder="Enter Child full name"
              onChange={(e) => setChangeData(e)}
              value={data?.eventStart}
            />

            <input
              type="time"
              id="eventEnd"
              className="px-[8px] py-[12px] w-1/2 outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
              name="eventEnd"
              placeholder="Enter Child full name"
              value={data?.eventEnd}
              onChange={(e) => setChangeData(e)}
            />
          </div>
        </div>

        {/* Remind Date */}
        <div className="w-full">
          <div className="w-full">
            <label htmlFor="eventDate" className="text-[12px] font-medium">
              Date
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]"
              onChange={(e) => setChangeData(e)}
              value={data?.eventDate}
            />
          </div>
        </div>
      </div>

      <div className="w-full flex gap-4 mb-4">
        {/* Remind Title */}
        <div className="w-full flex flex-col   ">
          <label
            htmlFor="location "
            className="text-sm font-medium mb-2 inline-block text-nowrap"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
            name="location"
            placeholder="Event Location "
            onChange={(e) => setChangeData(e)}
            value={data?.location}
          />
        </div>
      </div>

      <div className="w-full flex gap-4">
        {" "}
        <button
          className="py-[8px] px-[12px] w-full cursor-pointer  bg-[#4CAF50] text-white  rounded-md flex justify-center items-center gap-4 min-w-min text-nowrap text-[14px]  duration-200  hover:opacity-50"
          onClick={() => {
            sendData();
          }}
        >
          <i className="bi bi-plus "></i>
          Add Event Schedule
        </button>{" "}
        <button
          className="py-[8px] px-[12px] w-full cursor-pointer  border border-[#4CAF50] text-primary-color  rounded-md flex justify-center items-center gap-4 min-w-min text-nowrap text-[14px]  duration-200  hover:opacity-50"
          onClick={() => {
            setData({
              title: "",
              description: "",
              eventStart: "",
              eventEnd: "",
              eventDate: "",
              location: "",
            });
          }}
        >
          Reset Form
        </button>
      </div>
    </div>
  );
};

export default AddScheduleEventForm;
