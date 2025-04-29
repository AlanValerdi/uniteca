import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';
import getAdmin from '@/app/actions/getAdmin';

export async function GET() {
  const session = await auth();
  const admin = await getAdmin();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (admin?.role !== "admin"){
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    // Fetch all loans
    const loans = await prisma.loan.findMany({
      select: {
        id: true,
        requestDate: true,
        dueDate: true,
        status: true,
        borrowDate: true,
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
        borrower: {
          select: {
            name: true,
            image: true,
            email: true,
          }
        },
      },
    });

    return NextResponse.json({ success: true, loans });
  } catch (error) {
    console.error('[GET_USER_LOANS_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}