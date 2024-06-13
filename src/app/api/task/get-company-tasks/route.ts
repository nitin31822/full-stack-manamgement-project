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
  
   

    try {

        const {searchParams} = new URL(req.url)
        const queryParam = {
            CompanyID : searchParams.get("CompanyId")
        }

        if (!queryParam.CompanyID) {
            throw new Error("Invalid Query Parameter")
        }

        const Tasks = await prisma.task.findMany({
          where : {
           CompanyId : queryParam.CompanyID
            
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
            id : true ,

          }
        })

        return Response.json({
          message : "Company tasks fetched Successfully" ,
          success : true ,
          tasks  : Tasks ? Tasks : null
        } , {status : 200})
    } catch (error) {
        return Response.json(
            {
              success: false,
              message: "Error while fetching Company  Tasks",
            },
            { status: 500 }
          );
    }
}