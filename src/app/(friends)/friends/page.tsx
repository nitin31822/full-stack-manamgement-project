"use client"
import Friend from '@/components/my-components/Friend'
import { getFriends } from '@/queryFunctions/friends/friends'
import { useQuery } from '@tanstack/react-query'
import React from 'react'


function Friends() {
  const {data : friends , isLoading} = useQuery({
    queryKey : ["friends"] ,
    queryFn  : async () => await getFriends()
  })
  if (isLoading) {
    return <div>Loading</div>
  }
  if (!friends) {
    return <div>Nothing to show</div>
  }
  return (
    <div>
      {friends.map((friend)=>(
        <Friend friend={friend} />
      ))}
    </div>
  )
}

export default Friends