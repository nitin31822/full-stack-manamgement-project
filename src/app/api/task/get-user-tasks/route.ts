import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/constants/prisma";

export async function GET(req : Request) {
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
        const Tasks = await prisma.task.findMany({
          where : {
            reciverId : SessionUser.id
            
          } ,
          select : {
            Company : {
              select : {
                sokcetRoomName : true ,
                createdAt : true ,
                name : true ,
                email : true ,
                id : true ,
                avatar : true ,
                headline : true
              }
            } ,
            title : true ,
            sender : {
              select : {
                createdAt: true,
                name: true,
                email: true,
                id: true,
                avatar: true,
                headline: true,
              }
            } ,
            content : true ,
            createdAt : true ,
             isCompleted : true


          } ,
          orderBy :{
            createdAt : "desc"
          }
        })

        return Response.json({
          message : "User tasks fetched Successfully" ,
          success : true ,
          tasks  : Tasks ? Tasks : null
        })
    } catch (error) {
        return Response.json(
            {
              success: false,
              message: "Error while fetching user  Tasks",
            },
            { status: 500 }
          );
    }
}