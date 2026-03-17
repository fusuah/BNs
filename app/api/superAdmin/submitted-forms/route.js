import { NextResponse } from "next/server";
import SubmittedForm from "@/model/SubmittedForm";
import BnsUser from "@/model/BnsUser"; // Ensure model is registered
import connectToDatabase from "@/lib/mongoose";

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectToDatabase();
  try {
    // Fetch all submitted forms, populate the submitter's info
    const forms = await SubmittedForm.find({})
      .populate("submittedBy", "fullName barangay")
      .sort({ submissionDate: -1 });

    return NextResponse.json(forms, { status: 200 });
  } catch (error) {
    console.error("Error fetching submitted forms:", error);
    return NextResponse.json({ message: "Error fetching forms" }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Form ID is required" }, { status: 400 });
    }

    const deletedForm = await SubmittedForm.findByIdAndDelete(id);

    if (!deletedForm) {
      return NextResponse.json({ message: "Form not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Form deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting submitted form:", error);
    return NextResponse.json({ message: "Error deleting form" }, { status: 500 });
  }
}