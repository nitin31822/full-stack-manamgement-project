"use client"
import { useRouter } from 'next/navigation'
import {  ApiResponse, searchedusers, user } from '@/types/ApiResponse'
import React, { useState } from 'react'
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import dayjs from 'dayjs';
import {Avatar , AvatarFallback , AvatarImage} from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '../ui/button';
import axios from 'axios';
import { useToast } from '../ui/use-toast';
import { useSession } from 'next-auth/react';

function RequestSenderCard({Sender} : {Sender : user }) {
  const queryClient = useQueryClient();
  const router = useRouter()
  const {toast} = useToast() 

  const session = useSession()
  const sessionUser =  session.data?.user

  const handleClick = async ()=> {
      await queryClient.invalidateQueries({queryKey : ['profile/user']})
      router.push(`/profile/${Sender.id}`)
    
  }
  const makeFriend = async() => {
    const response = await axios.post<ApiResponse>(`/api/friends/accept-request?senderId=${Sender.id}`)
    console.log(response);
    
     if (response.data.success) {
      toast({
        title: response.data.message,
      });
 
     }else{
    toast({
      title : "Error" ,
      variant : "destructive"
    })
     }
  }
  return (
    <Card  className="card-bordered  ">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className=' flex flex-row items-center gap-6'>
            <Avatar  >
            <AvatarFallback >CN</AvatarFallback>
            <AvatarImage src={Sender.avatar ? Sender.avatar : ""} ></AvatarImage>
          </Avatar>
          <CardTitle>
          {Sender.name}
          
          </CardTitle>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
            <Button>
              Accept
            </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              {sessionUser ? <>
                <AlertDialogHeader>
                <AlertDialogTitle>Accept Friend Request of  {Sender.name}</AlertDialogTitle>
                <AlertDialogDescription>
                  This action  will make you and {Sender.name} friends. 
                  
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={makeFriend} >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
              </>: 
              <>
              <AlertDialogHeader>
                <AlertDialogTitle>Please Login To send Friend Request</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will only be done with registered and login user.
                  
                </AlertDialogDescription>
              </AlertDialogHeader> 
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => router.push("/login")} >
                  SignIn
                </AlertDialogAction>
              </AlertDialogFooter>
              </>
              }
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <p>{Sender.email}</p>
        <p>{Sender.headline }</p>
        <div className="text-sm flex flex-row justify-between items-center">
        <div> <span className=' text-md'>Since</span> {dayjs(Sender.createdAt).format('MMM D, YYYY ')}</div>
         <Button onClick={async()=> await handleClick()} variant={'secondary'}>Visit</Button>
        </div>
      </CardHeader>
     
    </Card>
  )
}

export default RequestSenderCard