import { auth } from "@/auth";
import DynamicNavbar from "@/components/homeComponents/dynamicNavBar";
import FavoritesSection from "@/components/homeComponents/favoritesSection";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signIn");
  }

  return (
    <>
      <DynamicNavbar session={session} />
      <section className="w-full py-30">
        <div className="mx-auto px-5 sm:px-10 md:px-12 lg:px-5 pt-8 pb-12 lg:max-w-7xl">
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Mis Favoritos
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Libros que has marcado como favoritos
              </p>
            </div>

            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(33,101,114)]"></div>
                </div>
              }
            >
              <FavoritesSection />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
