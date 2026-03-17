"use client";
import useAuth from "@/hooks/useAuth";
import { useAddNotificationsMutation } from "@/service/notifications/notificationApiSlice";
import { useState } from "react";
import toast from "react-hot-toast";

const AddingNotif = () => {
  const { barangay } = useAuth();

  const [addNotif, { isError }] = useAddNotificationsMutation();

  const [typeOfNotif, setTypeOfNotif] = useState("");
  const [notifDropdown, setNotifDropdown] = useState(false);
  const [notifContent, setNotifContent] = useState("");

  const selectTypeOfNotif = (code) => {
    let selected = "";

    switch (code) {
      case "A1":
        selected = "reminder";
        break;
      case "A2":
        selected = "announcement";
        break;
      case "A3":
        selected = "nutrition";
        break;
      case "A4":
        selected = "program";
        break;

      default:
        selected = "Unknown";
    }

    setTypeOfNotif(selected);
    console.log(selected);
  };

  console.log({
    notif_type: typeOfNotif,
    barangay: barangay,
    content: notifContent,
  });

  const sendData = async () => {
    const isTrue = [typeOfNotif, barangay, notifContent]?.every(Boolean);

    if (isTrue) {
      const res = await addNotif({
        notif_type: typeOfNotif,
        barangay: barangay,
        content: notifContent,
      });

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

  return (
    <div className="w-full">
      {" "}
      {/* DESRIPTION*/}
      <div className="w-full mb-[12px] ">
        <label
          htmlFor="notification"
          className="text-sm font-medium mb-2 inline-block"
        >
          Notifcation Content
        </label>
        <textarea
          type="text"
          id="notification"
          className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2 h-[100px] resize-none "
          name="notification"
          onChange={(e) => setNotifContent(e.target.value)}
          placeholder="Your Notifcation Content"
          value={notifContent}
        ></textarea>
      </div>
      {/* Barangay */}
      <div className="w-full mb-[12px]">
        <label
          htmlFor="Barangay"
          className="text-sm font-medium mb-2 inline-block"
        >
          To Barangay
        </label>

        <div className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px] text-gray-500">
          <h5 className="whitespace-nowrap">{barangay} Siniloan, Laguna</h5>
        </div>
      </div>
      {/* Remind Date */}
      <div className="w-full flex items-end justify-end gap-4 mb-4">
        <div className="w-full">
          <label htmlFor="notifType" className="text-sm font-medium">
            Notification Type
          </label>
          <div
            id="notifType"
            name="notifType"
            className="px-[8px] py-[12px] w-full flex justify-between outline-none rounded-md border border-gray-200 text-[14px] relative"
            onClick={() => setNotifDropdown((prev) => !prev)}
          >
            {typeOfNotif ? typeOfNotif : "Choose Notifcation Type"}
            <i className="bi bi-chevron-down"></i>
            {/* DROPDOWN MENU */}
            <div
              className={`p-2 w-full  gap-2 flex-col outline-none rounded-md border border-gray-200 text-[14px] absolute top-[120%] left-0 bg-[#f9fafb] ${
                notifDropdown ? "flex" : "hidden"
              } `}
            >
              <div
                className="px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                onClick={() => selectTypeOfNotif("A1")}
              >
                Reminders
              </div>
              <div
                className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                onClick={() => selectTypeOfNotif("A2")}
              >
                Announcement
              </div>

              <div
                className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                onClick={() => selectTypeOfNotif("A3")}
              >
                Nutrition
              </div>

              <div
                className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                onClick={() => selectTypeOfNotif("A4")}
              >
                Program
              </div>
            </div>
          </div>
        </div>

        <button
          className="py-[14px] px-[12px] cursor-pointer  bg-[#4CAF50] text-white  rounded-md flex justify-center items-center gap-4 min-w-min text-nowrap text-[14px]  duration-200  hover:opacity-50"
          onClick={() => {
            sendData();
          }}
        >
          <i className="bi bi-plus "></i>
          Add Notification
        </button>
      </div>
    </div>
  );
};

export default AddingNotif;
