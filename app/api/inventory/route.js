import { NextResponse } from "next/server";
import Inventory from "@/model/Inventory";
import connectToDatabase from "@/lib/mongoose";

// Read-only access for BNS to see available items
export async function GET() {
  await connectToDatabase();
  try {
    const items = await Inventory.find({}).sort({ itemName: 1 });
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching inventory" }, { status: 500 });
  }
}