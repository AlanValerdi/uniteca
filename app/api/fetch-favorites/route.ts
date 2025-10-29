import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId,
      },
      select: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            genre: true,
            language: true,
            pages: true,
            publishedYear: true,
            description: true,
            imgUrl: true,
            available: true,
            state: true,
          },
        },
      },
    });

    // Extract books from favorites
    const books = favorites.map((fav: typeof favorites[number]) => fav.book);

    return NextResponse.json({ success: true, books });
  } catch (error) {
    console.error('[FETCH_FAVORITES_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}
