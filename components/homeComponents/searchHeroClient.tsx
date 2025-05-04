"use client";

import { useEffect, useMemo, useState } from "react";
import { BookXIcon, Search } from "lucide-react";
import CardBookComponent from "../bookRelatedComponents/cardBookComponent";
import { Book } from "@/types/book";
import { motion } from "framer-motion";

export default function SearchHeroClient({ defaultBooks }: { defaultBooks: Book[] }) {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>(defaultBooks);

  const basePlaceholder = "Busca por";
  const changingWords = useMemo(() => ["Autor", "Género", "Título"], []);
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedWord, setDisplayedWord] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fullWord, setFullWord] = useState(changingWords[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = changingWords[wordIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayedWord.length < word.length) {
      timer = setTimeout(() => {
        setDisplayedWord(word.slice(0, displayedWord.length + 1));
      }, 100);
    } else if (isDeleting && displayedWord.length > 0) {
      timer = setTimeout(() => {
        setDisplayedWord(word.slice(0, displayedWord.length - 1));
      }, 60);
    } else {
      timer = setTimeout(() => {
        setIsDeleting(!isDeleting);
        if (!isDeleting) {
          setFullWord(changingWords[wordIndex]);
        } else {
          setWordIndex((prev) => (prev + 1) % changingWords.length);
        }
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [displayedWord, isDeleting, wordIndex, changingWords]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setBooks(data.books);
  };

  return (
    <>
      <div className="flex sm:flex-row flex-col gap-5 w-full mx-auto max-w-lg">
        <form
          onSubmit={handleSearch}
          className="py-1 pl-6 w-full pr-1 flex gap-3 items-center text-gray-600 dark:text-gray-400 shadow-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 rounded-full"
        >
          <input
            type="text"
            placeholder={`${basePlaceholder} ${displayedWord}`}
            className="w-full py-3 outline-none bg-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="flex text-white justify-center items-center w-max px-6 h-12 rounded-full bg-[rgb(33,101,114)] cursor-pointer">
            <Search />
          </button>
        </form>
        
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto px-4 py-6">
        
        { books.length == 0 ? (
            <div className="flex flex-col items-center justify-center text-center col-span-full">
              <BookXIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-lg">
              Aún no contamos con tu libro, mantente al pendiente para futuras actualizaciones
              </p>
            </div>
          
        ): (
            books.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                  duration: 0.5,
                  delay: index * 0.15, 
                  ease: "easeOut",
                  }}
                >
                <CardBookComponent key={book.id} book={book} />
                </motion.div>
            ))
        )}
      </div>
    </>
  );
}
