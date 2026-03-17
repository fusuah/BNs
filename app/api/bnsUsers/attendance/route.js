import { NextResponse } from "next/server";
import BnsUserDiary from "@/model/BnsUserDiary";
import connectToDatabase from "@/lib/mongoose";

export async function POST(request) {
  await connectToDatabase();
  
  try {
    const { userId, action } = await request.json(); // action: "timeIn" or "timeOut"
    const today = new Date().toISOString().split("T")[0];

    let diary = await BnsUserDiary.findOne({ userId, date: today });

    if (!diary) {
      // Create new diary entry if it doesn't exist (Time In usually starts the day)
      diary = new BnsUserDiary({
        userId,
        date: today,
        tasks: {}, 
        specialTasks: {}
      });
    }

    if (action === "timeIn") {
      if (diary.timeIn) {
        return NextResponse.json({ message: "Already Timed In" }, { status: 400 });
      }
      diary.timeIn = new Date();
    } else if (action === "timeOut") {
      diary.timeOut = new Date();
    }

    await diary.save();

    return NextResponse.json({ 
      message: action === "timeIn" ? "Timed In Successfully" : "Timed Out Successfully",
      timeIn: diary.timeIn,
      timeOut: diary.timeOut
    }, { status: 200 });

  } catch (error) {
    console.error("Attendance Error:", error);
    return NextResponse.json({ message: "Error updating attendance" }, { status: 500 });
  }
}

export async function GET(request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const today = new Date().toISOString().split("T")[0];

  if (!userId) return NextResponse.json({ message: "UserId required" }, { status: 400 });

  const diary = await BnsUserDiary.findOne({ userId, date: today });
  
  return NextResponse.json({
    timeIn: diary?.timeIn || null,
    timeOut: diary?.timeOut || null
  });
}