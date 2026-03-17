import { logOut } from "@/service/auth/authSlice";
import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";

const UserAccount = ({ userAccountOpen }) => {
  const dispatch = useDispatch();

  const logOutUser = () => {
    console.log("Log Out");

    dispatch(logOut());

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <div
      className={` p-2 w-[224px] absolute right-0 top-[110%] rounded-md bg-white border-gray-200 border ${
        userAccountOpen ? "block" : "hidden"
      }`}
    >
      <h4 className="text-sm font-semibold py-2.5 border-b border-gray-200">
        My Account
      </h4>
      {/* BUTTON */}
      <Link
        href={"/bnsUser/setting"}
        className="w-full p-2 block text-sm  text-start rounded-sm duration-200 hover:bg-[#FFC107]"
      >
        <i className="bi bi-person mr-2"></i> Profile Setting
      </Link>

      <h4
        className="text-sm flex items-center gap-2 justify-start text-[#EF5350]  rounded-sm font-regular py-2.5 border-t border-gray-100 duration-200 cursor-pointer hover:bg-[#FFC107] hover:text-black"
        onClick={() => logOutUser()}
      >
        <i className="bi bi-download rotate-[-90deg]"></i> Log Out
      </h4>
    </div>
  );
};

export default UserAccount;
