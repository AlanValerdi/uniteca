import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';

export async function DELETE(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const loanId = searchParams.get('loanId');

  if (!loanId) {
    return NextResponse.json({ error: "Missing loanId" }, { status: 400 });
  }

  try {
    await prisma.loan.delete({
      where: {
        id: loanId,
        borrowerId: session.user.id,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    console.log(NextResponse.json({ error: "Error deleting loan in this point" }, { status: 500 })) ;
  }
}
