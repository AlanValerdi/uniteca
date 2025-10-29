import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import CardBookComponent from "../bookRelatedComponents/cardBookComponent";
import { redirect } from "next/navigation";
import { BookXIcon } from "lucide-react";

export default async function FavoritesSection() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signIn");
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
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

    const books = favorites.map((fav) => fav.book);

    return (
      <div className="w-full">
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <BookXIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold text-muted-foreground">
              No tienes libros favoritos aún
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Explora libros y añade tus favoritos haciendo click en el corazón
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <CardBookComponent key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("[FETCH_FAVORITES_ERROR]", error);
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <p className="text-lg font-semibold text-red-500">
          Error cargando favoritos
        </p>
      </div>
    );
  }
}
