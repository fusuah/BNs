import { NextResponse } from "next/server";
import Inventory from "@/model/Inventory";
import connectToDatabase from "@/lib/mongoose";

export async function GET() {
  await connectToDatabase();
  try {
    const items = await Inventory.find({}).sort({ itemName: 1 });
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching inventory" }, { status: 500 });
  }
}

export async function POST(request) {
  await connectToDatabase();
  try {
    const body = await request.json();
    const { itemName, quantity, unit, category } = body;
    
    const newItem = await Inventory.create({ itemName, quantity, unit, category });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating item" }, { status: 500 });
  }
}