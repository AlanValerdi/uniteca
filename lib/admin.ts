// app/lib/auth.ts (o donde prefieras)

import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";

export async function admin() {
  const session = await auth(); 

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
