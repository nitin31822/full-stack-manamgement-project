import prisma from "@/constants/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      companyID: searchParams.get("companyId"),
    };

    if (!queryParam.companyID) {
      throw new Error("Invalid Query Parameter");
    }
    // company members
    const members =  await prisma.company.findFirst({
      where: {
        id: queryParam.companyID,
      },
      select: {
        Members: {
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
 
    return Response.json({
        success : true ,
        message : "Company Members Fetched" ,
        users : members ? members.Members : []
    })

  } catch (error) {
    return Response.json(
        {
          success: false,
          message: "Error while fetching company members",
        },
        { status: 500 }
      );
  }
}
