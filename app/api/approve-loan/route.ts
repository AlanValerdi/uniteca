import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { auth } from '@/auth';
import getAdmin from '@/app/actions/getAdmin';


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
    await prisma.loan.update({
      where: { id: loanId },
      data: {
        status: 'approved',
        // borrowDate: new Date(), changed to act as the renewDate, forgot to add the correct field
        dueDate: new Date(new Date().setDate(new Date().getDate() + 14)), 
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to approve loan' }, { status: 500 });
  }
}
