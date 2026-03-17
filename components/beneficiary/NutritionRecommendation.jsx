"use client";
import { nutritionData } from "@/data/bnsUserSampleData";

// 🧠 Generate recommendations based on logic
function generateRecommendations() {
  const recommendations = [];

  const bmi = parseFloat(nutritionData.bmi?.value || 0);

  // 1. Growth Progress
  if (bmi >= 14 && bmi < 18.5) {
    recommendations.push({
      title: "Good Growth Progress",
      description:
        "Juan is showing good growth progress. Continue with the current balanced diet.",
      color: "green",
    });
  } else if (bmi < 14) {
    recommendations.push({
      title: "Growth Monitoring",
      description:
        "Juan is slightly underweight. Increase calorie-rich and nutrient-dense meals.",
      color: "yellow",
    });
  } else {
    recommendations.push({
      title: "Weight Monitoring",
      description:
        "Juan may be above normal BMI. Encourage physical activity and reduce sugary foods.",
      color: "red",
    });
  }

  // 2. Protein Intake
  recommendations.push({
    title: "Protein Intake",
    description:
      "Maintain regular protein intake with eggs, fish, and lean meats at least 3-4 times a week.",
    color: "blue",
  });

  // 3. Iron-Rich Foods (if underweight)
  if (bmi < 14.5) {
    recommendations.push({
      title: "Iron-Rich Foods",
      description:
        "Increase iron-rich foods to support growth. Include more green leafy vegetables, beans, and fortified cereals.",
      color: "yellow",
    });
  }

  // 4. Vitamin Supplements
  recommendations.push({
    title: "Vitamin Supplements",
    description:
      "Continue with regular vitamin A supplements as prescribed. Next dose is due in 15 days.",
    color: "purple",
  });

  // 5. Hydration
  recommendations.push({
    title: "Hydration",
    description:
      "Ensure Juan drinks enough water throughout the day, especially during hot weather.",
    color: "red",
  });

  return recommendations;
}

// 🎨 Color classes per type
const colorStyles = [
  "bg-green-50 border-green-200 text-green-800",
  "bg-blue-50 border-blue-200 text-blue-800",
  "bg-yellow-50 border-yellow-200 text-yellow-800",
  "bg-purple-50 border-purple-200 text-purple-800",
  "bg-red-50 border-red-200 text-red-800",
];

export default function NutritionRecommendations({ dataRender }) {
  const recommendations = generateRecommendations();

  console.log(dataRender?.recommendation);

  return (
    <div className="bg-white p-5 rounded-xl space-y-4">
      <h3 className="text-xl font-bold text-gray-800">
        Nutrition Recommendations
      </h3>
      <p className="text-sm text-gray-600 mb-2">
        Personalized advice based on Juan's growth patterns
      </p>

      {dataRender?.recommendation.map((rec, index) => (
        <div
          key={index}
          className={`border-l-4 rounded-md px-4 py-3 ${colorStyles[index]}`}
        >
          <h4 className="font-semibold">{rec.title}</h4>
          <p className="text-sm">{rec.description}</p>
        </div>
      ))}
    </div>
  );
}
