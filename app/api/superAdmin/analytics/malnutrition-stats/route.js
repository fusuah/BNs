import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import ChildrenNutritionData from "@/model/ChildrenNutritionData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch all children records
    const children = await ChildrenNutritionData.find().lean();

    // Object to store stats per barangay
    const barangayStats = {};

    children.forEach((child) => {
      // Use a safer way to get address
      const address = child.address ? String(child.address) : "Unknown";
      
      // Heuristic: Assume address format might be "Barangay, City, Province" or just "Barangay"
      let barangay = address.split(',')[0].trim();
      
      if (barangay) {
          barangay = barangay.charAt(0).toUpperCase() + barangay.slice(1).toLowerCase();
      } else {
          barangay = "Unknown";
      }

      // Initialize stats for this barangay if not exists
      if (!barangayStats[barangay]) {
        barangayStats[barangay] = {
          _id: barangay, // Using _id as name for Recharts XAxis
          name: barangay,
          normalCount: 0,
          underweightCount: 0,
          overweightCount: 0,
          stuntedCount: 0,
          wastedCount: 0,
          malnourishedList: [] // List of children with bad status
        };
      }

      // Process nutrition status
      if (child.information && Array.isArray(child.information) && child.information.length > 0) {
        // Sort to find the latest record (by date descending)
        const sortedInfo = [...child.information].sort((a, b) => {
            const parseDate = (item) => {
                if (typeof item === 'string') {
                    try { return new Date(JSON.parse(item).date); } catch { return new Date(0); }
                }
                return new Date(item.date);
            };
            return parseDate(b) - parseDate(a);
        });

        let latestRecord = sortedInfo[0];

        // Parse if it's a JSON string
        if (typeof latestRecord === 'string') {
            try {
                latestRecord = JSON.parse(latestRecord);
            } catch (e) {
                return;
            }
        }

        if (latestRecord && latestRecord.status) {
          const status = latestRecord.status.trim().toLowerCase();
          const childName = child.name || "Unknown Child";

          // Categorize status and add to list if malnourished
          let isMalnourished = false;

          if (status.includes("severely underweight") || status.includes("underweight")) {
            barangayStats[barangay].underweightCount++;
            isMalnourished = true;
          } else if (status.includes("stunted") || status.includes("severely stunted")) {
            barangayStats[barangay].stuntedCount++;
            isMalnourished = true;
          } else if (status.includes("wasted") || status.includes("severely wasted")) {
            barangayStats[barangay].wastedCount++;
            isMalnourished = true;
          } else if (status.includes("overweight") || status.includes("obese")) {
            barangayStats[barangay].overweightCount++;
            isMalnourished = true;
          } else if (status === "normal") {
            barangayStats[barangay].normalCount++;
          }

          if (isMalnourished) {
            barangayStats[barangay].malnourishedList.push({
                name: childName,
                status: status,
                ageMonths: child.ageMonths, // Optional extra info
                gender: child.gender
            });
          }
        }
      }
    });

    // Convert stats object to array
    const results = Object.values(barangayStats);

    return NextResponse.json(results); // Return direct array as frontend expects

  } catch (err) {
    console.error("Error generating malnutrition stats:", err);
    return NextResponse.json(
      { success: false, message: "Server error", details: err.message },
      { status: 500 }
    );
  }
}