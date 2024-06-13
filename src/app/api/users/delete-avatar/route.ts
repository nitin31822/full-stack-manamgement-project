import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { TakeAndUpload } from "@/constants/TakeImageAndUpload";
import prisma from "@/constants/prisma";

export async function POST(req : Request) {
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
       

        // updates user avatar
          await prisma.user.update({
            where : {
                id : SessionUser.id 
            } ,
            data : {
                avatar : ""
            }
          })

          return Response.json({
           success : true,
           message : "User Avatar deleted Successfully Successfully"
          } , {status : 200})

    } catch (error) {
        return Response.json(
            {
              success: false,
              message: "Error while deleteing user-avatar",
            },
            { status: 500 }
          );
    }
}