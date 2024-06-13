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
    const friendRequestUsers = await prisma.friendRequests.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        RequestSenders: {
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

    if (!friendRequestUsers) {
      return Response.json(
        {
          message: "user doesnot have any friend Requests",
          success: true,
        },
        { status: 200 }
      );
    }
    return Response.json(
      {
        message: "Request Senders Fetched",
        success: true,
        users: friendRequestUsers.RequestSenders,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error while fetching friendRequests",
      },
      { status: 500 }
    );
  }
}
