import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAddLactatingDataMutation } from "@/service/lactatingData/lactatingDataApiSlice";
function AddingDataForm({ setOpen }) {
  const [pregnancyRiskDropDown, setPregnancyRisk] = useState(false);
  const [breestFeedDropDown, setBreestFeedDropdown] = useState(false);
  const [recommendationDropDown, setRecommendationDropDown] = useState(false);
  const [addData] = useAddLactatingDataMutation();
  const [formData, setFormData] = useState({
    name: "",
    age: 0,
    childAge: 0,
    address: "",
    birthDate: "",
    email: "",
    number: "",
    bns_code: "",
    type: "",
    lactatinginformation: {
      weightKg: 0,
      breestFeedStatus: "",
      muacCm: 0,
      pregnacyRisk: "",
      supplement: "",
      recommendation: [],
    },
  });

  const setChangeData = (e) => {
    const { value, name } = e.target;

    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  /* set w,h,muac */
  const setNumberData = (e) => {
    const { value, name } = e.target;

    setFormData((prev) => {
      return {
        ...prev,
        lactatinginformation: { ...prev?.lactatinginformation, [name]: value },
      };
    });
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

    setFormData((prev) => ({
      ...prev,
      lactatinginformation: {
        ...prev?.lactatinginformation,
        pregnacyRisk: risk,
      },
    }));
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

    setFormData((prev) => ({
      ...prev,
      lactatinginformation: {
        ...prev?.lactatinginformation,
        breestFeedStatus: breestFeedStatus,
      },
    }));
  };

  const addRecommendation = (code) => {
    const currentLength =
      formData?.lactatinginformation?.recommendation?.length || 0;
    let recommendation = {
      id: currentLength + 1,
      title: "",
      description: "",
    };

    if (code === "A1") {
      recommendation = {
        title: "Eat a Balanced Diet",
        description:
          "Include a variety of foods such as vegetables, fruits, whole grains, proteins, and healthy fats in your daily meals.",
      };
    } else if (code === "A2") {
      recommendation = {
        title: "Increase Iron Intake",
        description:
          "Eat iron-rich foods like lean meat, spinach, and beans to prevent anemia and support blood production.",
      };
    } else if (code === "A3") {
      recommendation = {
        title: "Consume Calcium-Rich Foods",
        description:
          "Dairy products, tofu, and green leafy vegetables are excellent sources of calcium for strong bones and teeth.",
      };
    } else if (code === "A4") {
      recommendation = {
        title: "Take Prenatal Supplements",
        description:
          "If pregnant, take prenatal vitamins as prescribed to meet the increased nutritional demands.",
      };
    } else {
      recommendation = {
        title: "Unknown Code",
        description: "No matching recommendation found for this code.",
      };
    }

    setFormData((prev) => {
      return {
        ...prev,
        lactatinginformation: {
          ...prev?.lactatinginformation,
          recommendation: [
            ...(prev?.lactatinginformation?.recommendation || []),
            recommendation,
          ],
        },
      };
    });
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

  const removeRecommendation = (value) => {
    console.log("this is the value bro " + value);

    setFormData((prev) => {
      return {
        ...prev,
        lactatinginformation: {
          ...prev?.lactatinginformation,
          recommendation: prev?.lactatinginformation?.recommendation?.filter(
            (data) => {
              return data?.id !== value;
            }
          ),
        },
      };
    });
  };

  const sendData = async () => {
    const dataToSend = {
      name: formData?.name,
      age: parseInt(formData?.age),
      childAge: parseInt(formData?.age),
      address: formData?.address,
      birthDate: formData?.birthDate,
      email: formData?.email,
      number: formData?.number,
      weightKg: parseInt(formData?.lactatinginformation.weightKg),
      breestFeedStatus: formData?.lactatinginformation.breestFeedStatus,
      muacCm: parseInt(formData?.lactatinginformation.muacCm),
      pregnacyRisk: formData?.lactatinginformation.pregnacyRisk,
      supplement: formData?.lactatinginformation.supplement,
      recommendation: formData?.lactatinginformation.recommendation || [],
    };
    console.log(dataToSend);

    try {
      const res = await addData({ ...dataToSend });
      toast.success("Lactating Data created", {
        duration: 3000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error("Invalid Create", {
        duration: 3000,
      });
      console.log(error);
    }
  };

  return (
    <div className="w-full p-[24px] border border-gray-200  rounded-md">
      <div className="full flex justify-between items-center">
        <div>
          <h3 className="text-[24px] font-semibold">
            Add Lactating Nutrition Record
          </h3>
          <p className="text-[14px]  text-[#64748b] mb-[24px]   ">
            Enter the Lactating Mother's information and nutrition measurements
          </p>{" "}
        </div>
        <div className="w-[35%] flex flex-col items-end">
          <h3 className="text-[16px]  text-right font-bold">Important Note</h3>
          <p className="text-[12px] text-right  text-[#64748b] mb-[24px] max-w-[90%] ">
            Adding a New Information Can create a new Beneficiary Account that
            can Access by the User through Portal
          </p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-[24px]">
        Lactating Mother Information
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
              required
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="pregnancyAge" className="text-sm font-medium">
              Child Age
            </label>
            <input
              type="number"
              id="childAge"
              name="childAge"
              className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px]"
              value={formData?.childAge}
              onChange={(e) => setChangeData(e)}
              placeholder="Child Age"
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
              id="birthDate"
              name="birthDate"
              className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px]"
              value={formData?.birthDate}
              onChange={(e) => setChangeData(e)}
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="pregnancyAge" className="text-sm font-medium">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px]"
              value={formData?.age}
              onChange={(e) => setChangeData(e)}
              placeholder="Age"
            />
          </div>
        </div>

        {/* INPUT 3 */}
        <div className="w-full flex gap-[24px] mb-[24px]">
          <div className="w-1/2 pr-3">
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

        {/* Nutrition Measurements */}

        <h3 className="text-lg font-semibold mb-[24px]">
          Nutrition Measurements
        </h3>

        {/* INPUT 5 */}
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
              value={formData?.lactatinginformation?.weightKg}
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
              value={formData?.lactatinginformation?.muacCm}
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
              value={formData?.lactatinginformation?.supplement}
              onChange={(e) => setNumberData(e)}
              name="supplement"
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="pregnacyRisk" className="text-sm font-medium">
              Lactating Risk
            </label>
            <div
              id="pregnacyRisk"
              name="pregnacyRisk"
              className="px-[8px] py-[12px] w-full flex justify-between outline-none rounded-md border border-gray-200 text-[14px] relative"
              onClick={() => setPregnancyRisk((prev) => !prev)}
            >
              {formData?.lactatinginformation?.pregnacyRisk
                ? formData?.lactatinginformation?.pregnacyRisk
                : "Choose Lactating Risk"}
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
              {formData?.lactatinginformation?.breestFeedStatus
                ? formData?.lactatinginformation?.breestFeedStatus
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
            <label htmlFor="recommendation" className="text-sm font-medium">
              Recommendation
            </label>
            <div
              id="recommendation"
              name="recommendation"
              className="px-[16px] py-[12px] w-full flex flex-wrap gap-2 justify-between outline-none rounded-md border border-gray-200 text-[14px] relative"
              onClick={() => setRecommendationDropDown((prev) => !prev)}
            >
              {formData?.lactatinginformation?.recommendation?.length ? (
                <>
                  {" "}
                  {formData?.lactatinginformation?.recommendation?.map(
                    (data, index) => {
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
                    }
                  )}
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
            onClick={() => setOpen(false)}
          >
            <i className="bi bi-x"></i> Cancel
          </button>

          <button
            className=" bg-[#4CAF50] text-white text-[12px]  flex items-center justify-center gap-5 px-[24px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:opacity-50"
            onClick={(e) => {
              e.preventDefault();
              sendData();
            }}
          >
            <i className="bi bi-file-earmark-text"></i> Upload Record
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddingDataForm;
