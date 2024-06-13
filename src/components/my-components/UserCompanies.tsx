import { getCompanies } from '@/queryFunctions/company/company'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Skeleton } from '../ui/skeleton'
import CompaniesCard from './ChatCompaniesCard'

function UserCompanies() {
    const {data : companies , isLoading} = useQuery({
        queryKey : ["message/company"],
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

export default UserCompanies