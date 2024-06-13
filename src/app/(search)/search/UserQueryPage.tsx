"use client"
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { searchUsers } from '@/queryFunctions/search/search'
import SearchCompaniesCard from '@/components/my-components/SearchCompanyCard'
import SearchUserCard from '@/components/my-components/SearchUserCard'

function UsersQueryPage () : React.JSX.Element{
    const query = useSelector((state : RootState)=> state.search.query)
    const router = useRouter()
    if (!query){
      router.push("/")
    }
    const {data : users, isLoading} = useQuery({
        queryKey : ["search/users"] ,
        queryFn : async () => await searchUsers(query as string)
    })
    if (isLoading) {
        return <div>Users Loading</div>
    }
    
  return (
    <div>
         {users ?  
          <div className=' flex flex-col gap-4 mt-5 lg:grid lg:grid-cols-2 lg:gap-3'>
            {users.map((user)=>(
              <SearchUserCard user={user} key={user.id} />
            ))}
          </div>
         : <div> 
            <h1>Soory Cant find Companies with Query</h1>
            </div>}
    </div>
  )
}

export default UsersQueryPage