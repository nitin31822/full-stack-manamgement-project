"use client"
import { useRouter } from 'next/navigation'

import { Companies } from '@/types/ApiResponse'
import React from 'react'

import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import dayjs from 'dayjs';
import {Avatar , AvatarFallback , AvatarImage} from "@/components/ui/avatar"
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { inCompany } from '@/store/company/slice';
import { Button } from '../ui/button';


function TaskCompanyCard({Company} : {Company : Companies}) {

 
  const dispatch : AppDispatch = useDispatch()

  const router = useRouter()

  const handleClick =  ()=> {
    dispatch(inCompany(Company))
    router.push("/tasks/send-task")
  }
  return (
    <Card  className="card-bordered cursor-pointer ">
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
      <CardFooter >
        <Button onClick={() =>  handleClick()}>Select</Button>
      </CardFooter>
    </Card>
  )
}

export default TaskCompanyCard