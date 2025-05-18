import { prisma } from '../lib/db';

async function testDatabase() {
  try {
    console.log('Testing database connection...');

    // Test 1: Create a user
    console.log('\nTest 1: Creating a user...');
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        phone: '+1234567890',
      },
    });
    console.log('User created:', user);

    // Test 2: Create a notification
    console.log('\nTest 2: Creating a notification...');
    const notification = await prisma.notification.create({
      data: {
        type: 'EMAIL',
        subject: 'Test Notification',
        message: 'This is a test notification',
        status: 'PENDING',
        userId: user.id,
      },
    });
    console.log('Notification created:', notification);

    // Test 3: Query notifications
    console.log('\nTest 3: Querying notifications...');
    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    console.log('Found notifications:', notifications);

    // Test 4: Update notification status
    console.log('\nTest 4: Updating notification status...');
    const updatedNotification = await prisma.notification.update({
      where: { id: notification.id },
      data: { status: 'SENT' },
    });
    console.log('Updated notification:', updatedNotification);

    // Test 5: Delete test notification
    console.log('\nTest 5: Cleaning up test data...');
    await prisma.notification.delete({
      where: { id: notification.id },
    });
    console.log('Test notification deleted');

    console.log('\nAll database tests completed successfully!');
  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 