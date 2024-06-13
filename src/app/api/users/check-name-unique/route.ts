import { z } from "zod";
import prisma from "@/constants/prisma";
import { nameValidation } from "@/zod-types/sign-up-Schema";

const NameQuerySchema = z.object({
  name: nameValidation,
});

export async function GET(req: Request) {

    

  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      name: searchParams.get("name"),
    };
    console.log(queryParam);
    
    // validate with zod
    const result = NameQuerySchema.safeParse(queryParam);
    console.log("zod result", result);

    if (!result.success) {
      const usernameErrors = result.error.format().name?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query Parameters ",
        },
        { status: 400 }
      );
    }

    const { name } = result.data;

    const existedVerifiedUser = await prisma.user.findFirst({
      where: {
        name,
        isVerified: true,
      },
    });

    if (existedVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Name is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error while checking username", error);

    return Response.json(
      {
        success: false,
        message: "error while checking username",
      },
      { status: 500 }
    );
  }
}
