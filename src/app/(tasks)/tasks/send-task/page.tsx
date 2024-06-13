"use client"
import { AppDispatch, RootState } from '@/store/store';
import { newTask } from '@/store/task/TaskSlice';
import { ITask } from '@/types/ApiResponse';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react'
import {useForm} from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux';

interface FormType {
  title: string;
  content: string;
}


function SendTask() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormType>();

  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const {data : session} = useSession()
  const userData = session?.user
  const Company = useSelector((state: RootState) => state.company.company);

  
  console.log("Company" , Company);
  
  if (!userData || !Company) {
    return <div>Please Login</div>
  }

  const onSubmit = (data : FormType) => {
    const task :ITask = {
      Company  : {
        avatar : Company.avatar ,
        createdAt : Company.createdAt ,
        email : Company.email ,
        headline : Company.headline ,
        id :Company.id ,
        name : Company.name ,
        sokcetRoomName :Company.sokcetRoomName
      } ,
      content : data.content ,
      createdAt : new Date() ,
      isCompleted : false ,
      sender : {
        avatar : userData.avatar ,
        createdAt : userData.createdAt ,
        name : userData.name ,
        email : userData.email ,
        headline : userData.headline ,
        id : userData.id
      } ,
      title : data.title
    } 
    dispatch(newTask(task))
    reset()
    router.push("/tasks/send-task/select-member")
  }

  return (
<div className="max-w-md mx-auto mt-6 p-4 bg-gray-100 rounded-md ">
      <h1 className="text-2xl font-bold mb-4">Create a Task</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="taskTitle"
            className="block text-sm font-medium text-gray-700"
          >
            Task Title
          </label>
          <input
            type="text"
            id="taskTitle"
            {...register("title", { required: true })}
            className={`mt-1 p-2 w-full border-gray-300 rounded-md ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && (
            <span className="text-red-500 text-sm">Task Title is required</span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="taskContent"
            className="block text-sm font-medium text-gray-700"
          >
            Task Content
          </label>
          <textarea
            id="taskContent"
            {...register("content", { required: true })}
            className={`resize-none mt-1 p-2 w-full border-gray-300 rounded-md ${errors.content ? "border-red-500" : ""}`}
            rows={4}
          ></textarea>
          {errors.content && (
            <span className="text-red-500 text-sm">
              Task Content is required
            </span>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full "
        >
          Submit Task
        </button>
      </form>
    </div>
  )
}

export default SendTask