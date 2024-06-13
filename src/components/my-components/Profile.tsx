"use client"
import { Separator } from "@/components/ui/separator";
import React from "react";
import Link from "next/link";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/queryFunctions/profile/profile";
import { Skeleton } from "../ui/skeleton";
import UserCompanies from "./UserCompanies";
import { useSession } from "next-auth/react";
import { DialogDemo } from "./EditProfile";

function Profile({userId}: {userId : string}) {
  const {data : session} = useSession()
  const Sessionuser = session?.user
    const {data : userProfileData , isLoading} = useQuery({
        queryKey : ["profile/user"],
        queryFn : async() => await getUserProfile(userId)
    })

    if (isLoading) {
       return <Skeleton />
    }
  return (
    <main className=" h-full w-full mt-4">
      <section className=" h-1/4 w-full  p-4 flex flex-col gap-6">
        <div className=" h-1/2 w-full  flex flex-row gap-6 items-center">
          <div className=" h-24 w-24 rounded-full  " >
            <img src={userProfileData?.avatar ? userProfileData.avatar : ""} alt="" className=" h-full w-full rounded-full"/>
          </div>
          <div className=" flex flex-col gap-2 ">
            <h2 className="  text-3xl font-semibold">{userProfileData?.name}</h2>
          </div>
        </div>
        <div className=" h-1/2 w-full mt-4 ">
          <p className="  break-words">
          {userProfileData?.headline ? userProfileData.headline : ""}  
          </p>
        </div>
        <div className="  lg:w-1/3 flex flex-col justify-center lg:flex-row  lg:items-center lg:gap-4">
          <Link className="flex flex-row items-center gap-2 h-8  pl-2 justify-center" href={"/"}><IoChatboxEllipsesOutline />Send Message</Link>
          {Sessionuser?.id === userId ? <DialogDemo /> : null}
        </div>
      </section>
      
      <Separator className="lg: mt-20 "/>
      <br />
     <section>
     <div className=" flex flex-row justify-center items-center">
      <h2 className=" text-xl font-medium">Work in Companies</h2>
     </div>
     <UserCompanies />
     </section>
    </main>
  );
}

export default Profile;
