"use client"
import ChildProfilePage from "@/components/pages/beneficiary/ChildProfile"
import { useParams } from "next/navigation"

function Page() {
    const params = useParams()
  return (
    <ChildProfilePage/>
  )
}

export default Page
