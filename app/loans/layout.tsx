import { Toaster } from "@/components/ui/sonner"

export default function LoanLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <section>
        <main>{children}</main>
        <Toaster richColors expand={true}/>
      </section>
    )
  }