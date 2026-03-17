import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import ChildrenNutritionData from "@/model/ChildrenNutritionData";
import PregnantUser from "@/model/PregnantUser";
import LactatingUser from "@/model/LactatingUser";

export async function PUT(request) {
  await connectToDatabase();

  const { address, email, name, number, id, user_type } = await request.json();

  // Validation
  if (!id || !user_type || !address || !email || !name || !number) {
    return NextResponse.json(
      { message: "All fields are mandatory!" },
      { status: 400 }
    );
  }

  let Model;

  switch (user_type) {
    case "children":
      Model = ChildrenNutritionData;
      break;
    case "pregnant":
      Model = PregnantUser;
      break;
    case "lactating":
      Model = LactatingUser;
      break;
    default:
      return NextResponse.json(
        { message: "Invalid user type!" },
        { status: 400 }
      );
  }

  try {
    const updatedUser = await Model.findByIdAndUpdate(
      id,
      { address, email, name, number },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "No user found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating user", error: error.message },
      { status: 500 }
    );
  }
}
