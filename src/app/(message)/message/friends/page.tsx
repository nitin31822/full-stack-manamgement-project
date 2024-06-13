"use client"
import Friend from '@/components/my-components/Friend'

import { Skeleton } from '@/components/ui/skeleton'
import { getFriends } from '@/queryFunctions/message/message'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

function FrinedsPage() {
  const {data : friends , isLoading} = useQuery({
    queryKey : ["message/friends"] ,
    queryFn : async () => await getFriends()
  })

  if (isLoading) {
    return <Skeleton />
  }
  if (!friends) {
    return <div>Nothing to Show</div>
  }
  return (
    <div>
      {friends.map((friend)=>(
        <Friend friend={friend} />
      ))}
    </div>
  )
}

export default FrinedsPage