import React from "react";

const NotifBnsUser = ({ notifOpen }) => {
  return (
    <div
      className={` p-2 w-[320px] absolute right-0 top-[110%] rounded-md bg-white border-gray-200 border ${
        notifOpen ? "block" : "hidden"
      }`}
    >
      <h4 className="text-sm font-semibold py-2.5 border-b border-gray-200">
        Notifications
      </h4>

      {/* NOTIF */}

      <div className="w-full p-2 rounded-sm duration-200 hover:bg-[#FFC107]">
        <h4 className="font-medium text-[14px]">Assigned New Task</h4>
        <p className="text-xs text-[12px] text-[#64748b] ">5 minutes ago</p>
      </div>

      <div className="w-full p-2 rounded-sm duration-200 hover:bg-[#FFC107]">
        <h4 className="font-medium text-[14px]">Mothnly Report Due Tommorow</h4>
        <p className="text-xs text-[12px] text-[#64748b]">2 hours ago</p>
      </div>

      <div className="w-full p-2 rounded-sm duration-200 hover:bg-[#FFC107]">
        <h4 className="font-medium text-[14px]">Feeding Program Schedule</h4>
        <p className="text-xs text-[12px] text-[#64748b]">Yesterday</p>
      </div>

      <h4 className="text-sm rounded-sm text-center font-regular text-[#4CAF50] py-2.5 border-t border-gray-100 duration-200 hover:bg-[#FFC107] hover:text-black">
        View all notifications
      </h4>
    </div>
  );
};

export default NotifBnsUser;
