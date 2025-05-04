"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { signInWithGoogle } from "@/app/actions/suggestedBooks"
import { CgGoogle } from "react-icons/cg"


export default function SignInButtonGoogle() {
  const [isPending, startTransition] = useTransition()

  return (
    <form action={() => startTransition(() => signInWithGoogle())}>
      <Button type="submit" variant="outline" disabled={isPending} className="w-full">
        <CgGoogle/>
        {isPending ? "Accediendo..." : "Únete a través de Google"}
      </Button>
    </form> 
  )
}
