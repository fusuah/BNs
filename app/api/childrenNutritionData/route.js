import connectToDatabase from "@/lib/mongoose";
import ChildrenNutritionData from "@/model/ChildrenNutritionData";
import { NextResponse } from "next/server";

/* HELPER FUNCTION TO GENERATE UNIQUE LOGIN CODE */
async function generateUniqueCode() {
  const generateBns_code = () =>
    `BNS-${Math.floor(1000 + Math.random() * 9000)}`;
  let bns_code;
  let exists = true;

  while (exists) {
    bns_code = generateBns_code();
    // Checking against ChildrenNutritionData for collision within this collection
    exists = await ChildrenNutritionData.findOne({ bns_code }).maxTimeMS(30000);
  }

  return bns_code;
}

/* GET ALL DATA OF CHILDREN NUTRITION DATA */
export async function GET() {
  try {
    await connectToDatabase();
    const childrenNutritionData = await ChildrenNutritionData.find().sort({ createdAt: -1 }).lean();

    if (childrenNutritionData) {
      return NextResponse.json(childrenNutritionData);
    } else {
      return NextResponse.json(
        { message: "No NutritionData Found!" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}

/* ADD NEW DATA */
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    const {
      name,
      mother,
      ageMonths,
      gender,
      status,
      dateRecorded,
      address,
      email,
      number,
      birthDate,
      weightKg,
      heightCm,
      muacCm,
      bmi,
      recommendation,
      // --- NEW FIELDS ---
      isIndigenous,
      hasDisability,
      hasEdema // This comes inside the payload usually, or flattened
    } = body;

    // Basic field validation
    if (!name || !status || !mother) {
      return NextResponse.json(
        { message: "All Fields are Mandatory!" },
        { status: 400 }
      );
    }

    // Check for duplicates
    const duplicate = await ChildrenNutritionData.findOne({ name, mother }).maxTimeMS(30000);

    if (duplicate) {
      return NextResponse.json(
        { message: "Child Record Already Exists" },
        { status: 409 }
      );
    }

    if (!weightKg || !heightCm) {
      return NextResponse.json(
        { message: "Missing measurement data (Weight and Height are required)" },
        { status: 400 }
      );
    }

    const nutritionData = await ChildrenNutritionData.create({
      name,
      mother,
      ageMonths,
      gender,
      address,
      birthDate,
      email,
      number,
      bmi,
      type: "children",
      approve: true,
      bns_code: await generateUniqueCode(),
      
      // Save new Profile Fields
      isIndigenous: isIndigenous || false,
      hasDisability: hasDisability || false,

      information: [
        {
          status,
          weightKg,
          heightCm,
          muacCm: muacCm || 0,
          date: dateRecorded || new Date(),
          recommendation,
          // Save new Measurement Field
          hasEdema: hasEdema || false,
        },
      ],
    });

    if (nutritionData) {
      return NextResponse.json(nutritionData, { status: 201 });
    } else {
      return NextResponse.json({ message: "Invalid Register" }, { status: 400 });
    }
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}

/* APPROVE / DECLINE NEW CHILDREN DATA */
export async function PUT(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { id, type } = body;

    if (!id || !type) {
      return NextResponse.json(
        { message: "All Fields are Mandatory!" },
        { status: 400 }
      );
    }

    const nutritionData = await ChildrenNutritionData.findById(id).exec();

    if (!nutritionData) {
        return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }

    if (type === "approve") {
      nutritionData.approve = true;
      const updatedNutritionData = await nutritionData.save();
      return NextResponse.json(
        { message: `NutritionData ${nutritionData.name} Approved!` },
        { status: 201 }
      );
    } else if (type === "decline") {
      await nutritionData.deleteOne();
      return NextResponse.json(
        { message: `NutritionData ${nutritionData.name} Declined!` },
        { status: 201 }
      );
    } else {
        return NextResponse.json({ message: "Invalid Type Action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}