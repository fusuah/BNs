import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import BnsUserDiary from "@/model/BnsUserDiary";

export async function POST(req) {
  try {
    await connectToDatabase();

    const { userId, taskName, date } = await req.json();

    if (!userId || !taskName || !date) {
      return NextResponse.json(
        { success: false, message: "userId, taskName, and date are required" },
        { status: 400 }
      );
    }

    // Find diary for this user and date
    let diary = await BnsUserDiary.findOne({ userId, date });

    // If not exist, create new diary
    if (!diary) {
      diary = new BnsUserDiary({
        userId,
        date,
        diary: {
          title: "",
          content: "",
        },
        tasks: {},
        specialTasks: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // 🚨 Prevent duplicate special task
    if (diary.specialTasks?.[taskName]) {
      return NextResponse.json(
        { success: false, message: "Special task already exists" },
        { status: 400 }
      );
    }

    // ✅ ADD SPECIAL TASK (MATCHES SCHEMA)
    diary.specialTasks.set(taskName, {
      title: taskName,
      completed: false,
      diary: {
        content: "",
        imageUrl: "",
      },
    });

    diary.updatedAt = Date.now();
    await diary.save();

    return NextResponse.json({
      success: true,
      diary,
      message: "Special task added successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
