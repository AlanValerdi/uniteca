// app/api/request-loan/route.ts
import { NextResponse } from 'next/server'

import { auth } from '@/auth' // Asegúrate de importar desde donde tengas tu configuración de auth()
import { prisma } from '@/app/lib/prisma'


export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    
    
    
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    
  }

  const borrowerId = session.user.id
  const { bookId } = await req.json()

  if (!bookId) {
    return NextResponse.json({ success: false, error: 'Missing bookId' }, { status: 400 })
  }

  try {
    const existingLoan = await prisma.loan.findFirst({
        where: {
            bookId,
            borrowerId,
        },
    })

    const availability = await prisma.book.findUnique({
        where: {
            id: bookId,
        },
        select: {
            available: true,
        },
    })

    if (availability?.available === false) {
        return NextResponse.json({ success: false, error: 'This book is out of stock' }, { status: 400 })
    }

    if (existingLoan){
        return NextResponse.json({ success: false, error: "You can't borrow the same book twice" }, { status: 400})
    }

    const loan = await prisma.loan.create({
      data: {
        bookId,
        borrowerId,
      },
    })

    return NextResponse.json({ success: true, loan })
  } catch (error) {
    console.error('[REQUEST_LOAN_ERROR]', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
