// Simple in-memory database for notifications
// In a real application, this would be replaced with a proper database

import { NotificationType, NotificationStatus } from './constants';
import { PrismaClient } from '../lib/generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export type Notification = {
  id: string
  userId: string
  type: NotificationType
  subject?: string
  message: string
  status: NotificationStatus
  timestamp: string
}

// In-memory database
export const db = {
  notifications: [] as Notification[],
  users: [] as { id: string; email: string; phone?: string }[],
}

// Seed function to create initial data
export async function seedDatabase() {
  try {
    // Create a test user if it doesn't exist
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        phone: '+1234567890',
      },
    });

    // Create some initial notifications
    const notifications = [
      {
        type: 'EMAIL',
        subject: 'Welcome to Notification Service',
        message: 'Thank you for using our notification service!',
        status: 'SENT',
        userId: user.id,
      },
      {
        type: 'SMS',
        message: 'Your account has been created successfully.',
        status: 'SENT',
        userId: user.id,
      },
      {
        type: 'IN_APP',
        subject: 'New Feature Available',
        message: 'Check out our new notification features!',
        status: 'PENDING',
        userId: user.id,
      },
    ];

    for (const notification of notifications) {
      await prisma.notification.create({
        data: notification,
      });
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
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
      status: "PENDING",
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    },
    {
      id: "2",
      userId: "user1",
      type: "SMS",
      subject: "Account verification",
      message: "Your verification code is 123456. It will expire in 10 minutes.",
      status: "PENDING",
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    },
    {
      id: "3",
      userId: "user1",
      type: "IN_APP",
      message: "You have a new message from the admin.",
      status: "PENDING",
      timestamp: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
      id: "4",
      userId: "user2",
      type: "EMAIL",
      subject: "Your subscription is expiring",
      message: "Your subscription will expire in 3 days. Renew now to avoid service interruption.",
      status: "PENDING",
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    },
  ]
}

// Seed the database
seedData()
