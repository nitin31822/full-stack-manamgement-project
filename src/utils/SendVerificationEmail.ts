import { resend } from "@/constants/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function SendVerificationEmail(
    email: string ,
    name : string ,
    verifyCode : string
) : Promise<ApiResponse>{
    try {
        
       await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email ,
            subject: 'Verification Code ',
            react: VerificationEmail({name , otp : verifyCode , }),
          });
         
        return {
            success : true ,
            message : "Verification email send Successfully"
        }
    } catch (emailEror) {
        console.error("error while sending email" , emailEror)
        return {
            success : false ,
            message : "Failed to send verification email"
        }
    }
}