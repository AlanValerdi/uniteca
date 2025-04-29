import { SignInForm } from "@/components/authComponents/sigInForm"
import { GalleryVerticalEnd } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            UNITECA
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignInForm/>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:flex  items-center justify-center">
        <div className="absolute inset-0">
            <Image
            src="https://images.unsplash.com/photo-1699544084159-19ab53017724?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Image"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            fill
            />
        </div>
        <Link href="/" className="flex items-center gap-4 font-medium text-white z-10">
            <div className="bg-primary text-primary-foreground flex size-20 items-center justify-center rounded-full">
            <GalleryVerticalEnd className="size-14" />
            </div>
            <span className="text-7xl font-bold">UNITECA</span>
        </Link>
        </div>
    </div>
  )
}
