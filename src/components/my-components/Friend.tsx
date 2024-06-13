"use client"
import { user } from '@/types/ApiResponse'
import React from 'react'
import { Avatar } from '../ui/avatar'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@/app/custom-Hooks/SocketProvider';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { inFriend } from '@/store/friend/friendSlice';

function Friend({friend} : {friend : user}) {

    const session = useSession()
    if (!session || !session.data) {
         return <div> please Login</div>
    }

    const {joinRoom , clearMessages , createRoomName} = useSocket()
    const SessionUser = session.data.user

    const user1 : user = {
        avatar : SessionUser.avatar  ,
        createdAt : SessionUser.createdAt ,
        email : SessionUser.email ,
        headline : SessionUser.email ,
        id : SessionUser.id ,
        name : SessionUser.name
    } 

    const RoomName  = createRoomName(user1 , friend)

    const RoomJoin = async () => {
        const res = await joinRoom(RoomName);
        console.log(`join Room Response ${res} `);
        return res;
      };

    const queryClient = useQueryClient();
    
    const dispatch : AppDispatch = useDispatch()
    const router = useRouter()


    const handleClick = async ()=> {
        const res = await RoomJoin()
        if (res) {
         dispatch(inFriend(friend))
          await queryClient.invalidateQueries({queryKey : ['message/friend']})
          clearMessages()
          router.push(`/message/friends/${RoomName}`)
        }
      }
  return (
    <div onClick={handleClick} className="container mx-auto p-4 cursor-pointer">
      <ul className="space-y-2">
       
          <li  className="p-4 border rounded-lg shadow-sm">
            <div className="font-semibold  h-12 flex flex-row gap-4 items-center">
               
                 <Avatar>
                    <AvatarImage src={friend.avatar ? friend.avatar : "" }></AvatarImage>
                    <AvatarFallback>CN</AvatarFallback>
                 </Avatar>
                {friend.name}
                </div>
            <div className="text-gray-600">{friend.email}</div>
          </li>
    
      </ul>
   
     
    </div>
  )
}

export default Friend