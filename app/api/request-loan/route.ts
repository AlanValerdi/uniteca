// app/api/request-loan/route.ts
import { NextResponse } from 'next/server'

import { auth } from '@/auth' // Asegúrate de importar desde donde tengas tu configuración de auth()
import { prisma } from '@/app/lib/prisma'
import { admin } from '@/lib/admin'


export async function POST(req: Request) {
  const session = await auth()
  const adminUser = await admin()

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    
  }

  const borrowerId = session.user.id
  const { bookId } = await req.json()

  if (!bookId) {
    return NextResponse.json({ success: false, error: 'Missing bookId' }, { status: 400 })
  }


  try {
    // Check if user has an active loan (pending or approved) for this book
    const existingActiveLoan = await prisma.loan.findFirst({
      where: {
        bookId,
        borrowerId,
        status: {
          in: ["pending", "approved"], // Only block if pending or approved
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
    
    if (availability?.available === false) {
      return NextResponse.json({ success: false, error: 'El libro no está disponible' }, { status: 400 })
    }
    
    if (existingActiveLoan){
      return NextResponse.json({ success: false, error: "Ya tienes un préstamo activo para este libro" }, { status: 400})
    }

    if (adminUser?.role === "admin") {
      return NextResponse.json({success : false, error: "El administrador no puede adquirir un libro"}, {status: 400});
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
