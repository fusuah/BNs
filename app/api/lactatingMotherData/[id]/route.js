import connectToDatabase from "@/lib/mongoose";
import LactatingUser from "@/model/LactatingUser";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  try {
    await connectToDatabase();

    // Await params before destructuring in Next.js 15
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "ID parameter is missing" },
        { status: 400 }
      );
    }

    const lactatingUser = await LactatingUser.findById(id);

    if (!lactatingUser) {
      return NextResponse.json(
        { message: "Lactating mother record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(lactatingUser, { status: 200 });
  } catch (error) {
    console.error("Error fetching lactating mother record:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    await connectToDatabase();

    // Await params before destructuring in Next.js 15
    const { id } = await context.params;
    const data = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "ID parameter is missing" },
        { status: 400 }
      );
    }

    const updatedUser = await LactatingUser.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { message: "Lactating mother record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating lactating mother record:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    await connectToDatabase();

    // Await params before destructuring in Next.js 15
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "ID parameter is missing" },
        { status: 400 }
      );
    }

    const deletedUser = await LactatingUser.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { message: "Lactating mother record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Record deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting lactating mother record:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}