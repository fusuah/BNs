"use client";

import {
  useAddNewDataRecordsMutation,
  useAddPregnantDataMutation,
  useUpdatePregnantDataMutation,
} from "@/service/pregnantData/pregnantDataApiSlice";
import { addMonths, format } from "date-fns";
import { getRedirectError } from "next/dist/client/components/redirect";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import PastAppoinmentRecord from "./PastAppoinmentRecord";
import Link from "next/link";
import { id } from "date-fns/locale";

const UpdateRecordPregnant = ({ updateData }) => {
  /* API POST */

  const [updateNewDataInformation, { isError }] =
    useUpdatePregnantDataMutation();
  const [newRecords] = useAddNewDataRecordsMutation();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [pregnancyRiskDropDown, setPregnancyRisk] = useState(false);
  const [recommendationDropDown, setRecommendationDropDown] = useState(false);

  /* FORM VIEW STATE */
  const [view, setview] = useState("I");

  /* INDICATOR OF NEW RECORDS */
  const [isRecording, setIsRecording] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    expectedDelivery: "",
    pregnancyAge: 0,
    address: "",
    email: "",
    birthDate: "",
    number: "",
    pregnantinformation: [
      {
        weightKg: 0,
        bloodPressure: 0,
        muacCm: 0,
        date: "2025-06-02T16:02:15.346Z",
        pregnacyRisk: "",
        supplement: "",
        recommendation: [],
        note: "",
      },
    ],
  });

  const [information, setInformation] = useState({
    weightKg: 0,
    bloodPressure: 0,
    muacCm: 0,
    date: "2025-06-02T16:02:15.346Z",
    pregnacyRisk: "",
    supplement: "",
    recommendation: [],
    note: "",
  });

  useEffect(() => {
    if (updateData) {
      setFormData(updateData);
    } else {
      setFormData({
        expectedDelivery: "",
        pregnancyAge: 0,
        address: "",
        email: "",
        birthDate: "",
        number: "",
        pregnantinformation: [
          {
            weightKg: 0,
            bloodPressure: 0,
            muacCm: 0,
            date: "2025-06-02T16:02:15.346Z",
            pregnacyRisk: "",
            supplement: "",
            recommendation: [],
            note: "",
          },
        ],
      });
    }
  }, [updateData]);

  console.log(updateData);

  /* Generate Explected Delivery  */

  const getExpectedDelivery = (pregnancyAgeMonths) => {
    if (
      typeof pregnancyAgeMonths !== "number" ||
      pregnancyAgeMonths < 0 ||
      pregnancyAgeMonths > 9
    ) {
      alert("Pregnancy age must be a number between 0 and 9");
    }

    const today = new Date();
    const monthsRemaining = 9 - pregnancyAgeMonths;
    const expectedDate = addMonths(today, monthsRemaining);

    return format(expectedDate, "yyyy, MMM");
  };

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

  /* set information*/
  const setNumberData = (e) => {
    const { value, name } = e.target;

    setInformation((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  /* GENERATE DATE NOW */

  const generateDate = () => {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const year = now.getFullYear();

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return {
      dateNow: `${month}/${day}/${year}`,
      textDate: `${year}, ${monthNames[now.getMonth()]} ${now.getDate()}`,
    };
  };

  /* BG Status Reccomendation */

  const setBg = (txt) => {
    if (txt === 1) {
      return "bg-[#DBEAFE] text-[#1447E6]";
    } else if (txt === 2) {
      return "bg-[#DBFCE7] text-[#008236]";
    } else if (txt === 3) {
      return "bg-[#FEF9C2] text-[#894B00]";
    } else if (txt === 4) {
      return "bg-[#FAF5FF] text-[#6E11B0]";
    } else {
      return "bg-[#DBEAFE] text-[]";
    }
  };

  /* Select PregnancyRisk */

  const selectPregnancyRisk = (code) => {
    let risk = "";

    switch (code) {
      case "A1":
        risk = "Low";
        break;
      case "A2":
        risk = "Moderate";
        break;
      case "A3":
        risk = "High";
        break;
      case "A4":
        risk = "Very High";
        break;

      default:
        risk = "Unknown";
    }

    setInformation((prev) => ({
      ...prev,
      pregnacyRisk: risk,
    }));
  };

  /* Adding Recomendation */

  const addRecommendation = (code) => {
    let recommendation = {};

    if (code === "A1") {
      recommendation = {
        id: information?.recommendation?.length + 1,
        title: "Eat a Balanced Diet",
        description:
          "Include a variety of foods such as vegetables, fruits, whole grains, proteins, and healthy fats in your daily meals.",
      };
    } else if (code === "A2") {
      recommendation = {
        id: information?.recommendation?.length + 1,
        title: "Increase Iron Intake",
        description:
          "Eat iron-rich foods like lean meat, spinach, and beans to prevent anemia and support blood production.",
      };
    } else if (code === "A3") {
      recommendation = {
        id: information?.recommendation?.length + 1,
        title: "Consume Calcium-Rich Foods",
        description:
          "Dairy products, tofu, and green leafy vegetables are excellent sources of calcium for strong bones and teeth.",
      };
    } else if (code === "A4") {
      recommendation = {
        id: information?.recommendation?.length + 1,
        title: "Take Prenatal Supplements",
        description:
          "If pregnant, take prenatal vitamins as prescribed to meet the increased nutritional demands.",
      };
    } else {
      recommendation = {
        id: information?.recommendation?.length + 1,
        title: "Unknown Code",
        description: "No matching recommendation found for this code.",
      };
    }

    setInformation((prev) => {
      return {
        ...prev,

        recommendation: [
          ...(prev?.pregnantinformation?.recommendation || []),
          recommendation,
        ],
      };
    });
  };

  const removeRecommendation = (value) => {
    setFormData((prev) => {
      return {
        ...prev,
        pregnantinformation: {
          ...prev?.pregnantinformation,
          recommendation: prev?.pregnantinformation?.recommendation?.filter(
            (data) => {
              return data?.id !== value;
            }
          ),
        },
      };
    });
  };

  /* GET MY AGE BY MONTH */
  const getAgeInMonths = (birthdate) => {
    if (!birthdate) return 0;

    const birth = new Date(birthdate);
    const today = new Date();

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    // Adjust years and months if birthday hasn't occurred yet this year
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate())
    ) {
      years--;
      months += 12;
    }

    if (today.getDate() < birth.getDate()) {
      months--;
    }

    const totalMonths = years * 12 + months;
    return totalMonths;
  };

  /* ADD DATA */

  const sendData = async () => {
    const isFormValid = [
      formData?.name,
      formData?.address,
      formData?.email,
      formData?.number,
    ].every(Boolean);

    const dataToSend = {
      id: formData?._id,
      name: formData.name,
      address: formData.address,
      email: formData.email,
      number: formData.number,
    };

    console.log(dataToSend);

    if (isFormValid) {
      try {
        const res = await updateNewDataInformation({ ...dataToSend });

        toast.success("User Data Created", {
          duration: 3000,
        });

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        toast.error("Invalid Create", {
          duration: 3000,
        });
        console.error("Create Error:", error);
      }
    }
  };

  /* ADD DATA */

  const updateRecords = async () => {
    const isFormValid = [
      information?.muacCm,
      information?.supplement,
      information?.weightKg,
      information?.pregnacyRisk,
      information?.bloodPressure,
    ].every(Boolean);

    const dataToSend = {
      id: formData?._id,
      muacCm: information?.muacCm,
      supplement: information?.supplement,
      weightKg: information?.weightKg,
      pregnacyRisk: information?.pregnacyRisk,
      recommendation: information?.recommendation,
      bloodPressure: information?.bloodPressure,
    };

    console.log(dataToSend);

    if (isFormValid) {
      try {
        const res = await newRecords({ ...dataToSend });

        toast.success("User Data Created", {
          duration: 3000,
        });

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        toast.error("Invalid Create", {
          duration: 3000,
        });
        console.error("Create Error:", error);
      }
    }
  };

  console.log(information);

  /* SELECT LINKS */
  const linkClasses = (path) =>
    `text-[14px] font-medium py-1.5 px-8 rounded-md cursor-pointer
        ${
          view === path
            ? "bg-white text-black"
            : "bg-transparent text-[#64748b] "
        }`;

  return (
    <div className="w-full p-[24px] border border-gray-200  rounded-md relative">
      <Link href={"/bnsUser/pregnantData/"} className="absolute right-8 top-8">
        {" "}
        <i className="bi bi-x text-2xl"></i>{" "}
      </Link>
      {/* TITLE */}
      <div className="full flex justify-between items-center mb-4">
        <div className="w-full flex  gap-[12px]">
          {/* IMG */}
          <div className="h-16 w-16 bg-green-100 rounded-full overflow-hidden">
            <img
              src={
                formData?.imgUrl ? formData?.imgUrl : "/asset/default-dp.jpg"
              }
              className="h-full w-full scale-[1.2]  rounded-full
               "
              alt="User Avatar"
            />
          </div>
          {/* NAME */}
          <div>
            <h3 className="text-[24px] font-semibold">{formData?.name}</h3>
            <p className="text-[14px]  text-[#64748b] mb-[24px]   ">
              Expected Delivery <b>{formData?.expectedDelivery}</b>
            </p>
          </div>
        </div>

        <div className="w-[35%] flex flex-col items-end">{/* VACANT */}</div>
      </div>

      {/* MINI NAV */}
      <div className="bg-[#F1F5F9] rounded-md p-2 inline-block mb-[24px]">
        <button className={linkClasses("N")} onClick={() => setview("N")}>
          Nutrition
        </button>
        <button className={linkClasses("I")} onClick={() => setview("I")}>
          Information
        </button>
      </div>

      {view === "N" ? (
        <>
          {isRecording ? (
            <div className="w-full">
              {/* Nutrition Measurements */}

              <h3 className="text-lg font-semibold mb-[24px]">
                Nutrition Measurements
              </h3>

              {/* INPUT 5 */}
              <div className="w-full flex gap-[24px] mb-[24px]">
                <div className="w-[33.33%]">
                  <label htmlFor="weight" className="text-sm font-medium">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    className=" px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px] placeholder:text-gray-500"
                    placeholder="0"
                    value={formData?.information?.weightKg}
                    onChange={(e) => setNumberData(e)}
                    name="weightKg"
                  />
                </div>

                <div className="w-[33.33%]">
                  <label
                    htmlFor="bloodPressure"
                    className="text-sm font-medium"
                  >
                    Blood Pressure
                  </label>
                  <input
                    type="text"
                    id="bloodPressure"
                    className=" px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px] placeholder:text-gray-500"
                    placeholder="0"
                    value={information?.bloodPressure}
                    onChange={(e) => setNumberData(e)}
                    name="bloodPressure"
                  />
                </div>

                <div className="w-[33.33%]">
                  <label htmlFor="muac" className="text-sm font-medium">
                    MUAC (cm) - Optional
                  </label>
                  <input
                    type="number"
                    id="muac"
                    className=" px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px] placeholder:text-gray-500"
                    placeholder="0"
                    value={information?.muacCm}
                    onChange={(e) => setNumberData(e)}
                    name="muacCm"
                  />
                </div>
              </div>

              {/* INPUT 6*/}

              <div className="w-full flex gap-[24px] mb-[24px]">
                <div className="w-1/2">
                  <label htmlFor="supplement" className="text-sm font-medium">
                    Supplement (use comma to have space)
                  </label>
                  <input
                    type="text"
                    id="supplement"
                    className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]"
                    value={information?.supplement}
                    onChange={(e) => setNumberData(e)}
                    name="supplement"
                  />
                </div>
                <div className="w-1/2">
                  <label htmlFor="pregnacyRisk" className="text-sm font-medium">
                    Pregnancy Risk
                  </label>
                  <div
                    id="pregnacyRisk"
                    name="pregnacyRisk"
                    className="px-[8px] py-[12px] w-full flex justify-between outline-none rounded-md border border-gray-200 text-[14px] relative"
                    onClick={() => setPregnancyRisk((prev) => !prev)}
                  >
                    {information?.pregnacyRisk
                      ? information?.pregnacyRisk
                      : "Choose Pregnancy Risk"}
                    <i className="bi bi-chevron-down"></i>
                    {/* DROPDOWN MENU */}
                    <div
                      className={`p-2 w-full  gap-2 flex-col outline-none rounded-md border border-gray-200 text-[14px] absolute bottom-[120%] left-0 bg-[#f9fafb] ${
                        pregnancyRiskDropDown ? "flex" : "hidden"
                      } `}
                    >
                      <div
                        className="px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                        onClick={() => selectPregnancyRisk("A1")}
                      >
                        Low
                      </div>
                      <div
                        className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                        onClick={() => selectPregnancyRisk("A2")}
                      >
                        Moderate
                      </div>

                      <div
                        className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                        onClick={() => selectPregnancyRisk("A3")}
                      >
                        High{" "}
                      </div>

                      <div
                        className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                        onClick={() => selectPregnancyRisk("A4")}
                      >
                        Very High
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* INPUT 7 */}
              <div className="w-full flex gap-[24px] mb-[24px]">
                <div className="w-1/2">
                  <label
                    htmlFor="recommendation"
                    className="text-sm font-medium"
                  >
                    Recommendation
                  </label>
                  <div
                    id="recommendation"
                    name="recommendation"
                    className="px-[8px] py-[12px] w-full flex flex-wrap gap-2 justify-between outline-none rounded-md border border-gray-200 text-[14px] relative"
                    onClick={() => setRecommendationDropDown((prev) => !prev)}
                  >
                    {information?.recommendation?.length ? (
                      <>
                        {" "}
                        {information?.recommendation?.map((data, index) => {
                          return (
                            <div
                              className={`w-[30%] flex items-center justify-center px-2 text-[12px] text-center rounded-[2px] ${setBg(
                                index + 1
                              )}`}
                              key={index}
                            >
                              <i
                                className="bi bi-x cursor-pointer text-[16px]"
                                onClick={() => removeRecommendation(data?.id)}
                              >
                                {" "}
                              </i>
                              {data?.title}
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <>Add Recommendation</>
                    )}
                    <i className="bi bi-chevron-down"></i>
                    {/* DROPDOWN MENU */}
                    <div
                      className={`p-2 w-full  gap-2 flex-col outline-none rounded-md border border-gray-200 text-[14px] absolute bottom-[120%] left-0 bg-[#f9fafb] ${
                        recommendationDropDown ? "flex" : "hidden"
                      } `}
                    >
                      <div
                        className="px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                        onClick={() => addRecommendation("A1")}
                      >
                        Eat a Balanced Diet
                      </div>
                      <div
                        className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                        onClick={() => addRecommendation("A2")}
                      >
                        Increase Iron Intake
                      </div>
                      <div
                        className="px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                        onClick={() => addRecommendation("A3")}
                      >
                        Consume Calcium-Rich Foods
                      </div>

                      <div
                        className="px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                        onClick={() => addRecommendation("A4")}
                      >
                        Take Prenatal Supplements
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-1/2 ">
                  <label htmlFor="daterecord" className="text-sm font-medium">
                    Date Recorded
                  </label>
                  <div
                    type="date"
                    id="daterecord"
                    className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]"
                  >
                    {generateDate().dateNow}
                  </div>
                </div>
              </div>

              {/* INPUT 8 */}
              <div className="w-full mb-[24px]">
                <label htmlFor="note" className="text-sm font-medium">
                  Note / Recommendation
                </label>
                <textarea
                  type="text"
                  id="note"
                  className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]"
                  value={information?.note}
                  onChange={(e) => setNumberData(e)}
                  name="note"
                ></textarea>
              </div>

              <div className="w-full flex justify-between items-center">
                <button
                  className=" border border-gray-400 text-[12px]  flex items-center justify-center gap-5  px-[24px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:bg-[#FFC105]"
                  onClick={() => setIsRecording(false)}
                >
                  <i className="bi bi-x"></i> Cancel
                </button>

                <button
                  className=" bg-[#4CAF50] text-white text-[12px]  flex items-center justify-center gap-5 px-[24px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:opacity-50"
                  onClick={() => updateRecords()}
                >
                  <i className="bi bi-file-earmark-text"></i> Upload Record
                </button>
              </div>
            </div>
          ) : (
            <PastAppoinmentRecord
              pregnantinformation={formData?.pregnantinformation}
              setIsRecording={setIsRecording}
            />
          )}
        </>
      ) : (
        <>
          {/* INFORMATIOMN FORM */}
          <h3 className="text-lg font-semibold mb-[24px]">
            Mother Information
          </h3>
          {/* FORM INPUT */}
          <div className="w-full">
            {/* INPUT 1 */}
            <div className="w-full flex gap-[24px] mb-[24px]">
              <div className="w-1/2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px]"
                  value={formData?.name}
                  onChange={(e) => setChangeData(e)}
                  placeholder="Enter Your Full Name"
                />
              </div>{" "}
              <div className="w-1/2">
                <label htmlFor="pregnancyAge" className="text-sm font-medium">
                  Pregnancy Age
                </label>
                <input
                  type="number"
                  id="pregnancyAge"
                  name="pregnancyAge"
                  className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px]"
                  value={formData?.pregnancyAge}
                  onChange={(e) => setChangeData(e)}
                  placeholder="Age by Months"
                />
              </div>
            </div>

            {/* INPUT 2 */}
            <div className="w-full flex gap-[24px] mb-[24px]">
              <div className="w-1/2">
                <label htmlFor="birthdate" className="text-sm font-medium">
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
              <div className="w-1/2">
                <label htmlFor="" className="text-sm font-medium">
                  Expected Delivery
                </label>
                <div className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200 text-gray-500 text-[14px]">
                  {formData?.expectedDelivery}
                </div>
              </div>
            </div>

            {/* INPUT 3 */}
            <div className="w-full flex gap-[24px] mb-[24px]">
              <div className="w-1/2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]"
                  value={formData?.email}
                  onChange={(e) => setChangeData(e)}
                  placeholder="Your Email Adress....."
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="number" className="text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px]"
                  value={formData?.number}
                  placeholder="Your Phone Number....."
                  onChange={(e) => setChangeData(e)}
                />
              </div>
            </div>

            {/* INPUT 4 */}
            <div className="w-full flex gap-[24px] mb-[24px]">
              <div className="w-full">
                <label htmlFor="address" className="text-sm font-medium">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]"
                  value={formData?.address}
                  onChange={(e) => setChangeData(e)}
                  name="address"
                />
              </div>
            </div>

            <div className="w-full flex justify-between items-center">
              <button className=" border border-gray-400 text-[12px]  flex items-center justify-center gap-5  px-[24px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:bg-[#FFC105]">
                <i className="bi bi-x"></i> Cancel
              </button>

              <button
                className=" bg-[#4CAF50] text-white text-[12px]  flex items-center justify-center gap-5 px-[24px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:opacity-50"
                onClick={() => sendData()}
              >
                <i className="bi bi-file-earmark-text"></i> Update Information
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UpdateRecordPregnant;
