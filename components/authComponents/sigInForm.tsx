import SignInButtonGoogle from "./sigInGoogle"
import SignInButtonGithub from "./signInGithub"

export function SignInForm(){
    return (
    
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Crea una cuenta</h1>
            <p className="text-muted-foreground text-sm text-balance">
                Inicia sesión con alguna de nustreas opciones, y únete a la era digital.
            </p>
            </div>
            <div className="grid gap-6">
            
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"/>
            
                <SignInButtonGithub/>
                <SignInButtonGoogle/>
            
            </div>
            <div className="text-center text-sm">
            ¿Tienes una cuenta?{" "}
            <a href="#" className="underline underline-offset-4">
                Inicia sesión
            </a>
            </div>
        </div>
    
      )
}
