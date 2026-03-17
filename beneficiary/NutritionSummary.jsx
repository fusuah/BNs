"use client";
import { nutritionData } from "@/data/bnsUserSampleData";
import useAuth from "@/hooks/useAuth";
import { selectBeneficiary } from "@/service/beneficiaryPortal/beneficiaryPortalSlice";
import { useSelector } from "react-redux";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import RequestVitamins from "./RequestVitamins";
import RequestMilk from "./RequestMilk";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function PregnantGraph({ pregnantData }) {
  const formatToYearMonth = (dateString) => {
    return format(new Date(dateString), "yyyy, MMM");
  };
  const data = {
    labels: pregnantData.map((d) => formatToYearMonth(d.date)), // X-axis dates
    datasets: [
      {
        label: "Weight (kg)",
        data: pregnantData.map((d) => d.weightKg),
        backgroundColor: "#4F46E5", // purple
      },
      {
        label: "MUAC (cm)",
        data: pregnantData.map((d) => d.muacCm),
        backgroundColor: "#22C55E", // green
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: { display: false, text: "Pregnant Women - Weight & MUAC" },
      legend: {
        position: "bottom",
        align: "center",
      },
    },
  };

  return (
    <div style={{ width: "100%" }} className="h-[400px] max-[640px]:h-[200px]">
      <Bar data={data} options={options} />
    </div>
  );
}

export default function NutritionSummary() {
  const { user_type } = useAuth();
  const userData = useSelector(selectBeneficiary);

  const [value, setValue] = useState(new Date());

  const formateDate = (dateStr) => {
    if (dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      return "loading";
    }
  };

  const lastPregnantInfo = Array.isArray(userData?.pregnantinformation)
    ? userData.pregnantinformation[userData.pregnantinformation.length - 1]
    : null;

  const lastChildrenInfo = Array.isArray(userData?.information)
    ? userData.information[userData.information.length - 1]
    : null;

  const lastLactatingInfo = Array.isArray(userData?.lactatinginformation)
    ? userData.lactatinginformation[userData.lactatinginformation.length - 1]
    : null;

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

  console.log(lastChildrenInfo);

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return { bmi: 0, status: "Invalid input" };

    const heightCm = height / 100;
    const bmiValue = weight / (heightCm * heightCm);
    const bmi = parseFloat(bmiValue.toFixed(1));
    let status = "";
    let txtColor = "";

    console.log(weight, heightCm);

    if (bmi < 16) {
      status = "severely underweight";
      txtColor = "text-[#1447E6]";
    } else if (bmi >= 16 && bmi < 18.5) {
      status = "underweight";
      txtColor = "text-[#894B00]";
    } else if (bmi >= 18.5 && bmi < 25) {
      status = "normal";
      txtColor = "text-[#6E11B0]";
    } else {
      status = "overweight";
      txtColor = "text-[#008236]";
    }

    return { bmi, status, txtColor };
  };

  console.log(userData);

  const getReadableAge = (birthDateString) => {
    const birthDate = new Date(birthDateString);
    const today = new Date();

    const years = today.getFullYear() - birthDate?.getFullYear();
    const months = today.getMonth() - birthDate?.getMonth();
    const days = today.getDate() - birthDate?.getDate();

    let ageInYears = years;
    let ageInMonths = years * 12 + months;

    // Adjust for incomplete months
    if (days < 0) ageInMonths--;

    // If less than 1 year old
    if (ageInMonths < 12) {
      return `${ageInMonths} ${ageInMonths === 1 ? "month" : "months"} old`;
    } else {
      // Adjust for negative month if birthday hasn't occurred yet this year
      if (months < 0 || (months === 0 && days < 0)) {
        ageInYears--;
      }
      return `${ageInYears} ${ageInYears === 1 ? "year" : "years"} old`;
    }
  };

  /*WEIGHT CHECKING */

const healthStatus = (birthDateStr, weight, bpString, muac) => {
if (!birthDateStr || typeof birthDateStr !== "string") {
return {
age: null,
weightStatus: "Unknown",
bpStatus: "Unknown",
muacStatus: "Unknown",
};
}


// Parse birthdate (DD-MM-YYYY)
const parts = birthDateStr.split("-").map(Number);
if (parts.length !== 3 || parts.some(isNaN)) {
return {
age: null,
weightStatus: "Invalid birth date",
bpStatus: "Unknown",
muacStatus: "Unknown",
};
}


const [day, month, year] = parts;
const birthDate = new Date(year, month - 1, day);


const today = new Date();
let age = today.getFullYear() - birthDate.getFullYear();
const monthDiff = today.getMonth() - birthDate.getMonth();


if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
age--;
}


// Parse blood pressure safely
const [systolicBP, diastolicBP] = bpString?.split("/").map(Number) || [];


// Weight range logic
let minNormalWeight = 50;
let maxNormalWeight = 85;


if (age >= 18 && age <= 24) {
minNormalWeight = 50;
maxNormalWeight = 70;
} else if (age >= 25 && age <= 34) {
minNormalWeight = 55;
maxNormalWeight = 75;
} else if (age >= 35 && age <= 50) {
minNormalWeight = 60;
maxNormalWeight = 80;
}


const weightStatus =
weight < minNormalWeight
? "Underweight"
: weight > maxNormalWeight
? "Overweight"
: "Normal weight";


const bpStatus =
!systolicBP || !diastolicBP
? "Unknown BP"
: systolicBP < 90 || diastolicBP < 60
? "Low BP"
: systolicBP <= 120 && diastolicBP <= 80
? "Normal BP"
: systolicBP <= 139 || diastolicBP <= 89
? "Elevated BP"
: "High BP";


const muacStatus =
muac < 23
? "Possible undernutrition"
: muac <= 32
? "Normal MUAC"
: "Possible overweight/obese";


return { age, weightStatus, bpStatus, muacStatus };
};

  const getAge = (birthDateStr) => {
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    if (!hasHadBirthdayThisYear) {
      age--;
    }

    return age;
  };

  const dataCompare = (lastMonth, recent) => {
    if (lastMonth === 0 && recent === 0) return "No change";
    if (lastMonth === 0)
      return (
        <span className="text-[10px] p-1  rounded-full bg-gray-100 text-gray-600">
          0 %
        </span>
      ); // avoid division by 0

    const change = recent - lastMonth;
    const percent = Math.abs((change / lastMonth) * 100).toFixed(2);

    if (change > 0) {
      return (
        <span className="text-[10px] p-1  rounded-full bg-green-100 text-green-600">
          <i className="bi bi-arrow-up-short"></i> {percent}%
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="text-[10px] p-1  rounded-full bg-red-100 text-red-600">
          <i className="bi bi-arrow-down-short"></i> {percent}%
        </span>
      );
    } else {
      return "No change";
    }
  };

  return (
    <div className="w-[75%] overflow-hidden max-[640px]:w-full ">
      {/* Request Card */}

      <div className="w-full flex flex-row gap-4 mb-4">
        <div className="bg-white rounded-xl shadow-md  p-6 space-y-4 w-full">
          <RequestVitamins />
        </div>

        {/*  */}
        <div
          className={`bg-white rounded-xl shadow-md  p-6 space-y-4 w-full ${
            user_type !== "lactating" ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <RequestMilk />
        </div>
      </div>

      {user_type === "children" ? (
        <div className="bg-white rounded-xl shadow-md  p-6 space-y-4 w-full sm:w-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              {" "}
              <p className="text-sm text-gray-500">
                Last measured: {formateDate(lastChildrenInfo?.date)}
              </p>
              <h2 className="text-xl font-semibold text-gray-800">
                Nutrition Summary
              </h2>
            </div>
          </div>

          {/* EXPECTED DELIVERY  AND MESSUREMENT */}
          <div className="w-full  flex flex-col mb-8">
            <div className="w-full flex gap-12 max-[640px]:flex-wrap">
              {/* TEXT-1 */}
              <div className="w-min whitespace-nowrap">
                <h2 className="text-[12px] font-medium text-gray-800  mb-2">
                  Child Name <br />
                </h2>

                <h2 className="text-[16px] font-medium text-gray-800 w-min">
                  {userData?.name}
                </h2>
              </div>

              {/* TEXT-1 */}
              <div className="w-min">
                <h2 className="text-[12px] font-medium text-gray-800  mb-2">
                  Child Age <br />
                </h2>

                <h2 className="text-[12px] font-medium text-gray-800  p-1 rounded-[7px] mb-2 w-min flex items-center justify-center ">
                  <b className="text-[16px] text-green-600 bg-green-100 px-2 py-1 rounded-[7px] mr-1">
                    {getReadableAge(userData?.birthDate)?.slice(0, 2)}
                  </b>
                  <b className="text-[16px] text-green-600  py-1 whitespace-nowrap">
                    Years Old
                  </b>
                </h2>
              </div>

              {/* TEXT-2 */}

              <div className="w-min whitespace-nowrap">
                <h2 className="text-[12px] font-medium text-gray-800  mb-2 p-1">
                  Health Status
                </h2>

                <h2 className="text-[16px] font-medium text-gray-800 w-min">
                  <i className="bi bi-graph-down mr-2"></i>
                  {lastChildrenInfo?.status}
                </h2>
                <p className="text-xs  text-gray-400">your status</p>
              </div>
            </div>
          </div>
          {/* Measurements */}
          <h2 className="text-[12px] font-medium text-gray-800  mb-2">
            Recent Mesurement <br />
          </h2>
          <div className="grid grid-cols-3 gap-4 max-[640px]:grid-cols-1">
            {/*  */}

            <div className="w-full border border-gray-300 rounded-[7px] p-2">
              <p className="text-xs text-gray-500">Weight</p>
              <p className="text-lg font-bold text-gray-800 w-full flex justify-between items-center">
                {lastChildrenInfo?.weightKg}
                {dataCompare(
                  userData?.information?.length > 1
                    ? userData.information[userData.information.length - 2]
                        ?.weightKg ?? 0
                    : 0,
                  lastChildrenInfo?.weightKg
                )}
              </p>

              <p className="text-xs text-blue-600 mt-1">
                {
                  healthStatus(
                    userData?.birthDate,
                    lastChildrenInfo?.weightKg,
                    lastChildrenInfo?.bloodPressure,
                    lastChildrenInfo?.muacCm
                  )?.weightStatus
                }
              </p>
            </div>
            {/*  */}
            <div className="w-full border border-gray-300  rounded-[7px] p-2">
              <p className="text-xs text-gray-500">MUAC</p>
              <p className="text-lg font-bold text-gray-800  flex justify-between items-center">
                {lastChildrenInfo?.muacCm}
                {dataCompare(
                  userData?.information?.length > 1
                    ? userData.information[userData.information.length - 2]
                        ?.muacCm ?? 0
                    : 0,
                  lastChildrenInfo?.muacCm
                )}
              </p>

              <p className="text-xs text-green-600 mt-1">
                Mid-Upper Arm Circumference
              </p>
            </div>
            {/*  */}
            <div className="w-full border border-gray-300  rounded-[7px] p-2">
              <p className="text-xs text-gray-500">Height</p>
              <p className="text-lg font-bold text-gray-800 flex justify-between items-center">
                {lastChildrenInfo?.heightCm}
                {dataCompare(
                  userData?.information?.length > 1
                    ? userData.information[userData.information.length - 2]
                        ?.heightCm ?? 0
                    : 0,
                  lastChildrenInfo?.heightCm
                )}
              </p>

              <p className="text-xs text-yellow-600 mt-1">your height</p>
            </div>
          </div>

          {/* GRAPH TABLE */}
          <PregnantGraph pregnantData={userData?.information || []} />

          {/* Nutrition Recommendations */}
          <div className="space-y-3  w-full">
            <h3 className="text-sm font-semibold text-gray-700">
              Nutrition Recommendations
            </h3>

            <div className="w-full grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
              {lastChildrenInfo?.recommendation?.map((data, index) => {
                return (
                  <div
                    key={`recommendations-${index}`}
                    className={`${setBg(
                      index + 1
                    )} text-sm rounded-lg p-3 w-full`}
                  >
                    <p className="font-semibold">{data.title}</p>
                    <p>{data.description}</p>
                  </div>
                );
              })}

              <div
                className={`bg-gray-100 border border-gray-300 text-sm rounded-lg p-3 w-full flex justify-center items-center gap-2`}
              >
                <p className="font-regular">View More</p>{" "}
                <i className="bi bi-arrow-right-short"></i>
              </div>
            </div>
          </div>
        </div>
      ) : user_type === "pregnant" ? (
        <div className="bg-white rounded-xl shadow-md  p-6 space-y-4 w-full sm:w-8/12`">
          {/* PREGNANT NUTRITION SUMMARY */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500">
                Last measured: {formateDate(lastPregnantInfo?.date)}
              </p>
              <h2 className="text-xl font-semibold text-gray-800">
                Nutrition Summary
              </h2>
            </div>
          </div>
          {/* EXPECTED DELIVERY  AND MESSUREMENT */}
          <div className="w-full  flex flex-col mb-8">
            <div className="w-full flex gap-12  max-[640px]:flex-wrap">
              {/* TEXT-1 */}
              <div className="w-full">
                <h2 className="text-[12px] font-medium text-gray-800  mb-2">
                  Expected Delivery <br />
                </h2>

                <h2 className="text-[12px] font-medium text-gray-800 border border-green-600 p-1 rounded-[12px] mb-2 w-min flex items-center justify-center ">
                  <b className="text-[12px] text-green-600 bg-green-100 px-2 py-1 mr-2 rounded-[12px]">
                    {userData?.expectedDelivery?.split(",")[1]?.toUpperCase()}
                  </b>
                  <b className="text-[16px]">
                    {userData?.expectedDelivery?.split(",")[0]}
                  </b>
                </h2>

                <p className="text-xs ">
                  <span className="text-green-600 bg-green-100 rounded-2xl px-2">
                    +2 month
                  </span>
                  before expected delivery
                </p>
              </div>

              {/* TEXT-2 */}

              <div className="w-min whitespace-nowrap">
                <h2 className="text-[12px] font-medium text-gray-800  mb-2 p-1">
                  Pregnancy Risk
                </h2>

                <h2 className="text-[16px] font-medium text-gray-800 w-min">
                  <i className="bi bi-arrows mr-2"></i>
                  {lastPregnantInfo?.pregnacyRisk}
                </h2>
                <p className="text-xs  text-gray-400">low pregnacy risk</p>
              </div>

              {/* TEXT-3 */}

              <div className="w-min whitespace-nowrap">
                <h2 className="text-[12px] font-medium text-gray-800  mb-2 p-1">
                  Months Old
                </h2>

                <h2 className="text-[16px] font-medium text-gray-800 w-min">
                  <i className="bi bi-calendar-range mr-2"></i>
                  {userData?.pregnancyAge} mos
                </h2>
                <p className="text-xs  text-gray-400">aug is date point</p>
              </div>
            </div>
          </div>
          {/* Measurements */}
          <h2 className="text-[12px] font-medium text-gray-800  mb-2">
            Expected Delivery <br />
          </h2>
          <div className="grid grid-cols-3 gap-4 max-[640px]:grid-cols-1">
            {/*  */}

            <div className="w-full border border-gray-300 rounded-[7px] p-2">
              <p className="text-xs text-gray-500">Weight</p>
              <p className="text-lg font-bold text-gray-800 w-full flex justify-between items-center">
                {lastPregnantInfo?.weightKg}
                {dataCompare(
                  userData?.pregnantinformation?.length > 1
                    ? userData.pregnantinformation[
                        userData.pregnantinformation.length - 2
                      ]?.weightKg ?? 0
                    : 0,
                  lastPregnantInfo?.weightKg
                )}
              </p>

              <p className="text-xs text-blue-600 mt-1">
                {
                  healthStatus(
                    userData?.birthDate,
                    lastPregnantInfo?.weightKg,
                    lastPregnantInfo?.bloodPressure,
                    lastPregnantInfo?.muacCm
                  )?.weightStatus
                }
              </p>
            </div>
            {/*  */}
            <div className="w-full border border-gray-300  rounded-[7px] p-2">
              <p className="text-xs text-gray-500">MUAC</p>
              <p className="text-lg font-bold text-gray-800  flex justify-between items-center">
                {lastPregnantInfo?.muacCm}
                {dataCompare(
                  userData?.pregnantinformation?.length > 1
                    ? userData.pregnantinformation[
                        userData.pregnantinformation.length - 2
                      ]?.muacCm ?? 0
                    : 0,
                  lastPregnantInfo?.muacCm
                )}
              </p>

              <p className="text-xs text-green-600 mt-1">
                {
                  healthStatus(
                    userData?.birthDate,
                    lastPregnantInfo?.weightKg,
                    lastPregnantInfo?.bloodPressure,
                    lastPregnantInfo?.muacCm
                  )?.muacStatus
                }
              </p>
            </div>
            {/*  */}
            <div className="w-full border border-gray-300  rounded-[7px] p-2">
              <p className="text-xs text-gray-500">Blood Pressure</p>
              <p className="text-lg font-bold text-gray-800">
                {lastPregnantInfo?.bloodPressure}
              </p>

              <p className="text-xs text-yellow-600 mt-1">
                {
                  healthStatus(
                    userData?.birthDate,
                    lastPregnantInfo?.weightKg,
                    lastPregnantInfo?.bloodPressure,
                    lastPregnantInfo?.muacCm
                  )?.bpStatus
                }
              </p>
            </div>
          </div>
          {/* GRAPH TABLE */}
          <PregnantGraph pregnantData={userData?.pregnantinformation || []} />
          {/* Recent Measurements */}

          {/* Nutrition Recommendations */}
          <div className="space-y-3  w-full">
            <h3 className="text-sm font-semibold text-gray-700">
              Nutrition Recommendations
            </h3>

            <div className="w-full grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
              {lastPregnantInfo?.recommendation?.map((data, index) => {
                return (
                  <div
                    key={`recommendations-${index}`}
                    className={`${setBg(
                      index + 1
                    )} text-sm rounded-lg p-3 w-full`}
                  >
                    <p className="font-semibold">{data.title}</p>
                    <p>{data.description}</p>
                  </div>
                );
              })}

              <div
                className={`bg-gray-100 border border-gray-300 text-sm rounded-lg p-3 w-full flex justify-center items-center gap-2`}
              >
                <p className="font-regular">View More</p>{" "}
                <i className="bi bi-arrow-right-short"></i>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md  p-6 space-y-4 w-full">
          {/* LACTATING NUTRITION SUMMARY */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm md:text-xs text-gray-500">
                Last measured: {formateDate(lastLactatingInfo?.date)}
              </p>
              <h2 className="text-xl font-semibold text-gray-800">
                Nutrition Summary
              </h2>
            </div>
          </div>
          {/* EXPECTED DELIVERY  AND MESSUREMENT */}
          <div className="w-full flex flex-row mb-8 ">
            <div className="w-full flex gap-12 max-[640px]:flex-wrap ">
              {/* TEXT-1 */}
              <div className="w-min">
                <h2 className="text-[12px] font-medium text-gray-800  mb-2">
                  Mother Age <br />
                </h2>

                <h2 className="text-[12px] font-medium text-gray-800  p-1 rounded-[7px] mb-2 w-min flex items-center justify-center ">
                  <b className="text-[16px] text-yellow-600 bg-yellow-100 px-2 py-1 rounded-[7px] mr-1">
                    {getReadableAge(userData?.birthDate)?.slice(0, 2)}
                  </b>
                  <b className="text-[16px] text-yellow-600  py-1 whitespace-nowrap">
                    Years Old
                  </b>
                </h2>
              </div>

              {/* TEXT-2 */}

              <div className="w-min whitespace-nowrap">
                <h2 className="text-[12px] font-medium text-gray-800  mb-2 p-1">
                  Lactatnig Status
                </h2>

                <h2 className="text-[16px] font-medium text-gray-800 w-min">
                  <i className="bi bi-graph-down mr-2"></i>
                  {lastLactatingInfo?.breestFeedStatus}
                </h2>
                <p className="text-xs  text-gray-400">your status</p>
              </div>

              {/* TEXT-3 */}

              <div className="w-min whitespace-nowrap">
                <h2 className="text-[12px] font-medium text-gray-800  mb-2 p-1">
                  Child Age
                </h2>

                <h2 className="text-[16px] font-medium text-gray-800 w-min">
                  <i className="bi bi-calendar-range mr-2"></i>
                  {userData?.childAge} mos
                </h2>
                <p className="text-xs  text-gray-400">mother child age</p>
              </div>

              {/* TEXT-4 */}
              <div className="w-min whitespace-nowrap">
                <h2 className="text-[12px] font-medium text-gray-800  mb-2 p-1">
                  Child Age
                </h2>

                <h2 className="text-[16px] font-medium text-gray-800 w-min">
                  <i className="bi bi-calendar-range mr-2"></i>
                  {userData?.childAge} mos
                </h2>
                <p className="text-xs  text-gray-400">mother child age</p>
              </div>
            </div>
          </div>
          {/* Measurements */}
          <h2 className="text-[12px] font-medium text-gray-800  mb-2">
            Recent Mesurement <br />
          </h2>
          <div className="grid grid-cols-3 gap-4 max-[640px]:grid-cols-1">
            {/*  */}

            <div className="w-full border border-gray-300 rounded-[7px] p-2">
              <p className="text-xs text-gray-500">Weight</p>
              <p className="text-lg font-bold text-gray-800 w-full flex justify-between items-center">
                {lastLactatingInfo?.weightKg}
                {dataCompare(
                  userData?.lactatinginformation?.length > 1
                    ? userData.lactatinginformation[
                        userData.lactatinginformation.length - 2
                      ]?.weightKg ?? 0
                    : 0,
                  lastLactatingInfo?.weightKg
                )}
              </p>

              <p className="text-xs text-blue-600 mt-1">
                {
                  healthStatus(
                    userData?.birthDate,
                    lastLactatingInfo?.weightKg,
                    lastLactatingInfo?.bloodPressure,
                    lastLactatingInfo?.muacCm
                  )?.weightStatus
                }
              </p>
            </div>
            {/*  */}
            <div className="w-full border border-gray-300  rounded-[7px] p-2">
              <p className="text-xs text-gray-500">MUAC</p>
              <p className="text-lg font-bold text-gray-800  flex justify-between items-center">
                {lastLactatingInfo?.muacCm}
                {dataCompare(
                  userData?.lactatinginformation?.length > 1
                    ? userData.lactatinginformation[
                        userData.lactatinginformation.length - 2
                      ]?.muacCm ?? 0
                    : 0,
                  lastLactatingInfo?.muacCm
                )}
              </p>

              <p className="text-xs text-green-600 mt-1">
                {
                  healthStatus(
                    userData?.birthDate,
                    lastLactatingInfo?.weightKg,
                    lastLactatingInfo?.bloodPressure,
                    lastLactatingInfo?.muacCm
                  )?.muacStatus
                }
              </p>
            </div>
            {/*  */}
            <div className="w-full border border-gray-300  rounded-[7px] p-2">
              <p className="text-xs text-gray-500">Recomendation</p>
              <p className="text-lg font-bold text-gray-800">
                {lastLactatingInfo?.recommendation?.length}
              </p>

              <p className="text-xs text-yellow-600 mt-1">
                your recommendation
              </p>
            </div>
          </div>
          {/* GRAPH TABLE */}
          <PregnantGraph pregnantData={userData?.lactatinginformation || []} />

          {/* Recent Measurements */}

          {/* Nutrition Recommendations */}
          <div className="space-y-3  w-full">
            <h3 className="text-sm font-semibold text-gray-700">
              Nutrition Recommendations
            </h3>

            <div className="w-full grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
              {lastLactatingInfo?.recommendation?.map((data, index) => {
                return (
                  <div
                    key={`recommendations-${index}`}
                    className={`${setBg(
                      index + 1
                    )} text-sm rounded-lg p-3 w-full`}
                  >
                    <p className="font-semibold">{data.title}</p>
                    <p>{data.description}</p>
                  </div>
                );
              })}

              <div
                className={`bg-gray-100 border border-gray-300 text-sm rounded-lg p-3 w-full flex justify-center items-center gap-2`}
              >
                <p className="font-regular">View More</p>{" "}
                <i className="bi bi-arrow-right-short"></i>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
