"use client"
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/zod-types/verify-Schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import {z} from "zod"
import {Form , FormItem , FormLabel , FormField , FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios , {AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

function VerifyPage() {
    const router = useRouter()
    const param = useParams<{name : string}>()
    const {toast}  = useToast()

    type verifyFormType = z.infer<typeof verifySchema>
    const form = useForm<verifyFormType>({
        resolver : zodResolver(verifySchema) ,
         defaultValues : {
            code : ""
         }
    })

    const verifyCode = async (data : verifyFormType) => {
      try {
      const response =   await axios.post<ApiResponse>(`/api/users/verify-code` , {
            name : param.name ,
            verificationCode : data.code
        })
        if (response.data.success) {
            toast({
                title : "Success" ,
                description : response.data.message
            })
          router.push("/login")  
        }else {
            toast({
                title : "Failed",
                description : "Incorrect verification code"
            })
        }
      } catch (error) {
        console.error("Error while Verifying User" , error)
        const axiosError = error as AxiosError<ApiResponse>
        let errorMessage = axiosError.response?.data.message
        toast({
          title : "Failed" ,
          description : errorMessage ? errorMessage : "Failed to Sign-Up User"  ,
          variant : "destructive"
        })
      }
    }
    return (
        <div className="flex justify-center items-center min-h-screen ">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Verify Your Account
              </h1>
              <p className="mb-4">Enter the verification code sent to your email</p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(verifyCode)} className="space-y-6">
                <FormField
                  name="code"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Verify</Button>
              </form>
            </Form>
          </div>
        </div>
      );
}

export default VerifyPage