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
    const isReturned = await prisma.loan.findFirst({
      where: {
        bookId,// id: bookId,
        borrowerId,   
      },select: {
        status: true,
      }, 
    })

    
    const existingLoan = await prisma.loan.findFirst({
    where: {
      bookId,
      borrowerId,
      status: {
        not: "returned", // Ensure the loan is not already returned
      },
    },
    });

    const availability = await prisma.book.findUnique({
        where: {
            id: bookId,
        },
        select: {
            available: true,
        },
    })
    
    if (isReturned && isReturned.status !== 'returned') {
      return NextResponse.json({ success: false, error: 'El libro aún no ha sido devuelto' }, { status: 400 });
    }

    if (availability?.available === false) {
        return NextResponse.json({ success: false, error: 'El libro no está disponible' }, { status: 400 })
    }

    if (existingLoan){
        return NextResponse.json({ success: false, error: "No puedes pedir un libro dos veces" }, { status: 400})
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
