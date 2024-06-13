import prisma from "@/constants/prisma";
import { z } from "zod";
import { verifySchema } from "@/zod-types/verify-Schema";


export async function POST(req: Request) {
  try {
    const { name, verificationCode } = await req.json();
    const decodedUsername = decodeURIComponent(name);
    console.log( "decoded username",decodedUsername);
    

  const user = await prisma.user.findFirst({
    where : {
      name : name
    }
  })

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === verificationCode
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          isVerified: true,
        },
      });
      return Response.json(
        {
          success: true,
          message: "Account Verified Successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "verification code expired  , Please Sign-up again",
        },
        { status: 500 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification  code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("error while verifying code", error);

    return Response.json(
      {
        success: false,
        message: "error while verifying code",
      },
      { status: 500 }
    );
  }
}
