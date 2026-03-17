import { NextResponse } from "next/server";
import Feedback from "@/model/Feedback";
import Event from "@/model/Events";
import connectToDatabase from "@/lib/mongoose";

export async function GET(req) {
  await connectToDatabase();
  try {
    const feedFeedback = await Feedback.find().lean().populate("programId");
    return NextResponse.json(feedFeedback, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to fetch feedFeedback" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectToDatabase();
  try {
    const body = await req.json();

    if (!body.rate && !body.comment && !body.isProgramFeedback) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const feedFeedback = await Feedback.create(body);

    return NextResponse.json(feedFeedback, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to create feedFeedback" },
      { status: 500 }
    );
  }
}
