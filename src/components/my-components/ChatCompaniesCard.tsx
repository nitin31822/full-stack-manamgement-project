"use client"
import { useRouter } from 'next/navigation'
import { useSocket } from '@/app/custom-Hooks/SocketProvider'
import { Companies } from '@/types/ApiResponse'
import React from 'react'
import {  useDispatch } from 'react-redux'
import { useQueryClient } from "@tanstack/react-query";
import { inCompany } from '@/store/company/slice'
import { AppDispatch } from '@/store/store'
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
  const {joinRoom , clearMessages} = useSocket()
  const dispatch : AppDispatch = useDispatch()
  const router = useRouter()

  const handleClick = async ()=> {
    const res = await RoomJoin()
    if (res) {
      dispatch(inCompany(Company))
      await queryClient.invalidateQueries({queryKey : ['message/company']})
      
      clearMessages()
      router.push(`/message/company/${Company.id}`)
    }
  }
  return (
    <Card onClick={async() => await handleClick()} className="card-bordered cursor-pointer ">
      <CardHeader>
        <div className="flex gap-6 items-center">
          <Avatar  >
            <AvatarFallback >CN</AvatarFallback>
            <AvatarImage ></AvatarImage>
          </Avatar>
          <CardTitle>{Company.name}</CardTitle>
         
        </div>
        <p>This is Company Bio</p>
        <div className="text-sm ">
         <span className=' text-md'>Since</span> {dayjs(Company.createdAt).format('MMM D, YYYY ')}
        </div>
      </CardHeader>
    </Card>
  )
}

export default CompaniesCard