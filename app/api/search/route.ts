// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q');

  if (!query) {
    return NextResponse.json({ books: [] });
  }

  const books = await prisma.book.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { author: { contains: query, mode: 'insensitive' } },
        { genre: { contains: query, mode: 'insensitive' } },
      ],
    },
  });

  return NextResponse.json({ books });
}
