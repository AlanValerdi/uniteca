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
        return NextResponse.json({ error: 'You cannot renew a loan if it is not approved' }, { status: 400 });
    }

    const newDueDate = new Date(loan.dueDate!);
    const renewDate = new Date(loan.borrowDate!);

    newDueDate.setDate(newDueDate.getDate() + 14); // Extending 14 more days
    renewDate.setDate(renewDate.getDate())  

    await prisma.loan.update({
      where: { id: loanId },
      data: {
        dueDate: newDueDate,
        borrowDate: renewDate,
      },
    });

    // Create notification for the borrower
    const { title, message } = getNotificationContent('LOAN_RENEWED', loan.book.title);
    await createNotification({
      userId: loan.borrower.id,
      type: 'LOAN_RENEWED',
      title,
      message,
      loanId: loan.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to renew loan' }, { status: 500 });
  }
}
