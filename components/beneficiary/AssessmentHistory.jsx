"use client";

import useAuth from "@/hooks/useAuth";

export default function AssessmentHistory({ mainData }) {
  console.log(mainData);

  const { user_type } = useAuth();

  const getFilteredData = () => {
    if (!mainData || !Array?.isArray(mainData)) return [];

    return [...mainData].sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // ✅ Helper: compute BMI from weight (kg) and height (cm)
  const computeBMI = (weightStr, heightStr) => {
    const weight = parseFloat(weightStr);
    const height = parseFloat(heightStr) / 100; // cm to meters
    if (!weight || !height) return null;
    const bmi = weight / (height * height);
    return parseFloat(bmi.toFixed(1));
  };

  // ✅ Helper: classify BMI status
  const getBMIStatus = (bmi) => {
    if (bmi < 14)
      return { label: "Underweight", color: "bg-yellow-100 text-yellow-700" };
    if (bmi < 18.5)
      return { label: "Normal", color: "bg-green-100 text-green-700" };
    return { label: "Overweight", color: "bg-red-100 text-red-700" };
  };

  const getPregnantStatus = (bmi) => {
    if (bmi?.toLowerCase() === "low") {
      return { label: "Underweight", color: "bg-blue-100 text-blue-700" };
    } else if (bmi?.toLowerCase() === "moderate") {
      return { label: "Normal", color: "bg-green-100 text-green-700" };
    } else if (bmi?.toLowerCase() === "high") {
      return { label: "Normal", color: "bg-yellow-100 text-yellow-700" };
    } else {
      return { label: "Normal", color: "bg-red-100 text-red-700" };
    }
  };

  // note base on bmi
  const generateNote = (bmi) => {
    if (bmi < 14) return "Improving steadily. Increase iron-rich foods.";
    if (bmi < 16) return "Growth on track. Continue current feeding practices.";
    if (bmi < 17.5)
      return "Good weight gain. Height increasing at expected rate.";
    if (bmi < 18.5) return "Maintaining healthy growth pattern.";
    return "Monitor weight closely. Reduce sugar intake and encourage physical activity.";
  };

  const filteredData = getFilteredData();

  const dataDisplay = () => {
    if (user_type === "children") {
      return filteredData.map((item, i) => {
        const bmi = computeBMI(item?.weightKg, item?.heightCm);
        const status = getBMIStatus(bmi);
        return (
          <tr key={i} className="border-b border-gray-200 last:border-none">
            <td className="py-6 px-3 font-medium text-gray-800">
              {new Date(item.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </td>
            <td className="py-2 px-3">{item.weightKg}</td>
            <td className="py-2 px-3">{item.heightCm}</td>
            <td className="py-2 px-3">{bmi}</td>
            <td className="py-2 px-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
              >
                {status.label}
              </span>
            </td>
            <td className="py-2 px-3 text-gray-700">{generateNote(bmi)}</td>
          </tr>
        );
      });
    } else if (user_type === "pregnant") {
      return filteredData.map((item, i) => {
        const bmi = computeBMI(item?.weightKg, item?.heightCm);
        const status = getPregnantStatus(item?.pregnacyRisk);
        return (
          <tr key={i} className="border-b border-gray-200 last:border-none">
            <td className="py-6 px-3 font-medium text-gray-800">
              {new Date(item.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </td>
            <td className="py-2 px-3">{item?.weightKg}</td>
            <td className="py-2 px-3">{item?.muacCm}</td>
            <td className="py-2 px-3">{item?.bloodPressure}</td>
            <td className="py-2 px-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
              >
                {item?.pregnacyRisk}
              </span>
            </td>
            <td className="py-2 px-3 text-gray-700">{item?.note}</td>
          </tr>
        );
      });
    } else if (user_type === "lactating") {
      return filteredData.map((item, i) => {
        const bmi = computeBMI(item?.weightKg, item?.heightCm);
        const status = getPregnantStatus(item?.pregnacyRisk);
        return (
          <tr key={i} className="border-b border-gray-200 last:border-none">
            <td className="py-6 px-3 font-medium text-gray-800">
              {new Date(item.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </td>
            <td className="py-2 px-3">{item.weightKg}</td>
            <td className="py-2 px-3">{item.muacCm}</td>
            <td className="py-2 px-3">{item?.breestFeedStatus}</td>
            <td className="py-2 px-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
              >
                {item?.pregnacyRisk}
              </span>
            </td>
            <td className="py-2 px-3 text-gray-700">{generateNote(bmi)}</td>
          </tr>
        );
      });
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-800">
        Assessment History
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Detailed record of all nutritional assessments
      </p>

      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="text-gray-600 border-b border-gray-300">
            <th className="py-2 px-3">Date</th>
            <th className="py-2 px-3">Weight</th>
            <th className="py-2 px-3">
              {" "}
              {user_type === "children" ? "Weight" : "Muac"}
            </th>

            <th className="py-2 px-3">
              {" "}
              {user_type === "children"
                ? "BMI"
                : user_type === "pregnant"
                ? "Blood Pressure"
                : "Status"}
            </th>
            <th className="py-2 px-3">
              {user_type === "children" ? "Status" : "Risk"}
            </th>
            <th className="py-2 px-3">Notes</th>
          </tr>
        </thead>
        <tbody>{dataDisplay()}</tbody>
      </table>
    </div>
  );
}
