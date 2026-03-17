import { NextResponse } from "next/server";
import Event from "@/model/Events";
import connectToDatabase from "@/lib/mongoose";

import LactatingUser from "@/model/LactatingUser";
import ChildrenNutritionData from "@/model/ChildrenNutritionData";
import PregnantUser from "@/model/PregnantUser";

/* GET ALL DATA OF EVENT SCHEDULE DATA */
export async function GET() {
  await connectToDatabase();

  const event = await Event.find()
    .populate({
      path: "joined.user",
      select: "name email  type",
    })
    .lean();

  if (event) {
    return NextResponse.json(event);
  } else {
    return NextResponse.json(
      { message: "No PregnantData Found!" },
      { status: 400 }
    );
  }
}

/* POST NEW SCEDULE EVENTS */
export async function POST(request) {
  await connectToDatabase();

  const body = await request.json();

  const { title, description, eventStart, eventEnd, eventDate, location } =
    body;

  if (
    !title ||
    !description ||
    !eventStart ||
    !eventEnd ||
    !eventDate ||
    !location
  ) {
    return NextResponse.json(
      { message: "All Fields are Mandatory!" },
      { status: 400 }
    );
  }

  const eventData = await Event.create({
    title,
    description,
    eventStart,
    eventEnd,
    eventDate,
    location,
  });

  if (eventData) {
    return NextResponse.json(eventData, { status: 201 });
  } else {
    return NextResponse.json({ message: "Invalid Register" });
  }
}

/* DELETE SCEDULE EVENTS */
export async function DELETE(request) {
  await connectToDatabase();

  const body = await request.json();

  const { id } = body;

  if (!id) {
    return NextResponse.json(
      { message: "All Fields are Mandatory!" },
      { status: 400 }
    );
  }

  const eventData = await Event.deleteOne({ _id: id });

  if (eventData) {
    return NextResponse.json(eventData, { status: 201 });
  } else {
    return NextResponse.json({ message: "Invalid Register" });
  }
}

/* ADD REMINDERS SCEDULE EVENTS */

export async function PUT(request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { eventId, userId, userModel } = body;

    // Validate fields
    if (!eventId || !userId || !userModel) {
      return NextResponse.json(
        { message: "eventId, userId, and userModel are required!" },
        { status: 400 }
      );
    }

    // Push new joined user into array
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        $push: {
          joined: { user: userId, userModel: userModel },
        },
      },
      { new: true } // return updated doc
    );

    if (!updatedEvent) {
      return NextResponse.json(
        { message: "Event not found!" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
