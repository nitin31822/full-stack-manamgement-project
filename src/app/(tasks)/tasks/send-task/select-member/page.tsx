"use client"
import Friend from '@/components/my-components/Friend'
import SendTaskEmployeesCard from '@/components/my-components/SendTaskToUser'
import { getCompanyMembers } from '@/queryFunctions/company/company'
import { RootState } from '@/store/store'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useSelector } from 'react-redux'

function SelectMember() {
    const Company = useSelector((state : RootState)=> state.company.company)
    if (!Company) {
        return <div>Something Went Wrong</div>
    }
    const {data : members , isLoading} = useQuery({
        queryKey : ["task/company-members"] ,
        queryFn : async()=> await getCompanyMembers(Company.id)
    })
    if (isLoading) {
        return <div>Loading</div> 
    }
    if (!members) {
        return <div>Nothing to show</div>
    }
  return (
    <div>
         {members?.map((member)=>(
            <SendTaskEmployeesCard user={member}  />
         ))}
    </div>
  )
}

export default SelectMember