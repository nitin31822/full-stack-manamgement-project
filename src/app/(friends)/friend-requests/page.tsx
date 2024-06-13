"use client"
import RequestSenderCard from '@/components/my-components/RequestSenderCard'
import { getFriendRequests } from '@/queryFunctions/friends/friends'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

function FriendRequests() {
    const {data : RequestSenders , isLoading} = useQuery({
        queryKey : ["friend/requests"],
        queryFn : async () => getFriendRequests() 
    })
    if (isLoading) {
        return <div>Is Loading</div>
    }
  return (
    <div>
        {RequestSenders ?  
          <div className=' flex flex-col gap-4 mt-5 lg:grid lg:grid-cols-2 lg:gap-3'>
            {RequestSenders.map((user)=>(
              <RequestSenderCard Sender={user} key={user.id} />
            ))}
          </div>
         : <div> 
            <h1>Soory You not have any Friend Requests</h1>
            </div>}
    </div>
  )
}

export default FriendRequests