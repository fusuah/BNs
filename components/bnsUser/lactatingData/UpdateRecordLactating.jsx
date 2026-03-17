"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import PastAppointmentRecord from "./PastAppointmentRecord";
import {
  useAddNewLactatingDataRecordMutation,
  useUpdateLactatingDataMutation,
} from "@/service/lactatingData/lactatingDataApiSlice";

function UpdateRecordLactating({ data }) {
  const [view, setView] = useState("I");
  const [isRecording, setIsRecording] = useState(false);
  const [pregnancyRiskDropDown, setPregnancyRisk] = useState(false);
  const [breestFeedDropDown, setBreestFeedDropdown] = useState(false);
  const [recommendationDropDown, setRecommendationDropDown] = useState(false);
  
  // Initialize formData with default values to avoid uncontrolled input warning
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    address: "",
    email: "",
    number: "",
    birthDate: "",
    lactatinginformation: []
  });

  const [updateLactatingData] = useUpdateLactatingDataMutation();
  const [addNewRecord] = useAddNewLactatingDataRecordMutation();
  
  const [information, setInformation] = useState({
    weightKg: 0,
    muacCm: 0,
    date: new Date().toISOString(),
    pregnacyRisk: "",
    supplement: "",
    recommendation: [],
    breestFeedStatus: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        _id: data._id || "",
        name: data.name || "",
        address: data.address || "",
        email: data.email || "",
        number: data.number || "",
        birthDate: data.birthDate || "",
        lactatinginformation: data.lactatinginformation || []
      });
    }
  }, [data]);

  /* SELECT LINKS */
  const linkClasses = (path) =>
    `text-[14px] font-medium py-1.5 px-8 rounded-md cursor-pointer
        ${
          view === path
            ? "bg-white text-black"
            : "bg-transparent text-[#64748b] "
        }`;

  const setChangeData = (e) => {
    const { value, name } = e.target;

    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const sendData = async () => {
    console.log("Updating form data:", formData);
    const isFormValid = [
      formData?.name,
      formData?.address,
      formData?.email,
      formData?.number,
      formData?.birthDate,
    ].every(Boolean);

    const dataToSend = {
      id: formData?._id, // Ensure ID is sent
      name: formData.name,
      address: formData.address,
      email: formData.email,
      number: formData.number,
      birthDate: formData.birthDate,
    };

    if (isFormValid) {
      try {
        console.log("Sending update payload:", dataToSend);
        const res = await updateLactatingData(dataToSend).unwrap(); // Use unwrap to catch error
        console.log("Update response:", res);
        
        toast.success("User Data Updated Successfully", {
          duration: 3000,
        });

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error("Update Error:", error);
        toast.error("Failed to Update Data", {
          duration: 3000,
        });
      }
    } else {
      toast.error("Please fill in all required fields", {
        duration: 3000,
      });
    }
  };

  const setNumberData = (e) => {
    const { value, name } = e.target;

    setInformation((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    console.log(information);
  };

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

  const selectBreestFeedStatus = (code) => {
    let breestFeedStatus = "";

    switch (code) {
      case "A1":
        breestFeedStatus = "Exclusive Breastfeeding";
        break;
      case "A2":
        breestFeedStatus = "Partial Breastfeeding";
        break;
      case "A3":
        breestFeedStatus = "Bottle Feeding";
        break;
      case "A4":
        breestFeedStatus = "No Breastfeeding";
        break;
      case "A5":
        breestFeedStatus = "Breastfeeding with Supplementation";
        break;
      case "A6":
        breestFeedStatus = "Expressed Milk";
        break;
      default:
        breestFeedStatus = "Unknown";
    }

    setInformation((prev) => ({
      ...prev,
      breestFeedStatus: breestFeedStatus,
    }));
  };

  const addRecommendation = (code) => {
    const currentLength = information.recommendation?.length || 0;
    let recommendation = {
      id: "",
      title: "",
      description: "",
    };

    if (code === "A1") {
      recommendation = {
        id: currentLength + 1,
        title: "Eat a Balanced Diet",
        description:
          "Include a variety of foods such as vegetables, fruits, whole grains, proteins, and healthy fats in your daily meals.",
      };
    } else if (code === "A2") {
      recommendation = {
        id: currentLength + 1,
        title: "Increase Iron Intake",
        description:
          "Eat iron-rich foods like lean meat, spinach, and beans to prevent anemia and support blood production.",
      };
    } else if (code === "A3") {
      recommendation = {
        id: currentLength + 1,
        title: "Consume Calcium-Rich Foods",
        description:
          "Dairy products, tofu, and green leafy vegetables are excellent sources of calcium for strong bones and teeth.",
      };
    } else if (code === "A4") {
      recommendation = {
        id: currentLength + 1,
        title: "Take Prenatal Supplements",
        description:
          "If pregnant, take prenatal vitamins as prescribed to meet the increased nutritional demands.",
      };
    } else {
      recommendation = {
        id: currentLength + 1,
        title: "Unknown Code",
        description: "No matching recommendation found for this code.",
      };
    }

    setInformation((prev) => {
      return {
        ...prev,
        recommendation: [...(prev?.recommendation || []), recommendation],
      };
    });

    console.log(information);
  };

  const removeRecommendation = (value) => {
    console.log(value);
    console.log(information);
    setInformation((prev) => {
      return {
        ...prev,
        recommendation: prev?.recommendation?.filter((data) => {
          return data?.id !== value;
        }),
      };
    });
  };

  const updateRecords = async () => {
    const isFormValid = [
      information?.muacCm,
      information?.supplement,
      information?.weightKg,
      information?.pregnacyRisk,
      information?.recommendation,
    ].every(Boolean);

    const dataToSend = {
      id: formData?._id,
      muacCm: information?.muacCm,
      supplement: information?.supplement,
      weightKg: information?.weightKg,
      pregnacyRisk: information?.pregnacyRisk,
      recommendation: information?.recommendation,
      breestFeedStatus: information?.breestFeedStatus,
    };

    console.log(dataToSend);

    if (isFormValid) {
      try {
        const res = await addNewRecord({ ...dataToSend });

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

  return (
    <div className="w-full p-[24px] border border-gray-200  rounded-md relative">
      <Link href={"/bnsUser/lactatingData/"} className="absolute right-8 top-8">
        {" "}
        <i className="bi bi-x text-2xl"></i>{" "}
      </Link>
      {/* MINI NAV */}
      <div className="bg-[#F1F5F9] rounded-md p-2 inline-block mb-[24px]">
        <button className={linkClasses("N")} onClick={() => setView("N")}>
          Nutrition
        </button>
        <button className={linkClasses("I")} onClick={() => setView("I")}>
          Information
        </button>
      </div>

      {view === "I" ? (
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
                  value={formData.name || ""}
                  onChange={(e) => setChangeData(e)}
                  placeholder="Enter Your Full Name"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="birthdate" className="text-sm font-medium">
                  Birth Date
                </label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthDate"
                  className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]"
                  value={formData.birthDate ? formData.birthDate.slice(0, 10) : ""}
                  onChange={(e) => setChangeData(e)}
                />
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
                  value={formData.email || ""}
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
                  value={formData.number || ""}
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
                  value={formData.address || ""}
                  onChange={(e) => setChangeData(e)}
                  name="address"
                />
              </div>
            </div>

            <div className="w-full flex justify-between items-center">
              <Link href="/bnsUser/lactatingData">
                <button className=" border border-gray-400 text-[12px]  flex items-center justify-center gap-5  px-[24px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:bg-[#FFC105]">
                    <i className="bi bi-x"></i> Cancel
                </button>
              </Link>

              <button
                className=" bg-[#4CAF50] text-white text-[12px]  flex items-center justify-center gap-5 px-[24px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:opacity-50"
                onClick={() => sendData()}
              >
                <i className="bi bi-file-earmark-text"></i> Update Information
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {isRecording ? (
            <div className="w-full">
              <div className="w-full flex gap-[24px] mb-[24px]">
                <div className="w-1/2">
                  <label htmlFor="weight" className="text-sm font-medium">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    className=" px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px] placeholder:text-gray-500"
                    placeholder="0"
                    value={information?.weightKg}
                    onChange={(e) => setNumberData(e)}
                    name="weightKg"
                  />
                </div>
                <div className="w-1/2">
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
                    placeholder="Vitamin C, Vitamin B"
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
                    {information.pregnacyRisk
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

              <div className="w-full flex gap-[24px] mb-[24px]">
                <div className="w-1/2">
                  <label htmlFor="pregnacyRisk" className="text-sm font-medium">
                    Breest Feeding Status
                  </label>
                  <div
                    id="pregnacyRisk"
                    name="pregnacyRisk"
                    className="px-[8px] py-[12px] w-full flex justify-between outline-none rounded-md border border-gray-200 text-[14px] relative"
                    onClick={() => setBreestFeedDropdown((prev) => !prev)}
                  >
                    {information?.breestFeedStatus
                      ? information?.breestFeedStatus
                      : "Choose Breest Feeding Status "}
                    <i className="bi bi-chevron-down"></i>
                    {/* DROPDOWN MENU */}
                    <div
                      className={`p-2 w-full  gap-2 flex-col outline-none rounded-md border border-gray-200 text-[14px] absolute bottom-[120%] left-0 bg-[#f9fafb] ${
                        breestFeedDropDown ? "flex" : "hidden"
                      } `}
                    >
                      <div
                        className="px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                        onClick={() => selectBreestFeedStatus("A1")}
                      >
                        Exclusive Breastfeeding
                      </div>
                      <div
                        className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                        onClick={() => selectBreestFeedStatus("A2")}
                      >
                        Partial Breastfeeding
                      </div>

                      <div
                        className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                        onClick={() => selectBreestFeedStatus("A3")}
                      >
                        Bottle Feeding
                      </div>

                      <div
                        className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                        onClick={() => selectBreestFeedStatus("A4")}
                      >
                        No Breastfeeding
                      </div>
                      <div
                        className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                        onClick={() => selectBreestFeedStatus("A5")}
                      >
                        Breastfeeding with Supplementation
                      </div>
                      <div
                        className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                        onClick={() => selectBreestFeedStatus("A6")}
                      >
                        Expressed Milk
                      </div>
                    </div>
                  </div>
                </div>
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
                    className="px-[16px] py-[12px] w-full flex flex-wrap gap-2 justify-between outline-none rounded-md border border-gray-200 text-[14px] relative"
                    onClick={() => setRecommendationDropDown((prev) => !prev)}
                  >
                    {information.recommendation?.length ? (
                      <>
                        {" "}
                        {information.recommendation?.map((data, index) => {
                          return (
                            <div
                              className={`w-[30%] flex items-center justify-center px-2 text-[12px] text-center rounded-[2px] ${setBg(
                                index + 1
                              )}`}
                              key={index}
                              onClick={() => {
                                removeRecommendation(data?.id);
                                console.log(data.id);
                              }}
                            >
                              <i className="bi bi-x cursor-pointer text-[16px]">
                                {" "}
                              </i>
                              {data?.title} + {data?.id}
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
              </div>
              <div className="w-full flex justify-between items-center">
                <button
                  className=" border border-gray-400 text-[12px]  flex items-center justify-center gap-5  px-[24px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:bg-[#FFC105]"
                  // onClick={() => setIsRecording(false)}
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
            <PastAppointmentRecord
              lactatingInformation={formData?.lactatinginformation}
              setIsRecording={setIsRecording}
              lactatingUser={formData}
            />
          )}
        </>
      )}
    </div>
  );
}

export default UpdateRecordLactating;