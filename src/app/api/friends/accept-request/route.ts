import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
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

  const user = session.user;

  try {
    // session user friendRequests Profile friendRequest senders

    const { searchParams } = new URL(req.url);
    const queryParam = {
      senderId: searchParams.get("senderId"),
    };

    if (!queryParam.senderId) {
      throw new Error("Invalid Query Parameter");
    }

    const friendRequestSenders = await prisma.friendRequests.findFirst({
        where : {
            userId : user.id
        } ,
        select : {
            RequestSenders : {
                select : {
                    createdAt: true,
                    name: true,
                    email: true,
                    id: true,
                    avatar: true,
                    headline: true,
                }
            }
        }
    })

    if (!friendRequestSenders) {
        return Response.json({
            message : "user doesnot have any friend Requests" ,
            success : false
        }  , {status : 400})
    }

    // if senderId user exists on friendRequestSenders  

    const isExists = friendRequestSenders.RequestSenders.some((sender)=> sender.id === queryParam.senderId)

    if (!isExists) {
        return Response.json({
            success : false ,
            message : `sender does not send any request to ${user.name} `
        } , {status : 400})
    }


    // sender who sends request

    const sender = await prisma.user.findFirst({
        where : {
            id : queryParam.senderId
        }
    })

    if (!sender) {
        return Response.json({
            success : false ,
            message : "Sender not found"
        } , {status : 401})
    }

    // accept the requset and make friends

    //  updtaes session user friendList
    await prisma.friendsList.update({
      where: {
        userId : user.id
      },
       data : {
        friends: {
          connect: {
            id: sender.id
          },
        },
      },
     
    });

    // pdtaes sender friendList
    
    await prisma.friendsList.update({
      where: {
        userId : sender.id
      },
       data : {
        friends: {
          connect: {
            id: user.id,
          },
        },
      },
     
    });

    // removes from friendRequests 

    await prisma.friendRequests.update({
        where : {
            userId : user.id
        } ,
        data : {
            RequestSenders : {
                disconnect : {
                    id : sender.id
                }
            }
        }
    })

    return Response.json(
      {
        message: `${sender.name} Added to Your Friend List`,
        success: true,
      },
      { status: 200 }
    );

  } catch (error) {
    console.log(error);
    
    return Response.json(
      {
        success: false,
        message: "Error while accepting friend Requests",
      },
      { status: 500 }
    );
  }

}