import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/constants/prisma";
import { SendCompanyVerificationEmail } from "@/utils/SendCompanyVerificationEmail";

import { Company } from "@prisma/client";

export async function POST(req: Request) {
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
    const { name, email }: { name: string; email?: string } = await req.json();
   
    const sokcetRoomName = `${user.id}_${name}`;
    // creates socket room named  to ensure that with socket.io, only one room is created with the same name and no duplicate rooms are  created.
    const exisitingCompany = await prisma.company.findFirst({
      where: {
        sokcetRoomName,
      },
    });
    if (exisitingCompany) {
      return Response.json(
        {
          success: false,
          message: "User has already creates a company with this name",
        },
        { status: 400 }
      );
    }
    if (email) {
      // checking if company already exists with this email and verify
      const existingComapnyAndIsVerified = await prisma.company.findFirst({
        where: {
          email,
          isEmailVerified: true,
        },
      });

      if (existingComapnyAndIsVerified) {
        return Response.json(
          {
            success: false,
            message: "Company already registered with this email",
          },
          { status: 500 }
        );
      }

      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      // if company is created with this email , name and same userID for the second time and email is not verified
      const existingComapanyWithEmail = await prisma.company.findFirst({
        where: {
          email,
          createdsUserId: user.id,
          name,
        },
      });

      if (existingComapanyWithEmail) {
        // in this case user try for to make company with same email but first company is not verified then we updates the first company

        const updateCompany = await prisma.company.update({
          where: {
            id: existingComapanyWithEmail.id,
          },
          data: {
            name,
            sokcetRoomName,
            email,
            verifyCode,
            verifyCodeExpiry: expiryDate,
          },
        });
        // not making profile because this if condition runs when company is already created and if company already created then profile is also created
        // send verification email
        const emailResponse = await SendCompanyVerificationEmail(
          email,
          updateCompany.name,
          verifyCode
        );

        if (!emailResponse.success) {
          return Response.json(
            {
              success: false,
              message: emailResponse.message,
            },
            { status: 500 }
          );
        }

        return Response.json(
          {
            success: true,
            message: "Company created Successfully",
          },
          { status: 200 }
        );
      } else {
        // user creates company with  this email for the first time
        const newCompany = await prisma.company.create({
          data: {
            name,
            email,
            sokcetRoomName,
            createdUser: {
              connect: {
                id: user.id,
              },
            },
            Members: {
              connect: {
                id: user.id,
              },
            },
            verifyCode,
            verifyCodeExpiry: expiryDate,
          },
        });
      

        
        // send verification email
        const emailResponse = await SendCompanyVerificationEmail(
          email,
          newCompany.name,
          verifyCode
        );

        if (!emailResponse.success) {
          return Response.json(
            {
              success: false,
              message: emailResponse.message,
            },
            { status: 500 }
          );
        }

        return Response.json(
          {
            success: true,
            message: "Company created Successfully",
          },
          { status: 200 }
        );
      }
    } else {
     
       await prisma.company.create({
        data: {
          name,
          sokcetRoomName,
          createdUser: {
            connect: {
              id: session.user.id,
            },
          },
          Members: {
            connect: {
              id: session.user.id,
            },
          },
        },
      });

     

    
      return Response.json(
        {
          success: true,
          message: "Company created Successfully",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Company Creation error", error);

    return Response.json(
      {
        success: false,
        message: "Error while creating Comapany",
      },
      { status: 500 }
    );
  }
}
