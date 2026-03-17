"use client";

import { useRegisterBnsWorkerMutation } from "@/service/auth/autApiSlice";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

const RegisterBNSWorker = () => {
  /* API FUNCTION */

  const siniloanBarangay = [
    "Acevida",
    "Bagong Pag-Asa",
    "Bagumbarangay",
    "Buhay",
    "Gen. Luna",
    "Halayhayin",
    "Mendiola",
    "Kapatalan",
    "Laguio",
    "Liyang",
    "Llavac",
    "Pandeno",
    "Magsaysay",
    "Macatad",
    "Mayatba",
    "P. Burgos",
    "G. Redor",
    "Salubungan",
    "Wawa",
    "J. Rizal",
  ];
  const [register, { isSuccess, error }] = useRegisterBnsWorkerMutation();

  /*  */
  const [statusDropDown, setStatusDropDown] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [barangayDropDown, setBarangayDropDown] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    emailAddress: "",
    bnsnumber: "",
    number: "",
    barangay: "",
    password: "",
    confirmPassword: "",
    type: "bns-worker",
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

  /* setBarangay */

  const setBarangay = (txt) => {
    setFormData((prev) => {
      return { ...prev, barangay: txt };
    });
  };

  console.log(formData);

  const registerUserSubmit = async () => {
    const isTrue = [
      formData.firstname,
      formData.lastname,
      formData.emailAddress,
      formData.bnsnumber,
      formData.number,
      formData.barangay,
      formData.password,
      formData.confirmPassword,
      formData.type,
    ].every(Boolean);

    const registerData = {
      fullName: `${formData?.firstname} ${formData?.lastname}`,
      email: formData?.emailAddress,
      bnsId: formData?.bnsnumber,
      number: formData?.number,
      barangay: formData?.barangay,
      password: formData?.password,
      type: "bns-worker",
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
          type: "bns-worker",
        });
      }
    }
  };

  return (
    <div className="p-[24px]">
      <h3 className="text-2xl font-semibold mb-[6px]">
        Register as BNS Worker
      </h3>{" "}
      <p className="text-sm text-gray-600 mb-[8px]">
        Create an account to access the BNS Assist platform
      </p>
      {/*F Name L name*/}
      <div className="w-full flex gap-4">
        <div className="w-1/2  items-center mb-4  ">
          <label
            htmlFor="firstname"
            className="text-sm font-medium mb-2 inline-block text-nowrap"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            className="h-10 px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
            name="firstname"
            placeholder="First Name"
            value={formData?.firstname}
            onChange={(e) => setChangeData(e)}
          />
        </div>

        <div className="w-1/2  items-center mb-4  ">
          <label
            htmlFor="lastname"
            className="text-sm font-medium mb-2 inline-block text-nowrap"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            className="h-10 px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
            name="lastname"
            placeholder="Last Name"
            value={formData?.lastname}
            onChange={(e) => setChangeData(e)}
          />
        </div>
      </div>
      {/* Email Address */}
      <div className="w-full  items-center mb-[16px]  ">
        <label
          htmlFor="emailAddress"
          className="text-sm font-medium mb-2 inline-block text-nowrap"
        >
          Email Address
        </label>
        <input
          type="email"
          id="emailAddress"
          className="h-10 px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
          name="emailAddress"
          onChange={(e) => setChangeData(e)}
          value={formData?.emailAddress}
          placeholder="maria.santos@sample.com"
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
          value={formData?.number}
          onChange={(e) => setChangeData(e)}
        />
      </div>
      {/* BNS Number */}
      <div className="w-full  items-center mb-[16px]  ">
        <label
          htmlFor="bnsnumber"
          className="text-sm font-medium mb-2 inline-block text-nowrap"
        >
          BNS ID Number (if available)
        </label>
        <input
          type="text"
          id="bnsnumber"
          className="h-10 px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
          name="bnsnumber"
          placeholder="BNS-12345"
          value={formData?.bnsnumber}
          onChange={(e) => setChangeData(e)}
        />
      </div>
      {/* BARANGAY */}
      {/*  */}
      <div className="w-full  mb-[16px] ">
        <label
          htmlFor="barangay"
          className="text-sm font-medium inline-block text-nowrap mb-2 "
        >
          Barangay Assignment
        </label>
        <div
          id="barangay"
          name="barangay"
          className="px-[8px] py-[12px] w-full flex justify-between outline-none rounded-md border border-gray-200 text-[14px] relative focus:ring-[#4CAF50] focus:ring-offset-2 "
          onClick={() => setBarangayDropDown((prev) => !prev)}
        >
          {formData?.barangay ? formData?.barangay : "Select Barangay"}
          <i className="bi bi-chevron-down"></i>
          {/* DROPDOWN MENU */}
          <div
            className={`p-2 w-full overflow-auto gap-2 flex-col outline-none rounded-md border border-gray-200 text-[14px] absolute top-[120%] left-0 bg-[#f9fafb] ${
              barangayDropDown ? "flex" : "hidden"
            } `}
          >
            {/* DROPDOWN DATA */}
            {siniloanBarangay.map((barangayName, index) => (
              <div
                className={`px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer flex   ${
                  formData?.barangay === barangayName ? "bg-[#ffc105]" : ""
                }`}
                key={index}
                onClick={() => setBarangay(barangayName)}
              >
                <i
                  className={`bi bi-check mr-2 ${
                    formData?.barangay === barangayName ? "block" : "hidden"
                  } `}
                ></i>
                {barangayName}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/*  */}
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
          value={formData?.password}
          onChange={(e) => setChangeData(e)}
        />
        <p className="text-sm text-gray-600 ">
          Password must be at least 8 characters long
        </p>
      </div>
      {/* Confirm Password */}
      <div className="w-full  items-center mb-[24px]  ">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium mb-2 inline-block text-nowrap"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          className="h-10 px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
          name="confirmPassword"
          placeholder="********"
          value={formData?.confirmPassword}
          onChange={(e) => setChangeData(e)}
        />
      </div>
      <button
        className="w-full text-[14px] bg-[#4CAF50] text-white py-[12px] px-[8px] rounded-md hover:opacity-50 mb-4"
        disabled={formData?.confirmPassword != formData.password}
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

export default RegisterBNSWorker;
