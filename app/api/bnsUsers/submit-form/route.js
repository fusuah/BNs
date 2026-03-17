import { NextResponse } from "next/server";
import SubmittedForm from "@/model/SubmittedForm"; // Assumes model created in previous step
import connectToDatabase from "@/lib/mongoose";

export async function POST(request) {
  await connectToDatabase();
  try {
    const body = await request.json();
    const { formTitle, submittedBy, barangay, fileUrl } = body;

    const newSubmission = await SubmittedForm.create({
      formTitle,
      submittedBy,
      barangay,
      fileUrl,
      status: "Pending"
    });

    return NextResponse.json(newSubmission, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error submitting form" }, { status: 500 });
  }
}