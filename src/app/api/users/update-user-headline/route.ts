import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/constants/prisma";


export async function  POST(req : Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 }
      );
    }
  
    const SessionUser = session.user;  

    try {
        
        const {headline} : {headline : string} = await req.json()
         
        await prisma.user.update({
            where : {
               id : SessionUser.id
            },
            data :{
                headline
            }
            
        })

        return Response.json({
            success : true ,
            message : "user headline updated Successfully"
        } , {status : 200})


    } catch (error) {
        return Response.json(
            {
              success: false,
              message: "Error while updating user-headline",
            },
            { status: 500 }
          );
    }

}