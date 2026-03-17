"use client";
import { useLoginAdminMutation } from "@/service/auth/autApiSlice";
import { setToken } from "@/service/auth/authSlice";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const AdminLogIn = () => {
  /* API FUNCTION LOGIN */
  const [logInBnsAdmin, { isLoading }] = useLoginAdminMutation();

  const [logInData, setlogInData] = useState({
    email: "",
    password: "",
  });

  /* AUTH HANDLER*/

  const dispatch = useDispatch();

  /* Dynamic On Change  */
  const setChangeData = (e) => {
    const { value, name } = e.target;

    setlogInData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const logInUser = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (logInData?.email && logInData?.password) {
      try {
        const res = await logInBnsAdmin({ ...logInData });

        if (res?.error) {
          console.error(res.error);
          toast.error(res.error?.data?.message || "Wrong Email or Password!", {
            duration: 3000,
          });
        } else if (res?.data?.accessToken) {
          console.log(res?.data?.accessToken);

          dispatch(setToken({ accessToken: res?.data?.accessToken }));
          toast.success("Login Successful!");

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (err) {
        console.error("Login failed", err);
        toast.error("An unexpected error occurred.");
      }
    } else {
      toast.error("Please fill in both email and password.");
    }
  };

  return (
    <div className="p-[24px]">
      <h3 className="text-2xl font-semibold mb-[6px]">Admin Login</h3>{" "}
      <p className="text-sm text-gray-600 mb-[8px]">
        Enter your credentials to access the administration portal
      </p>
      <form onSubmit={logInUser}>
        {/* Email or ID Number*/}
        <div className="w-full  items-center mb-4  ">
          <label
            htmlFor="email"
            className="text-sm font-medium mb-2 inline-block text-nowrap"
          >
            Email or ID Number
          </label>
          <input
            type="text"
            id="email"
            className="h-10 px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
            name="email"
            placeholder="admin@example.com"
            onChange={(e) => setChangeData(e)}
            value={logInData.email}
          />
        </div>
        {/* Password */}
        <div className="w-full  items-center mb-[24px]  ">
          <div className="w-full flex justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium mb-2 inline-block text-nowrap"
            >
              Password
            </label>{" "}
            <Link
              href="#"
              className="text-sm text-[#4CAF50] font-regular mb-2 inline-block text-nowrap hover:underline"
            >
              Forgot Password ?
            </Link>
          </div>

          <input
            type="password"
            id="password"
            className="h-10 px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
            name="password"
            placeholder="**********"
            onChange={(e) => setChangeData(e)}
            value={logInData.password}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full text-[14px] bg-[#4CAF50] text-white py-[12px] px-[8px] rounded-md hover:opacity-50 mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing In..." : "Sign In as Admin"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogIn;