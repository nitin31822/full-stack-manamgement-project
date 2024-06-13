import prisma from "@/constants/prisma";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

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

  const user = session.user;

  try {
    
   

    const companies = await prisma.company.findMany({
        where : {
            Members : {
                some : {
                    id : user.id
                }
            }
        } ,
        select :{
            sokcetRoomName : true ,
            createdAt : true ,
            name : true ,
            email : true ,
            id : true ,
            avatar : true ,
            headline : true
        } ,
        orderBy :{
          createdAt : "desc"
        }
    })

    if (!companies) {
        return Response.json(
            {
              success: true,
              message: " User are not a member of any company",
            },
            { status: 200 }
          );
    }
    return Response.json(
        {
          success: true,
          message: " User companies fetched ",
          companies
        },
        { status: 200 }
      );

  } catch (error) {
    console.error("Get companies Error", error);

    return Response.json(
      {
        success: false,
        message: "Error while fetching companies",
      },
      { status: 500 }
    );
  }
}


