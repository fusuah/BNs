import { NextResponse } from "next/server";
import ChildrenNutritionData from "@/model/ChildrenNutritionData";
import connectToDatabase from "@/lib/mongoose";

export async function POST(req) {
  await connectToDatabase();
  
  try {
    const { motherName } = await req.json();

    if (!motherName) {
      return NextResponse.json(
        { error: "Mother name is required" },
        { status: 400 }
      );
    }

    // Find children where 'mother' matches the logged-in user's name
    // Using case-insensitive regex for better matching
    const children = await ChildrenNutritionData.find({
      mother: { $regex: new RegExp(`^${motherName}$`, "i") }
    }).lean();

    return NextResponse.json({ data: children }, { status: 200 });
  } catch (error) {
    console.error("Error fetching children:", error);
    return NextResponse.json(
      { error: "Failed to fetch children" },
      { status: 500 }
    );
  }
}