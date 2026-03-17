import { NextResponse } from "next/server";
import Forms from "@/model/Forms";
import connectToDatabase from "@/lib/mongoose";

export async function GET(request, context) {
  // 🔹 FIX: Await context.params for Next.js 15+ compatibility
  // If this is missing, 'id' will be undefined or throw an error
  const params = await context.params;
  const id = params.id;
  
  await connectToDatabase();
  try {
    const form = await Forms.findById(id); 
    
    if (!form) {
        return NextResponse.json({ message: "Form not found" }, { status: 404 });
    }

    // Return the form wrapped in 'data' key to match typical slice expectations
    return NextResponse.json({ data: form }, { status: 200 });
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json({ message: "Error fetching form" }, { status: 500 });
  }
}