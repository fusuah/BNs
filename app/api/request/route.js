import { NextResponse } from "next/server";
import Request from "@/model/Request";
import connectToDatabase from "@/lib/mongoose";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  await connectToDatabase();
  try {
    // Fetch requests sorted by newest first
    // We are no longer populating 'requestedBy' as it will store the fullName string directly
    const reqRequest = await Request.find({})
      .sort({ createdAt: -1 });

    return NextResponse.json({ data: reqRequest }, { status: 200 }); 
  } catch (error) {
    console.error("Failed to fetch requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch reqRequest" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectToDatabase();
  try {
    const body = await req.json();

    if (body.content == "" || body.reqtype == "" || body.requestedBy == "") {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const reqRequest = await Request.create(body);

    return NextResponse.json(reqRequest, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to create reqRequest" },
      { status: 500 }
    );
  }
}

/*APPROVE REQUEST */
export async function PUT(request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { message: "All Fields are Mandatory!" },
        { status: 400 }
      );
    }

    const requestResult = await Request.findById(id).exec();

    if (requestResult) {
      requestResult.isdone = true;

      const updatedrequest = await requestResult.save();

      if (updatedrequest) {
        return NextResponse.json(
          { message: `Request ${requestResult._id} Approved!` },
          { status: 201 }
        );
      } else {
        return NextResponse.json({ message: "Invalid Update" }, { status: 400 });
      }
    } else {
        return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }
  } catch (error) {
      console.error(error);
      return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}