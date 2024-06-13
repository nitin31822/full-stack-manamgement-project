"use client"
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {  useDebounceCallback} from "usehooks-ts"
import {zodResolver} from "@hookform/resolvers/zod"
import { SignUpSchema } from '@/zod-types/sign-up-Schema'
import {z} from "zod"
import axios , {AxiosError} from "axios"
import { ApiResponse } from '@/types/ApiResponse'
import { Form , FormField , FormItem , FormLabel ,FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'


function page() {
  const [name , setName] = useState("")
  const [nameMessage , setNameMessage] = useState("")
  const [isCheckingName , setIsCheckingName] = useState(false)
  const [isSubmiting , setIsSubmiting] = useState(false)
  const debounced =   useDebounceCallback(setName , 300)
  const {toast} = useToast()
  const router = useRouter()


  // zod implementation
   type signUpFormType = z.infer<typeof SignUpSchema>
  const form = useForm<signUpFormType>({
    resolver : zodResolver(SignUpSchema) ,
    defaultValues : {
      name : "" ,
      email : "" ,
      password : ""
    }
  })

  useEffect(()=>{
     const checkUsernameUnique = async () => {
       if (name) {
        setIsCheckingName(true)
        setNameMessage("")
        try {
         const response =  await axios.get(`/api/users/check-name-unique?name=${name}`)
         setNameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setNameMessage(axiosError.response?.data.message ?? "Error checking username") 
        }
        finally{
          setIsCheckingName(false)
        }
       }
     }
      checkUsernameUnique()
    } ,  [name])

    const registerUser = async(data : signUpFormType) => {
     setIsSubmiting(true)
     try {
    const response =   await axios.post<ApiResponse>("/api/users/register" , data)
    if (response.data.success) {
      toast({
        title : "Success" ,
        description : response.data.message
      })
      router.push(`/verify/${data.name}`)
    }
     } catch (error) {
      console.error("Error while Submiting User" , error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
      toast({
        title : "Failed" ,
        description : errorMessage ? errorMessage : "Failed to Sign-Up User"  ,
        variant : "destructive"
      })
     } 
     finally {
      setIsSubmiting(false)
     }
    }

    return (
      <div className="flex justify-center items-center min-h-screen ">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join AI Management App
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(registerUser)} className="space-y-6">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                    {isCheckingName && <Loader2 className="animate-spin" />}
                    {!isCheckingName && nameMessage && (
                      <p
                        className={`text-sm ${
                          nameMessage === 'Name is unique'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {nameMessage}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input {...field} name="email" />
                    <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" {...field} name="password" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className='w-full' disabled={isSubmiting}>
                {isSubmiting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Already a member?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-800">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
}

export default page