"use client"


import { Skeleton } from '@/components/ui/skeleton'
import { getCompanies } from '@/queryFunctions/company/company'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

import TaskCompanyCard from '@/components/my-components/TaskCompanyCard'

function page() {
    const {data : companies , isLoading} = useQuery({
        queryKey : ["companies"],
        queryFn : async () => getCompanies()
    })
    if (isLoading) {
        return <Skeleton />
    }
    if(!companies || companies.length  === 0){
        return(
            <>
      
      <h1 className=' '>Nothing to show</h1>
      </>
        )
    }
  return (
    
    <main className=' flex flex-col gap-5 mt-5 lg:grid lg:grid-cols-2 lg:gap-3 '>
    {companies.map((company)=>(
        <TaskCompanyCard Company={company} />
    ))}
   </main>
   
  )
}

export default page