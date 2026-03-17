import { NextResponse } from "next/server";
import BnsUser from "@/model/BnsUser";
import connectToDatabase from "@/lib/mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const ACCESS_TOKEN = "Waxcs0UvN1RvPJewtBrqQxrZGxB80m9AAPx3gQifa04";

/* LOGIN USER */
export async function POST(request) {
  connectToDatabase();

  const body = await request.json();

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { message: "All Fields are Mandatory!" },
      { status: 400 }
    );
  }

  const foundUser = await BnsUser.findOne({ email });

  if (!foundUser || !foundUser.password) {
    return NextResponse.json({ message: "User Not Found" }, { status: 401 });
  }

  const match = await bcrypt.compare(password, foundUser?.password);

  if (!match) {
    return NextResponse.json(
      { message: "Wrong Password Try Again" },
      { status: 401 }
    );
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser._id,
        name: foundUser.fullName,
        email: foundUser.email,
        type: foundUser.type,
        barangay: foundUser.barangay,
        imgUrl: foundUser.imgUrl,
      },
    },
    ACCESS_TOKEN,
    { expiresIn: "100m" }
  );

  if (accessToken) {
    return NextResponse.json({ accessToken }, { status: 201 });
  } else {
    return NextResponse.json({ message: "Invalid LogIn" });
  }
}
