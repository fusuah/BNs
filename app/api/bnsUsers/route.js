import dbConnect from "@/lib/mongoose";
import BnsUser from "@/model/BnsUser";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const barangay = searchParams.get("barangay");

    const query = {};

    // Filter by status
    // CRITICAL FIX: If status is "All", we do NOT set the query.status field.
    // This ensures we fetch Active, Inactive, Pending, and any other status.
    if (status && status !== "All") {
      // Mapping "Pending" status to { approve: false } or similar logic if needed
      // Assuming 'status' is derived or stored. If strictly using 'approve' boolean:
      if (status === 'Pending') {
          query.approve = false;
      } else if (status === 'Active') {
          query.approve = true;
      } else {
          // If you have a specific status field, use it. Otherwise, rely on 'approve'.
          // For now, let's assume 'approve' handles active/pending.
          // If you have an explicit 'status' field in DB, uncomment below:
          // query.status = status;
      }
    }

    // Filter by barangay
    if (barangay && barangay !== "All") {
      query.barangay = barangay;
    }

    // Search functionality
    if (search) {
      // FIX: Search by fullName, email, bnsId/bnsnumber
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }, // Changed from emailAddress based on user schema
        { emailAddress: { $regex: search, $options: "i" } }, // Keeping as fallback
        { bnsnumber: { $regex: search, $options: "i" } },
        { bnsId: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    // Fetch users with pagination
    const users = await BnsUser.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first

    const totalUsers = await BnsUser.countDocuments(query);

    return NextResponse.json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      totalUsers,
    });
  } catch (error) {
    console.error("Error fetching BNS users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}