import { NextResponse } from "next/server";
import BnsUser from "@/model/BnsUser";
import connectToDatabase from "@/lib/mongoose";

//add task to bns worker
export async function POST(request) {
	connectToDatabase();
	const body = await request.json();
	const { id, title, description, category } = body;
	console.log(category);
	if (!id || !title || !description || !category) {
		return NextResponse.json(
			{
				message: "All fields are mandatory",
			},
			{ status: 400 }
		);
	}

	const userTask = await BnsUser.findByIdAndUpdate(
		id,
		{
			$push: {
				task: { title, description, category, status: "pending", date: new Date() },
			},
		},
		{ new: true }
	);

	if (userTask) {
		return NextResponse.json(
			{
				message: `New task added to ${userTask.fullName}`,
			},
			{
				status: 201,
			}
		);
	} else {
		return NextResponse.json({ message: "invalid create task" });
	}
}

export async function PUT(request) {
	connectToDatabase();
	console.log("this is working bro");
	const body = await request.json();
	const { id, tasks } = body;

	try {
		const updatedUser = await BnsUser.findByIdAndUpdate(
			id,
			{ $set: { task: tasks } },
			{ new: true }
		);

		if (!updatedUser) {
			return NextResponse.json(
				{ error: `User with id ${id} not found.` },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Updated successfully" },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
