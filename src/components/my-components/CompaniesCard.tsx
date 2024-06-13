"use client"
import { useRouter } from 'next/navigation'
import { useSocket } from '@/app/custom-Hooks/SocketProvider'
import { Companies } from '@/types/ApiResponse'
import React from 'react'
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dayjs from 'dayjs';
import {Avatar , AvatarFallback , AvatarImage} from "@/components/ui/avatar"


function CompaniesCard({Company} : {Company : Companies}) {
  const RoomJoin = async () => {
    const res = await joinRoom(Company.sokcetRoomName);
    console.log(`join Room Response ${res} `);
    return res;
  };
  const queryClient = useQueryClient();
  const {joinRoom } = useSocket()

  const router = useRouter()

  const handleClick = async ()=> {
    const res = await RoomJoin()
    if (res) {
     
      await queryClient.invalidateQueries({queryKey : ['company']})
       await queryClient.invalidateQueries({queryKey : ["company/members"]})
      router.push(`/companies/${Company.id}`)
    }
  }
  return (
    <Card onClick={async() => await handleClick()} className="card-bordered cursor-pointer ">
      <CardHeader>
        <div className="flex gap-6 items-center">
          <Avatar  >
            <AvatarFallback >CN</AvatarFallback>
            <AvatarImage src={Company.avatar ? Company.avatar : ""} ></AvatarImage>
          </Avatar>
          <CardTitle>{Company.name}</CardTitle>
         
        </div>
        <p>{Company.headline }</p>
        <div className="text-sm ">
         <span className=' text-md'>Since</span> {dayjs(Company.createdAt).format('MMM D, YYYY ')}
        </div>
      </CardHeader>
    </Card>
  )
}

export default CompaniesCard