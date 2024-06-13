import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/constants/prisma";

interface TaskDetails {
  content: string;
  title: string;
}

export async function POST(req: Request) {
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
    const { content, title }: TaskDetails = await req.json();
    if ([content, title].some((item) => item.trim() === "")) {
      throw new Error("please provide full information");
    }
    const { searchParams } = new URL(req.url);
    const queryParam = {
      CompanyId : searchParams.get("CompanyId"),
      recieverId: searchParams.get("recieverId"),
    };
    if (!queryParam.CompanyId || !queryParam.recieverId) {
      throw new Error("Invalid Query Parameter");
    }

    const reciver = await prisma.user.findFirst({
      where: {
        id: queryParam.recieverId,
      },
    });

    if (!reciver) {
        return Response.json(
            {
              success: false,
              message: " Reciever not found",
            },
            { status: 401 }
          );
    }

    const Company = await prisma.company.findFirst({
        where : {
            id : queryParam.CompanyId
        }
    })

    if (!Company) {
        return Response.json(
            {
              success: false,
              message: " Company not found",
            },
            { status: 401 }
          );
    }

    const newTask = await prisma.task.create({
        data : {
            title : title ,
            content : content ,
            sender : {
                connect : {
                  id  : SessionUser.id 
                }
            },
            reciver : {
                connect  : {
                    id : reciver.id
                }
            } ,
          Company : {
            connect : {
              id : Company.id
            }
          }
        } 
    
       
    })

    return Response.json(
        {
          success: true,
          message: "Task Created Successfully",
        },
        { status: 200 }
      );
    
  } catch (error) {
    return Response.json(
        {
          success: false,
          message: "Error while creating Task",
        },
        { status: 500 }
      );
  }
}
