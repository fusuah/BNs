import { Calendar, Download, FileText } from "lucide-react";
import { nutritionData } from "@/data/bnsUserSampleData";
import { useEffect, useState } from "react";
import GrowthCharts from "@/components/beneficiary/GrowthCharts";
import AssessmentHistory from "@/components/beneficiary/AssessmentHistory";
import NutritionRecommendations from "@/components/beneficiary/NutritionRecommendation";
import useAuth from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { selectBeneficiary } from "@/service/beneficiaryPortal/beneficiaryPortalSlice";

const statConfigs = [
  {
    key: "weight",
    label: "Current Weight",
    bg: "bg-blue-100",
    text: "c",
    iconColor: "text-blue-500",
    unit: "kg",
  },
  {
    key: "height",
    label: "Current Height",
    bg: "bg-green-100",
    text: "text-green-700",
    iconColor: "text-green-500",
    unit: "cm",
  },
  {
    key: "bmi",
    label: "Current BMI",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    iconColor: "text-yellow-500",
    unit: "",
  },
];

const TABS = ["Growth Charts", "Assessment History", "Recommendations"];

function NutritionRecords() {
  const [tab, setTab] = useState("Growth Charts");
  const [mainData, setMainData] = useState([
    {
      type: "",
      weightKg: "",
      heightCm: "",
      muacCm: "",
      bloodPressure: "",
      status: "",
      breastFeedStatus: "",
      pregnacyRisk: "",
      note: "",
      recommendation: [
        {
          title: "",
          description: "",
        },
      ],
      date: new Date(),
    },
  ]);

  const { user_type } = useAuth();
  const userData = useSelector(selectBeneficiary);

  const lastPregnantInfo = Array.isArray(userData?.pregnantinformation)
    ? userData.pregnantinformation[userData.pregnantinformation.length - 1]
    : null;

  const lastChildrenInfo = Array.isArray(userData?.information)
    ? userData.information[userData.information.length - 1]
    : null;
  const lastLactatingInfo = Array.isArray(userData?.lactatinginformation)
    ? userData.lactatinginformation[userData.lactatinginformation.length - 1]
    : null;

  const render = () => {
    if (user_type === "children") {
      setMainData(userData?.information);
    } else if (user_type === "pregnant") {
      setMainData(userData?.pregnantinformation);
    } else if (user_type === "lactating") {
      setMainData(userData?.lactatinginformation);
    }
  };

  useEffect(() => {
    render();
  }, [user_type, userData]);

  const getPercentageIncrease = (previous, current) => {
    if (!previous || previous === 0) return 0;
    const increase = ((current - previous) / previous) * 100;
    return parseFloat(increase.toFixed(2)); // returns a number with 2 decimal places
  };

  const lastCurrentData = () => {
    if (user_type === "children") {
      return {
        last: Array.isArray(userData?.information)
          ? userData.information[userData.information.length - 2]
          : null,
        current: lastChildrenInfo,
      };
    } else if (user_type === "pregnant") {
      return {
        last: Array.isArray(userData?.pregnantinformation)
          ? userData.pregnantinformation[
              userData.pregnantinformation.length - 2
            ]
          : null,
        current: lastPregnantInfo,
      };
    } else if (user_type === "lactating") {
      return {
        last: Array.isArray(userData?.lactatinginformation)
          ? userData.lactatinginformation[
              userData.lactatinginformation.length - 2
            ]
          : null,
        current: lastLactatingInfo,
      };
    }
  };

  return (
    <div className="text-black">
      <div className="flex justify-between items-center">
        <div>
          <strong className="text-2xl">Nutrition Records</strong>
          <p className="text-gray-500">Track growth and nutrition history</p>
        </div>
        {/* <div className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-2xl h-10 w-fit">
          <Download size={16} />

          <span className="font-semibold text-sm">Export Records</span>
        </div> */}
      </div>

      {/* STAT */}
      <div className="flex gap-4 my-6 max-[640px]:flex-col">
        <div
          className={`bg-blue-100 text-blue-700 flex justify-between items-center rounded-xl p-5 shadow-none w-full  `}
        >
          <div>
            <p className="text-sm">Current Weight</p>
            <p className="text-2xl font-bold">
              {user_type === "children"
                ? lastChildrenInfo?.weightKg
                : user_type === "pregnant"
                ? lastPregnantInfo?.weightKg
                : lastLactatingInfo?.weightKg}{" "}
              kg
            </p>
            <p className="text-sm">
              ++
              {getPercentageIncrease(
                lastCurrentData()?.last?.weightKg,
                lastCurrentData()?.current?.weightKg
              )}{" "}
              from last month
            </p>
          </div>
          <div className="bg-white rounded-full p-2 shadow-md">
            <FileText size={20} className={"text-blue-800"} />
          </div>
        </div>

        <div
          className={`bg-green-100 text-green-700 flex justify-between items-center rounded-xl p-5 shadow-none w-full`}
        >
          <div>
            <p className="text-sm">
              {user_type === "children" ? "Current Height" : "Muac"}
            </p>
            <p className="text-2xl font-bold">
              {user_type === "children"
                ? lastChildrenInfo?.heightCm
                : user_type === "pregnant"
                ? lastPregnantInfo?.muacCm
                : lastLactatingInfo?.muacCm}{" "}
              cm
            </p>
            <p className="text-sm">
              {user_type === "children" ? (
                <>
                  {" "}
                  ++
                  {getPercentageIncrease(
                    lastCurrentData()?.last?.heightCm,
                    lastCurrentData()?.current?.heightCm
                  )}{" "}
                  from last month
                </>
              ) : (
                <>
                  {" "}
                  ++
                  {getPercentageIncrease(
                    lastCurrentData()?.last?.muacCm,
                    lastCurrentData()?.current?.muacCm
                  )}{" "}
                  from last month{" "}
                </>
              )}
            </p>
          </div>
          <div className="bg-white rounded-full p-2 shadow-md">
            <FileText size={20} className={"text-green-800"} />
          </div>
        </div>

        <div
          className={`bg-yellow-100 text-yellow-700 flex justify-between items-center rounded-xl p-5 shadow-none w-full`}
        >
          <div>
            <p className="text-sm">
              {user_type === "children"
                ? "Current BMI"
                : user_type === "pregnant"
                ? "Blood Pressure"
                : "Status"}
            </p>
            <p className="text-2xl font-bold">
              {" "}
              {user_type === "children"
                ? lastChildrenInfo?.heightCm
                : user_type === "pregnant"
                ? lastPregnantInfo?.bloodPressure
                : lastLactatingInfo?.breestFeedStatus}{" "}
            </p>
            <p className="text-sm">
              {user_type === "children" ? (
                <>
                  {" "}
                  ++
                  {getPercentageIncrease(
                    lastCurrentData()?.last?.heightCm,
                    lastCurrentData()?.current?.heightCm
                  )}{" "}
                  from last month
                </>
              ) : (
                <></>
              )}
            </p>
          </div>
          <div className="bg-white rounded-full p-2 shadow-md">
            <FileText size={20} className={"text-yellow-800"} />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        {/* Tabs */}
        <div className="flex items-center gap-2 bg-[#f4f6f8] px-3 py-2 rounded-lg w-fit  my-6">
          {TABS.map((t) => {
            const isActive = tab === t;

            return (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  isActive ? "bg-white shadow text-black" : "text-gray-500"
                }`}
              >
                <span>{t}</span>
              </button>
            );
          })}
        </div>
      </div>
      {tab === "Growth Charts" && <GrowthCharts />}
      {tab === "Assessment History" && (
        <AssessmentHistory mainData={mainData} />
      )}
      {tab === "Recommendations" && (
        <NutritionRecommendations dataRender={lastCurrentData()?.current} />
      )}
    </div>
  );
}

export default NutritionRecords;
