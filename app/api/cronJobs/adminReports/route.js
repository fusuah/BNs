import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import reportType from "@/model/ReportType";
import generateReport from "@/model/GenerateReport";
import { format, endOfMonth } from "date-fns";
export async function GET() {
	try {
		await connectToDatabase();

		const now = new Date();
		const day = now.getDate();
		const month = now.getMonth(); // Jan = 0
		const year = now.getFullYear();

		const activeReportTypes = await reportType.find({ active: true });

		for (const type of activeReportTypes) {
			const { _id, frequency, title } = type;
			let period = "";
			let shouldGenerate = false;

			// Determine schedule
			if (frequency === "monthly" && day === 1) {
				period = format(now, "MMMM yyyy"); // June 2025 -> sample neto
				shouldGenerate = true;
			} else if (
				frequency === "quarterly" &&
				day === 1 &&
				[0, 3, 6, 9].includes(month)
			) {
				const quarter = Math.floor(month / 3) + 1;
				period = `Q${quarter} ${year}`;
				shouldGenerate = true;
			} else if (frequency === "annual" && day === 1 && month === 0) {
				period = `${year}`;
				shouldGenerate = true;
			}

			if (shouldGenerate) {
				const alreadyExists = await generateReport.findOne({
					reportTypeId: _id,
					frequency,
					period,
				});

				if (!alreadyExists) {
					await generateReport.create({
						reportTypeId: _id,
						title: `${title} - ${period}`,
						period,
						dueDate: endOfMonth(now),
						frequency,
					});
					console.log(`Created: ${title} (${frequency}) - ${period}`);
				} else {
					console.log(`Already exists: ${title} - ${period}`);
				}
			}
		}

		return NextResponse.json({ message: "Report generation complete." });
	} catch (error) {
		console.error("Cron job error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
