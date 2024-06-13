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

function SearchUserCard({user} : {user : searchedusers }) {
  const [friendButtonClicked , setFriendButtonClicked] = useState<boolean>(user.isFriend) 
  const queryClient = useQueryClient();
  const router = useRouter()
  const {toast} = useToast() 

  const session = useSession()
  const sessionUser =  session.data?.user

  const handleClick = async ()=> {
      await queryClient.invalidateQueries({queryKey : ['profile/user']})
      router.push(`/profile/${user.id}`)
    
  }
  const makeFriend = async() => {
    const response = await axios.get<ApiResponse>(`/api/friends/toggle-friends?friendID=${user.id}`)
    console.log(response);
    
     if (response.data.success) {
      toast({
        title: response.data.message,
      });
      setFriendButtonClicked(!user.isFriend)
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
            <AvatarImage src={user.avatar ? user.avatar : ""} ></AvatarImage>
          </Avatar>
          <CardTitle>
          {user.name}
          
          </CardTitle>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
             {user.id === sessionUser?.id ? null :  <Button variant='default'>
               {user.isFriend ? "Remove From Friends" : "Send Friend Request" }
              </Button>}
            </AlertDialogTrigger>
            <AlertDialogContent>
              {sessionUser ? <>
                <AlertDialogHeader>
                <AlertDialogTitle>Send Friend Request To {user.name}</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  
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
        <p>{user.email}</p>
        <p>{user.headline }</p>
        <div className="text-sm flex flex-row justify-between items-center">
        <div> <span className=' text-md'>Since</span> {dayjs(user.createdAt).format('MMM D, YYYY ')}</div>
         <Button onClick={async()=> await handleClick()} variant={'secondary'}>Visit</Button>
        </div>
      </CardHeader>
     
    </Card>
  )
}

export default SearchUserCard