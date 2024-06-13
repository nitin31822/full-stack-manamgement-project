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
  
    const SessionUser = session.user;  


    try {
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

        // updates user avatar
          await prisma.user.update({
            where : {
                id : SessionUser.id 
            } ,
            data : {
                avatar : avatar.url
            }
          })

          return Response.json({
           success : true,
           message : "User Avatar updated Successfully"
          } , {status : 200})

    } catch (error) {
        return Response.json(
            {
              success: false,
              message: "Error while updating user-avatar",
            },
            { status: 500 }
          );
    }
}