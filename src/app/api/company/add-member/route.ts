import prisma from "@/constants/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";



export async function POST(req : Request) {
    // const session  = await getServerSession(authOptions)
    // const user = session?.user
    // console.log(session);
    
 
    // if(!session || session.user) {
    //  return Response.json(
    //      {
    //        success: false,
    //        message: "Not Authenticated"
    //      },
    //      { status: 401 }
    //    );
    // }
 
    // const SessionUserID = user?.id
    
    try {

      const { searchParams } = new URL(req.url);
      const queryParam = {
      companyID: searchParams.get("companyId"),
      userID : searchParams.get("userId")
     };

     if (!queryParam.companyID || !queryParam.userID) {
        throw new Error("Invalid Query Parameter")
     }

     const company  = await prisma.company.findFirst({
        where : {
            id :queryParam.companyID
        }
     })

     if (!company) {
        return Response.json({
            success : false,
            message : "Comapny not found"
        } , {status : 401})
     }

     const user = await prisma.user.findFirst({
        where : {
            id : queryParam.userID
        }
     })

     if (!user) {
        return Response.json({
            success : false,
            message : "User not found"
        } , {status : 401})
     }

     

    
      await prisma.company.update({
      where :{
        id : company.id
      } ,
      data : {
        Members : {
          connect : {
            id : user.id
          }
        }
      }
     })
     return Response.json(
      {
        success: true,
        message: "User added Successfully to company",
      },
      { status: 200 }
    ); 

    } catch (error) {
        console.error(error);
        
        return Response.json(
            {
              success: false,
              message: "error while adding a new member in company",
            },
            { status: 500 }
          ); 
    }
}