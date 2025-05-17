import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { db } from "@/lib/db"
import { emitNotification } from "@/lib/socket-server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, type, subject, message } = body

    // Validate required fields
    if (!userId || !type || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate notification type
    if (!["EMAIL", "SMS", "IN_APP"].includes(type)) {
      return NextResponse.json({ error: "Invalid notification type" }, { status: 400 })
    }

    // Create notification
    const notification = {
      id: uuidv4(),
      userId,
      type,
      subject: subject || undefined,
      message,
      timestamp: new Date().toISOString(),
    }

    // Store notification
    db.notifications.push(notification)

    // Emit real-time notification if it's an in-app notification
    if (type === "IN_APP") {
      emitNotification(notification)
    }

    return NextResponse.json({ message: "Notification sent successfully", notification }, { status: 201 })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
