import { NextResponse } from "next/server"
import { NotificationService } from "@/lib/notification-service"
import { db } from "@/lib/db"
import { NOTIFICATION_TYPES } from "@/lib/constants"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, type, subject, message } = body

    // Validate required fields
    if (!userId || !type || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate notification type
    if (!Object.values(NOTIFICATION_TYPES).includes(type)) {
      return NextResponse.json({ error: "Invalid notification type" }, { status: 400 })
    }

    const notification = await NotificationService.sendNotification({
      userId,
      type,
      subject,
      message,
    })

    // Store notification in database

    // TODO: Implement email and SMS sending based on type
    if (type === "EMAIL") {
      // Implement email sending
    } else if (type === "SMS") {
      // Implement SMS sending
    }

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
