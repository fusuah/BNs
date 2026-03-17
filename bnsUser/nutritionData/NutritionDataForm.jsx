"use client";
import {
  useAddNewCndataRecordMutation,
  useDeleteChildrenNutritionDataMutation,
  useUpdateChildrenNutritionDataMutation,
} from "@/service/childrenNutritionData/childrenNurtritionDataApiSlice";
import { format, isValid, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const NutritionDataForm = ({ setOpen, formUpdateData }) => {
  /* API FUNCTION */

  const [addNewCnDataRecords] = useAddNewCndataRecordMutation();
  const [deleteChild, { isLoading: isDeleting }] = useDeleteChildrenNutritionDataMutation();
  const [updateChildProfile] = useUpdateChildrenNutritionDataMutation();

  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [recommendationDropDown, setRecommendationDropDown] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    mother: "",
    ageMonths: 0,
    gender: "",
    status: "",
    birthDate: "",
    address: "",
    email: "",
    number: "",
    // --- NEW FIELDS ---
    isIndigenous: false,
    hasDisability: false,
  });

  /* GENERATE DATE NOW */
  const generateDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return {
      dateNow: `${month}/${day}/${year}`,
      textDate: `${year}, ${monthNames[now.getMonth()]} ${now.getDate()}`,
    };
  };

  const [information, setInformation] = useState({
    weightKg: 0,
    heightCm: 0,
    muacCm: 0,
    status: "",
    date: generateDate()?.dateNow,
    recommendation: [],
    hasEdema: false,
  });

  useEffect(() => {
    if (formUpdateData) {
      // Merge defaults for new boolean fields in case they don't exist in DB yet
      setFormData({
        ...formUpdateData,
        // Using !! to ensure safe boolean conversion
        isIndigenous: !!formUpdateData.isIndigenous, 
        hasDisability: !!formUpdateData.hasDisability,
      });

      if (formUpdateData.information && formUpdateData.information.length > 0) {
        const latestInfo = formUpdateData?.information[formUpdateData?.information?.length - 1];
        setInformation({
          ...latestInfo,
          hasEdema: latestInfo.hasEdema || false,
        });
      }
    } else {
      setFormData({
        _id: "",
        name: "",
        mother: "",
        ageMonths: 0,
        gender: "",
        status: "",
        birthDate: "",
        address: "",
        email: "",
        number: "",
        isIndigenous: false,
        hasDisability: false,
      });
      setInformation({
        weightKg: 0,
        heightCm: 0,
        muacCm: 0,
        status: "",
        date: generateDate()?.dateNow,
        recommendation: [],
        hasEdema: false,
      });
    }
  }, [formUpdateData]);

  /* Dynamic On Change  */
  const setChangeData = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    setInformation((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  /* Set gender */
  const setGender = (txt) => {
    setFormData((prev) => ({ ...prev, gender: txt }));
  };

  /* set w,h,muac */
  const setNumberData = (e) => {
    const { value, name } = e.target;
    setInformation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setBg = (txt) => {
    if (txt === 1) return "bg-[#DBEAFE] text-[#1447E6]";
    else if (txt === 2) return "bg-[#DBFCE7] text-[#008236]";
    else if (txt === 3) return "bg-[#FEF9C2] text-[#894B00]";
    else if (txt === 4) return "bg-[#FAF5FF] text-[#6E11B0]";
    else return "bg-[#DBEAFE] text-[]";
  };

  const recordNew = () => {
    setInformation({
      weightKg: 0,
      heightCm: 0,
      muacCm: 0,
      status: "",
      date: new Date().toISOString(),
      recommendation: [],
      hasEdema: false,
    });
    setIsUpdating(true);
  };

  /* Adding Recomendation */
  const addRecommendation = (code) => {
    let recommendation = {};
    const nextId = (information?.recommendation?.length || 0) + 1;

    if (code === "A1") {
      recommendation = { id: nextId, title: "Good Growth Progress", description: "Child is showing good growth progress. Continue with the current balanced diet." };
    } else if (code === "A2") {
      recommendation = { id: nextId, title: "Mild Underweight", description: "Child is mildly underweight. Introduce more protein-rich foods and monitor weight weekly." };
    } else if (code === "A3") {
      recommendation = { id: nextId, title: "Overweight Risk", description: "Child is at risk of being overweight. Encourage active play and reduce sugary snacks." };
    } else if (code === "A4") {
      recommendation = { id: nextId, title: "Severely Underweight", description: "Immediate attention needed. Refer to a health worker and provide nutrient-dense meals." };
    }

    setInformation((prev) => ({
      ...prev,
      recommendation: [...(prev?.recommendation || []), recommendation],
    }));
  };

  /* Removing Recomendation */
  const removeRecommendation = (value) => {
    setInformation((prev) => ({
      ...prev,
      recommendation: prev?.recommendation?.filter((data) => data?.id !== value),
    }));
  };

  const formatCustomDate = (value) => {
    if (!value) return "";
    const date = typeof value === "string" ? parseISO(value) : value instanceof Date ? value : new Date(value);
    if (!isValid(date)) return "";
    return format(date, "yyyy, MMM dd").toUpperCase();
  };

  /* GENERATE BMI */
  const calculateBMI = (weight, height) => {
    if (!weight || !height) return { bmi: 0, status: "Invalid input" };
    const bmiValue = weight / (height * height);
    const bmi = parseFloat(bmiValue.toFixed(2));
    let status = "";

    if (bmi < 16) status = "severely underweight";
    else if (bmi >= 16 && bmi < 18.5) status = "underweight";
    else if (bmi >= 18.5 && bmi < 25) status = "normal";
    else status = "overweight";

    setInformation((prev) => ({
      ...prev,
      status: status,
      bmi: bmi,
    }));
  };

  const addNewRecord = async () => {
    const dataSend = {
      id: formData?._id,
      ...information,
      weightKg: parseFloat(information.weightKg),
      heightCm: parseFloat(information.heightCm),
      muacCm: parseFloat(information.muacCm || 0),
      hasEdema: information.hasEdema,
    };

    const isTrue = [dataSend.weightKg, dataSend.heightCm].every(val => val > 0);

    if (isTrue) {
      try {
        await addNewCnDataRecords({ ...dataSend }).unwrap();
        toast.success("New nutrition record added!");
        setTimeout(() => window.location.reload(), 1500); // REFRESH ADDED
      } catch (err) {
        console.error("Add Record Error:", err);
        toast.error("Failed to add record.");
      }
    } else {
      toast.error("Please ensure Weight and Height are valid numbers.");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      console.log("Saving Profile Data:", formData);
      await updateChildProfile(formData).unwrap();
      toast.success("Child information updated!");
      setTimeout(() => window.location.reload(), 1500); // REFRESH ADDED
    } catch (err) {
      console.error("Update Profile Error:", err);
      toast.error("Failed to update profile.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this child record? This action cannot be undone.")) return;

    try {
      await deleteChild({ id: formData._id }).unwrap();
      toast.success("Child record deleted.");
      setOpen(false);
      setTimeout(() => window.location.reload(), 1000); // REFRESH ADDED
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Failed to delete record.");
    }
  };

  return (
    <div className="w-full p-[24px] border border-gray-200  rounded-md bg-white">
      <h3 className="text-[24px] font-semibold">Edit Nutrition Records</h3>
      <p className="text-[14px]  text-[#64748b] mb-[24px]">
        Update the nutrition information for this child
      </p>

      <h3 className="text-lg font-semibold mb-[24px]">Child Information</h3>

      {/* FORM INPUT */}
      <div className="w-full">
        {/* INPUT 1 */}
        <div className="w-full flex gap-[24px] mb-[24px]">
          <div className="w-1/2">
            <label htmlFor="fullname" className="text-sm font-medium">Child's Full Name</label>
            <input
              type="text"
              id="fullname"
              name="name"
              className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px]"
              value={formData?.name}
              onChange={setChangeData}
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="gender" className="text-sm font-medium">Gender</label>
            <div
              id="gender"
              className="px-[8px] py-[12px] w-full flex justify-between outline-none rounded-md border border-gray-200 text-[14px] relative cursor-pointer bg-white"
              onClick={() => setDropDownOpen((prev) => !prev)}
            >
              {formData?.gender ? formData?.gender : " Choose Gender..."}
              <i className="bi bi-chevron-down"></i>
              <div className={`p-2 w-full gap-2 flex-col outline-none rounded-md border border-gray-200 text-[14px] absolute top-[120%] left-0 bg-[#f9fafb] z-10 ${dropDownOpen ? "flex" : "hidden"} `}>
                <div className="px-[8px] py-[8px] w-full rounded-md duration-200 hover:bg-[#FFC105] cursor-pointer" onClick={() => setGender("Male")}>Male</div>
                <div className="px-[8px] py-[8px] w-full rounded-md duration-200 hover:bg-[#FFC105] cursor-pointer" onClick={() => setGender("Female")}>Female</div>
              </div>
            </div>
          </div>
        </div>

        {/* INPUT 2 */}
        <div className="w-full flex gap-[24px] mb-[24px]">
          <div className="w-1/2">
            <label htmlFor="birthdate" className="text-sm font-medium">Birth Date</label>
            <input
              type="date"
              id="birthdate"
              name="birthDate"
              className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200 text-black text-[14px]"
              value={formData?.birthDate ? formData.birthDate.slice(0, 10) : ""}
              onChange={setChangeData}
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="guardian" className="text-sm font-medium">Mother/Guardian's Name</label>
            <input
              type="text"
              id="guardian"
              name="mother"
              className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200 text-[14px]"
              value={formData?.mother}
              onChange={setChangeData}
            />
          </div>
        </div>

        {/* INPUT 3 */}
        <div className="w-full flex items-end gap-[24px] mb-[24px]">
          <div className="w-1/2">
            <label htmlFor="address" className="text-sm font-medium">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200 text-black text-[14px]"
              value={formData?.address}
              onChange={setChangeData}
            />
          </div>

          <div className="w-1/2 flex justify-end gap-2">
             <button
                className="bg-red-500 text-white text-[12px] flex items-center justify-center gap-2 px-[16px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:bg-red-600"
                onClick={handleDelete}
                disabled={isDeleting}
             >
                <i className="bi bi-trash"></i> Delete
             </button>

            <button
                className="bg-[#4CAF50] text-white text-[12px] flex items-center justify-center gap-2 px-[16px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:opacity-50"
                onClick={handleUpdateProfile}
            >
              <i className="bi bi-file-info"></i> Update Info
            </button>
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

        {/* DIVIDER */}
        <div className="w-full flex justify-end py-4 border-b border-gray-200 mb-[24px]"></div>

        {/* Nutrition Measurements */}

        <h3 className="text-[24px] font-semibold">Monthly Nutrition Records</h3>
        <p className="text-[14px]  text-[#64748b] mb-[24px]">
          Record Child Nutritional Data Monthly update
        </p>

        <div className="w-full flex justify-between items-center">
          <h3 className="text-lg font-semibold mb-[24px]">
            Nutrition Measurements
          </h3>

          <button
            className=" border border-[#4CAF50] text-[#4CAF50] text-[12px]  flex items-center justify-center gap-5 px-[24px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:opacity-50"
            onClick={() => recordNew()}
          >
            <i className="bi bi-plus-circle"></i> Record New Month
          </button>
        </div>

        {/* INPUT 4 */}
        <div className="w-full flex gap-[24px] mb-[24px]">
          <div className="w-[25%]">
            <label htmlFor="weight" className="text-sm font-medium">Weight (kg)</label>
            <input
              type="number"
              id="weight"
              name="weightKg"
              className=" px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px] placeholder:text-gray-500"
              placeholder="0"
              step="0.01"
              value={information?.weightKg}
              onChange={setNumberData}
              disabled={!isUpdating}
            />
          </div>

          <div className="w-[25%]">
            <label htmlFor="height" className="text-sm font-medium">Height (cm)</label>
            <input
              type="number"
              id="height"
              name="heightCm"
              className=" px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px] placeholder:text-gray-500"
              placeholder="0"
              step="0.01"
              value={information?.heightCm}
              onChange={setNumberData}
              disabled={!isUpdating}
            />
          </div>

          <div className="w-[25%]">
            <label htmlFor="muac" className="text-sm font-medium">MUAC (cm) - Optional</label>
            <input
              type="number"
              id="muac"
              name="muacCm"
              className=" px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-[14px] placeholder:text-gray-500"
              placeholder="0"
              step="0.01"
              value={information?.muacCm}
              onChange={setNumberData}
              disabled={!isUpdating}
            />
          </div>

          <div className="w-[25%] flex items-center pt-6">
             {/* NEW: Edema Checkbox */}
             <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasEdema"
                name="hasEdema"
                checked={information?.hasEdema || false}
                onChange={setInfoCheckboxData}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                disabled={!isUpdating}
              />
              <label htmlFor="hasEdema" className="text-sm font-medium cursor-pointer">
                Has Edema?
              </label>
            </div>
          </div>
        </div>

        {/* INPUT 5 */}
        <div className="w-full flex gap-[24px] mb-[24px]">
          <div className="w-1/2">
            <label htmlFor="daterecord" className="text-sm font-medium">Date Recorded</label>
            <div className="px-[8px] py-[12px] w-full outline-none rounded-md border border-gray-200  text-black text-[14px] bg-gray-50">
              {formatCustomDate(information?.date)}
            </div>
          </div>
          <div className="w-1/2">
            <label htmlFor="status" className="text-sm font-medium">Nutritional Status</label>
            <div className="px-[8px] py-[4px] w-full flex justify-between items-center outline-none rounded-md border border-gray-200  text-black text-[14px]">
              <p className="py-[8px]">{information?.status ? information?.status : "Click Calculate"}</p>
              {isUpdating && (
                <button
                  className=" border border-gray-400 text-[12px] px-[12px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:bg-[#FFC105]"
                  onClick={() => calculateBMI(parseFloat(information?.weightKg), parseFloat(information?.heightCm)/100)}
                >
                  Calculate
                </button>
              )}
            </div>
          </div>
        </div>

        {/* INPUT 6*/}
        <div className="w-full flex gap-[24px] mb-[24px]">
          <div className="w-1/2">
            <label htmlFor="daterecord" className="text-sm font-medium">Recommendations</label>
            <div className="px-[8px] py-[12px] w-full flex flex-wrap gap-4  outline-none rounded-md border border-gray-200  text-black text-[14px] min-h-[50px]">
              {information?.recommendation?.length ? (
                <>
                  {information?.recommendation?.map((data, index) => {
                    return (
                      <div className={`w-[30%] flex items-center justify-center px-2 text-[12px] text-center rounded-[2px] ${setBg(index + 1)}`} key={index}>
                        {isUpdating && (
                          <i className="bi bi-x cursor-pointer text-[16px] mr-1" onClick={() => removeRecommendation(data?.id)}></i>
                        )}
                        {data?.title}
                      </div>
                    );
                  })}
                </>
              ) : (
                <span className="text-gray-400 italic text-xs">No recommendations added</span>
              )}
            </div>
          </div>

          <div className="w-1/2">
            <label htmlFor="recommendation" className="text-sm font-medium">Recommendation</label>
            <div
              id="recommendation"
              name="recommendation"
              className={`px-[8px] py-[12px] w-full flex justify-between outline-none rounded-md border border-gray-200 text-[14px] relative cursor-pointer ${!isUpdating ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
              onClick={() => isUpdating && setRecommendationDropDown((prev) => !prev)}
            >
              {isUpdating ? "Give Recommendation" : "View Only"}
              <i className="bi bi-chevron-down"></i>
              <div className={`p-2 w-full  gap-2 flex-col outline-none rounded-md border border-gray-200 text-[14px] absolute bottom-[120%] left-0 bg-[#f9fafb] z-10 ${recommendationDropDown ? "flex" : "hidden"} `}>
                <div className="px-[8px] py-[8px] w-full outline-none rounded-md border  border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer " onClick={() => addRecommendation("A1")}>Good Growth Progress</div>
                <div className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer " onClick={() => addRecommendation("A2")}>Mild Underweight</div>
                <div className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer " onClick={() => addRecommendation("A3")}>Overweight Risk</div>
                <div className="px-[8px] py-[8px] w-full outline-none rounded-md border border-gray-200 text-[14px] relative duration-200 hover:bg-[#FFC105] cursor-pointer " onClick={() => addRecommendation("A4")}>Severely Underweight</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-between items-center mt-6">
          <button
            className=" border border-gray-400 text-[12px]  flex items-center justify-center gap-5  px-[24px] py-[8px] rounded-md font-medium cursor-pointer duration-200 hover:bg-[#FFC105]"
            onClick={() => setOpen(false)}
          >
            <i className="bi bi-x"></i> Close
          </button>

          {isUpdating && (
            <button
                className={`bg-[#4CAF50] text-white text-[12px]  flex items-center justify-center gap-5 px-[24px] py-[8px] rounded-md font-medium duration-200 hover:opacity-50`}
                onClick={() => addNewRecord()}
            >
                <i className="bi bi-file-earmark-plus"></i> Save New Record
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutritionDataForm;