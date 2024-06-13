import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/constants/prisma";


export async function  POST(req : Request) {
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
    try {

        const { searchParams } = new URL(req.url);
        const queryParam = {
        companyID: searchParams.get("companyId"),
       };
  
       if (!queryParam.companyID ) {
          throw new Error("Invalid Query Parameter")
       }
        
        const {headline} : {headline : string} = await req.json()

        const company = await prisma.company.findFirst({
            where : {
                id : queryParam.companyID
            }
        })

        if (!company) {
            return Response.json({
                success : true ,
                message : " Company Not Found"
            } , {status : 401})
    
        }
         
        await prisma.company.update({
            where : {
               id : company.id
            },
            data :{
                headline
            }
            
        })

        return Response.json({
            success : true ,
            message : "Company headline updated Successfully"
        } , {status : 200})


    } catch (error) {
        return Response.json(
            {
              success: false,
              message: "Error while updating Company-headline",
            },
            { status: 500 }
          );
    }

}