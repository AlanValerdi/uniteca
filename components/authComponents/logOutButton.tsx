"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function SignOut() {
  return (
    <Button
      variant="secondary"
      onClick={() =>
        signOut({
          callbackUrl: "/", // redirige al home
        })
      }
    >
      Cerrar sesión
    </Button>
  )
}
