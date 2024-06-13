import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/constants/prisma";
import { User } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",

      credentials: {
        email: {
          label: "Username",
          type: "text",
          placeholder: "enter username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "enter password",
        },
      },
      async authorize(credentials: any) {
      
        
        try {
          console.log("credentials", credentials);

          const user = await prisma.user.findFirst({
            where: {
              OR: [
                {
                  email: credentials.identifier,
                },
                {
                  name: credentials.identifier,
                },
              ],
            },
          });

          if (!user) {
            throw new Error("No user found with this email/name");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            const {password , ...userWithoutPassword} = user
            return userWithoutPassword
          } else {
            throw new Error("Password Incorrect");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  pages : {
    signIn : "/login"
  } ,
  session : {
    strategy : "jwt"
  },
  secret  : process.env.NEXT_AUTH_SECRET ,
  callbacks: {
    async jwt({ token , user}){
      if (user) {
        token.user = user  as User
      }
      return token
    } ,
    async session({session , token }){
     session.user = token.user
      return session
    }
    
  }
};
