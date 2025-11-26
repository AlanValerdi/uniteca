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
import { BookXIcon, QrCodeIcon} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import LoanSkeleton from './loanSkeleton';
import { motion } from "framer-motion";
import { formatDateTime } from '@/app/lib/loanAdminActions';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { QRCodeSVG } from 'qrcode.react'


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
  returnDate: string | null;
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
                    <TabsTrigger value="approved" className='cursor-pointer'>Aprobados({loans.filter((loan) => loan.status === 'approved').length})</TabsTrigger>
                    <TabsTrigger value="pending" className='cursor-pointer'>Pendientes({loans.filter((loan) => loan.status === 'pending').length})</TabsTrigger>
                    <TabsTrigger value="returned" className='cursor-pointer'>Devueltos({loans.filter((loan) => loan.status === 'returned').length})</TabsTrigger>
                    <TabsTrigger value="all" className='cursor-pointer'>Historial ({loans.length})</TabsTrigger>
                    {/* <TabsTrigger value="rejected" className='cursor-pointer'>Rechazados({loans.filter((loan) => loan.status === 'rejected').length})</TabsTrigger> */}
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
                {/* <TabsContent value="rejected" className="space-y-4">
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
                </TabsContent> */}
            </Tabs>
            </div>
            )}
            </motion.div>
        </div>
    );  
}


function LoadCard({loan, deleteLoan}: {loan:Loan; deleteLoan: (loanId: string ) => void}) {
    const [showQr, setShowQr] = useState(false);

    const getStatusBorderColor = (status: LoanStatus): string => {
        switch (status) {
            case "pending":
                return "border-1 border-yellow-300 shadow-lg bg-yellow-50 ";
            case "approved":
                return "border-1 border-green-300 shadow-lg bg-green-50 ";
            case "rejected":
                return "border-1 border-red-300 shadow-lg bg-red-50";
            case "returned":
                return "border-1 border-blue-300 shadow-lg bg-blue-50";
            default:
                return "border-1 border-gray-300 shadow-lg bg-gray-50";
        }
    };

    const getDaysRemaining = (): { text: string; color: string } => {
        if (!loan.dueDate || loan.status !== 'approved') {
            return { text: '', color: '' };
        }

        const now = new Date();
        const due = new Date(loan.dueDate);
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { text: 'DEUDA', color: 'text-red-600 font-bold' };
        } else if (diffDays === 0) {
            return { text: 'Vence hoy', color: 'text-orange-600 font-semibold' };
        } else if (diffDays === 1) {
            return { text: '1 día restante', color: 'text-yellow-600 font-semibold' };
        } else {
            return { text: `${diffDays} días restantes`, color: 'text-green-600 font-semibold' };
        }
    };

    return(
        
        <Card className={getStatusBorderColor(loan.status)}>
            <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
                
                <div className="flex flex-col items-center md:items-start">
                    <div className="relative h-[180px] w-[120px] flex-shrink-0">
                        <Image
                            src={loan.book.imgUrl || "/placeholder.svg"}
                            alt={`Cover of ${loan.book.title}`}
                            fill
                            className="object-cover rounded-md"
                        />
                    </div>
                    {loan.status === 'approved' && loan.dueDate && (
                        <div className={`mt-2 text-center px-3 py-1 rounded-md bg-white dark:bg-gray-800 border ${getDaysRemaining().text === 'DEUDA' ? 'border-red-500' : 'border-gray-300'}`}>
                            <p className={`text-sm ${getDaysRemaining().color}`}>
                                {getDaysRemaining().text}
                            </p>
                        </div>
                    )}
                </div>
        
                <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-center md:text-left items-center">
                    <div>
                    <h3 className="font-semibold text-lg">{loan.book.title}</h3>
                    <p className="text-muted-foreground">{loan.book.author}</p>
                    </div>
                    <div className='flex space-x-2'>
                      <span className="text-muted-foreground">Estado de la solicitud:</span> 
                      <LoanStatusBadge status={loan.status} />
                    </div>
                    
                    {/* TODO: Create the qr which is the one the admin could scan */}
                    { loan.status == "pending"  ? (
                        <>
                        <div>
                            <Drawer>
                            <DrawerTrigger asChild>
                                <Button variant="ghost" className="size-12 p-0 flex items-center justify-center">
                                <QrCodeIcon className="size-10" />
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader className='items-center align-middle'>
                                    <DrawerTitle>Crear qr</DrawerTitle>
                                    <DrawerDescription>Crea tu código qr, muéstralo en tu biblioteca universitaria, y llévate tu libro .</DrawerDescription>
                                </DrawerHeader>
                                <div className="flex justify-center items-center py-6">
                                    {showQr ? (
                                        <QRCodeSVG
                                        value={
                                            typeof window !== 'undefined'
                                            // ? `${window.location.origin}/admin/approve-loan?loanId=${loan.id}`
                                            ? `${loan.id}`
                                            : ''
                                        }
                                        size={160}
                                        level="H"
                                        />
                                    ) : (
                                        <div className="border w-40 h-40 flex items-center justify-center text-muted-foreground">
                                        
                                        </div>
                                    )}
                                </div>
                            <DrawerFooter className='flex justify-center items-center'>
                                <Button className='w-32' onClick={() => setShowQr(true)}>Crear Qr</Button>
                            </DrawerFooter>
                            </DrawerContent>
                            </Drawer>
                        </div>
                        <Button variant={'destructive'} onClick={() => deleteLoan(loan.id)} className='cursor-pointer'>Cancelar Prestamo</Button>
                        </>
                    )  : loan.status == "rejected" || loan.status == "returned" ? (
                        <></>
                    ) : (
                      <></>
                    )}
                </div>
        
                <Separator className="my-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                    <span className="text-muted-foreground">Pedido el:</span> {loan.requestDate ? formatDateTime(loan.requestDate) : "Fecha no disponible"}
                    </div>
                    <div>
                    <span className="text-muted-foreground">Fecha de vencimiento:</span> {loan.dueDate ? formatDateTime(loan.dueDate) : "Fecha no disponible"}
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
                {/* TODO: send the button to cancel the loan at the bottom */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm py-4 sm:items-center sm:justify-center sm:flex sm:flex-col">
                    <Button variant={'destructive'} onClick={() => deleteLoan(loan.id)} className='cursor-pointer w-34'>Cancelar Prestamo</Button>
                </div> */}
                </div>
            </div>
            </CardContent>
        </Card>
        
      
      
    );
}
