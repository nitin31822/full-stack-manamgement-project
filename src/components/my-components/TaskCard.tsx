'use client'

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { SquareCheckBig, X } from 'lucide-react';
import { Task } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle , CardDescription  , CardFooter} from '@/components/ui/card';
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
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse, ITask } from '@/types/ApiResponse';

type MessageCardProps = {
  task: ITask;
 
};

export function TaskCard({ task}: MessageCardProps) {
  const { toast } = useToast();

  // const handleDeleteConfirm = async () => {
  //   try {
  //     const response = await axios.delete<ApiResponse>(
  //       `/api/delete-message/${message.id}`
  //     );
  //     toast({
  //       title: response.data.message,
  //     });
  //     onMessageDelete(message.id);

  //   } catch (error) {
  //     const axiosError = error as AxiosError<ApiResponse>;
  //     toast({
  //       title: 'Error',
  //       description:
  //         axiosError.response?.data.message ?? 'Failed to delete message',
  //       variant: 'destructive',
  //     });
  //   } 
  // };

  return (
    <Card className="card-bordered w-full " >
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{task.title}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              {task.isCompleted ? 
              <Button variant="secondary" className=' bg-green-500' >
              
              <SquareCheckBig className="w-5 h-5" />
            </Button>
              : 
              <Button variant="destructive" >
                <X  className="w-5 h-5"/>
              
              </Button>}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="text-sm">
          {/* {dayjs(task.createdAt).format('MMM D, YYYY h:mm A')} */}
         Company Name :  <span className=' font-medium'>{task.Company.name}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className=' text-slate-700'>
          {task.content}
        </p>
      </CardContent>
      <CardFooter >
      <div className="text-sm flex  flex-row w-full justify-between items-center">
       <div className=' flex flex-col gap-2'>
       <p>Task Sender: <span className=' font-semibold'>{task.sender.name}</span></p>
        <p> Task Reciever: {task.sender.name}</p>
       </div>
          <p>{dayjs(task.createdAt).format('MMM D, YYYY h:mm A')}</p>
         
        </div>
      </CardFooter>
    </Card>
  );
}