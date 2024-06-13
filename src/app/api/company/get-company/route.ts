import prisma from "@/constants/prisma";


export async function GET(req : Request) {
   

  try {
    
    const { searchParams } = new URL(req.url);
    const queryParam = {
    companyID: searchParams.get("companyId"),
   };

   if (!queryParam.companyID ) {
      throw new Error("Invalid Query Parameter")
   }

    const company = await prisma.company.findFirst({
        where : {
            id : queryParam.companyID
        } ,
        select :{
            sokcetRoomName : true ,
            createdAt : true ,
            name : true ,
            email : true ,
            id : true ,
            avatar : true ,
            headline : true ,
            createdUser : {
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

    if (!company) {
        return Response.json(
            {
              success: false,
              message: " Company Not Found ",
            },
            { status: 401 }
          );
    }
    return Response.json(
        {
          success: true,
          message: "Company Fetched Successfully ",
          company
        },
        { status: 200 }
      );

  } catch (error) {
    console.error("Get company Error", error);

    return Response.json(
      {
        success: false,
        message: "Error while fetching company",
      },
      { status: 500 }
    );
  }
}


