import prisma from "@/constants/prisma";
import { z } from "zod";
import { verifySchema } from "@/zod-types/verify-Schema";


export async function POST(req: Request) {
  try {
    const { name, verificationCode } = await req.json();
    const decodedUsername = decodeURIComponent(name);
    console.log( "decoded username",decodedUsername);
    

  const company = await prisma.company.findFirst({
    where : {
      name : name
    }
  })

    if (!company) {
      return Response.json(
        {
          success: false,
          message: "comapany not found",
        },
        { status: 400 }
      );
    }

    const isCodeValid = company.verifyCode === verificationCode
    let isCodeNotExpired : boolean = false
    if (company.verifyCodeExpiry) {
      isCodeNotExpired = new Date(company.verifyCodeExpiry) > new Date();
    }

    if (isCodeValid && isCodeNotExpired) {
      return Response.json(
        {
          success: true,
          message: "Company email  Verified Successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "verification code expired  ",
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
