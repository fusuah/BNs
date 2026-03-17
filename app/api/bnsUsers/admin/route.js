import { NextResponse } from "next/server";
import BnsUser from "@/model/BnsUser";
import BnsUserDiary from "@/model/BnsUserDiary";
import connectToDatabase from "@/lib/mongoose";

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectToDatabase();

  try {
    // FIX: Use the correct schema field 'approve' (boolean) instead of 'status'
    // Also ensuring 'role' matches your schema/data (assuming 'type' field in schema corresponds to 'role' in query, or we should use 'type')
    
    // Looking at your schema: "type" is the field name for user role (e.g. 'bns-worker')
    // Looking at your schema: "approve" is the field name for status (Boolean)

    const query = {
      type: "bns-worker", // Changed from 'role' to 'type' based on your Schema
      approve: true       // Changed from 'status' to 'approve' based on your Schema
    };

    const totalBnsUsers = await BnsUser.countDocuments(query);

    // 1. Get all approved BNS users
    const bnsUsers = await BnsUser.find(
      query,
      "fullName barangay _id"
    ).lean();

    console.log(`[AdminAPI] Found ${bnsUsers.length} approved BNS users.`);

    // 2. Aggregate tasks/activities for these users
    // We want to know:
    // - How many active tasks (diaries) in the last 30 days?
    // - Most recent activity date
    // - Compliance % (this is tricky without a fixed denominator, so we'll approximate based on expected daily entries)

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    
    // Count report this month based on diaries created this month
    const reportThisMonthCount = await BnsUserDiary.countDocuments({
       date: { 
           $gte: firstDayOfMonth.toISOString().split("T")[0],
           $lt: firstDayNextMonth.toISOString().split("T")[0]
       }
    });

    const rows = await Promise.all(
      bnsUsers.map(async (user) => {
        // Fetch recent diaries for this user
        const recentDiaries = await BnsUserDiary.find({
          userId: user._id.toString(),
          date: { $gte: thirtyDaysAgoStr },
        }).lean();

        // console.log(`[AdminAPI] User ${user.fullName} has ${recentDiaries.length} diaries in last 30 days.`);

        const last30Count = recentDiaries.length;
        
        // Calculate "Activity %": (Days with entries / 30) * 100
        // Cap at 100
        const activityPct = Math.min(Math.round((last30Count / 30) * 100), 100);

        // Calculate "Compliance %": 
        // Let's assume compliance means having tasks marked as completed.
        let completedTasks = 0;
        let totalTasks = 0;

        recentDiaries.forEach(d => {
            if (d.tasks) {
                const tasks = d.tasks instanceof Map ? Object.fromEntries(d.tasks) : d.tasks;
                Object.values(tasks).forEach(status => {
                    totalTasks++;
                    if (status === true || status?.completed === true) completedTasks++;
                });
            }
        });

        const compliancePct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Calculate Recency Score
        // 100 if active today, decays by 5 per day
        const lastActivityDate = recentDiaries.length > 0 
            ? recentDiaries.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date 
            : null;
        
        let recencyDays = 30; // default to 'inactive'
        if (lastActivityDate) {
            const diffTime = Math.abs(new Date() - new Date(lastActivityDate));
            recencyDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        }
        
        const recencyScore = Math.max(0, 100 - (recencyDays * 5));

        return {
          barangay: user.barangay,
          bnsName: user.fullName,
          activityPct,
          compliancePct,
          recencyScore,
          recencyDays, // For tooltip
          last30Count, // For tooltip
          completedTasks, // For tooltip
          totalTasks, // For tooltip
          bnsAssigned: 1 // Grouping by barangay later if needed, but row per BNS is fine for now
        };
      })
    );

    // Group rows by Barangay if multiple BNS per barangay
    // This makes the Heatmap cleaner: One row per Barangay
    const barangayMap = new Map();

    rows.forEach(row => {
        if (!barangayMap.has(row.barangay)) {
            barangayMap.set(row.barangay, {
                barangay: row.barangay,
                activityPct: 0,
                compliancePct: 0,
                recencyScore: 0,
                recencyDays: 0,
                last30Count: 0,
                completedTasks: 0,
                totalTasks: 0,
                bnsAssigned: 0
            });
        }
        const b = barangayMap.get(row.barangay);
        b.activityPct += row.activityPct;
        b.compliancePct += row.compliancePct;
        b.recencyScore += row.recencyScore;
        b.last30Count += row.last30Count;
        b.completedTasks += row.completedTasks;
        b.totalTasks += row.totalTasks;
        b.bnsAssigned += 1;
        // Recency days: take the minimum (most recent)
        b.recencyDays = b.bnsAssigned === 1 ? row.recencyDays : Math.min(b.recencyDays, row.recencyDays);
    });

    const finalRows = Array.from(barangayMap.values()).map(b => ({
        ...b,
        activityPct: Math.round(b.activityPct / b.bnsAssigned),
        compliancePct: Math.round(b.compliancePct / b.bnsAssigned),
        recencyScore: Math.round(b.recencyScore / b.bnsAssigned)
    }));

    return NextResponse.json({
      totalBnsUsers,
      activeBarangays: finalRows.filter(r => r.activityPct > 0).length,
      reportThisMonthCount,
      rows: finalRows
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { message: "Error fetching admin stats" },
      { status: 500 }
    );
  }
}