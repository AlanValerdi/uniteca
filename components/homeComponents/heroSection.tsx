import getSuggestData from "@/app/actions/suggestedBooks";
import SearchHeroClient from "./searchHeroClient";

export default async function HeroSection() {
    const books = await getSuggestData();
  
    return (
      <section className="min-h-screen bg-white dark:bg-gray-950">
        <div className="w-full flex items-center relative">
          <div className="min-h-max relative mx-auto pt-32 lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 text-center space-y-10">
            <h1 className="text-gray-900 dark:text-white mx-auto max-w-5xl font-semibold text-4xl/tight sm:text-5xl/tight lg:text-6xl/tight">
              Knowledge starts with curiosity.
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mx-auto max-w-2xl">
              Search, rent, and explore the books that shape your learning journey by accessing the university&apos;s digital library.
            </p>
            
  
            {/* Reemplazar búsqueda aquí */}
            <SearchHeroClient defaultBooks={books} />

          </div>
            
        </div>
      </section>
    );
  }