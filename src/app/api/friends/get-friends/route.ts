import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/constants/prisma";

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
    const friends = await prisma.friendsList.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        friends: {
          select: {
            createdAt: true,
            name: true,
            email: true,
            id: true,
            avatar: true,
            headline: true,
          },
        },
      },
    });

    if (!friends) {
      return Response.json(
        {
          success: false,
          message: "UserDoes Not Have any Friends",
        },
        { status: 401 }
      );
    }

    return Response.json({
      message: "user Friends Fetched",
      success : true,
      users : friends.friends
     
    } , {status : 200});
  } catch (error) {
    return Response.json(
        {
          success: false,
          message: "Error while fetching friends",
        },
        { status: 500 }
      );
  }
}
