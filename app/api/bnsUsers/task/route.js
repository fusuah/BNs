import { NextResponse } from "next/server";
import BnsUser from "@/model/BnsUser";
import connectToDatabase from "@/lib/mongoose";

// proper route for updating task using backend logic
export async function PUT(request) {
	await connectToDatabase();
	console.log("this is working bro")
	try {
		const body = await request.json();
		const { userId, taskId, updatedFields } = body;

		if (!userId || !taskId || !updatedFields) {
			return NextResponse.json(
				{
					message: "Missing required fields: userId, taskId, or updatedFields",
				},
				{ status: 400 }
			);
		}

		const result = await BnsUser.updateOne(
			{ _id: userId, "task._id": taskId },
			{
				$set: {
					"task.$.title": updatedFields.title,
					"task.$.description": updatedFields.description,
					"task.$.status": updatedFields.status,
					"task.$.category": updatedFields.category,
					"task.$.verificationImgUrl": updatedFields.verificationImgUrl,
					"task.$.date": updatedFields.date,
				},
			}
		);

		if (result.modifiedCount === 0) {
			return NextResponse.json(
				{
					message:
						"No task was updated. Check if taskId and userId are correct.",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Task updated successfully." },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Task update failed:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
