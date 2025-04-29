import { auth } from "@/auth";
import DynamicNavbar from "@/components/homeComponents/dynamicNavBar";
import HeroSection from "@/components/homeComponents/heroSection";

export default async function Home(){
  const session = await auth()
  return(
    <>
      <DynamicNavbar session={session}/>
      <HeroSection/>
    </>
  )
}