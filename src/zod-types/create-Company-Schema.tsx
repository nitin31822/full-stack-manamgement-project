import {z} from "zod"
export const createCompanySchema = z.object({
    email : z.string().email("please enter a valid email").optional() ,
    name : z.string()
    .min(2 , "name required atleast 2 characters") 
    .max(50 , "Organization name must only contains 50 characters")   
})
