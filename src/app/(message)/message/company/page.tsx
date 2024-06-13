"use client"
import CompaniesCard from '@/components/my-components/ChatCompaniesCard'
import { SkeletonDemo } from '@/components/my-components/Skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { getCompanies } from '@/queryFunctions/company/company'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

function page() {
    const {data : companies , isLoading} = useQuery({
        queryKey : ["message/companies"],
        queryFn : async () => getCompanies()
    })
    if (isLoading) {
        return <Skeleton />
    }
    if(!companies || companies.length  === 0){
       return <h1 className=' text-white'>Nothing to show</h1>
    }
    
  return (
   <main className=' flex flex-col gap-5 mt-5 lg:grid lg:grid-cols-2 lg:gap-3 '>
    {companies.map((company)=>(
        <CompaniesCard Company={company} />
    ))}
   </main>
  )
}

export default page