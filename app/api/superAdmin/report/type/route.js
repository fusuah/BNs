import connectToDatabase from "@/lib/mongoose";
import { NextResponse } from "next/server";
import reportType from "@/model/ReportType";

export async function POST(request) {
	await connectToDatabase();
	console.log("this is working manniga");
	const body = await request.json();
	const { title, description, frequency, formTemplateUrl } = body;

	// Validate input
	if (!title || !description || !frequency || !formTemplateUrl) {
		return NextResponse.json(
			{ message: "All fields are required." },
			{ status: 400 }
		);
	}

	// Validate frequency value
	const allowedFrequencies = ["monthly", "quarterly", "annual"];
	if (!allowedFrequencies.includes(frequency)) {
		return NextResponse.json(
			{ message: "Invalid frequency value." },
			{ status: 400 }
		);
	}

	try {
		const newReportType = await reportType.create({
			title,
			description,
			frequency,
			formTemplateUrl,
		});

		return NextResponse.json(
			{
				message: `Report type '${newReportType.title}' created successfully.`,
				reportType: newReportType,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating report type:", error);
		return NextResponse.json(
			{ message: "Failed to create report type." },
			{ status: 500 }
		);
	}
}

export async function GET(request) {
	try {
		await connectToDatabase();

		const reportTypes = await reportType.find().sort({ createdAt: -1 }); // newest first

		return NextResponse.json({ reportTypes }, { status: 200 });
	} catch (error) {
		console.error("Error fetching report types:", error);
		return NextResponse.json(
			{ message: "Failed to fetch report types." },
			{ status: 500 }
		);
	}
}
