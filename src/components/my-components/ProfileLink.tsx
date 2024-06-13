"use client"
import React from 'react'
import Link from 'next/link'
import { FaRegUser } from "react-icons/fa6";
import {  useSession } from 'next-auth/react';


function ProfileLink() {
    const {data : session} = useSession()
    
  return (
    <Link  className=" flex flex-row items-center gap-2 h-8 hover:bg-slate-200 hover:rounded-md pl-2" href={`/profile/${session?.user.id}`} > <FaRegUser /> Your Profile</Link>
  )
}

export default ProfileLink