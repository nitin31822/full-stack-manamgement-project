import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/constants/prisma";

export async function POST(req:Request) {
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

    const user = session.user

    try {

        const {content } : {content : string} = await req.json()
        const { searchParams } = new URL(req.url);
        const queryParam = {
        GroupSocketRoomName: searchParams.get("GroupSocketRoomName")
       };

       if (!queryParam.GroupSocketRoomName) {
        throw new Error("Invalid Query Parameters")
       }

       // cretaes message

     await prisma.message.create({
        data : {
            sender : {
                connect : {
                    id : user.id
                }
            } ,
            content,
            GroupSocketRoomName : queryParam.GroupSocketRoomName
        }
       })

       return Response.json({
        message :"Message Send" ,
        success : true
       } , {status : 200})
       

        
    } catch (error) {
        return Response.json(
            {
              success: false,
              message: "Error while sending message",
            },
            { status: 500 }
          );
    }

    
}