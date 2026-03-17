import { NextResponse } from "next/server";
import BnsUser from "@/model/BnsUser";
import connectToDatabase from "@/lib/mongoose";
import bcrypt from "bcrypt";
import BnsUserDiary from "@/model/BnsUserDiary";
import { verifyToken } from "@/lib/auth";

export async function GET(request) {
  await connectToDatabase();

  try {
    // ✅ Get logged-in user from token
    const user = verifyToken(request);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const barangay = user.barangay;

    // ✅ Filter users by barangay
    const users = await BnsUser.find({ barangay }).lean();

    // Attach diaries to each user
    const usersWithDiaries = await Promise.all(
      users.map(async (u) => {
        const diaries = await BnsUserDiary.find({ userId: u._id }).lean();

        return {
          ...u,
          diaries: diaries || [],
        };
      })
    );

    return NextResponse.json(usersWithDiaries);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

/* REGUSTER USER */
export async function POST(request) {
  await connectToDatabase();

  const body = await request.json();

  const { fullName, email, number, barangay, type, password, bnsId } = body;

  if (!fullName || !email || !number) {
    return NextResponse.json(
      { message: "All Fields are Mandatory!" },
      { status: 400 }
    );
  }

  const duplicate = await BnsUser.findOne({ fullName }).maxTimeMS(30000);

  if (duplicate) {
    return NextResponse.json(
      { message: "Email already Taken" },
      { status: 401 }
    );
  }

  const hashedPass = await bcrypt.hash(password, 10);

  const user = await BnsUser.create({
    fullName,
    email,
    number,
    barangay,
    type,
    password: hashedPass,
    bnsId,
    approve: false,
  });

  if (user) {
    return NextResponse.json(user, { status: 201 });
  } else {
    return NextResponse.json({ message: "Invalid Register" });
  }
}

/* UDDATE USER */
export async function PUT(request) {
  await connectToDatabase();

  const body = await request.json();

  const { fullName, email, number, barangay, imgUrl, bio, id, approve } = body;

  if (!fullName || !email || !number) {
    return NextResponse.json(
      { message: "All Fields are Mandatory!" },
      { status: 400 }
    );
  }

  const user = await BnsUser.findById({ _id: id }).exec();

  if (user) {
    user.fullName = fullName;
    user.email = email;
    user.number = number;
    user.barangay = barangay;
    user.imgUrl = imgUrl;
    user.bio = bio;
    user.approve = approve;
  }

  const updatedUser = await user.save();

  if (updatedUser) {
    return NextResponse.json(
      { message: `User ${user.fullName} Updated !` },
      { status: 201 }
    );
  } else {
    return NextResponse.json({ message: "Invalid Update" });
  }
}
