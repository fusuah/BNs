import { NextResponse } from "next/server";
import ChildrenNutritionData from "@/model/ChildrenNutritionData";
import connectToDatabase from "@/lib/mongoose";

/*UPDATE ADD NEW RECORDS  */
export async function PUT(request) {
  connectToDatabase();

  const body = await request.json();

  const { id, muacCm, heightCm, weightKg, status, recommendation } = body;

  if (!id || !muacCm || !heightCm || !weightKg) {
    return NextResponse.json(
      { message: "All Fields are Mandatory!" },
      { status: 400 }
    );
  }

  const nutritionData = await ChildrenNutritionData.findByIdAndUpdate(
    id,
    {
      $push: {
        information: {
          muacCm,
          heightCm,
          weightKg,
          status,
          date: new Date(),
          recommendation,
        },
      },
    },
    { new: true } // Return the updated document
  );

  if (nutritionData) {
    return NextResponse.json(
      { message: `NutritionData ${nutritionData.name} Approve !` },
      { status: 201 }
    );
  } else {
    return NextResponse.json({ message: "Invalid Update" });
  }
}