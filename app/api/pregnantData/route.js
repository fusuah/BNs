import { NextResponse } from "next/server";
import PregnantUser from "@/model/PregnantUser";
import connectToDatabase from "@/lib/mongoose";
import bcrypt from "bcrypt";

/* HELPER FUNCTION TO GENERATE UNIQUE LOGIN CODE */
async function generateUniqueCode() {
  const generateBns_code = () =>
    `BNS-${Math.floor(1000 + Math.random() * 9000)}`;
  let bns_code;
  let exists = true;

  while (exists) {
    bns_code = generateBns_code();
    exists = await PregnantUser.findOne({ bns_code }).maxTimeMS(30000);
  }

  return bns_code;
}
/* GET ALL DATA OF CHILDREN NUTRITION DATA */
export async function GET() {
  connectToDatabase();

  const pregnantUser = await PregnantUser.find().lean();

  if (pregnantUser) {
    return NextResponse.json(pregnantUser);
  } else {
    return NextResponse.json(
      { message: "No PregnantData Found!" },
      { status: 400 }
    );
  }
}

/* ADD NEW DATA */
export async function POST(request) {
  connectToDatabase();

  const body = await request.json();

  const {
    name,
    expectedDelivery,
    pregnancyAge,
    address,
    birthDate,
    email,
    number,
    bloodPressure,
    weightKg,
    muacCm,
    pregnacyRisk,
    supplement,
    recommendation,
    note,
  } = body;

  if (!name || !expectedDelivery || !pregnancyAge || !address || !birthDate) {
    return NextResponse.json(
      { message: "All Fields are Mandatory!" },
      { status: 400 }
    );
  }

  const duplicate = await PregnantUser.findOne({ name }).maxTimeMS(30000);

  if (duplicate) {
    return NextResponse.json(
      { message: "This user already has a record" },
      { status: 401 }
    );
  }

  if (!weightKg || !muacCm) {
    return NextResponse.json(
      { message: "Missing  measurement  data" },
      { status: 401 }
    );
  }

  // Generate a unique login code
  const code = await generateUniqueCode();

  const pregnantData = await PregnantUser.create({
    name,
    expectedDelivery,
    pregnancyAge,
    address,
    birthDate,
    email,
    number,
    approve: true,
    bns_code: code,
    type: "pregnant",
    pregnantinformation: [
      {
        bloodPressure,
        weightKg,
        muacCm,
        pregnacyRisk,
        supplement,
        recommendation,
        note,
        date: new Date(),
      },
    ],
  });

  if (pregnantData) {
    return NextResponse.json(pregnantData, { status: 201 });
  } else {
    return NextResponse.json({ message: "Invalid Register" });
  }
}

/*APPROVE / DECLINE NEW CHILDREN DATA  */
export async function PUT(request) {
  await connectToDatabase();

  const body = await request.json();

  const { id, name, email, number, address } = body;

  if (!id || !name || !email || !number || !address) {
    return NextResponse.json(
      { message: "All Fields are Mandatory!" },
      { status: 400 }
    );
  }

  const pregnantData = await PregnantUser.findById({
    _id: id,
  }).exec();

  if (!pregnantData) {
    return NextResponse.json(
      { message: `All Field Are Mandatory!` },
      { status: 400 }
    );
  }

  pregnantData.name = name;
  pregnantData.email = email;
  pregnantData.number = number;
  pregnantData.address = address;

  const updatedPregnantData = await pregnantData.save();

  if (updatedPregnantData) {
    return NextResponse.json(
      { message: `PregnantData ${pregnantData.name} Approve !` },
      { status: 201 }
    );
  }
}
