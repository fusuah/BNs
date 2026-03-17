import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import BnsUserDiary from "@/model/BnsUserDiary";
import { generateTasksForDay } from "./utils";

// CREATE diary
export async function POST(req) {
  try {
    await connectToDatabase();
    // Accept tasks from the client payload
    const { userId, date, tasks: clientTasks } = await req.json(); 
    
    if (!userId) {
        return NextResponse.json({ message: "UserId is required" }, { status: 400 });
    }

    // Use provided date from client or fallback to server today
    const targetDate = date ? new Date(date) : new Date();
    const formattedDate = date || targetDate.toISOString().split("T")[0];
    
    const dayName = targetDate
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    // Check if diary already exists
    let diary = await BnsUserDiary.findOne({ userId, date: formattedDate });
    if (diary) {
      return NextResponse.json({
        success: false,
        message: "Diary already exists for this date",
      }, { status: 400 });
    }

    // Determine tasks: Use client provided tasks -> OR generate from utils -> OR empty object
    let tasksToSave = {};
    if (clientTasks && Object.keys(clientTasks).length > 0) {
        tasksToSave = clientTasks;
    } else {
        tasksToSave = generateTasksForDay ? generateTasksForDay(dayName) : {};
    }

    diary = await BnsUserDiary.create({
      userId,
      date: formattedDate,
      diary: { title: "", content: "" },
      tasks: tasksToSave, 
      specialTasks: {} 
    });

    return NextResponse.json({
      success: true,
      diary,
      message: "Diary created successfully",
    }, { status: 201 });

  } catch (error) {
    console.error("Diary creation error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// READ diary entries
export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const date = searchParams.get("date");

    if (!userId) {
        return NextResponse.json({ message: "UserId is required" }, { status: 400 });
    }

    const query = { userId };
    if (date) query.date = date;

    const diaries = await BnsUserDiary.find(query).sort({ date: -1 });

    return NextResponse.json({ success: true, diaries }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE diary
export async function PATCH(req) {
  try {
    await connectToDatabase();
    const { diaryId, diary, tasks, specialTasks } = await req.json();
    if (!diaryId) throw new Error("DiaryId is required");

    const updateData = { updatedAt: Date.now() };

    if (diary) updateData.diary = diary;
    if (tasks) updateData.tasks = tasks;
    if (specialTasks) updateData.specialTasks = specialTasks;

    const updatedDiary = await BnsUserDiary.findByIdAndUpdate(
      diaryId,
      updateData,
      { new: true }
    );

    return NextResponse.json({ success: true, diary: updatedDiary });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE diary entry
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const diaryId = searchParams.get("diaryId");

    if (!diaryId) {
      return NextResponse.json({ message: "Diary ID is required" }, { status: 400 });
    }

    const deletedDiary = await BnsUserDiary.findByIdAndDelete(diaryId);

    if (!deletedDiary) {
      return NextResponse.json({ message: "Diary not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Diary deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting diary:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}