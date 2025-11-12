import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';

export async function PATCH() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  try {
    const result = await prisma.notification.updateMany({
      where: { 
        userId,
        read: false,
      },
      data: { 
        read: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      count: result.count,
    });
  } catch (error) {
    console.error('[MARK_ALL_READ_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark all notifications as read' },
      { status: 500 }
    );
  }
}
