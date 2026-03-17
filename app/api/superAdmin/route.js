import connectToDatabase from "../../../lib/mongoose";
import { NextResponse } from "next/server";

//sample for connection only
export async function GET(request) {
	try {
		await connectToDatabase();
		return NextResponse.json({ message: "Connected to DB!" });
	} catch (error) {
		console.error("DB connection error:", error);
		return NextResponse.json(
			{ error: "Failed to connect to database" },
			{ status: 500 }
		);
	}
}
