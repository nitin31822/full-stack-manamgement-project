import prisma from "@/constants/prisma"
import { SendVerificationEmail } from "@/utils/SendVerificationEmail"
import bcrypt from "bcryptjs"

interface UserDetails {
    name : string
    email : string
    password : string
}

export async function POST (req : Request) {
    try {
        const {name , email  , password} : UserDetails = await req.json()
        const existingUserVerifiedByName = await prisma.user.findFirst({
            where : {
                name ,
                isVerified : true
            }
        })

        if (existingUserVerifiedByName) {
            return Response.json(
                {
                    success : false ,
                    message : "Name is already taken"
                } , {
                    status : 400
                }
            )
        }

        const existedUserByEmail = await prisma.user.findFirst({
            where : {
                email
            }
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if (existedUserByEmail) {
            if (existedUserByEmail.isVerified) {
                return Response.json(
                    {
                        success : false ,
                        message : "User already registerd with this email "
                    } , 
                    {status : 200})
            }else{
                // in this case we tackle for if one user registers and not verified his email and second user comes and registers with same email then we give email to second user if second user verifies email
                const hashedPassword = await bcrypt.hash(password , 10)
            const user = await prisma.user.update({
                    where : {
                        id : existedUserByEmail.id
                    } ,
                    data : {
                        password : hashedPassword ,
                        verifyCode  ,
                        verifyCodeExpiry : new Date(Date.now() +  3600000)
                    }
                })    
            }
        }
        else{
         const hashedPassword = await bcrypt.hash(password , 10)
         const expiryDate = new Date()
         expiryDate.setHours(expiryDate.getHours() + 1)

         const newUser = await prisma.user.create({
            data : {
                email ,
                name ,
                password : hashedPassword ,
                verifyCode ,
                verifyCodeExpiry : expiryDate ,

            }
         })
           
         // makes friends profile 
         await prisma.friendsList.create({
            data  : {
                user : {
                    connect : {
                        id : newUser.id
                    }
                }
            }
         })

         // makes friendRequest 
         await prisma.friendRequests.create({
            data : {
              user : {
                connect : {
                    id : newUser.id
                }
              }
            }
         })        
        
        }



         // send verification email
         const emailResponse = await SendVerificationEmail(email , name , verifyCode)
         if (!emailResponse.success) {
           return Response.json(
               {
                   success : false ,
                   message : emailResponse.message
               } , 
               {status : 500})
         }else{
           return Response.json(
               {
                   success : true ,
                   message : "User registerd Successfully , Please verify you email"
               } , 
               {status : 200})
         }

       
    } catch (error) {
        console.error("user registeration error" , error);
        
        return Response.json({
            success : false ,
            message : "Error while registering user"
        } , {status : 500})
    }
}