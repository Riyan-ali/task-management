import db from "@/lib/db";
import Task from "@/models/Task";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import { options } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse(
      JSON.stringify({
        message: "User not authenticated",
        success: false,
      }),
      { status: 400 }
    );
  }

  try {
    await db.connectDb();

    const user = await User.findById(id);
    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
          success: false,
        }),
        { status: 404 }
      );
    }

    const tasks = await Task.find({ user: id });

    await db.disconnectDb();
    return new NextResponse(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}

export async function POST(req) {
  const { data } = await req.json();
  const { title, description, dueDate, status, priority } = data;

  if (!title || !dueDate || !status || !priority) {
    return new NextResponse(
      JSON.stringify({
        message: "Please enter all required fields",
        success: false,
      }),
      { status: 400 }
    );
  }

  try {
    await db.connectDb();

    // Get the authenticated user session
    const session = await getServerSession(options);
    if (!session || !session.user) {
      return new NextResponse(
        JSON.stringify({
          message: "Unauthorized",
          success: false,
        }),
        { status: 401 }
      );
    }

    // Find the user in the database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
          success: false,
        }),
        { status: 404 }
      );
    }

    // Create a new task
    const newTask = new Task({
      user: user._id,
      title,
      description,
      dueDate,
      status,
      priority,
    });

    await newTask.save();

    const tasks = await Task.find({ user: user._id });

    return new NextResponse(
      JSON.stringify({
        message: "Task created successfully",
        success: true,
        data: tasks,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Server error",
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse(
      JSON.stringify({
        message: "Task ID is required",
        success: false,
      }),
      { status: 400 }
    );
  }

  try {
    await db.connectDb();

    // Get the authenticated user session
    const session = await getServerSession(options);
    if (!session || !session.user) {
      return new NextResponse(
        JSON.stringify({
          message: "Unauthorized",
          success: false,
        }),
        { status: 401 }
      );
    }

    // Find the user in the database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
          success: false,
        }),
        { status: 404 }
      );
    }

    // Parse request body
    const { data } = await req.json();
    const { title, description, dueDate, status, priority } = data;

    if (!title || !dueDate || !status || !priority) {
      return new NextResponse(
        JSON.stringify({
          message: "Please enter all required fields",
          success: false,
        }),
        { status: 400 }
      );
    }

    // Find and update the task
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: user._id },
      { title, description, dueDate, status, priority },
      { new: true }
    );

    if (!updatedTask) {
      return new NextResponse(
        JSON.stringify({
          message: "Task not found or unauthorized",
          success: false,
        }),
        { status: 404 }
      );
    }

    // Fetch the updated task list after update
    const tasks = await Task.find({ user: user._id });

    return new NextResponse(
      JSON.stringify({
        message: "Task updated successfully",
        success: true,
        data: tasks,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Server error",
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse(
      JSON.stringify({
        message: "Task ID is required",
        success: false,
      }),
      { status: 400 }
    );
  }

  try {
    await db.connectDb();

    // Get the authenticated user session
    const session = await getServerSession(options);
    if (!session || !session.user) {
      return new NextResponse(
        JSON.stringify({
          message: "Unauthorized",
          success: false,
        }),
        { status: 401 }
      );
    }

    // Find the user in the database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
          success: false,
        }),
        { status: 404 }
      );
    }

    // Find and delete the task
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return new NextResponse(
        JSON.stringify({
          message: "Task not found or unauthorized",
          success: false,
        }),
        { status: 404 }
      );
    }

    // Fetch the updated task list after deletion
    const tasks = await Task.find({ user: user._id });

    return new NextResponse(
      JSON.stringify({
        message: "Task deleted successfully",
        success: true,
        data: tasks,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Server error",
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
