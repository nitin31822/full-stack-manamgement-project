import { ApiResponse } from "@/types/ApiResponse"
import axios from "axios"



export const updateHeadline = async (headline : string) => {
   try {
  const Response =   await axios.post<ApiResponse>("/api/users/update-user-headline" , {
        headline 
    })

     return Response.data

   } catch (error) {
    console.log(error);
    
   }
}

