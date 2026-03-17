import connectToDatabase from "@/lib/mongoose";
import PregnantUser from "@/model/PregnantUser";
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

    const pregnantUser = await PregnantUser.findById(id);

    if (!pregnantUser) {
      return NextResponse.json(
        { message: "Pregnant record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(pregnantUser, { status: 200 });
  } catch (error) {
    console.error("Error fetching pregnant record:", error);
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

    const updatedUser = await PregnantUser.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { message: "Pregnant record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating pregnant record:", error);
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

    const deletedUser = await PregnantUser.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { message: "Pregnant record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Record deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting pregnant record:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}