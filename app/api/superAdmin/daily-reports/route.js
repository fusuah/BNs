import { NextResponse } from "next/server";
import BnsUserDiary from "@/model/BnsUserDiary";
import BnsUser from "@/model/BnsUser"; // Ensure this model is loaded
import connectToDatabase from "@/lib/mongoose";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  await connectToDatabase();

  try {
    // Get today's date in YYYY-MM-DD format (User's local time logic should be handled, defaulting to server time string for now)
    // For better accuracy, pass the date as a query param from the frontend
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    
    const today = dateParam || new Date().toISOString().split("T")[0];

    // Find diaries for the specific date
    // We populate 'userId' to get the BNS Name and Barangay
    const reports = await BnsUserDiary.find({ date: today }).populate('userId', 'fullName barangay imgUrl');

    // Filter out empty reports if needed (optional)
    // We only want to show BNS who actually DID something (Time In, Wrote Diary, or Completed Task)
    const activeReports = reports.filter(report => {
        const hasTimeIn = !!report.timeIn;
        const hasContent = report.diary?.content?.length > 0;
        const hasTasks = report.tasks && Object.values(report.tasks).some(t => t === true || t.completed === true);
        return hasTimeIn || hasContent || hasTasks;
    });

    return NextResponse.json(activeReports, { status: 200 });
  } catch (error) {
    console.error("Error fetching daily reports:", error);
    return NextResponse.json({ message: "Error fetching reports" }, { status: 500 });
  }
}