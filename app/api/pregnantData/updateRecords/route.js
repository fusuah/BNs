import { NextResponse } from "next/server";
import PregnantUser from "@/model/PregnantUser";
import connectToDatabase from "@/lib/mongoose";

/*UPDATE ADD NEW RECORDS  */
export async function PUT(request) {
  connectToDatabase();

  const body = await request.json();

  const {
    id,
    muacCm,
    supplement,
    weightKg,
    pregnacyRisk,
    recommendation,
    bloodPressure,
  } = body;

  if (!id || !muacCm || !bloodPressure || !weightKg) {
    return NextResponse.json(
      { message: "All Fields are Mandatory!" },
      { status: 400 }
    );
  }

  const nutritionData = await PregnantUser.findByIdAndUpdate(
    id,
    {
      $push: {
        pregnantinformation: {
          muacCm,
          bloodPressure,
          weightKg,
          pregnacyRisk,
          recommendation,
          supplement,
          date: new Date(),
        },
      },
      $inc: {
        pregnancyAge: 1, // Increment pregnancyAge by 1
      },
    },
    { new: true } // Return the updated document
  );

  if (nutritionData) {
    return NextResponse.json(
      {
        message: `NutritionData ${nutritionData.name} Approve !`,
        data: nutritionData.pregnantinformation,
      },
      { status: 201 }
    );
  } else {
    return NextResponse.json({ message: "Invalid Update" });
  }
}
