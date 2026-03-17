"use client";

import {
  Bell,
  BellRing,
  ArrowRight,
  FileText,
  Calendar,
  Info,
} from "lucide-react";
import { notification } from "@/data/bnsUserSampleData";
import Link from "next/link";
import { useGetNotificationsQuery } from "@/service/notifications/notificationApiSlice";
import { useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import useAuth from "@/hooks/useAuth";

const getTimeAgo = (date) => {
  if (!date) return "";
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(parsedDate, { addSuffix: true });
};

const getNotificationIcon = (type) => {
  const className = `h-7 w-7 p-1 rounded-full text-white`;
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

const getNotificationBg = (type, read) => {
  if (read) return "bg-gray-50 border-gray-100";

  const typeOfNotif = type?.toString().trim().toLowerCase();

  switch (typeOfNotif) {
    case "reminder":
      return "bg-[#F7F7FE] border-[#E2E2FC]";
    case "nutrition":
      return "bg-[#F4FCF7] border-[#DFF7E8]";
    case "program":
      return "bg-[#F9FAFB] border-[#E8EBF1]";
    case "announcement":
      return "bg-[#F9FAFB] border-[#E8EBF1]";
    default:
      return "bg-gray-50 border-gray-100";
  }
};

export default function Notifications() {
  const user = useAuth();

  const notif = useGetNotificationsQuery();

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

  console.log(filteredData);

  return (
    <div className="bg-white rounded-xl shadow-md p-5 space-y-4 border-none w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
          <BellRing size={18} className="text-green-600" />
          Recent Notifications
        </div>
        <div className="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          {notification.filter((n) => !n.read).length}
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-3">
        {filteredData?.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No new notifications</p>
          </div>
        ) : (
          filteredData?.slice(0, 3).map((notification) => (
            <div
              key={notification._id}
              className={`p-3 rounded-lg border ${getNotificationBg(
                notification?.notif_type,
                notification?.read
              )}`}
            >
              <div className="flex gap-3">
                <div className="shrink-0 mt-1">
                  {getNotificationIcon(notification?.notif_type)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">
                      {notification?.notif_type}
                    </h4>
                    <p className="text-xs text-gray-400 text-muted-foreground">
                      {getTimeAgo(notification?.createdAt)}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification?.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Link
        href={"/beneficiary/notifications"}
        className="flex bg-gray-100 p-2 justify-center items-center gap-2 text-sm font-semibold text-green-500 rounded-md border border-gray-300"
      >
        View All Notifications <ArrowRight />
      </Link>
    </div>
  );
}
