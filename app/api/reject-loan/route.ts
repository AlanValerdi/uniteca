import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/auth';
import getAdmin from '@/app/actions/getAdmin';
import { createNotification, getNotificationContent } from '@/lib/createNotification';

export async function PATCH(req: Request) {
  const session = await auth();
  const admin = await getAdmin();

  if (!session || admin?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const loanId = searchParams.get('loanId');

  if (!loanId) {
    return NextResponse.json({ error: 'Missing loanId' }, { status: 400 });
  }

  try {
    const loan = await prisma.loan.update({
      where: { id: loanId },
      data: {
        status: 'rejected',
      },
      include: {
        book: {
          select: {
            title: true,
          },
        },
        borrower: {
          select: {
            id: true,
          },
        },
      },
    });

    // Create notification for the borrower
    const { title, message } = getNotificationContent('LOAN_REJECTED', loan.book.title);
    await createNotification({
      userId: loan.borrower.id,
      type: 'LOAN_REJECTED',
      title,
      message,
      loanId: loan.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to reject loan' }, { status: 500 });
  }
}
