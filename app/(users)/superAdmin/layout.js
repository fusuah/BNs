"use client";

import Persist from "@/components/auth/persist/Persist";
import SuperAdminSidebar from "@/components/superAdmin/SuperAdminSidebar";
import useAuth from "@/hooks/useAuth";
import { Bell, MonitorCog, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserAccount from "@/components/bnsUser/nav-components/UserAccount";
import { format } from "date-fns";

export default function SuperAdminLayout({ children }) {
  const { type, name, id, imgUrl } = useAuth();

  const router = useRouter();
  const [notifOpen, setnotifOpen] = useState(false);
  const [userAccountOpen, setuserAccountOpen] = useState(false);
  // Add mounted state to fix hydration error
  const [isMounted, setIsMounted] = useState(false);

  const [systemNotifications, setSystemNotifications] = useState([
    {
      id: "1",
      title: "System Maintenance",
      message: "The system will be offline from 1AM to 3AM.",
      createdAt: new Date("2025-06-15"),
    },
    {
      id: "2",
      title: "New Feature Released",
      message: "Chat support is now available for all users.",
      createdAt: new Date("2025-06-16"),
    },
    {
      id: "3",
      title: "New Feature Released",
      message: "Chat support is now available for all users.",
      createdAt: new Date("2025-06-16"),
    },
    {
      id: "4",
      title: "New Feature Released",
      message: "Chat support is now available for all users.",
      createdAt: new Date("2025-06-16"),
    },
    {
      id: "5",
      title: "New Feature Released",
      message: "Chat support is now available for all users.",
      createdAt: new Date("2025-06-16"),
    },
    {
      id: "6",
      title: "New Feature Released",
      message: "Chat support is now available for all users.",
      createdAt: new Date("2025-06-16"),
    },
    {
      id: "7",
      title: "New Feature Released",
      message: "Chat support is now available for all users.",
      createdAt: new Date("2025-06-16"),
    },
  ]);
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [justCreatedId, setJustCreatedId] = useState(null);
  const handleSelect = (notif) => {
    setSelected(notif);
    setEditMode(false);
  };

  const handleSave = () => {
    if (!selected) return;
    setSystemNotifications((prev) =>
      prev.map((n) => (n.id === selected.id ? selected : n))
    );
    setEditMode(false);
  };
  useEffect(() => {
    // Set mounted to true after initial client render
    setIsMounted(true);

    if (type !== "bns-admin") {
      if (type === "bns-worker") {
        router.replace("/bnsUser");
      } else if (type === "bns-beneficiary") {
        router.replace("/beneficiary");
      }
    }
  }, [router, type]);
  const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    const initials = words
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
    return initials;
  };
  const handleCreate = () => {
    const newNotif = {
      id: Date.now().toString(),
      title: "Untitled Notification",
      message: "New system notification message...",
      createdAt: new Date(),
    };
    setSystemNotifications([newNotif, ...systemNotifications]);
    setSelected(newNotif);
    setEditMode(true);
    setJustCreatedId(newNotif.id);
  };
  return (
    <Persist>
      <div className="flex min-h-screen bg-[#F9FAFB]">
        {/* Left Sidebar */}
        <SuperAdminSidebar />

        {/* Right Main Content */}
        <div className="flex flex-col flex-1  ">
          {/* Top Header  */}
          <header className="text-black h-16 flex items-center justify-between px-6 shadow bg-white sticky top-0 z-10 w-full">
            {/* Search Bar */}
            <div className="flex items-center gap-2 w-1/3">
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-sm outline-none"
                />
              </div>
            </div>

            {/* Notification + Profile */}
            <div className="flex items-center gap-6">
              {/* Notification Bell */}
              {/* <div
                className="relative"
                onClick={() =>
                  document.getElementById("notificationModal").showModal()
                }
              >
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
              </div> */}

              {/* <div
                onClick={() =>
                  document.getElementById("systemNotificationModal").showModal()
                }
              >
                <MonitorCog className="w-5 h-5 text-gray-700" />
              </div> */}

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="leading-tight text-sm">
                  {/* Hydration fix: Only display name if mounted */}
                  <div className="font-semibold text-gray-900">
                    {isMounted ? name || "User" : ""}
                  </div>
                  <div className="text-gray-500 text-xs">Bns-Admin</div>
                </div>
                <div
                  className=" h-[40px] w-[40px] bg-green-400 rounded-full relative"
                  onClick={() => {
                    setuserAccountOpen((prev) => !prev);
                    setnotifOpen(false);
                  }}
                >
                  <UserAccount userAccountOpen={userAccountOpen} />

                  <div className="w-full h-full rounded-full flex justify-center items-center text-xl">
                    {/* Hydration fix: Only display initials if mounted */}
                    {isMounted ? getInitials(name) : ""}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <dialog id="notificationModal" className="modal">
            <div className="modal-box bg-white h-[80vh] w-[80vw] max-w-none">
              <h3 className="font-bold text-lg">Hello!</h3>
              <p className="py-4">
                Press ESC key or click the button below to close
              </p>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>

          <dialog id="systemNotificationModal" className="modal">
            <div className="modal-box bg-white text-black w-[80vw] p-10 h-[80vh] max-w-none overflow-hidden">
              <h3 className="font-bold text-xl mb-4 flex justify-between items-center">
                <span>System Notifications</span>
                <button
                  className="btn bg-green-500 btn-sm border-none"
                  onClick={handleCreate}
                >
                  + New Notification
                </button>
              </h3>

              <div className="flex gap-6">
                {/* Notification List */}
                <div className="mb-4 space-y-2 w-4/12 overflow-y-auto h-[55vh]">
                  {systemNotifications.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No notifications available.
                    </p>
                  ) : (
                    systemNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 rounded border ${
                          selected?.id === notif.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        } cursor-pointer hover:bg-gray-50`}
                        onClick={() => handleSelect(notif)}
                      >
                        <p className="font-semibold">{notif.title}</p>
                        <p className="text-sm text-gray-500">
                          {/* Hydration fix: Only format date if mounted to prevent server/client timezone mismatch */}
                          {isMounted ? format(notif.createdAt, "PPpp") : ""}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Viewer/Editor */}
                <div className="pt-4 space-y-3 w-8/12">
                  {selected ? (
                    !editMode ? (
                      <>
                        <div>
                          <p className="font-semibold text-sm text-gray-500">
                            Title:
                          </p>
                          <p className="text-lg">{selected.title}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-500">
                            Message:
                          </p>
                          <p className="whitespace-pre-wrap">
                            {selected.message}
                          </p>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <button
                            className="btn btn-outline"
                            onClick={() => setEditMode(true)}
                          >
                            Edit
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="label">Title</label>
                          <input
                            type="text"
                            className="input input-bordered w-full bg-gray-100"
                            value={selected.title}
                            onChange={(e) =>
                              setSelected({
                                ...selected,
                                title: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="label">Message</label>
                          <textarea
                            className="textarea textarea-bordered w-full h-32 bg-gray-100"
                            value={selected.message}
                            onChange={(e) =>
                              setSelected({
                                ...selected,
                                message: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <button
                            className="btn bg-green-500 border-none"
                            onClick={handleSave}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-outline"
                            onClick={() => {
                              setSystemNotifications((prev) =>
                                prev.filter((n) => n.id !== justCreatedId)
                              );
                              setJustCreatedId(null);
                              setSelected(null);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )
                  ) : (
                    <div className="text-gray-500 italic">
                      Select a notification
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn bg-red-500 border-none">Close</button>
                </form>
              </div>
            </div>
          </dialog>

          {/* Page content */}
          <main className="p-6 flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </Persist>
  );
}