import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { TakeAndUpload } from "@/constants/TakeImageAndUpload";
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
        } 

       })
       if (!company) {
        return Response.json({
            success : true,
            message : " Company Not Found"
           } , {status : 200})
 
       }
        const filesData = await req.formData()
        const avatarPhoto : File | null = filesData.get("avatar") as unknown as File

        const  avatar = await TakeAndUpload(avatarPhoto)
        if (!avatar) {
            return Response.json(
                {
                  success: false,
                  message: "Error while uploading user-avatar to cloudinary",
                },
                { status: 500 }
              );
        }

        // updates company avatar
          await prisma.company.update({
            where : {
                id : company.id 
            } ,
            data : {
                avatar : avatar.url
            }
          })

          return Response.json({
           success : true,
           message : "Company Avatar updated Successfully"
          } , {status : 200})

    } catch (error) {
        return Response.json(
            {
              success: false,
              message: "Error while updating Company-avatar",
            },
            { status: 500 }
          );
    }
}