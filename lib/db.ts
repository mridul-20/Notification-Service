// Simple in-memory database for notifications
// In a real application, this would be replaced with a proper database

type Notification = {
  id: string
  userId: string
  type: "EMAIL" | "SMS" | "IN_APP"
  subject?: string
  message: string
  timestamp: string
}

// In-memory database
export const db = {
  notifications: [] as Notification[],
}

// Seed some initial data
const seedData = () => {
  const now = new Date()

  db.notifications = [
    {
      id: "1",
      userId: "user1",
      type: "EMAIL",
      subject: "Welcome to our platform",
      message: "Thank you for joining our platform. We're excited to have you on board!",
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    },
    {
      id: "2",
      userId: "user1",
      type: "SMS",
      subject: "Account verification",
      message: "Your verification code is 123456. It will expire in 10 minutes.",
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    },
    {
      id: "3",
      userId: "user1",
      type: "IN_APP",
      message: "You have a new message from the admin.",
      timestamp: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
      id: "4",
      userId: "user2",
      type: "EMAIL",
      subject: "Your subscription is expiring",
      message: "Your subscription will expire in 3 days. Renew now to avoid service interruption.",
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    },
  ]
}

// Seed the database
seedData()
