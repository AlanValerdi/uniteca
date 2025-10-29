import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userId = session.user.id;
  const { bookId } = await req.json();

  if (!bookId) {
    return NextResponse.json(
      { success: false, error: 'Missing bookId' },
      { status: 400 }
    );
  }

  try {
    // Check if favorite already exists
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    let isFavorited = false;

    if (existingFavorite) {
      // Remove favorite
      await prisma.favorite.delete({
        where: {
          userId_bookId: {
            userId,
            bookId,
          },
        },
      });
      isFavorited = false;
    } else {
      // Add favorite
      await prisma.favorite.create({
        data: {
          userId,
          bookId,
        },
      });
      isFavorited = true;
    }

    return NextResponse.json({ success: true, isFavorited });
  } catch (error) {
    console.error('[ADD_FAVORITE_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update favorite' },
      { status: 500 }
    );
  }
}
