import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import ChildrenNutritionData from "@/model/ChildrenNutritionData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();

    // Using lean() gives us the raw JavaScript objects from the DB
    const children = await ChildrenNutritionData.find().lean();

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

    // Initialize results
    const results = monthNames.map((m) => ({
      month: m,
      Underweight: 0,
      Normal: 0,
      Overweight: 0,
    }));

    children.forEach((child) => {
      if (child.information && Array.isArray(child.information)) {
        child.information.forEach((item) => {
          let record = item;

          // FIX: Parse stringified JSON if the database contains strings instead of objects
          if (typeof item === 'string') {
            try {
              record = JSON.parse(item);
            } catch (e) {
              console.error("Failed to parse record:", item);
              return;
            }
          }

          if (!record.date || !record.status) return;

          const recordDate = new Date(record.date);
          if (isNaN(recordDate.getTime())) return;

          const monthIndex = recordDate.getMonth();
          const status = (record.status || "").trim().toLowerCase();

          // Categorize status
          if (status.includes("underweight") || status.includes("severely")) {
            results[monthIndex].Underweight++;
          } else if (status === "normal") {
            results[monthIndex].Normal++;
          } else if (status.includes("overweight") || status.includes("obese")) {
            results[monthIndex].Overweight++;
          }
        });
      }
    });

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (err) {
    console.error("Error in nutrition stats API:", err);
    return NextResponse.json(
      { success: false, message: "Server error", details: err.message },
      { status: 500 }
    );
  }
}