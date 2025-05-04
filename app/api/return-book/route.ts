import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/auth';
import getAdmin from '@/app/actions/getAdmin';

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
    const loan = await prisma.loan.findUnique({ where: { id: loanId } });

    const approved = await prisma.loan.findUnique({
        where: {
            id: loanId
        },
        select:{
            status: true
        }
    });


    if(approved?.status !== "approved"){
        return NextResponse.json({ error: 'You cannot return a book if it is not approved' }, { status: 400 });
    }

    if (!loan) {
      return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
    }

  
    const returnDate = new Date(); 

    await prisma.loan.update({
      where: { id: loanId },
      data: {
        returnDate: returnDate,
        status: "returned"
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to return the book' }, { status: 500 });
  }
}
