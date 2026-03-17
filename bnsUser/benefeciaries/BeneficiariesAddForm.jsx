"use client";
import React, { useEffect, useState } from "react";

const BeneficiariesAddForm = ({ setOpen }) => {
  const [statusDropDown, setStatusDropDown] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [categoryDropDown, setCategoryDropDown] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    ageMonths: 0,
    gender: "",
    street: "",
    barangay: "",
    contact: "",
    status: "",
    category: "",
    household: "",
    note: "",
  });

  console.log(formData);

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

  /* Set gender */

  const setGender = (txt) => {
    setFormData((prev) => {
      return { ...prev, gender: txt };
    });
  };

  /* setCategory */

  const setCategory = (txt) => {
    setFormData((prev) => {
      return { ...prev, category: txt };
    });
  };

  /* setStatus */

  const setStatus = (txt) => {
    setFormData((prev) => {
      return { ...prev, status: txt };
    });
  };

  console.log(formData);

  return (
    <div className="w-full p-[24px] border border-gray-200  rounded-md">
      <h3 className="text-[24px] font-semibold mb-[24px]">
        Add New Beneficiary{" "}
      </h3>

      {/* FORM INPUT */}

      <form action="" className="w-full">
        {/* INPUT 1 */}
        <div className="w-full flex gap-[24px] mb-[24px]">
          <div className="w-1/2">
            <label
              htmlFor="firstname"
              className="text-sm font-medium mb-[8  px]"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="name"
              className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px] focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
              value={formData?.name}
              onChange={(e) => setChangeData(e)}
              placeholder="First name"
            />
          </div>

          <div className="w-1/2">
            <label htmlFor="lastname" className="text-sm font-medium mb-[8px]">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px] focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
              value={formData?.mother}
              onChange={(e) => setChangeData(e)}
              placeholder="Last name"
            />
          </div>
        </div>

        {/* INPUT 2 */}
        <div className="w-full flex gap-[24px] mb-[24px]">
          <div className="w-1/2">
            <label htmlFor="gender" className="text-sm font-medium mb-[8px]">
              Gender
            </label>
            <div
              id="gender"
              name="nagenderme"
              className="px-[8px] py-[12px] w-full flex justify-between outline-none rounded-md border border-gray-200 text-[14px] relative"
              onClick={() => setDropDownOpen((prev) => !prev)}
            >
              {formData?.gender ? formData?.gender : " Choose Gender..."}
              <i className="bi bi-chevron-down"></i>
              {/* DROPDOWN MENU */}
              <div
                className={`p-2 w-full  gap-2 flex-col outline-none rounded-md border border-gray-200 text-[14px] absolute top-[120%] left-0 bg-[#f9fafb] ${
                  dropDownOpen ? "flex" : "hidden"
                } `}
              >
                <div
                  className={`px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer flex ${
                    formData?.gender === "Male" ? "bg-[#ffc105]" : ""
                  } `}
                  onClick={() => setGender("Male")}
                >
                  {" "}
                  <i
                    className={`bi bi-check mr-2  ${
                      formData?.gender === "Male" ? "block" : "hidden"
                    }`}
                  ></i>
                  Male
                </div>
                <div
                  className={`px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer flex ${
                    formData?.gender === "Female" ? "bg-[#ffc105]" : ""
                  } `}
                  onClick={() => setGender("Female")}
                >
                  {" "}
                  <i
                    className={`bi bi-check mr-2  ${
                      formData?.gender === "Female" ? "block" : "hidden"
                    }`}
                  ></i>
                  Female
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <label htmlFor="birthdate" className="text-sm font-medium mb-[8px]">
              Birth Date
            </label>
            <input
              type="date"
              id="birthdate"
              name="birthDate"
              className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]"
              value={formData?.birthDate}
              onChange={(e) => setChangeData(e)}
            />
          </div>
        </div>

        {/* INPUT 3 */}
        <div className="w-full flex gap-[24px] mb-[24px]">
          <div className="w-1/2">
            <label htmlFor="street" className="text-sm font-medium mb-[8px]">
              Adress
            </label>
            <input
              type="text"
              id="street"
              className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px] focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
              value={formData?.street}
              onChange={(e) => setChangeData(e)}
              name="street"
              placeholder="House no. and Street"
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="barangay" className="text-sm font-medium mb-[8px]">
              Barangay
            </label>
            <input
              type="text"
              id="barangay"
              className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px] focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2"
              value={formData?.barangay}
              onChange={(e) => setChangeData(e)}
              name="barangay"
              placeholder="Barangay"
            />
          </div>
        </div>

        {/* INPUT 4 */}
        <div className="w-full flex gap-[24px] mb-[24px]">
          <div className="w-1/2">
            <label htmlFor="contact" className="text-sm font-medium mb-[8px]">
              Contact
            </label>
            <input
              type="text"
              id="contact"
              className=" px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px] placeholder:text-gray-500 focus:ring-slate- focus:ring-[#4CAF50] focus:ring-offset-2"
              placeholder="Contact Number"
              value={formData?.contact}
              onChange={(e) => setChangeData(e)}
              name="contact"
            />
          </div>
          <div className="w-1/2">
            <label
              htmlFor="category"
              className="text-sm font-medium inline-block text-nowrap"
            >
              Beneficiary Category
            </label>
            <div
              id="category"
              name="category"
              className="px-[8px] py-[12px] w-full flex justify-between outline-none rounded-md border border-gray-200 text-[14px] relative focus:ring-[#4CAF50] focus:ring-offset-2 "
              onClick={() => setCategoryDropDown((prev) => !prev)}
            >
              {formData?.category
                ? formData?.category
                : "Select Nutritional Status"}
              <i className="bi bi-chevron-down"></i>
              {/* DROPDOWN MENU */}
              <div
                className={`p-2 w-full h-[200px] overflow-auto gap-2 flex-col outline-none rounded-md border border-gray-200 text-[14px] absolute top-[120%] left-0 bg-[#f9fafb] ${
                  categoryDropDown ? "flex" : "hidden"
                } `}
              >
                {/* DROPDOWN DATA */}
                <div
                  className={`px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer flex   ${
                    formData?.category === "Child" ? "bg-[#ffc105]" : ""
                  }`}
                  onClick={() => setCategory("Child")}
                >
                  <i
                    className={`bi bi-check mr-2 ${
                      formData?.category === "Child" ? "block" : "hidden"
                    } `}
                  ></i>
                  Child (0-5 years)
                </div>
                <div
                  className={`px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointe flex  ${
                    formData?.category === "Pregnant" ? "bg-[#ffc105]" : ""
                  } `}
                  onClick={() => setCategory("Pregnant")}
                >
                  <i
                    className={`bi bi-check mr-2 ${
                      formData?.category === "Pregnant" ? "block" : "hidden"
                    } `}
                  ></i>
                  Pregnant Woman
                </div>
                <div
                  className={`px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointe flex  ${
                    formData?.category === "Lactating" ? "bg-[#ffc105]" : ""
                  } `}
                  onClick={() => setCategory("Lactating")}
                >
                  <i
                    className={`bi bi-check mr-2 ${
                      formData?.category === "Lactating" ? "block" : "hidden"
                    } `}
                  ></i>
                  Lactating Mother
                </div>
                <div
                  className={`px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointe flex  ${
                    formData?.category === "Elderly" ? "bg-[#ffc105]" : ""
                  } `}
                  onClick={() => setCategory("Elderly")}
                >
                  <i
                    className={`bi bi-check mr-2 ${
                      formData?.category === "Elderly" ? "block" : "hidden"
                    } `}
                  ></i>
                  Elderly
                </div>{" "}
                <div
                  className={`px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointe flex  ${
                    formData?.category === "PWD" ? "bg-[#ffc105]" : ""
                  } `}
                  onClick={() => setCategory("PWD")}
                >
                  <i
                    className={`bi bi-check mr-2 ${
                      formData?.category === "PWD" ? "block" : "hidden"
                    } `}
                  ></i>
                  Person with Disability
                </div>{" "}
                <div
                  className={`px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer flex   ${
                    formData?.category === "Other " ? "bg-[#ffc105]" : ""
                  }`}
                  onClick={() => setCategory("Other")}
                >
                  <i
                    className={`bi bi-check mr-2 ${
                      formData?.category === "Other" ? "block" : "hidden"
                    } `}
                  ></i>
                  Other
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INPUT 5 */}
        <div className="w-full flex gap-[24px] mb-[24px]">
          <div className="w-1/2">
            <label
              htmlFor="status"
              className="text-sm font-medium inline-block text-nowrap"
            >
              Nutritional Status
            </label>
            <div
              id="status"
              name="status"
              className="px-[8px] py-[12px] w-full flex justify-between outline-none rounded-md border border-gray-200 text-[14px] relative focus:ring-[#4CAF50] focus:ring-offset-2"
              onClick={() => setStatusDropDown((prev) => !prev)}
            >
              {formData?.status
                ? formData?.status
                : "Select Nutritional Status"}
              <i className="bi bi-chevron-down"></i>
              {/* DROPDOWN MENU */}
              <div
                className={`p-2 w-full h-[100px] overflow-auto gap-2 flex-col outline-none rounded-md border border-gray-200 text-[14px] absolute top-[120%] left-0 bg-[#f9fafb] ${
                  statusDropDown ? "flex" : "hidden"
                } `}
              >
                <div
                  className={`px-[8px] py-[8px] w-full outline-none rounded-md flex  border  border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer ${
                    formData?.status === "Normal" ? "bg-[#ffc105]" : ""
                  } `}
                  onClick={() => setStatus("Normal")}
                >
                  <i
                    className={`bi bi-check mr-2  ${
                      formData?.status === "Normal" ? "block" : "hidden"
                    }`}
                  ></i>
                  Normal
                </div>
                <div
                  className={`px-[8px] py-[8px] w-full outline-none rounded-md flex  border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer ${
                    formData?.status === "Underweight" ? "bg-[#ffc105]" : ""
                  } `}
                  onClick={() => setStatus("Underweight")}
                >
                  <i
                    className={`bi bi-check mr-2  ${
                      formData?.status === "Underweight" ? "block" : "hidden"
                    }`}
                  ></i>
                  Underweight
                </div>
                <div
                  className={`px-[8px] py-[8px] w-full outline-none rounded-md flex  border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer ${
                    formData?.status === "Severely Underweight"
                      ? "bg-[#ffc105]"
                      : ""
                  } `}
                  onClick={() => setStatus("Severely Underweight")}
                >
                  <i
                    className={`bi bi-check mr-2  ${
                      formData?.status === "Severely Underweight"
                        ? "block"
                        : "hidden"
                    }`}
                  ></i>
                  Severely Underweight
                </div>
                <div
                  className={`px-[8px] py-[8px] w-full outline-none rounded-md flex  border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer ${
                    formData?.status === "Overweight" ? "bg-[#ffc105]" : ""
                  } `}
                  onClick={() => setStatusDropDown("Overweight")}
                >
                  <i
                    className={`bi bi-check mr-2  ${
                      formData?.status === "Overweight" ? "block" : "hidden"
                    }`}
                  ></i>
                  Overweight
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/2">
            <label htmlFor="household" className="text-sm font-medium mb-[8px]">
              Household (optional)
            </label>
            <input
              type="text"
              id="household"
              className=" px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px] placeholder:text-gray-500 focus:ring-[#4CAF50] focus:ring-offset-2 "
              placeholder="Household ID (optional)"
              value={formData?.household}
              onChange={(e) => setChangeData(e)}
              name="household"
            />
          </div>
        </div>

        {/* TEXTAREA INPUT */}
        <div className="w-full mb-[24px]">
          <label
            htmlFor="notes"
            className="text-sm font-medium mb-2 inline-block"
          >
            Notes
          </label>
          <textarea
            type="text"
            id="notes"
            className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]  focus:ring-1 focus:ring-[#4CAF50] focus:ring-offset-2 h-[80px] resize-none"
            name="notes"
            placeholder="Additional information about the beneficiary"
          ></textarea>{" "}
        </div>

        <div className="w-full flex justify-end gap-6 items-center">
          <button
            className=" border border-gray-400 text-[12px]  flex items-center justify-center gap-5  px-[24px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:bg-[#FFC105]"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>

          <button className=" bg-[#4CAF50] text-white text-[12px]  flex items-center justify-center gap-5 px-[24px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:opacity-50">
            Add Beneficiary
          </button>
        </div>
      </form>
    </div>
  );
};

export default BeneficiariesAddForm;
