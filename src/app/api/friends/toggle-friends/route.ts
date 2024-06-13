import { getServerSession } from "next-auth";
import prisma from "@/constants/prisma";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(req: Request) {
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
    console.log("chala");
    
    const { searchParams } = new URL(req.url);
    const queryParam = {
      friendID: searchParams.get("friendID"),
    };

    if (!queryParam.friendID) {
      throw new Error("Invalid Query Parameter");
    }

    const friend = await prisma.user.findFirst({
      where: {
        id: queryParam.friendID,
      },
    });

    if (!friend) {
      return Response.json(
        {
          message: "Friend not found",
          success: false,
        },
        { status: 401 }
      );
    }

    if (user.id === friend.id) {
      throw new Error("user cannot make a frind itself");
    }

    const userFrindsProfile = await prisma.friendsList.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!userFrindsProfile) {
      return Response.json({
        success : false ,
        message : "User Friends Profile not found"
      })
    }

    const friendFriendsProfile  = await prisma.friendsList.findFirst({
      where : {
        userId : friend.id
      }
    })

    if (!friendFriendsProfile) {
      return Response.json({
        success : false ,
        message : `${friend.name} Friends Profile not found`
      })
    }


    const check = userFrindsProfile?.friendsID;

    const IsAlreadyFrinnds = check?.includes(friend.id);

    if (IsAlreadyFrinnds) {
      // removes friend from user friends profile and friend friends profile
      await prisma.friendsList.update({
        where: {
         id : userFrindsProfile.id
        },
        data: {
          friends: {
            disconnect: {
              id: friend.id,
            },
          },
        },
      });

      await prisma.friendsList.update({
        where: {
          id : friendFriendsProfile.id
        },
        data: {
          friends: {
            disconnect: {
              id: user.id,
            },
          },
        },
      });

      return Response.json(
        {
          message: "friend Remove From Friend List",
          success: true,
        },
        { status: 200 }
      );
    }


    // // makes friends
   
    

    // send Friend Reuest

    await prisma.friendRequests.update({
      where : {
        userId : friend.id
      } ,
      data : {
        RequestSenders : {
          connect : {
            id : user.id
          }
        }
      }
    })

    return Response.json(
      {
        success : true ,
        message : "Friend Request Send"
      } ,
      {status : 200}
    )
  } catch (error) {
    console.log(error);
    
    return Response.json(
      {
        success: false,
        message: "Error while toggle friends",
      },
      { status: 500 }
    );
  }
}
