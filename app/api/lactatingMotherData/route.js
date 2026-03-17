import { NextResponse } from "next/server";
import LactatingUser from "@/model/LactatingUser";
import connectToDatabase from "@/lib/mongoose";

/* HELPER FUNCTION TO GENERATE UNIQUE LOGIN CODE */
async function generateUniqueCode() {
  const generateBns_code = () =>
    `BNS-${Math.floor(1000 + Math.random() * 9000)}`;
  let bns_code;
  let exists = true;

  while (exists) {
    bns_code = generateBns_code();
    exists = await LactatingUser.findOne({ bns_code }).maxTimeMS(30000);
  }

  return bns_code;
}

/* GET ALL DATA OF LACTATING DATA */
export async function GET() {
  connectToDatabase();
  console.log("this is working sa get all data ng lactating");
  const lactatingUser = await LactatingUser.find().lean();

  if (lactatingUser) {
    return NextResponse.json(lactatingUser);
  } else {
    return NextResponse.json(
      { message: "No LactatingData Found!" },
      { status: 400 }
    );
  }
}

/* ADD NEW DATA */
export async function POST(request) {
  connectToDatabase();
  console.log("this is working bro");
  const body = await request.json();

  const {
    name,
    age,
    childAge,
    address,
    birthDate,
    email,
    number,
    weightKg,
    breestFeedStatus,
    muacCm,
    pregnacyRisk,
    supplement,
    recommendation,
  } = body;

  if (!name || !age || !childAge || !address || !birthDate) {
    return NextResponse.json(
      { message: "All Fields are Mandatory!" },
      { status: 400 }
    );
  }

  const duplicate = await LactatingUser.findOne({ name }).maxTimeMS(30000);

  if (duplicate) {
    return NextResponse.json(
      { message: "This user already has a record" },
      { status: 401 }
    );
  }

  if (!weightKg || !muacCm || !breestFeedStatus) {
    return NextResponse.json(
      { message: "Missing  measurement  data" },
      { status: 401 }
    );
  }

  const lactatingData = await LactatingUser.create({
    name,
    age,
    childAge,
    address,
    birthDate,
    email,
    number,
    approve: true,
    type: "lactating",
    bns_code: generateUniqueCode(),
    lactatinginformation: [
      {
        weightKg,
        breestFeedStatus,
        muacCm,
        pregnacyRisk,
        supplement,
        recommendation,
        date: new Date(),
      },
    ],
  });

  if (lactatingData) {
    console.log("nice one success");
    return NextResponse.json(lactatingData, { status: 201 });
  } else {
    console.log("ayaw gumana pre");
    return NextResponse.json({ message: "Invalid Register" });
  }
}

/*APPROVE / DECLINE NEW CHILDREN DATA  */
export async function PUT(request) {
  await connectToDatabase();
  const body = await request.json();

  const { id, name, address, email, number, birthDate } = body;

  if (!id || !name || !address || !email || !number || !birthDate) {
    return NextResponse.json(
      { message: "All Fields are Mandatory!" },
      { status: 400 }
    );
  }

  const lactatingData = await LactatingUser.findById({
    _id: id,
  }).exec();

  if (!lactatingData) {
    return NextResponse.json(
      { message: `All Field Are Mandatory!` },
      { status: 400 }
    );
  }

  lactatingData.name = name;
  lactatingData.address = address;
  lactatingData.email = email;
  lactatingData.number = number;
  lactatingData.birthDate = birthDate;

  const updatedData = await lactatingData.save();

  if (updatedData) {
    return NextResponse.json(
      { message: `Lactating Data ${lactatingData.name} Updated !` },
      { status: 201 }
    );
  }
}
