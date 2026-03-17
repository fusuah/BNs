"use client";
import { Check, X, Bell, FileText, Calendar, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { notification } from "@/data/bnsUserSampleData";
import { useGetNotificationsQuery } from "@/service/notifications/notificationApiSlice";
import { format } from "date-fns";
import useAuth from "@/hooks/useAuth";
import { useAddFeedbackMutation } from "@/service/feedback/feedbackApiSlice";
import toast from "react-hot-toast";

const getNotificationIcon = (type, read) => {
  const className = `h-7 w-7 p-1 rounded-full ${
    read ? "text-white" : "text-white"
  }`;
  const typeOfNotif = type?.toString().trim().toLowerCase();

  switch (typeOfNotif) {
    case "reminder":
      return <Bell className={`${className} bg-[#6366F1]`} />;
    case "announcement":
      return <FileText className={`${className} bg-green-500`} />;
    case "program":
      return <Calendar className={`${className} bg-orange-500`} />;
    case "nutrition":
      return <Info className={`${className} bg-purple-500`} />;
    default:
      return <Bell className={className} />;
  }
};

const getNotificationTypeColor = (type) => {
  const typeOfNotif = type?.toString().trim().toLowerCase();

  switch (typeOfNotif) {
    case "reminder":
      return "bg-[#EFEFFE] text-blue-400 text-sm px-4 p-1 rounded-2xl font-semibold";
    case "announcement":
      return "bg-green-50 text-green-400 text-sm px-4 p-1 rounded-2xl font-semibold";
    case "program":
      return "bg-orange-50 text-orange-400 text-sm px-4 p-1 rounded-2xl font-semibold";
    case "nutrition":
      return "bg-violet-50 text-violet-400 text-sm px-4 p-1 rounded-2xl font-semibold";
    default:
      return "bg-[#EFEFFE] text-blue-400 text-sm px-4 p-1 rounded-2xl font-semibold";
  }
};

function formatDate(isoString) {
  if (!isoString) return "";
  return format(new Date(isoString), "dd MMMM yyyy");
}

const TABS = ["All", "Announcement", "Reminder", "Nutrition", "Program"];

function NotificationsPage() {
  const user = useAuth();

  const notif = useGetNotificationsQuery();

  const [openModal, setopenModal] = useState(false);

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(
      notif?.data
        ?.filter((data) =>
          data?.barangay?.toLowerCase()?.includes(user?.barangay?.toLowerCase())
        )
        ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  }, [notif?.data]);

  const [tab, setTab] = useState("All");

  console.log(filteredData);
  console.log("barangay");

  return (
    <>
      <FeedBackForm openModal={openModal} setopenModal={setopenModal} />
      <div className="space-y-6 animate-fade-in text-black max-[640px]:h-screen">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground text-gray-500">
              Stay updated with important information about your child's health
            </p>
          </div>
        </div>

        {/* NOTIFICATION CONTENT */}

        <div className="w-full bg-white p-6 rounded-2xl shadow">
          <div className="pb-3 w-full flex justify-between items-center max-[640px]:flex-col max-[640px]:items-start  max-[640px]:gap-2 ">
            <div className="">
              <h4 className="text-2xl font-semibold">All Notifications</h4>
              <p className="text-sm text-gray-500">
                Your recent notifications and updates
              </p>
            </div>

            <button
              className=" bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer"
              onClick={() => setopenModal(true)}
            >
              <i className="bi bi-bell mr-2"></i>Send Feedback
            </button>
          </div>
          <div className="flex items-center gap-2 bg-[#f4f6f8] px-3 py-2 rounded-lg w-fit  my-6 max-[640px]:flex-wrap">
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
          <div>
            <div className="w-full">
              {/* ALL FILTERING */}
              {tab === "All" && (
                <div value="all" className="space-y-4  w-full">
                  {filteredData?.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 rounded-lg border w-full  ${getNotificationTypeColor(
                        notification?.notif_type
                      )}`}
                    >
                      <div className="flex gap-4 items-start w-full ">
                        {/* ICON */}
                        <div
                          className={` rounded-full bg-gray-50 border-gray-100  ${
                            notification.read
                              ? "text-gray-700"
                              : "text-gray-900"
                          }`}
                        >
                          {getNotificationIcon(
                            notification.notif_type,
                            notification.read
                          )}
                        </div>

                        {/* CONTENT */}
                        <div className="flex justify-between w-full max-[640px]:flex-col max-[640px]:items-start">
                          <div className="flex w-full  flex-col items-start justify-center ">
                            <h3
                              className={`font-medium text-lg text-gray-900
                            `}
                            >
                              {notification.notif_type
                                ?.charAt(0)
                                .toUpperCase() +
                                notification.notif_type?.slice(1)}
                              {!notification.read && (
                                <span className="inline-block h-2 w-2 rounded-full bg-bns-primary ml-2"></span>
                              )}
                            </h3>
                            <span className="text-[12px] text-gray-500 mb-6 max-[640px]:mb-2">
                              {formatDate(notification?.createdAt)}
                            </span>
                            <p className={`mt-1 text-sm text-gray-500 `}>
                              {notification?.content}
                            </p>
                          </div>

                          <button className="whitespace-nowrap">
                            Mark As Read
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* ANNOCMENT FILTERING */}
              {tab?.toLowerCase() === "announcement" && (
                <div value="all" className="space-y-4  w-full">
                  {filteredData
                    ?.filter(
                      (data) =>
                        data?.notif_type?.toLowerCase() === tab?.toLowerCase()
                    )
                    ?.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-4 rounded-lg border w-full ${getNotificationTypeColor(
                          notification?.notif_type
                        )}`}
                      >
                        <div className="flex gap-4 items-start w-full">
                          {/* ICON */}
                          <div
                            className={` rounded-full bg-gray-50 border-gray-100  ${
                              notification.read
                                ? "text-gray-700"
                                : "text-gray-900"
                            }`}
                          >
                            {getNotificationIcon(
                              notification.notif_type,
                              notification.read
                            )}
                          </div>

                          {/* CONTENT */}
                          <div className="flex justify-between w-full max-[640px]:flex-col max-[640px]:items-start">
                            <div className="flex w-full  flex-col items-start justify-center">
                              <h3
                                className={`font-medium text-lg text-gray-900
                            `}
                              >
                                {notification.notif_type
                                  ?.charAt(0)
                                  .toUpperCase() +
                                  notification.notif_type?.slice(1)}
                                {!notification.read && (
                                  <span className="inline-block h-2 w-2 rounded-full bg-bns-primary ml-2"></span>
                                )}
                              </h3>
                              <span className="text-[12px] text-gray-500 mb-6 max-[640px]:mb-2">
                                {formatDate(notification?.createdAt)}
                              </span>
                              <p className={`mt-1 text-sm text-gray-500 `}>
                                {notification?.content}
                              </p>
                            </div>

                            <button className="whitespace-nowrap">
                              Mark As Read
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              {/* REMINDER FILTERING */}
              {tab?.toLowerCase() === "reminder" && (
                <div value="all" className="space-y-4  w-full">
                  {filteredData
                    ?.filter(
                      (data) =>
                        data?.notif_type?.toLowerCase() === tab?.toLowerCase()
                    )
                    ?.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-4 rounded-lg border w-full ${getNotificationTypeColor(
                          notification?.notif_type
                        )}`}
                      >
                        <div className="flex gap-4 items-start w-full">
                          {/* ICON */}
                          <div
                            className={` rounded-full bg-gray-50 border-gray-100  ${
                              notification.read
                                ? "text-gray-700"
                                : "text-gray-900"
                            }`}
                          >
                            {getNotificationIcon(
                              notification.notif_type,
                              notification.read
                            )}
                          </div>

                          {/* CONTENT */}
                          <div className="flex justify-between w-full max-[640px]:flex-col max-[640px]:items-start">
                            <div className="flex w-full  flex-col items-start justify-center">
                              <h3
                                className={`font-medium text-lg text-gray-900
                            `}
                              >
                                {notification.notif_type
                                  ?.charAt(0)
                                  .toUpperCase() +
                                  notification.notif_type?.slice(1)}
                                {!notification.read && (
                                  <span className="inline-block h-2 w-2 rounded-full bg-bns-primary ml-2"></span>
                                )}
                              </h3>
                              <span className="text-[12px] text-gray-500 mb-6 max-[640px]:mb-2">
                                {formatDate(notification?.createdAt)}
                              </span>
                              <p className={`mt-1 text-sm text-gray-500 `}>
                                {notification?.content}
                              </p>
                            </div>

                            <button className="whitespace-nowrap">
                              Mark As Read
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}{" "}
              {/* NUTRITION FILTERING */}
              {tab?.toLowerCase() === "nutrition" && (
                <div value="all" className="space-y-4  w-full">
                  {filteredData
                    ?.filter(
                      (data) =>
                        data?.notif_type?.toLowerCase() === tab?.toLowerCase()
                    )
                    ?.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-4 rounded-lg border w-full ${getNotificationTypeColor(
                          notification?.notif_type
                        )}`}
                      >
                        <div className="flex gap-4 items-start w-full">
                          {/* ICON */}
                          <div
                            className={` rounded-full bg-gray-50 border-gray-100  ${
                              notification.read
                                ? "text-gray-700"
                                : "text-gray-900"
                            }`}
                          >
                            {getNotificationIcon(
                              notification.notif_type,
                              notification.read
                            )}
                          </div>

                          {/* CONTENT */}
                          <div className="flex justify-between w-full max-[640px]:flex-col max-[640px]:items-start">
                            <div className="flex w-full  flex-col items-start justify-center">
                              <h3
                                className={`font-medium text-lg text-gray-900
                            `}
                              >
                                {notification.notif_type
                                  ?.charAt(0)
                                  .toUpperCase() +
                                  notification.notif_type?.slice(1)}
                                {!notification.read && (
                                  <span className="inline-block h-2 w-2 rounded-full bg-bns-primary ml-2"></span>
                                )}
                              </h3>
                              <span className="text-[12px] text-gray-500 mb-6 max-[640px]:mb-2">
                                {formatDate(notification?.createdAt)}
                              </span>
                              <p className={`mt-1 text-sm text-gray-500 `}>
                                {notification?.content}
                              </p>
                            </div>

                            <button className="whitespace-nowrap">
                              Mark As Read
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              {/* PROGRAM FILTERING */}
              {tab?.toLowerCase() === "program" && (
                <div value="all" className="space-y-4  w-full">
                  {filteredData
                    ?.filter(
                      (data) =>
                        data?.notif_type?.toLowerCase() === tab?.toLowerCase()
                    )
                    ?.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-4 rounded-lg border w-full ${getNotificationTypeColor(
                          notification?.notif_type
                        )}`}
                      >
                        <div className="flex gap-4 items-start w-full">
                          {/* ICON */}
                          <div
                            className={` rounded-full bg-gray-50 border-gray-100  ${
                              notification.read
                                ? "text-gray-700"
                                : "text-gray-900"
                            }`}
                          >
                            {getNotificationIcon(
                              notification.notif_type,
                              notification.read
                            )}
                          </div>

                          {/* CONTENT */}
                          <div className="flex justify-between w-full max-[640px]:flex-col max-[640px]:items-start">
                            <div className="flex w-full  flex-col items-start justify-center">
                              <h3
                                className={`font-medium text-lg text-gray-900
                            `}
                              >
                                {notification.notif_type
                                  ?.charAt(0)
                                  .toUpperCase() +
                                  notification.notif_type?.slice(1)}
                                {!notification.read && (
                                  <span className="inline-block h-2 w-2 rounded-full bg-bns-primary ml-2"></span>
                                )}
                              </h3>
                              <span className="text-[12px] text-gray-500 mb-6 max-[640px]:mb-2">
                                {formatDate(notification?.createdAt)}
                              </span>
                              <p className={`mt-1 text-sm text-gray-500 `}>
                                {notification?.content}
                              </p>
                            </div>

                            <button className="whitespace-nowrap">
                              Mark As Read
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const FeedBackForm = ({ openModal, setopenModal }) => {
  const [sendFeedback] = useAddFeedbackMutation();

  const [feedBackData, setFeedBackData] = useState("");
  const [rateNumber, setRateNumber] = useState(0);

  const [rate, setRate] = useState(false);

  const sendData = async () => {
    if (feedBackData && rateNumber) {
      const res = sendFeedback({
        rate: rateNumber,
        comment: feedBackData,
        isProgramFeedback: false,
      });

      if (res) {
        toast.success("FeedBack Sent!", {
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
        });

        window.location.reload();
      }
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 z-10 h-screen w-screen bg-[rgba(0,0,0,0.37)]  justify-center items-center  ${
        openModal ? "flex" : "hidden"
      }`}
      onClick={() => setopenModal(false)}
    >
      <div
        className="bg-white p-8 rounded-md flex flex-col gap-3 max-[640px]:w-[90%]"
        onClick={(e) => e?.stopPropagation()}
      >
        <div className="w-full ">
          <h4 className="text-2xl font-semibold text-black">
            Send Us Feedback
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            Your concern and feedback will be action, Thank you
          </p>
        </div>

        <input
          type="text"
          id="tasktitle"
          className="px-[8px] py-[12px] w-[534px] mr-2 outline-none rounded-md border border-gray-200 text-black text-[14px] focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2 max-[640px]:w-full"
          value={feedBackData}
          onChange={(e) => setFeedBackData(e.target.value)}
          placeholder="Input your Comment/Feedback Here"
        />

        <div className="w-full flex gap-3 max-[640px]:flex-col">
          {/* DROPDOWN */}
          <div
            id="rate"
            name="rate"
            className="px-[8px] py-[6px] w-1/2 flex justify-between outline-none rounded-md border border-gray-200 text-[14px] relative focus:ring-[#4CAF50] text-black focus:ring-offset-2 max-[640px]:w-full"
            onClick={() => setRate((prev) => !prev)}
          >
            {rateNumber ? (
              <div>
                <i className="bi bi-star-fill text-yellow-500"> </i>
                {rateNumber}.0
              </div>
            ) : (
              "Select your Rating"
            )}
            <i className="bi bi-chevron-down"></i>
            <div
              className={`p-2 w-full overflow-auto gap-2 flex-col outline-none rounded-md border border-gray-200 text-[14px] absolute top-[120%] left-0 bg-[#f9fafb] ${
                rate ? "flex" : "hidden"
              } `}
            >
              {/* DROPDOWN DATA */}
              <div
                className={`px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px]  relative  duration-200 hover:bg-[#FFC105] hover:text-white cursor-pointer flex gap-3   ${
                  rateNumber == 1.0
                    ? "bg-[#ffc105] text-white"
                    : "text-yellow-500"
                }`}
                onClick={() => setRateNumber(1.0)}
              >
                <i
                  className={`bi bi-check mr-2 ${
                    rateNumber == 1.0 ? "block" : "hidden"
                  } `}
                ></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star"></i>
                <i className="bi bi-star"></i>
                <i className="bi bi-star"></i>
                <i className="bi bi-star"></i>
              </div>

              <div
                className={`px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px]  relative  duration-200 hover:bg-[#FFC105] hover:text-white cursor-pointer flex gap-3   ${
                  rateNumber == 2.0
                    ? "bg-[#ffc105] text-white"
                    : "text-yellow-500"
                }`}
                onClick={() => setRateNumber(2.0)}
              >
                <i
                  className={`bi bi-check mr-2 ${
                    rateNumber == 2.0 ? "block" : "hidden"
                  } `}
                ></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star"></i>
                <i className="bi bi-star"></i>
                <i className="bi bi-star"></i>
              </div>

              {/*  */}
              <div
                className={`px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px]  relative  duration-200 hover:bg-[#FFC105] hover:text-white cursor-pointer flex gap-3   ${
                  rateNumber == 3.9
                    ? "bg-[#ffc105] text-white"
                    : "text-yellow-500"
                }`}
                onClick={() => setRateNumber(3.9)}
              >
                <i
                  className={`bi bi-check mr-2 ${
                    rateNumber == 3.9 ? "block" : "hidden"
                  } `}
                ></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star"></i>
                <i className="bi bi-star"></i>
              </div>
              {/*  */}

              <div
                className={`px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px]  relative  duration-200 hover:bg-[#FFC105] hover:text-white cursor-pointer flex gap-3   ${
                  rateNumber == 4.0
                    ? "bg-[#ffc105] text-white"
                    : "text-yellow-500"
                }`}
                onClick={() => setRateNumber(4.0)}
              >
                <i
                  className={`bi bi-check mr-2 ${
                    rateNumber == 4.0 ? "block" : "hidden"
                  } `}
                ></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star"></i>
              </div>
              {/*  */}
              <div
                className={`px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px]  relative  duration-200 hover:bg-[#FFC105] hover:text-white cursor-pointer flex gap-3   ${
                  rateNumber == 5.0
                    ? "bg-[#FFC105] text-white"
                    : "text-yellow-500"
                }`}
                onClick={() => setRateNumber(5.0)}
              >
                <i
                  className={`bi bi-check mr-2 ${
                    rateNumber == 5.0 ? "block" : "hidden"
                  } `}
                ></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
              </div>
            </div>
          </div>
          <button
            className=" bg-green-600 w-1/2 text-white px-6 py-2 rounded-md cursor-pointer max-[640px]:w-full"
            onClick={sendData}
          >
            Send <i className="bi bi-arrow-right-short "></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
