"use client"
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { searchCompanies } from '@/queryFunctions/search/search'
import SearchCompaniesCard from '@/components/my-components/SearchCompanyCard'

function CompanyQueryPage () : React.JSX.Element{
    const query = useSelector((state : RootState)=> state.search.query)
    const router = useRouter()
    if (!query){
      router.push("/")
    }
    const {data : companies, isLoading} = useQuery({
        queryKey : ["search/companies"] ,
        queryFn : async () => await searchCompanies(query as string)
    })
    if (isLoading) {
        return <div>Companies Loading</div>
    }
    
  return (
    <div>
         {companies ?  
          <div className=' flex flex-col gap-4 mt-5 lg:grid lg:grid-cols-2 lg:gap-3'>
            {companies.map((company)=>(
              <SearchCompaniesCard Company={company} key={company.id} />
            ))}
          </div>
         : <div> 
            <h1>Soory Cant find Companies with Query</h1>
            </div>}
    </div>
  )
}

export default CompanyQueryPage