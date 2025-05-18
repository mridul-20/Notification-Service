import { NotificationType, NotificationStatus } from './constants';
import { emitNotification } from './socket-server';
import { config } from './config';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { prisma } from './db';
import { notificationQueue } from './notification-queue';

export class NotificationService {
  private static emailClient: nodemailer.Transporter;
  private static smsClient: ReturnType<typeof twilio>;

  static initialize() {
    // Initialize Nodemailer
    if (config.email.auth.user && config.email.auth.pass) {
      this.emailClient = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
          user: config.email.auth.user,
          pass: config.email.auth.pass,
        },
      });
    }

    // Initialize Twilio
    if (config.sms.accountSid && config.sms.authToken) {
      this.smsClient = twilio(config.sms.accountSid, config.sms.authToken);
    }
  }

  static async sendNotification(notification: {
    userId: string;
    type: NotificationType;
    subject?: string;
    message: string;
  }) {
    // Create notification in database
    const newNotification = await prisma.notification.create({
      data: {
        type: notification.type,
        subject: notification.subject,
        message: notification.message,
        status: 'PENDING',
        userId: notification.userId,
      },
    });

    // Queue the notification for processing
    await notificationQueue.add({
      id: newNotification.id,
      userId: newNotification.userId,
      type: newNotification.type as NotificationType,
      subject: newNotification.subject || undefined,
      message: newNotification.message,
      status: newNotification.status as NotificationStatus,
      timestamp: newNotification.createdAt.toISOString(),
    });

    return newNotification;
  }

  static async processNotification(notification: {
    id: string;
    userId: string;
    type: NotificationType;
    subject?: string;
    message: string;
    status: NotificationStatus;
    timestamp: string;
  }) {
    try {
      switch (notification.type) {
        case 'EMAIL':
          await this.sendEmail(notification);
          break;
        case 'SMS':
          await this.sendSMS(notification);
          break;
        case 'IN_APP':
          emitNotification(notification);
          break;
      }

      // Update status to SENT
      await prisma.notification.update({
        where: { id: notification.id },
        data: { status: 'SENT' },
      });
    } catch (error) {
      console.error(`Error sending ${notification.type} notification:`, error);
      // Update status to FAILED
      await prisma.notification.update({
        where: { id: notification.id },
        data: { status: 'FAILED' },
      });
      throw error;
    }
  }

  private static async sendEmail(notification: {
    userId: string;
    subject?: string;
    message: string;
  }) {
    if (!this.emailClient) {
      throw new Error('Email service is not configured');
    }

    const user = await prisma.user.findUnique({
      where: { id: notification.userId },
    });

    if (!user?.email) {
      throw new Error('User email not found');
    }

    const mailOptions = {
      from: config.email.from,
      to: user.email,
      subject: notification.subject || 'Notification',
      text: notification.message,
      html: `<p>${notification.message}</p>`,
    };

    await this.emailClient.sendMail(mailOptions);
  }

  private static async sendSMS(notification: {
    userId: string;
    message: string;
  }) {
    if (!this.smsClient) {
      throw new Error('Twilio is not configured');
    }

    const user = await prisma.user.findUnique({
      where: { id: notification.userId },
    });

    if (!user?.phone) {
      throw new Error('User phone number not found');
    }

    await this.smsClient.messages.create({
      body: notification.message,
      from: config.sms.from,
      to: user.phone,
    });
  }
}

// Initialize the service
NotificationService.initialize();