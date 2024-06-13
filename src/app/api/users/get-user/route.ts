import prisma from "@/constants/prisma";


export async function GET(req : Request) {
   

  try {
    
    const { searchParams } = new URL(req.url);
    const queryParam = {
    userId: searchParams.get("userId"),
   };

   if (!queryParam.userId ) {
      throw new Error("Invalid Query Parameter")
   }

    const user = await prisma.user.findFirst({
        where : {
            id : queryParam.userId
        } ,
        select :{
            createdAt : true ,
            name : true ,
            email : true ,
            id : true ,
            avatar : true ,
            headline : true
        }
    })

    if (!user) {
        return Response.json(
            {
              success: false,
              message: " User not Found ",
            },
            { status: 401 }
          );
    }
    return Response.json(
        {
          success: true,
          message: "Company Fetched Successfully ",
          user 
        },
        { status: 200 }
      );

  } catch (error) {
    console.error("Get User Error", error);

    return Response.json(
      {
        success: false,
        message: "Error while fetching user",
      },
      { status: 500 }
    );
  }
}


