"use server"

import { auth } from "@/auth";
import { prisma } from "../lib/prisma"


export default async function getAdmin(){
    const session = await auth()

    if (!session?.user?.id) {
        return null;
      }
    
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, name: true, email: true, role: true },
      });
    
      if (!user) {
        return null;
      }
    
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, 
      };
}



