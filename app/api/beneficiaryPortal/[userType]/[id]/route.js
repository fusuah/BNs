import { NextResponse } from "next/server";
import ChildrenNutritionData from "@/model/ChildrenNutritionData";
import PregnantUser from "@/model/PregnantUser";
import LactatingUser from "@/model/LactatingUser"; // Assuming this model exists based on usage
import connectToDatabase from "@/lib/mongoose";

export async function GET(req, context) {
  await connectToDatabase();
  
  // FIX: Await params
  const { userType, id } = await context.params;

  if (!userType) {
    return NextResponse.json(
      { error: "User type is required" },
      { status: 400 }
    );
  }

  try {
    let result = null;

    if (userType === "children") {
      result = await ChildrenNutritionData.findById(id).lean();
    } else if (userType === "pregnant") {
      result = await PregnantUser.findById(id).lean();
    } else if (userType === "lactating") {
      result = await LactatingUser.findById(id).lean();
    } else {
      return NextResponse.json(
        { error: "Invalid user type" },
        { status: 400 }
      );
    }

    if (!result) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

export async function PUT(req, context) {
  await connectToDatabase();
  
  // FIX: Await params
  const { userType, id } = await context.params;
  const body = await req.json();

  if (!userType) {
    return NextResponse.json(
      { error: "User type is required" },
      { status: 400 }
    );
  }

  try {
    let updatedUser = null;

    const updateData = { ...body };

    if (userType === "children") {
      updatedUser = await ChildrenNutritionData.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).lean();
    } else if (userType === "pregnant") {
      updatedUser = await PregnantUser.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).lean();
    } else if (userType === "lactating") {
      updatedUser = await LactatingUser.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).lean();
    } else {
      return NextResponse.json(
        { error: "Invalid user type" },
        { status: 400 }
      );
    }

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json(
      { error: "Failed to update user data" },
      { status: 500 }
    );
  }
}