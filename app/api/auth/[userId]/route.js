import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import BnsUser from "@/model/BnsUser";

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    
    // Await params before using them (Required for Next.js 15+)
    const { userId } = await params; 
    
    const body = await req.json();

    // Validate ID format before querying
    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ message: "Invalid User ID format" }, { status: 400 });
    }

    // Find the user by ID and update fields
    // We use { new: true } to return the updated document
    const updatedUser = await BnsUser.findByIdAndUpdate(userId, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    
    const { userId } = await params; 

    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ message: "Invalid User ID format" }, { status: 400 });
    }

    const deletedUser = await BnsUser.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
     try {
        await dbConnect();
        
        // Await params here as well
        const { userId } = await params;

        const user = await BnsUser.findById(userId);
         if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
         return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}