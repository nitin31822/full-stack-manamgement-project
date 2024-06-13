"use client"
import { getCompanyMembers } from '@/queryFunctions/company/company'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import Friend from './Friend'

function CompanyMembers({companyId} : {companyId : string}) {
    const {data : members , isLoading} = useQuery({
        queryKey : ["company/members"],
        queryFn : async () => await getCompanyMembers(companyId)
    })
    if (isLoading) {
        return <div>Loading</div>
    }
  return (
    <div>
        {members ?  
         members.map((user)=>(
            <Friend friend={user}></Friend>
         ))
        : null }
    </div>
  )
}

export default CompanyMembers