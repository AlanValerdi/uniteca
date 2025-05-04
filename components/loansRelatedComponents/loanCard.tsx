'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { Separator } from '../ui/separator';
import { LoanStatusBadge } from './loanStatusBadge';
import { Badge } from '../ui/badge';
import { FaRegSmile } from 'react-icons/fa';
import { CgSmileNeutral, CgSmileSad } from 'react-icons/cg';
import { BookXIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import LoanSkeleton from './loanSkeleton';
import { motion } from "framer-motion";


type LoanStatus = 'pending' | 'approved' | 'rejected' | "returned";

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

interface Loan {
  id: string;
  requestDate: string;
  dueDate: string | null;
  status: LoanStatus;
  book: {
    title: string;
    author: string;
    imgUrl: string;
    genre: string;
    language: string;
    state: string;
  };
}

function setState(bookstatus: string) {
    const state = statusMap[bookstatus as keyof typeof statusMap];
    if (!state) return <span className="text-muted-foreground">Estado desconocido</span>;
  
    return (
      <span className={`inline-flex items-center gap-1 ${state.color}`}>
        {state.icon}
        {state.text}
      </span>
    );
}                   

export default function LoansList() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetching user loans
  useEffect(() => {
    async function fetchLoans() {
      try {
        const response = await fetch('/api/fetch-user-loans');
        const data = await response.json();

        if (response.ok) {
          setLoans(data.loans);
        } else {
          setError(data.error || 'Failed to fetch loans');
        }
      } catch (err) {
        console.error('Error fetching loans:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchLoans();
  }, []);

  // calling delete endpoint
  const deleteLoan = async (loanId: string) => {
    try {
      const res = await fetch(`/api/delete-loan?loanId=${loanId}`, {
        method: "DELETE",
      });
      
      const data = await res.json();
  
      if (!res.ok) {
        toast.error("Hubo un error en tu solicitud", {
          description: data.error,    
        })
      }
  
      setLoans((prevLoans) => prevLoans.filter((loan) => loan.id !== loanId));
      toast.success("Préstamo cancelado correctamente", {
        description: "Quizás querías algún otro libro",
      })

    } catch (error) {
      console.error('Error cancelando el préstamo:', error);
    }
  };
  
 

  if (loading) {
    return <LoanSkeleton/>
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

    return(
        <div>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
            {loans.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-100 px-4 text-center">
                <BookXIcon className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">¡Aún no tienes prestamos!</h3>
                <p className="text-muted-foreground max-w-md">Búsca tu libro favorita y solivita un préstamo, aparecerá aquí.</p>
            </div>
            ) : (
            <div className="container mx-auto px-4 py-40 md:px-20 md:py-10 lg:px-38 lg:py-40">
            <h1 className="text-3xl font-bold mb-6">Tus préstamos</h1>
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4 overflow-x-auto whitespace-nowrap max-w-full scrollbar-hide">
                    <TabsTrigger value="all" className='cursor-pointer'>Todos ({loans.length})</TabsTrigger>
                    <TabsTrigger value="pending" className='cursor-pointer'>Pendientes({loans.filter((loan) => loan.status === 'pending').length})</TabsTrigger>
                    <TabsTrigger value="approved" className='cursor-pointer'>Aprobados({loans.filter((loan) => loan.status === 'approved').length})</TabsTrigger>
                    <TabsTrigger value="rejected" className='cursor-pointer'>Rechazados({loans.filter((loan) => loan.status === 'rejected').length})</TabsTrigger>
                    <TabsTrigger value="returned" className='cursor-pointer'>Devueltos({loans.filter((loan) => loan.status === 'returned').length})</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                     <>
                        { loans.map((loan, index) => 
                            <motion.div
                                key={loan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                duration: 0.5,
                                delay: index * 0.15, 
                                ease: "easeOut",
                                }}
                            >
                                <LoadCard loan={loan} deleteLoan={deleteLoan}  />
                            </motion.div>
                        
                        )}
                    </>
                </TabsContent>
                <TabsContent value="pending" className="space-y-4">
                   <>
                        { loans.filter((loan)=> loan.status == "pending").
                        map((loan, index) => 
                            <motion.div
                                key={loan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                duration: 0.5,
                                delay: index * 0.15, 
                                ease: "easeOut",
                                }}
                            >
                                <LoadCard key={loan.id} loan={loan} deleteLoan={deleteLoan}  />
                            </motion.div>
                        )}
                        </>
                </TabsContent>
                <TabsContent value="approved" className="space-y-4">
                    <>
                        { loans.filter((loan)=> loan.status == "approved").
                            map((loan, index) => 
                            <motion.div
                                key={loan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                duration: 0.5,
                                delay: index * 0.15, 
                                ease: "easeOut",
                                }}
                            >
                            <LoadCard key={loan.id} loan={loan} deleteLoan={deleteLoan} /> 
                            </motion.div>
                        )}
                    </>
                </TabsContent>
                <TabsContent value="returned" className="space-y-4">
                    <>
                    { loans.filter((loan)=> loan.status == "returned").
                        map((loan, index) => 
                        <motion.div
                            key={loan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                            duration: 0.5,
                            delay: index * 0.15, 
                            ease: "easeOut",
                            }}
                        >
                            <LoadCard key={loan.id} loan={loan} deleteLoan={deleteLoan} /> 
                        </motion.div>
                    )}
                    </>
                </TabsContent>
                <TabsContent value="rejected" className="space-y-4">
                    <>
                    { loans.filter((loan)=> loan.status == "rejected").
                        map((loan, index) => 
                        <motion.div
                            key={loan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                            duration: 0.5,
                            delay: index * 0.15, 
                            ease: "easeOut",
                            }}
                        >
                            <LoadCard key={loan.id} loan={loan} deleteLoan={deleteLoan} /> 
                        </motion.div>
                    )}
                    </>
                </TabsContent>
            </Tabs>
            </div>
            )}
            </motion.div>
        </div>
    );  
}


function LoadCard({loan, deleteLoan}: {loan:Loan; deleteLoan: (loanId: string ) => void}) {
    return(
        <Card>
            <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
                
                <div className="relative h-[180px] w-[120px] flex-shrink-0 mx-auto md:mx-0">
                <Image
                    src={loan.book.imgUrl || "/placeholder.svg"}
                    alt={`Cover of ${loan.book.title}`}
                    fill
                    className="object-cover rounded-md"
                />
                </div>
        
                <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-center md:text-left items-center">
                    <div>
                    <h3 className="font-semibold text-lg">{loan.book.title}</h3>
                    <p className="text-muted-foreground">{loan.book.author}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Estado de la solicitud:</span> 
                      <LoanStatusBadge status={loan.status} />

                    </div>
                    {/* TODO: Call the deleete endpoint */}
                    { loan.status == "approved" || loan.status == "rejected" || loan.status == "returned" ? (
                        <></>
                    ) : (
                      <Button variant={'destructive'} onClick={() => deleteLoan(loan.id)} className='cursor-pointer'>Cancelar Prestamo</Button>
                    )}
                </div>
        
                <Separator className="my-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                    <span className="text-muted-foreground">Pedido el:</span> {loan.requestDate}
                    </div>
                    <div>
                    <span className="text-muted-foreground">Fecha de vencimiento:</span> {loan.dueDate}
                    </div>
                </div>

                <Separator className="my-4" />
                <p className="text-muted-foreground my-4">Información del libro:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  <div>
                      <span className="text-muted-foreground">Género:</span> <Badge>{loan.book.genre}</Badge> 
                  </div>
                  <div>
                  <span className="text-muted-foreground">Idioma: {loan.book.language == "English" ?(
                                        <>Inglés</>
                                    ) : loan.book.language == "Spanish" ? (
                                        <>Español</>
                                    ) : loan.book.language }</span>  
                  </div>
                  <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Estado del libro:</span>
                      {setState(loan.book.state)}
                  </div>
                </div>
                </div>
            </div>
            </CardContent>
        </Card>
      
      
    );
}
