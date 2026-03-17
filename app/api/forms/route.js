import { NextResponse } from "next/server";
import Forms from "@/model/Forms";
import connectToDatabase from "@/lib/mongoose";

// Force dynamic to prevent caching of empty lists
export const dynamic = 'force-dynamic';

export async function GET() {
  await connectToDatabase();
  try {
    const forms = await Forms.find({}).sort({ createdAt: -1 });
    // IMPORTANT: Return structure must match what slice expects.
    // Slice just expects the data. If slice uses 'response.data', backend should wrap.
    // Usually RTK Query uses the direct JSON response.
    // If your slice code has no `transformResponse`, it uses this JSON directly.
    return NextResponse.json({ data: forms }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching forms" }, { status: 500 });
  }
}

export async function POST(request) {
  await connectToDatabase();
  try {
    const body = await request.json();
    const { formName, embeddedLink } = body;

    if (!formName || !embeddedLink) {
        return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const newForm = await Forms.create(body);
    
    return NextResponse.json({ data: newForm }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error creating form" }, { status: 500 });
  }
}