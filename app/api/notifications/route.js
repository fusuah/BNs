import { NextResponse } from "next/server";
import Notification from "@/model/Notification";
import connectToDatabase from "@/lib/mongoose";

export async function GET(req) {
  await connectToDatabase();
  try {
    const notification = await Notification.find({});
    return NextResponse.json(notification, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch notification" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectToDatabase();
  try {
    const body = await req.json();

    if (body.barangay == "" || body.content == "" || body.notif_type == "") {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const notification = await Notification.create(body);

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
