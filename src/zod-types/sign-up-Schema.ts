import {z} from "zod"

export  const nameValidation = z
    .string()
    .min( 2,"Name must be atleast 2 characters")
    .max(20 , "Name must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, 'Name must not contain special characters')

export const SignUpSchema = z.object({
    name : nameValidation ,
    email    : z.string()
    .email({message : "invalid email address"}) ,
    password : z.string()
    .min(6 , {message : "Password must be atleast 6 Characters"})
    .max(20 , {message : "Password cotains only 20 characters"})
})