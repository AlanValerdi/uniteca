import SignInButtonGoogle from "./sigInGoogle"
import SignInButtonGithub from "./signInGithub"

export function SignInForm(){
    return (
    
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground text-sm text-balance">
                Sign in with one of our options below, and enter to the new digital era.
            </p>
            </div>
            <div className="grid gap-6">
            
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"/>
            
                <SignInButtonGithub/>
                <SignInButtonGoogle/>
            
            </div>
            <div className="text-center text-sm">
            Do you have an account?{" "}
            <a href="#" className="underline underline-offset-4">
                Log In
            </a>
            </div>
        </div>
    
      )
}
