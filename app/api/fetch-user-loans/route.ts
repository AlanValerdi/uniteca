import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Fetch loans for the authenticated user
    const loans = await prisma.loan.findMany({
      where: {
        borrowerId: userId,
      },
      select: {
        id: true,
        requestDate: true,
        dueDate: true,
        status: true,
        book: {
          select: {
            title: true,
            author: true,
            imgUrl: true,
            genre: true,
            language: true,
            state: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, loans });
  } catch (error) {
    console.error('[GET_USER_LOANS_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}