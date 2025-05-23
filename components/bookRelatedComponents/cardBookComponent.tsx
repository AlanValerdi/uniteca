"use client"

import { FaRegSmile } from "react-icons/fa";
import { Card, CardContent } from "../ui/card";
import { CgSmileNeutral, CgSmileSad } from "react-icons/cg";
import { Button } from "../ui/button";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { BookOpen, Calendar, User } from "lucide-react";
import { Badge } from "../ui/badge";
import { Book } from "@/types/book"
import { redirect } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

type Props = {
    book: Book
}

const statusMap = {
    Good: {
      icon: <FaRegSmile />,
      text: "Excelente",
      color: "text-green-600 dark:text-green-400",
    },
    Normal: {
      icon: <CgSmileNeutral />,
      text: "Normal",
      color: "text-yellow-600 dark:text-yellow-400",
    },
    Damaged: {
      icon: <CgSmileSad />,
      text: "Dañado",
      color: "text-red-600 dark:text-red-400",
    },
};

function setAvailability(isAvailable: boolean) {
    if (!isAvailable) {
        return "Sin entidades"
    }

    return "Disponible"
}

function setState(bookstatus: string) {
    const state = statusMap[bookstatus as keyof typeof statusMap];
    if (!state) return <span className="text-muted-foreground">Unknown state</span>;
  
    return (
      <span className={`inline-flex items-center gap-1 ${state.color}`}>
        {state.icon}
        {state.text}
      </span>
    );
}



export default function CardBookComponent({ book }: Props){
    // using state 
    const [isDialogOpen, setIsDialogOpen] = useState(false)


    const handleBorrow = async () => {
        const res = await fetch("/api/request-loan", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId: book.id }),
        })
    
        const data = await res.json()
    
        if (data.success) {
            toast.success("La solicitud fue envíada correctamente", {
                description: (
                    <>
                    Ve a la pagina de {<Link href={"loans"} className="underline">Prestamos</Link>} o {<Link href={"loans"} className="underline">haz click aquí</Link>}
                    </>
                ),
            })
        } else if (res.status == 401){
            redirect("/signIn")
        }else {
            toast.error("Hubo un error en tu solicitud", {
                description: data.error,    
            })
        }
    }

    return(
        <>
            <Card className="max-w-sm rounded-lg overflow-hidden shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl focus-within:scale-[1.02] focus-within:shadow-xl">
                <div className="relative aspect-[3/4] bg-muted">
                    <Image
                        src= { book.imgUrl}
                        alt = "Book cover"
                        fill
                        
                    />
                </div>
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-[18px] font-semibold line-clamp-1">{ book.title }</h3>
                        <p className="text-muted-foreground">{ book.author }</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Disponibilidad</p>
                            <p className="text-base">{ setAvailability(book.available) }</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-sm font-medium">Estado del libro</p>
                            <p className="text-base font-semibold">{ setState(book.state) }</p>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 pt-2">
                            <Button className="px-4 bg-[rgb(33,101,114)] cursor-pointer" onClick={handleBorrow}>Solicitar</Button>

                            <Button className="px-4 cursor-pointer" variant="outline" onClick={() => setIsDialogOpen(true)}>Mostrar más</Button>
                    </div>
                </CardContent>
            </Card>

            {/* // setting dialog */}
            <Dialog open={ isDialogOpen } onOpenChange={setIsDialogOpen}>
                <DialogContent className="w-[90vw] sm:w-[800px] md:max-w-3xl max-h-[90vh] overflow-y-auto sm:rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{book.title}</DialogTitle>
                        <DialogDescription className="text-base">Por: {book.author}</DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                        <div className="relative aspect-[3/4] col-span-1">
                            <Image
                                src={book.imgUrl}
                                alt={`Cover of ${book.title}`}
                                fill
                                className="object-cover rounded-md"
                                priority
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-4">
                            <div className="space-y-2">
                                <h4 className="font-semibold">Descripción</h4>
                                <p>{ book.description }</p>
                            </div>
                        
                            <Separator/>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{book.publishedYear} </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{book.pages}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{book.language == "English" ?(
                                        <>Inglés</>
                                    ) : book.language == "Spanish" ? (
                                        <>Español</>
                                    ) : book.language }</span>  
                                </div>
                                <div>
                                    <Badge variant="secondary">{book.genre} </Badge>
                                </div>
                            </div>

                            <Separator/>
                            
                            <Button className="px-4 bg-[rgb(33,101,114)] cursor-pointer" onClick={handleBorrow}>Solicitar</Button>


                        </div>
                    </div>
                </DialogContent>

            </Dialog>
        </>
    );
}

