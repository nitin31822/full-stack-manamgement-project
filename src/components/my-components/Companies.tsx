"use client"
import CompaniesCard from '@/components/my-components/CompaniesCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getCompanies } from '@/queryFunctions/company/company'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import Link from 'next/link' 

function Companies() {
    const {data : companies , isLoading} = useQuery({
        queryKey : ["select/companies"],
        queryFn : async () => getCompanies()
    })
    if (isLoading) {
        return <Skeleton />
    }
    if(!companies || companies.length  === 0){
       return <h1 className=' text-white'>Nothing to show</h1>
    }
  return (
    <>
    <Link href={"/companies/create-company"}><Button variant="default">Create Company</Button></Link>
    <main className='  gap-5 mt-5 lg:grid lg:grid-cols-2 lg:gap-3  md:grid-cols-2 md:gap-3 h-full overflow-auto flex flex-col-reverse '>
    {companies.map((company)=>(
        <CompaniesCard Company={company} />
    ))}
   </main>
   </>
  )
}

export default Companies