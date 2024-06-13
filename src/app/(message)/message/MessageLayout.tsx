"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'

function MessageLayout() {
  const queryClient = useQueryClient()
  const InvalidateFriends = async() => {
    await queryClient.invalidateQueries({queryKey : ["message/friends"]})
  }
  return (
    <div className=" flex flex-row justify-center items-center gap-8 ">
      

       <Link href={"/message/friends"}><Button onClick={async () => await InvalidateFriends() }>Friends</Button></Link>
       <Link href={"/message/company"}><Button>Companies</Button></Link>
       
      </div>
  )
}

export default MessageLayout