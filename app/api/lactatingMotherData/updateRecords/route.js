import { NextResponse } from "next/server";
import LactatingUser from "@/model/LactatingUser";
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
    breestFeedStatus,
  } = body;

  if (!id || !muacCm || !breestFeedStatus || !weightKg) {
    return NextResponse.json(
      { message: "All Fields are Mandatory!" },
      { status: 400 }
    );
  }

  const lactatingData = await LactatingUser.findByIdAndUpdate(
    id,
    {
      $push: {
        lactatinginformation: {
          muacCm,
          breestFeedStatus,
          weightKg,
          pregnacyRisk,
          recommendation,
          supplement,
          date: new Date(),
        },
      },
    },
    { new: true } // Return the updated document
  );

  if (lactatingData) {
    return NextResponse.json(
      {
        message: `LactatingData ${lactatingData.name} Approve !`,
        data: lactatingData.lactatinginformation,
      },
      { status: 201 }
    );
  } else {
    return NextResponse.json({ message: "Invalid Update" });
  }
}
