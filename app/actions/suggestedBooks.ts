"use server"

import { signIn } from "@/auth";
import { prisma } from "../lib/prisma"

export default async function getSuggestData(){
    const data = await prisma.book.findMany({
        where:{
            title:{
                in: ["The Story of Art", "Thinking, Fast and Slow", "The Pragmatic Programmer", "Clean Code"]
            }
        }
    });
    return data;
}

export async function signInWithGitHub() {
    await signIn("github")
}

export async function signInWithGoogle() {
    await signIn("google")
}

