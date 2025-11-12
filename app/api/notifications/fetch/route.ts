import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      include: {
        loan: {
          include: {
            book: {
              select: {
                title: true,
                author: true,
                imgUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({ 
      success: true, 
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('[FETCH_NOTIFICATIONS_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
