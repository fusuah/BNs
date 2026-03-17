"use client";

import { useRegisterBnsAdminMutation } from "@/service/auth/autApiSlice";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

const AdminCoordinatorRegister = () => {
  const [register, { isSuccess, error }] = useRegisterBnsAdminMutation();

  const [statusDropDown, setStatusDropDown] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [positionDropDown, setPositionDropDown] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    number: "",
    position: "",
    municipality: "",
    province: "",
    password: "",
    confirmpassword: "",
  });
  /* Dynamic On Change  */
  const setChangeData = (e) => {
    const { value, name } = e.target;

    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  /* setPosition */

  const setPosition = (txt) => {
    setFormData((prev) => {
      return { ...prev, position: txt };
    });
  };

  const registerUserSubmit = async () => {
    const isTrue = [
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.number,
      formData.password,
      formData.municipality,
      formData.confirmpassword,
      formData.province,
      formData.position,
    ].every(Boolean);

    const registerData = {
      fullName: `${formData?.firstName} ${formData?.lastName}`,
      email: formData?.email,
      number: formData?.number,
      municipality: formData.municipality,
      province: formData.province,
      position: formData.position,
      password: formData?.password,
      type: "bns-admin",
    };

    if (isTrue) {
      const res = await register({ ...registerData });

      if (error) {
        console.log(res);
      } else {
        toast.success("Register New Worker!", {
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
        });

        setFormData({
          firstname: "",
          lastname: "",
          emailAddress: "",
          bnsnumber: "",
          number: "",
          barangay: "",
          password: "",
          confirmPassword: "",
          type: "bns-admin",
        });
      }
    }
  };

  return (
    <div className="p-[24px]">
      <h3 className="text-2xl font-semibold mb-[6px]">
        Register as Admin/Coordinator
      </h3>{" "}
      <p className="text-sm text-gray-600 mb-[8px]">
        Create an administrative account for your municipality
      </p>
      {/*F Name L name*/}
      <div className="w-full flex gap-4">
        <div className="w-1/2  items-center mb-4  ">
          <label
            htmlFor="firstName"
            className="text-sm font-medium mb-2 inline-block text-nowrap"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            className="h-10 px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
            name="firstName"
            placeholder="First Name"
            onChange={(e) => setChangeData(e)}
          />
        </div>

        <div className="w-1/2  items-center mb-4  ">
          <label
            htmlFor="lastName"
            className="text-sm font-medium mb-2 inline-block text-nowrap"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            className="h-10 px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
            name="lastName"
            placeholder="Last Name"
            onChange={(e) => setChangeData(e)}
          />
        </div>
      </div>
      {/* Email Address */}
      <div className="w-full  items-center mb-[16px]  ">
        <label
          htmlFor="email"
          className="text-sm font-medium mb-2 inline-block text-nowrap"
        >
          Official Email Address
        </label>
        <input
          type="text"
          id="email"
          className="h-10 px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
          name="email"
          placeholder="jaun.delacruz@sample.com"
          onChange={(e) => setChangeData(e)}
        />
      </div>
      {/* Mobile Number */}
      <div className="w-full  items-center mb-[16px]  ">
        <label
          htmlFor="number"
          className="text-sm font-medium mb-2 inline-block text-nowrap"
        >
          Mobile Number
        </label>
        <input
          type="text"
          id="number"
          className="h-10 px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
          name="number"
          placeholder="09XX-XXX-XXXX"
          onChange={(e) => setChangeData(e)}
        />
      </div>
      {/* Postition */}
      {/*  */}
      <div className="w-full  mb-[16px] ">
        <label
          htmlFor="position"
          className="text-sm font-medium inline-block text-nowrap mb-2 "
        >
          Position
        </label>
        <div
          id="position"
          name="position"
          className="px-[8px] py-[12px] w-full flex justify-between outline-none rounded-md border border-gray-200 text-[14px] relative focus:ring-[#4CAF50] focus:ring-offset-2 "
          onClick={() => setPositionDropDown((prev) => !prev)}
        >
          {formData?.position ? formData?.position : "Select Position"}
          <i className="bi bi-chevron-down"></i>
          {/* DROPDOWN MENU */}
          <div
            className={`p-2 w-full overflow-auto gap-2 flex-col outline-none rounded-md border border-gray-200 text-[14px] absolute top-[120%] left-0 bg-[#f9fafb] ${
              positionDropDown ? "flex" : "hidden"
            } `}
          >
            {/* DROPDOWN DATA */}
            <div
              className={`px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer flex   ${
                formData?.position === "Municipal Nutrition Officer"
                  ? "bg-[#ffc105]"
                  : ""
              }`}
              onClick={() => setPosition("Municipal Nutrition Officer")}
            >
              <i
                className={`bi bi-check mr-2 ${
                  formData?.position === "Municipal Nutrition Officer"
                    ? "block"
                    : "hidden"
                } `}
              ></i>
              Municipal Nutrition Officer
            </div>
            <div
              className={`px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointe flex  ${
                formData?.position === "Municipal Health Environment Officer"
                  ? "bg-[#ffc105]"
                  : ""
              } `}
              onClick={() =>
                setPosition("Municipal Health Environment Officer")
              }
            >
              <i
                className={`bi bi-check mr-2 ${
                  formData?.position === "Municipal Health Environment Officer"
                    ? "block"
                    : "hidden"
                } `}
              ></i>
              Municipal Health Environment Officer
            </div>
            <div
              className={`px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointe flex  ${
                formData?.position === "Municipal Health Officer"
                  ? "bg-[#ffc105]"
                  : ""
              } `}
              onClick={() => setPosition("Municipal Health Officer")}
            >
              <i
                className={`bi bi-check mr-2 ${
                  formData?.position === "Municipal Health Officer"
                    ? "block"
                    : "hidden"
                } `}
              ></i>
              Municipal Health Officer
            </div>
            <div
              className={`px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointe flex  ${
                formData?.position === "Other Please Specify"
                  ? "bg-[#ffc105]"
                  : ""
              } `}
              onClick={() => setPosition("Other Please Specify")}
            >
              <i
                className={`bi bi-check mr-2 ${
                  formData?.position === "Other Please Specify"
                    ? "block"
                    : "hidden"
                } `}
              ></i>
              Other Please Specify
            </div>
          </div>
        </div>
      </div>
      {/*  */}
      {/* Municipality */}
      <div className="w-full  items-center mb-[16px]  ">
        <label
          htmlFor="municipality"
          className="text-sm font-medium mb-2 inline-block text-nowrap"
        >
          Municipality
        </label>
        <input
          type="text"
          id="municipality"
          className="h-10 px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
          name="municipality"
          placeholder="Your Municipality"
          onChange={(e) => setChangeData(e)}
        />
      </div>
      {/* Province */}
      <div className="w-full  items-center mb-[16px]  ">
        <label
          htmlFor="province"
          className="text-sm font-medium mb-2 inline-block text-nowrap"
        >
          Province
        </label>
        <input
          type="text"
          id="province"
          className="h-10 px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
          name="province"
          placeholder="Your Province"
          onChange={(e) => setChangeData(e)}
        />
      </div>
      {/* Password */}
      <div className="w-full  items-center mb-[16px]  ">
        <label
          htmlFor="password"
          className="text-sm font-medium mb-2 inline-block text-nowrap"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          className="h-10 px-[8px] py-[12px] mb-2 w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
          name="password"
          placeholder="********"
          onChange={(e) => setChangeData(e)}
        />
        <p className="text-sm text-gray-600 ">
          Password must be at least 8 characters long with special characters
        </p>
      </div>
      {/* Confirm Password */}
      <div className="w-full  items-center mb-[24px]  ">
        <label
          htmlFor="confirmpassword"
          className="text-sm font-medium mb-2 inline-block text-nowrap"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmpassword"
          className="h-10 px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
          name="confirmpassword"
          placeholder="********"
          onChange={(e) => setChangeData(e)}
        />
      </div>
      <button
        className={`w-full text-[14px] bg-[#4CAF50] text-white py-[12px] px-[8px] rounded-md hover:opacity-50 mb-4 ${
          formData.password !== formData?.confirmpassword ||
          !formData.password ||
          !formData?.confirmpassword
            ? "pointer-events-none opacity-50"
            : " "
        }`}
        disabled={formData.password !== formData?.confirmpassword}
        onClick={() => registerUserSubmit()}
      >
        Register
      </button>
      <p className="text-sm text-gray-600 mb-[8px] w-full text-center">
        Alrady have and Account ?{" "}
        <Link href={"/login"} className="text-[#4CAF50]">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default AdminCoordinatorRegister;
