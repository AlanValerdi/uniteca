import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/auth';
import getAdmin from '@/app/actions/getAdmin';
import { createNotification, getNotificationContent } from '@/lib/createNotification';

export async function PATCH(req: Request) {
  const session = await auth();
  const admin = await getAdmin();

  if (!session || admin?.role !== "admin") {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const loanId = searchParams.get('loanId');

  if (!loanId) {
    return NextResponse.json({ error: 'Missing loanId' }, { status: 400 });
  }

  try {
    const loan = await prisma.loan.findUnique({ 
      where: { id: loanId },
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

    if (!loan) {
      return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
    }

    if(loan.status !== "approved"){
        return NextResponse.json({ error: 'You cannot return a book if it is not approved' }, { status: 400 });
    }

    const returnDate = new Date(); 

    await prisma.loan.update({
      where: { id: loanId },
      data: {
        returnDate: returnDate,
        status: "returned"
      },
    });

    // Update book availability to true when returned
    await prisma.book.update({
      where: { id: loan.bookId },
      data: {
        available: true
      },
    });

    // Create notification for the borrower
    const { title, message } = getNotificationContent('LOAN_RETURNED', loan.book.title);
    await createNotification({
      userId: loan.borrower.id,
      type: 'LOAN_RETURNED',
      title,
      message,
      loanId: loan.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to return the book' }, { status: 500 });
  }
}
