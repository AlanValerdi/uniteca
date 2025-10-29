'use client';

import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { Separator } from '../ui/separator';
import { LoanStatusBadge } from './loanStatusBadge';
import { Badge } from '../ui/badge';
import { FaRegSmile } from 'react-icons/fa';
import { CgSmileNeutral, CgSmileSad } from 'react-icons/cg';
import { BookXIcon} from 'lucide-react';
import { Button } from '../ui/button';
// import { toast } from 'sonner';
import LoanSkeleton from './loanSkeleton';
import { approveLoan, formatDateTime, rejectLoan, renewLoan, returnBook } from "@/app/lib/loanAdminActions";
import { toast } from "sonner";
import { ActionDialog } from "./ActionDialog";
import { QRScannerSection } from "./QrScannerSection";




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
  borrowDate: string | null;
  returnDate: string | null;
  book: {
    title: string;
    author: string;
    imgUrl: string;
    genre: string;
    language: string;
    state: string;
  };
  borrower:{
    name: string;
    image: string;
    email: string;
  }
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

export default function LoansAdminList() {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const fetchLoans = async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/fetch-admin-loans');
          const data = await response.json();
          if (response.ok) {
            setLoans(data.loans);
            setError(null);
          } else {
            setError(data.error || 'Failed to fetch loans');
          }
        } catch (err) {
          console.error('Error fetching loans:', err);
          setError('An unexpected error occurred');
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchLoans();
      }, []);

  // calling reject endpoint
  

  
 
  if (loading) {  
    return <LoanSkeleton/>
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

    return(

        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {loans.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-100 px-4 text-center">
                <BookXIcon className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">¡No hay solicitudes que administrar!</h3>
                <p className="text-muted-foreground max-w-md">Espera a que los usuarios soliciten sus prestamos.</p>
            </div>
            ) : (
            <div className="container mx-auto px-4 py-40 md:px-20 md:py-10 lg:px-38 lg:py-40">
            <h1 className="text-3xl font-bold mb-6">Administración de prestamos</h1>
            <div className="pb-4">
                <QRScannerSection onSuccess={fetchLoans}/>
            </div>
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4 overflow-x-auto whitespace-nowrap max-w-full scrollbar-hide">
                    <TabsTrigger value="all" className='cursor-pointer'>Todos({loans.length})</TabsTrigger>
                    <TabsTrigger value="pending" className='cursor-pointer'>Pendientes({loans.filter((loan) => loan.status === 'pending').length})</TabsTrigger>
                    <TabsTrigger value="approved"className='cursor-pointer'>Aprobados({loans.filter((loan) => loan.status === 'approved').length})</TabsTrigger>
                    <TabsTrigger value="returned" className='cursor-pointer'>Devueltos({loans.filter((loan) => loan.status === 'returned').length})</TabsTrigger>
                    <TabsTrigger value="rejected" className='cursor-pointer'>Rechazados({loans.filter((loan) => loan.status === 'rejected').length})</TabsTrigger>
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
                            <LoadCard loan={loan} refetchLoans={fetchLoans}  />
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
                            <LoadCard key={loan.id} loan={loan} refetchLoans={fetchLoans}  />
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
                            <LoadCard key={loan.id} loan={loan} refetchLoans={fetchLoans} /> 
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
                            <LoadCard key={loan.id} loan={loan} refetchLoans={fetchLoans} /> 
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
                            <LoadCard key={loan.id} loan={loan} refetchLoans={fetchLoans} /> 
                        </motion.div>
                    )}
                    </>
                </TabsContent>
                
            </Tabs>
            </div>
            )}
        </motion.div>
        
    );  
}

// TODO: Implement Toast
function LoadCard({loan, refetchLoans }: {loan:Loan, refetchLoans: () => void }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => () => {});

    const openDialogWithAction = (action: () => void) => {
        setOnConfirmAction(() => action); // store the action
        setIsDialogOpen(true); // open dialog
    };
    
    // const router = useRouter();

    const handleApprove = async () => {
        try {
            await approveLoan(loan.id);
            toast.success("El prestamo se aprobó correctamente");
            refetchLoans();
        }catch(error){
            console.error(error);
        }
    }

    const handleReject = async () => {
        try {
            await rejectLoan(loan.id);
            toast.success("El prestamo se rechazó correctamente");
            refetchLoans();
        }catch(error){
            console.error(error);
        }
    }
    
    const handleRenew = async () => {
        try{
            await renewLoan(loan.id);
            toast.success("El prestamo se renovó correctamente");
            refetchLoans();
        }catch(error){
            console.error(error);
        }
    }

    const handleReturn = async () => {
        try{
            await returnBook(loan.id);
            toast.success("El libro se marcó como retornado correctamente");
            refetchLoans();
        }catch(error){
            console.error(error)
        }
    }

    const getStatusBorderColor = (status: LoanStatus): string => {
        switch (status) {
            case "pending":
                return "border-2 border-yellow-300";
            case "approved":
                return "border-2 border-green-300";
            case "rejected":
                return "border-2 border-red-300";
            case "returned":
                return "border-2 border-blue-300";
            default:
                return "border-2 border-gray-300";
        }
    };

    return(
        <>
            <Card className={getStatusBorderColor(loan.status)}>
                <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    
                    <div className="relative h-[180px] w-[120px] flex-shrink-0 mx-auto xl:my-12 md:mx-0">
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
                        <div className="flex space-x-2">
                            <span className="text-muted-foreground">Estado de la solicitud:</span> 
                            <LoanStatusBadge status={loan.status} />
                        </div>

                        </div>
                        {/* Action section */}
                        <div className="flex gap-6">
                            { loan.status == "approved" ? (
                                <>
                                    <Button variant={'default'} className="bg-green-700 hover:bg-green-800 cursor-pointer" onClick={() => openDialogWithAction(handleRenew)}>Renovar</Button>
                                    <Button variant={'default'} className="bg-green-500 hover:bg-green-600 cursor-pointer" onClick={() => openDialogWithAction(handleReturn)}><span className="font-bold">Marcar como devuelto</span></Button>
                                </>
                            ) : loan.status == "rejected" || loan.status == "returned" ?(
                                <></>
                            ):(
                                <>
                                    <Button variant={'destructive'} className="hover:bg-red-800 cursor-pointer" onClick={() => openDialogWithAction(handleReject)}>Rechazar</Button>
                                    <Button variant={'default'} className="bg-green-600 hover:bg-green-800 cursor-pointer" onClick={() => openDialogWithAction(handleApprove)}>Aprobar</Button>
                                </>
                            ) }
                            
                        </div>
                    </div>
                    
                    {/* Dates section */}
                    <Separator className="my-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                            <div className="flex space-x-1">
                            <span className="text-muted-foreground">Pedido el:</span> <p>{loan.requestDate ? formatDateTime(loan.requestDate) : "Fecha no disponible"}</p>
                            </div>
                            <div className="flex space-x-1">
                            <span className="text-muted-foreground">Fecha de vencimiento:</span><p>{loan.dueDate ? formatDateTime(loan.dueDate) : 'Fecha no disponible'}</p>
                            </div>
                        { !loan.borrowDate  ? (
                            <></>
                        ) : loan.status == "returned" ? (
                            <div className="flex space-x-1">
                                <span className="text-muted-foreground">Devuelto el:</span> <p>{loan.returnDate ? formatDateTime(loan.returnDate) : "Fecha no disponible"}</p>
                            </div>
                        ) : loan.status == "approved" ? (
                            <></>
                        ) : (
                            <div className="flex space-x-1">
                            <span className="text-muted-foreground">Renewed on:</span> <p>{loan.borrowDate}</p>
                            </div>
                        )}
                    </div>

                    <Separator className="my-4" />
                    <p className="text-muted-foreground my-4">Información del libro:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div>
                        <span className="text-muted-foreground">Género:</span> <Badge>{loan.book.genre}</Badge> 
                    </div>
                    <div className="flex space-x-1">
                        <span className="text-muted-foreground">Idioma:</span> <p>{loan.book.language == "English" ?(
                                        <>Inglés</>
                                    ) : loan.book.language == "Spanish" ? (
                                        <>Español</>
                                    ) : loan.book.language }</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Estado del libro:</span>
                        {setState(loan.book.state)}
                    </div>
                    </div>
                    <Separator className="my-4" />
                    <p className="text-muted-foreground my-4">Pedido por:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">Usuario:</span> 
                            <div className='relative size-7 overflow-hidden rounded-full'>
                                <Image
                                    src={loan.borrower.image}
                                    alt="User Image"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <Badge>{loan.borrower.name}</Badge> 
                    </div>
                    <div className="flex space-x-1">
                        <span className="text-muted-foreground">Correo:</span> <p>{loan.borrower.email}</p>
                    </div>
                    </div>
                    </div>
                </div>
                </CardContent>
            </Card>

            {/* TODO: dialog here */}
            <ActionDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                onConfirm={onConfirmAction}
                title="¿Quieres proceder con esta acción?"
                description="La acción no se podrá revertir"
            />

           

        </>
    );
}
