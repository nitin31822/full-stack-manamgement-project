import { getServerSession } from "next-auth";
import prisma from "../../../../constants/prisma";
import { authOptions } from "../../auth/[...nextauth]/options";
import { searchedusers, user } from "@/types/ApiResponse";

const checkIsFriends = (
  friends: Array<user>,
  users: Array<user>,
  index: number,
  convertedUsers: Array<searchedusers>
): Array<searchedusers> | null => {
  if (!friends) {
    return null;
  }
  if (index >= users.length) {
    return convertedUsers;
  }

  const currentUser = users[index];
  console.log("current user", currentUser);

  if (currentUser && currentUser.id) {
    // Check if the current user is in the friends array by comparing IDs
    const isFriend = friends.some((friend) => friend.id === currentUser.id);
    console.log("boolean", isFriend);

    const convertUser = {
      createdAt: currentUser.createdAt,
      id: currentUser.id,
      isFriend: isFriend,
      name: currentUser.name,
      avatar: currentUser.avatar,
      email: currentUser.email,
      headline: currentUser.headline,
    };

    convertedUsers = [...convertedUsers, convertUser];
  }

  return checkIsFriends(friends, users, index + 1, convertedUsers);
};

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      const { searchParams } = new URL(req.url);

      const queryParam = {
        query: searchParams.get("query"),
      };

      if (!queryParam.query) {
        throw new Error("Invalid Query Parameter");
      }
      const searchedusers = await prisma.user.findMany({
        where: {
          OR: [
            {
              email: {
                contains: queryParam.query,
              },
            },
            {
              name: {
                contains: queryParam.query,
              },
            },
          ],
        },
        select: {
          createdAt: true,
          name: true,
          email: true,
          id: true,
          avatar: true,
          headline: true,
        },
      });

      if (!searchedusers) {
        return Response.json({
          success: false,
          message: "cant find any users with this query",
        });
      }

       const convertedUsers = searchedusers.map((user) => ({
        ...user,
        isFriend: false,
      }));

      return Response.json({
        success: true,
        message: "Users fetched with this query",
        searchUsers: convertedUsers,
      });
    }

    const user = session.user;

    const { searchParams } = new URL(req.url);

    const queryParam = {
      query: searchParams.get("query"),
    };

    if (!queryParam.query) {
      throw new Error("Invalid Query Parameter");
    }
    const searchedusers = await prisma.user.findMany({
      where: {
        OR: [
          {
            email: {
              contains: queryParam.query,
            },
          },
          {
            name: {
              contains: queryParam.query,
            },
          },
        ],
      },
      select: {
        createdAt: true,
        name: true,
        email: true,
        id: true,
        avatar: true,
        headline: true,
      },
    });
    console.log(searchedusers);

    if (!searchedusers) {
      return Response.json({
        success: false,
        message: "cant find any users with this query",
      });
    }

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
      //    when friends is not that means isFriend is fasle
      const convertedUsers = searchedusers.map((user) => ({
        ...user,
        isFriend: false,
      }));

      return Response.json({
        success: true,
        message: "Users fetched with this query",
        searchUsers: convertedUsers,
      });
    }

    console.log("friends", friends.friends);

    let convertedUsers: Array<searchedusers> | null = [];

    convertedUsers = checkIsFriends(
      friends.friends,
      searchedusers,
      0,
      convertedUsers
    );

    if (!convertedUsers) {
      return Response.json({
        success: true,
        message: "Users fetched with this query",
        users: searchedusers,
      });
    }
    console.log("converted users", convertedUsers);

    return Response.json({
      success: true,
      message: "Users fetched with this query",
      searchUsers: convertedUsers,
    });
  } catch (error) {
    console.log(error);
    
    return Response.json(
      {
        success: false,
        message: "Error while  searching user",
      },
      { status: 500 }
    );
  }
}
