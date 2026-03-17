import { NextResponse } from "next/server";
import ChildrenNutritionData from "@/model/ChildrenNutritionData";
import connectToDatabase from "@/lib/mongoose";

// GET single record (optional but good practice)
export async function GET(request, context) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    const child = await ChildrenNutritionData.findById(id);

    if (!child) {
      return NextResponse.json({ message: "Child not found" }, { status: 404 });
    }

    return NextResponse.json(child);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching child", error: error.message }, { status: 500 });
  }
}

// DELETE record
export async function DELETE(request, context) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    const result = await ChildrenNutritionData.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ message: "Child not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Child record deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ message: "Error deleting record", error: error.message }, { status: 500 });
  }
}

// UPDATE Profile (Name, Gender, etc.)
export async function PUT(request, context) {
  try {
    await connectToDatabase();
    const { id } = await context.params;
    const body = await request.json();

    console.log("📝 PUT Request received at [id]/route.js for ID:", id);
    console.log("📦 Body:", body);

    // Extract fields from body
    const {
      name,
      mother,
      birthDate,
      gender,
      address,
      email,
      number,
      // 👇 Capture new fields
      isIndigenous,
      hasDisability,
    } = body;

    // Build the update object carefully
    const updateData = {
      name,
      mother,
      birthDate,
      gender,
      address,
      email,
      number,
      // 👇 Only add these if they exist in the request body
      // This prevents overwriting with 'undefined' if not sent
      ...(isIndigenous !== undefined && { isIndigenous }),
      ...(hasDisability !== undefined && { hasDisability }),
    };

    console.log("🛠️ Updating with data:", updateData);

    const updatedChild = await ChildrenNutritionData.findByIdAndUpdate(
      id,
      { $set: updateData }, // Use $set to be explicit
      { new: true }
    );

    if (!updatedChild) {
      return NextResponse.json({ message: "Child not found" }, { status: 404 });
    }

    console.log("✅ Update Success:", updatedChild);

    return NextResponse.json(updatedChild);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Error updating record", error: error.message }, { status: 500 });
  }
}