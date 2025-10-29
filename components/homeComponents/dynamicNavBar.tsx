"use client"

import { Button } from '@/components/ui/button'
// import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import LogOutButton from '../authComponents/logOutButton'
import { GalleryVerticalEnd } from 'lucide-react'
 
const navItems = [
{
    id: 1,
    text: "Buscar Libros",
    link: "/"
},
{
    id: 2,
    text: "Préstamos",
    link: "loans"
},
{
    id: 3,
    text: "Mis Favoritos",
    link: "favorites"
},
]

 
// this is not getting any as a type TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DynamicNavbar({ session }: { session: any | null }) { 
    const [openNavbar, setOpenNavbar] = useState(false)
    const toggleNavbar = () => {
        setOpenNavbar(openNavbar => !openNavbar)
    }
    const pathname = usePathname()

    return (
        <>
            <header className="absolute left-0 top-0 w-full flex items-center h-24 z-40">
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-br from-[rgb(33,101,114)] opacity-90 blur-lg dark:from-c dark:blur-xl dark:opacity-40" />
                <nav className="relative mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 flex gap-x-5 justify-between items-center">
                    <div className="flex items-center min-w-max relative">
                        <Link href="/" className="font-semibold flex items-center gap-x-2 cursor-pointer" onClick={() => window.location.reload()}>
                            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full">
                                <GalleryVerticalEnd className="size-5" />
                            </div>
                            <span className="text-2xl text-white">UNITECA</span>
                        </Link>
                    </div>
                    <div className={`
                        fixed inset-x-0 h-[100dvh] lg:h-max top-0 lg:opacity-100 left-0 bg-white dark:bg-gray-950 lg:!bg-transparent py-32 lg:py-0 px-5 sm:px-10 md:px-12 lg:px-0 w-full lg:top-0 lg:relative  lg:flex lg:justify-between duration-300 ease-linear
                        ${openNavbar ? "flex flex-col items-center" : "-translate-y-10 opacity-0 invisible lg:visible  lg:translate-y-0"}
                    `}>
                        {openNavbar ? ( 
                            // On mobile when Navbar is open
                            <div className='py-6'>
                            <Link href="/" className="font-semibold flex items-center gap-x-2">
                                <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full">
                                    <GalleryVerticalEnd className="size-5" />
                                </div>
                                <span className="text-2xl text-black">UNITECA</span>
                            </Link>
                            </div>
                        ) : ""}
                        <ul className={`flex flex-col lg:flex-row gap-6 lg:items-center text-white lg:w-full lg:pl-10 ${openNavbar ? "flex flex-col align-middle items-center text-gray-950 font-semibold underline" : "" }`}>
                            {
                                navItems.map(navItem => {
                                    const isActive = pathname === navItem.link || pathname === `/${navItem.link}`

                                    return(
                                        <li key={navItem.id}>
                                            
                                            <Link href={navItem.link} className={`relative py-2.5 duration-300 ease-linear hover:text-[rgb(16,45,63)] text-black ${isActive ? "text-[rgb(33,101,114)] font-semibold underline" : "" }`}>
                                                {navItem.text}
                                            </Link>
                                        </li>    
                                    )
                                })
                            }
                        </ul>
                        <div className={`flex flex-col sm:flex-row sm:items-center gap-4  lg:min-w-max mt-10 lg:mt-0 ${openNavbar ? "flex flex-col align-middle items-center" : ""}`}>
                            { session?.user ? (
                                <>
                                    <p>Bienvenido, {session.user.name}</p>
                                    <div className='relative size-8 overflow-hidden rounded-full'>
                                        <Image
                                            src={session?.user.image}
                                            alt="Image for blog"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <LogOutButton/>
                                </>
                            ) : (
                                <Link href="signIn">
                                    <Button variant="default" className='bg-[rgb(33,101,114)]'>Conviertete en un miembro</Button>
                                </Link>
                            )
                            }
                            {/* <Link href="#" className="h-10 flex items-center justify-center w-full sm:w-max rounded-full px-5 bg-purple-600 text-white">
                                Sign-up
                            </Link> */}
                            {/* <Button variant="default" className='bg-[rgb(33,101,114)]'>Sign Up</Button> */}
                        </div>
                    </div>
                    <div className="flex items-center lg:hidden">
                        <button onClick={() => { toggleNavbar() }} className="outline-none border-l border-l-purple-100 dark:border-l-gray-800 pl-3 relative py-3">
                            <span className="sr-only">Toggle navbar</span>
                            <span aria-hidden="true" className={`
                                flex h-0.5 w-6 rounded bg-gray-800 dark:bg-gray-300 transition duration-300
                                ${openNavbar ? "rotate-45 translate-y-[0.33rem]" : ""}
                            `} />
                            <span aria-hidden="true" className={`
                                flex mt-2 h-0.5 w-6 rounded bg-gray-800 dark:bg-gray-300 transition duration-300
                                ${openNavbar ? "-rotate-45 -translate-y-[0.33rem]" : ""}
                            `} />
                        </button>
                    </div>
                </nav>
            </header>
        </>
    )
}