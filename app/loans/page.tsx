import { auth } from "@/auth";
import DynamicNavbar from "@/components/homeComponents/dynamicNavBar";
import LoansList from "@/components/loansRelatedComponents/loanCard";
import { redirect } from "next/navigation";
import getAdmin from "../actions/getAdmin";
import LoansAdminList from "@/components/loansRelatedComponents/LoansAdminList";
import { Suspense } from "react";
import LoanSkeleton from "@/components/loansRelatedComponents/loanSkeleton";

export default async function LoansPage(){
    const session = await auth()
    const admin = await getAdmin();


    if(!session?.user?.id){
        redirect("/signIn");
    }

    return(
        <>
        <DynamicNavbar session={session}/>
        { admin?.role == "admin" ? (
            <Suspense fallback={<LoanSkeleton/>}>
                <LoansAdminList/>
            </Suspense>
        ) : (
            <LoansList/>
        )}
        </>
    );
}