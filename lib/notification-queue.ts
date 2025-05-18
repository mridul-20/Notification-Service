import { Notification } from './db';
import { NotificationService } from './notification-service';

interface QueuedNotification {
  notification: Notification;
  retryCount: number;
  lastAttempt: Date;
}

class NotificationQueue {
  private queue: QueuedNotification[] = [];
  private processing = false;
  private maxRetries = 3;
  private retryDelay = 5000; // 5 seconds

  async add(notification: Notification) {
    this.queue.push({
      notification,
      retryCount: 0,
      lastAttempt: new Date(),
    });
    this.process();
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const item = this.queue[0];

    try {
      await NotificationService.processNotification(item.notification);
      this.queue.shift(); // Remove processed item
    } catch (error) {
      console.error('Error processing notification:', error);
      
      if (item.retryCount < this.maxRetries) {
        // Move to end of queue for retry
        item.retryCount++;
        item.lastAttempt = new Date();
        this.queue.push(this.queue.shift()!);
        
        // Wait before next retry
        setTimeout(() => this.process(), this.retryDelay);
      } else {
        // Max retries reached, remove from queue
        this.queue.shift();
        console.error('Max retries reached for notification:', item.notification.id);
      }
    }

    this.processing = false;
    if (this.queue.length > 0) {
      this.process();
    }
  }

  getQueueLength() {
    return this.queue.length;
  }

  getQueueStatus() {
    return this.queue.map(item => ({
      id: item.notification.id,
      type: item.notification.type,
      retryCount: item.retryCount,
      lastAttempt: item.lastAttempt,
    }));
  }
}

export const notificationQueue = new NotificationQueue(); 