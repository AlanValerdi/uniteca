import getSuggestData from "@/app/actions/suggestedBooks";
import SearchHeroClient from "./searchHeroClient";
import { Session } from "next-auth";

export default async function HeroSection({ session }: { session: Session | null }) {
    const books = await getSuggestData();
  
    return (
      <section className="min-h-screen bg-white dark:bg-gray-950">
        <div className="w-full flex items-center relative">
          <div className="min-h-max relative mx-auto pt-32 lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 text-center space-y-10">
            <h1 className="text-gray-900 dark:text-white mx-auto max-w-5xl font-semibold text-4xl/tight sm:text-5xl/tight lg:text-6xl/tight">
              El conocimiento empieza por la curiosidad.
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mx-auto max-w-2xl">
              Busca, renta, y explora los libros que te interesen accediendo a la bilbioteca online universitaria.
            </p>
            
  
            {/* Reemplazar búsqueda aquí */}
            <SearchHeroClient defaultBooks={books} session={session} />

          </div>
            
        </div>
      </section>
    );
  }