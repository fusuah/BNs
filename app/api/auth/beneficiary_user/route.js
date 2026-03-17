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

/* LOGIN USER */
export async function POST(request) {
  await connectToDatabase();

  const body = await request.json();

  const { bns_code, usertype } = body;

  if (!bns_code) {
    return NextResponse.json(
      { message: "All Fields are Mandatory!" },
      { status: 400 }
    );
  }

  if (usertype === "children") {
    const foundUser = await ChildrenNutritionData.findOne({ bns_code });

    if (!foundUser || !foundUser.approve) {
      return NextResponse.json(
        { message: "User Not Approve Yet" },
        { status: 401 }
      );
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
          name: foundUser.mother,
          email: foundUser.email,
          type: "bns-beneficiary",
          barangay: foundUser?.address,
          imgUrl: foundUser.imgUrl,
          user_type: foundUser?.type,
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
  } else if (usertype === "pregnantwomen") {
    const foundUser = await PregnantUser.findOne({ bns_code });

    if (!foundUser || !foundUser.approve) {
      return NextResponse.json(
        { message: "User Not Approve Yet" },
        { status: 401 }
      );
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
          name: foundUser.name,
          email: foundUser.email,
          type: "bns-beneficiary",
          barangay: foundUser?.address,
          imgUrl: foundUser.imgUrl,
          user_type: foundUser?.type,
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
  } else if (usertype === "lactatingmother") {
    const foundUser = await LactatingUser.findOne({ bns_code });

    if (!foundUser || !foundUser.approve) {
      return NextResponse.json(
        { message: "User Not Approve Yet" },
        { status: 401 }
      );
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
          name: foundUser.name,
          email: foundUser.email,
          type: "bns-beneficiary",
          barangay: foundUser?.address,
          imgUrl: foundUser.imgUrl,
          user_type: foundUser?.type,
        },
      },
      ACCESS_TOKEN,
      { expiresIn: "100m" }
    );

    if (accessToken) {
      return NextResponse.json(
        {
          accessToken,
          info: {
            id: foundUser._id,
            name: foundUser.name,
            email: foundUser.email,
            type: "bns-beneficiary",
            barangay: foundUser?.address,
            imgUrl: foundUser.imgUrl,
            user_type: foundUser?.type,
          },
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json({ message: "Invalid LogIn" });
    }
  } else {
    return NextResponse.json(
      { msg: "All Field Are mandatory" },
      { status: 401 }
    );
  }
}
