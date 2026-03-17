import { NextResponse } from "next/server";
import ChildrenNutritionData from "@/model/ChildrenNutritionData";
import PregnantUser from "@/model/PregnantUser";
import LactatingUser from "@/model/LactatingUser";
import connectToDatabase from "@/lib/mongoose";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN = "Waxcs0UvN1RvPJewtBrqQxrZGxB80m9AAPx3gQifa04";

export async function GET() {
  await connectToDatabase();

  let users;

  users = await BnsUser.find().lean();

  if (users) {
    return NextResponse.json(users);
  } else {
    return NextResponse.json({ message: "No User Found!" }, { status: 400 });
  }
}
