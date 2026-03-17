"use client";
import { useAddChildrenNutritionDataMutation } from "@/service/childrenNutritionData/childrenNurtritionDataApiSlice";
import { getRedirectError } from "next/dist/client/components/redirect";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddingNutritionForm = ({ setOpen, formStatus }) => {
  /* API POST */

  const [addData, { isError, error }] = useAddChildrenNutritionDataMutation();

  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [recommendationDropDown, setRecommendationDropDown] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mother: "",
    ageMonths: 0,
    gender: "",
    status: "",
    birthDate: "",
    bmi: 0,
    email: "",
    address: "",
    number: "",
    // --- NEW FIELDS ---
    isIndigenous: false,
    hasDisability: false,
    information: {
      weightKg: 0,
      heightCm: 0,
      muacCm: 0,
      hasEdema: false, // --- NEW FIELD ---
      date: "",
      recommendation: [],
    },
  });

  console.log("Current Form Data State:", formData);

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

  /* Checkbox Handler for Demographics */
  const setCheckboxData = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  /* Checkbox Handler for Measurements (Edema) */
  const setInfoCheckboxData = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      information: {
        ...prev.information,
        [name]: checked,
      },
    }));
  };

  /* Set gender */

  const setGender = (txt) => {
    setFormData((prev) => {
      return { ...prev, gender: txt };
    });
  };

  /* set w,h,muac */
  const setNumberData = (e) => {
    const { value, name } = e.target;

    setFormData((prev) => {
      return {
        ...prev,
        information: { ...prev?.information, [name]: value },
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

  /* Adding Recomendation */

  const addRecommendation = (code) => {
    let recommendation = {};

    if (code === "A1") {
      recommendation = {
        id: formData?.information?.recommendation?.length + 1,
        title: "Good Growth Progress",
        description:
          "Child is showing good growth progress. Continue with the current balanced diet.",
      };
    } else if (code === "A2") {
      recommendation = {
        id: formData?.information?.recommendation?.length + 1,
        title: "Mild Underweight",
        description:
          "Child is mildly underweight. Introduce more protein-rich foods and monitor weight weekly.",
      };
    } else if (code === "A3") {
      recommendation = {
        id: formData?.information?.recommendation?.length + 1,
        title: "Overweight Risk",
        description:
          "Child is at risk of being overweight. Encourage active play and reduce sugary snacks.",
      };
    } else if (code === "A4") {
      recommendation = {
        id: formData?.information?.recommendation?.length + 1,
        title: "Severely Underweight",
        description:
          "Immediate attention needed. Refer to a health worker and provide nutrient-dense meals.",
      };
    } else {
      recommendation = {
        id: formData?.information?.recommendation?.length + 1,
        title: "Unknown Code",
        description: "No matching recommendation found for this code.",
      };
    }

    setFormData((prev) => {
      return {
        ...prev,
        information: {
          ...prev?.information,
          recommendation: [
            ...(prev?.information?.recommendation || []),
            recommendation,
          ],
        },
      };
    });
  };

  const removeRecommendation = (value) => {
    setFormData((prev) => {
      return {
        ...prev,
        information: {
          ...prev?.information,
          recommendation: prev?.information?.recommendation?.filter((data) => {
            return data?.id !== value;
          }),
        },
      };
    });
  };

  /* GENERATE BMI */

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return { bmi: 0, status: "Invalid input" };

    const bmiValue = weight / (height * height);
    const bmi = parseFloat(bmiValue.toFixed(2));
    let status = "";

    console.log("Calculated BMI:", weight, height, bmi);

    if (bmi < 16) {
      status = "severely underweight";
    } else if (bmi >= 16 && bmi < 18.5) {
      status = "underweight";
    } else if (bmi >= 18.5 && bmi < 25) {
      status = "normal";
    } else {
      status = "overweight";
    }

    /* return { bmi, status }; */

    setFormData((prev) => {
      return {
        ...prev,
        status: status,
        bmi: bmi,
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
    console.log("sendData function triggered");

    // Validate required fields
    const isFormValid = [
      formData?.name,
      formData?.mother,
      formData?.birthDate,
      formData?.gender,
      formData?.email,
      formData?.number,
      formData?.information?.weightKg,
      formData?.information?.heightCm,
    ].every(Boolean);

    if (!isFormValid) {
        console.warn("Validation Failed. Missing fields:", formData);
        toast.error("Please fill in all required fields (Name, Mother, Birthdate, Gender, Email, Number, Weight, Height)");
        return;
    }

    const dateNow = new Date().toISOString(); // Use standard ISO date format

    const dataToSend = {
      name: formData.name,
      mother: formData.mother,
      ageMonths: getAgeInMonths(formData?.birthDate),
      gender: formData.gender?.toLocaleLowerCase(),
      status: formData.status || "Normal", // Default status if not calculated
      birthDate: formData.birthDate,
      bmi: parseFloat(formData.bmi) || 0, // Use parseFloat
      email: formData.email,
      number: formData.number,
      weightKg: parseFloat(formData.information.weightKg) || 0, // Use parseFloat
      heightCm: parseFloat(formData.information.heightCm) || 0, // Use parseFloat
      muacCm: parseFloat(formData.information.muacCm) || 0, // Use parseFloat
      date: dateNow, // Use generated ISO date
      address: formData.address,
      recommendation: formData.information.recommendation,
      // --- NEW FIELDS IN PAYLOAD ---
      isIndigenous: formData.isIndigenous,
      hasDisability: formData.hasDisability,
      hasEdema: formData.information.hasEdema, 
    };

    console.log("Preparing to send data payload:", dataToSend);

    try {
      console.log("Calling addData mutation...");
      const res = await addData({ ...dataToSend }).unwrap(); // unwrap to handle errors in catch block
      
      console.log("API Response Success:", res);
      
      toast.success("Child Nutrition Record Created Successfully!", {
        duration: 3000,
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("API Create Error:", error);
      console.error("Error details:", error?.data || error?.message);
      toast.error(error?.data?.message || "Failed to create record. Please check console for details.", {
        duration: 3000,
      });
    }
  };

  return (
    <div className="w-full p-[24px] border border-gray-200  rounded-md">
      <div className="full flex justify-between items-center">
        <div>
          <h3 className="text-[24px] font-semibold">
            Add New Nutrition Record
          </h3>
          <p className="text-[14px]  text-[#64748b] mb-[24px]   ">
            Enter the child's information and nutrition measurements
          </p>{" "}
        </div>
        <div className="w-[35%] flex flex-col items-end">
          <h3 className="text-[16px]  text-right font-bold">Important Note</h3>
          <p className="text-[12px] text-right  text-[#64748b] mb-[24px] max-w-[90%] ">
            Adding a New Child Information Can create a new Beneficiary Account
            that can Access by the User through Portal
          </p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-[24px]">Child Information</h3>

      {/* FORM INPUT */}

      <div className="w-full">
        {/* INPUT 1 */}
        <div className="w-full flex gap-[24px] mb-[24px]">
          <div className="w-1/2">
            <label htmlFor="fullname" className="text-sm font-medium">
              Child's Full Name
            </label>
            <input
              type="text"
              id="fullname"
              name="name"
              className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px]"
              value={formData?.name}
              onChange={(e) => setChangeData(e)}
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="gender" className="text-sm font-medium">
              Gender
            </label>
            <div
              id="gender"
              name="nagenderme"
              className="px-[8px] py-[12px] w-full flex justify-between outline-none rounded-md border border-gray-200 text-[14px] relative cursor-pointer bg-white"
              onClick={() => setDropDownOpen((prev) => !prev)}
            >
              {formData?.gender ? formData?.gender : " Choose Gender..."}
              <i className="bi bi-chevron-down"></i>
              {/* DROPDOWN MENU */}
              <div
                className={`p-2 w-full  gap-2 flex-col outline-none rounded-md border border-gray-200 text-[14px] absolute top-[120%] left-0 bg-[#f9fafb] z-10 ${
                  dropDownOpen ? "flex" : "hidden"
                } `}
              >
                <div
                  className="px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                  onClick={() => setGender("Male")}
                >
                  Male
                </div>
                <div
                  className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                  onClick={() => setGender("Female")}
                >
                  Female
                </div>
              </div>
            </div>
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
            <label htmlFor="guardian" className="text-sm font-medium">
              Mother/Guardian's Name
            </label>
            <input
              type="text"
              id="guardian"
              name="mother"
              className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px]"
              value={formData?.mother}
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

        {/* NEW: Additional Demographics Checkboxes */}
        <div className="w-full flex gap-[24px] mb-[24px]">
          <div className="flex items-center gap-3 w-1/2">
            <input
              type="checkbox"
              id="isIndigenous"
              name="isIndigenous"
              checked={formData.isIndigenous}
              onChange={setCheckboxData}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="isIndigenous" className="text-sm font-medium cursor-pointer">
              Is member of Indigenous People (IP)?
            </label>
          </div>
          
          <div className="flex items-center gap-3 w-1/2">
            <input
              type="checkbox"
              id="hasDisability"
              name="hasDisability"
              checked={formData.hasDisability}
              onChange={setCheckboxData}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="hasDisability" className="text-sm font-medium cursor-pointer">
              Child has Disability?
            </label>
          </div>
        </div>

        {/* Nutrition Measurements */}

        <h3 className="text-lg font-semibold mb-[24px]">
          Nutrition Measurements
        </h3>

        {/* INPUT 5 */}
        <div className="w-full flex gap-[24px] mb-[24px]">
          <div className="w-[25%]">
            <label htmlFor="weight" className="text-sm font-medium">
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              className=" px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px] placeholder:text-gray-500"
              placeholder="0"
              step="0.01"
              value={formData?.information?.weightKg}
              onChange={(e) => setNumberData(e)}
              name="weightKg"
            />
          </div>

          <div className="w-[25%]">
            <label htmlFor="height" className="text-sm font-medium">
              Height (cm)
            </label>
            <input
              type="number"
              id="height"
              className=" px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px] placeholder:text-gray-500"
              placeholder="0"
              step="0.01"
              value={formData?.information?.heightCm}
              onChange={(e) => setNumberData(e)}
              name="heightCm"
            />
          </div>

          <div className="w-[25%]">
            <label htmlFor="muac" className="text-sm font-medium">
              MUAC (cm) - Optional
            </label>
            <input
              type="number"
              id="muac"
              className=" px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px] placeholder:text-gray-500"
              placeholder="0"
              step="0.01"
              value={formData?.information?.muacCm}
              onChange={(e) => setNumberData(e)}
              name="muacCm"
            />
          </div>

          <div className="w-[25%] flex items-center pt-6">
             {/* NEW: Edema Checkbox */}
             <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasEdema"
                name="hasEdema"
                checked={formData?.information?.hasEdema}
                onChange={setInfoCheckboxData}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="hasEdema" className="text-sm font-medium cursor-pointer">
                Has Edema?
              </label>
            </div>
          </div>
        </div>

        {/* INPUT 6 */}
        <div className="w-full flex gap-[24px] mb-[24px]">
          <div className="w-1/2">
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
          <div className="w-1/2">
            <label htmlFor="status" className="text-sm font-medium">
              Nutritional Status
            </label>

            <div className="w-full flex items-center border rounded-md border-gray-200 pr-4">
              {" "}
              <div className="px-[8px] py-[12px] w-full outline-none  text-[14px]">
                {formData?.status
                  ? formData?.status
                  : "Click to Generate Status"}
              </div>
              <button
                className=" border border-gray-400 text-[12px] px-[12px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:bg-[#FFC105]"
                onClick={() => {
                  calculateBMI(
                    parseFloat(formData?.information?.weightKg),
                    parseFloat(formData?.information?.heightCm / 100)
                  );
                }}
              >
                Calculate
              </button>
            </div>
          </div>
        </div>

        {/* INPUT 7*/}

        <div className="w-full flex gap-[24px] mb-[24px]">
          <div className="w-1/2">
            <label htmlFor="daterecord" className="text-sm font-medium">
              Recommendations
            </label>
            <div
              type="date"
              id="daterecord"
              className="px-[8px] py-[12px] w-full flex flex-wrap gap-4  outline-none rounded-md border border-gray-200  text-black text-[14px]"
            >
              {formData?.information?.recommendation?.length ? (
                <>
                  {" "}
                  {formData?.information?.recommendation?.map((data, index) => {
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
            </div>
          </div>

          <div className="w-1/2">
            <label htmlFor="recommendation" className="text-sm font-medium">
              Recommendation
            </label>
            <div
              id="recommendation"
              name="recommendation"
              className="px-[8px] py-[12px] w-full flex justify-between outline-none rounded-md border border-gray-200 text-[14px] relative cursor-pointer bg-white"
              onClick={() => setRecommendationDropDown((prev) => !prev)}
            >
              Give Recommendation
              <i className="bi bi-chevron-down"></i>
              {/* DROPDOWN MENU */}
              <div
                className={`p-2 w-full  gap-2 flex-col outline-none rounded-md border border-gray-200 text-[14px] absolute bottom-[120%] left-0 bg-[#f9fafb] z-10 ${
                  recommendationDropDown ? "flex" : "hidden"
                } `}
              >
                <div
                  className="px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                  onClick={() => addRecommendation("A1")}
                >
                  Good Growth Progress
                </div>
                <div
                  className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                  onClick={() => addRecommendation("A2")}
                >
                  Mild Underweight
                </div>
                <div
                  className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                  onClick={() => addRecommendation("A3")}
                >
                  Overweight Risk
                </div>
                <div
                  className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer "
                  onClick={() => addRecommendation("A4")}
                >
                  Severely Underweight
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
            onClick={() => sendData()}
          >
            <i className="bi bi-file-earmark-text"></i> Upload Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddingNutritionForm;