import { NextResponse } from "next/server";
import Event from "@/model/Events";
import connectToDatabase from "@/lib/mongoose";

/* GET ALL DATA OF EVENT SCHEDULE DATA */
export async function GET() {
  await connectToDatabase();
}

/* POST NEW SCEDULE EVENTS */
export async function POST(request) {
  await connectToDatabase();

  const body = await request.json();
}

/* DELETE SCEDULE EVENTS */
export async function DELETE(request) {
  await connectToDatabase();
}
