"use client";
import { useState } from "react";

const FillUpModal = ({
  modalFormOpen,
  setModalFormOpen,
  formTitle,
  formDescription,
  formType,
}) => {
  const [genderDropDown, setGenderDropDown] = useState(false);
  const [statusDropDown, setStatusDropDown] = useState(false);

  return (
    <div
      className={`h-screen w-screen flex justify-center items-center bg-[#00000082] fixed top-0 left-0 z-[999] ${
        modalFormOpen ? "flex" : "hidden"
      }`}
    >
      <div className="bg-white p-6 rounded-md relative">
        <button
          className="absolute right-[5%] top-6"
          onClick={() => setModalFormOpen(false)}
        >
          <i className="bi bi-x"></i>
        </button>
        {/* FORM TITLE */}
        <h2 className="text-lg font-semibold mb-[6px]">{formTitle}</h2>{" "}
        <p className="text-[14px]  text-[#64748b]  mb-4">{formDescription}</p>
        <form className="w-full ">
          {/* INPUT GROUPS */}

          <div className="flex flex-col gap-4 w-[718px] mb-4 p-6">
            {" "}
            {/* NAME */}
            <div className="w-full flex items-center justify-end gap-6 ">
              <label
                htmlFor="fullName"
                className="text-sm font-medium mb-2 inline-block text-nowrap"
              >
                Child Full Name <b className="text-red-500">*</b>
              </label>
              <input
                type="text"
                id="fullName"
                className="px-[8px] py-[12px] w-[534px] outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
                name="fullName"
                placeholder="Enter Child full name"
              />
            </div>
            {/* BIRTHDATE */}
            <div className="w-full flex items-center justify-end gap-6 ">
              <label
                htmlFor="birthDate"
                className="text-sm font-medium mb-2 inline-block text-nowrap"
              >
                Date of Birth <b className="text-red-500">*</b>
              </label>
              <input
                type="date"
                id="birthDate"
                className="px-[8px] py-[12px] w-[534px] outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
                name="birthDate"
                placeholder="Enter Child full name"
              />
            </div>
            {/* GENDER */}
            <div className="w-full flex items-center justify-end gap-6">
              <label
                htmlFor="gender"
                className="text-sm font-medium mb-2 inline-block text-nowrap"
              >
                Gender <b className="text-red-500">*</b>
              </label>
              <div
                id="gender"
                name="gender"
                className="px-[8px] py-[12px] w-[534px] flex justify-between outline-none rounded-md border border-gray-200 text-[14px] relative"
                onClick={() => setGenderDropDown((prev) => !prev)}
              >
                Choose Gender...
                <i className="bi bi-chevron-down"></i>
                {/* DROPDOWN MENU */}
                <div
                  className={`p-2 w-full  gap-2 flex-col outline-none rounded-md border border-gray-200 text-[14px] absolute top-[120%] left-0 bg-[#f9fafb] ${
                    genderDropDown ? "flex" : "hidden"
                  } `}
                >
                  <div
                    className="px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                    /*   onClick={() => setGender("Male")} */
                  >
                    Male
                  </div>
                  <div
                    className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                    /*   onClick={() => setGender("Female")} */
                  >
                    Female
                  </div>
                </div>
              </div>
            </div>
            {/* WEIGHT  */}
            <div className="w-full flex items-center justify-end gap-6 ">
              <label
                htmlFor="weight"
                className="text-sm font-medium mb-2 inline-block text-nowrap"
              >
                Weight (kg) <b className="text-red-500">*</b>
              </label>
              <input
                type="number"
                id="weight"
                className="px-[8px] py-[12px] w-[534px] outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
                name="weight"
                placeholder="Enter Weight (kg)"
              />
            </div>
            {/* HEIGHT  */}
            <div className="w-full flex items-center justify-end gap-6 ">
              <label
                htmlFor="height"
                className="text-sm font-medium mb-2 inline-block text-nowrap"
              >
                Height (cm) <b className="text-red-500">*</b>
              </label>
              <input
                type="number"
                id="height"
                className="px-[8px] py-[12px] w-[534px] outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
                name="height"
                placeholder="Enter Height (cm)"
              />
            </div>
            {/* MUAC  */}
            <div className="w-full flex items-center justify-end gap-6 ">
              <label
                htmlFor="muac"
                className="text-sm font-medium mb-2 inline-block  text-right"
              >
                Mid-Upper Arm Circumference (cm)
              </label>
              <input
                type="number"
                id="muac"
                className="px-[8px] py-[12px] min-w-[534px] outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
                name="muac"
                placeholder="Enter Mid-Upper Arm Circumference (cm)"
              />
            </div>
            {/* STATUS */}
            <div className="w-full flex items-center justify-end gap-6">
              <label
                htmlFor="status"
                className="text-sm font-medium mb-2 inline-block text-nowrap"
              >
                Status <b className="text-red-500">*</b>
              </label>
              <div
                id="status"
                name="status"
                className="px-[8px] py-[12px] w-[534px] flex justify-between outline-none rounded-md border border-gray-200 text-[14px] relative"
                onClick={() => setStatusDropDown((prev) => !prev)}
              >
                Select Nutritional Status
                <i className="bi bi-chevron-down"></i>
                {/* DROPDOWN MENU */}
                <div
                  className={`p-2 w-full h-[100px] overflow-auto gap-2 flex-col outline-none rounded-md border border-gray-200 text-[14px] absolute top-[120%] left-0 bg-[#f9fafb] ${
                    statusDropDown ? "flex" : "hidden"
                  } `}
                >
                  <div
                    className="px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                    /*   onClick={() => setGender("Male")} */
                  >
                    Normal
                  </div>
                  <div
                    className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                    /*   onClick={() => setGender("Female")} */
                  >
                    Underweight
                  </div>
                  <div
                    className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                    /*   onClick={() => setGender("Female")} */
                  >
                    Severely Underweight
                  </div>
                  <div
                    className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                    /*   onClick={() => setGender("Female")} */
                  >
                    Overweight
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* BTN CONTAINER */}
          <div className="w-full flex justify-between">
            {" "}
            <div className="flex gap-4">
              {" "}
              <button className="py-[8px] px-[12px] cursor-pointer font-semibold border border-gray-200 rounded-md flex justify-center items-center gap-4 min-w-min text-nowrap text-[14px]  duration-200  hover:bg-[#FFC105]  hover:text-black">
                <i className="bi bi-file-earmark-text "></i>
                Export to Excel
              </button>{" "}
              <button className="py-[8px] px-[12px] cursor-pointer font-semibold border border-gray-200 rounded-md flex justify-center items-center gap-4 min-w-min text-nowrap text-[14px]  duration-200  hover:bg-[#FFC105]  hover:text-black">
                <i className="bi bi-file-earmark "></i>
                Export to PDF
              </button>
            </div>
            <button className="py-[8px] px-[12px] cursor-pointer font-semibold bg-[#4CAF50] text-white  rounded-md flex justify-center items-center gap-4 min-w-min text-nowrap text-[14px]  duration-200  hover:opacity-50">
              Save Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FillUpModal;
