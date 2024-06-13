import React from "react";
import { Separator } from "@/components/ui/separator";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ProfileLink from "./ProfileLink";
import Link from "next/link";
import { AiOutlineHome } from "react-icons/ai";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaTasks } from "react-icons/fa";
import { IoMdVideocam } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GiPostStamp } from "react-icons/gi";
import { MdOutlineNotifications } from "react-icons/md";
import { ImUsers } from "react-icons/im";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import SearchInput from "./SearchInput";

interface NavbarItem {
  name: String;
  path: String;
  icon: any;
}

function Navbar() {
  const navItems: Array<NavbarItem> = [
    {
      name: "Home",
      path: "/",
      icon: <AiOutlineHome />,
    },
    
    {
      name: "Discussions",
      path: "/message/company",
      icon: <IoChatboxEllipsesOutline />,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: <FaTasks />,
    },
    {
      name: "Companies",
      path: "/companies",
      icon: <IoMdVideocam />,
    },
  ];

  const profileItems: Array<NavbarItem> = [
    {
      name: "Friends",
      path: "/friends",
      icon: <ImUsers />,
    },
   
    {
      name: "Friend Requests",
      path: "/friend-requests",
      icon: <MdOutlineCreateNewFolder />,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <MdOutlineNotifications />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <CiSettings />,
    },
  ];

  return (
    <main className="bg-slate-800">
      <nav className="  h-14 flex flex-row items-center ml-4 justify-between mr-4">
        <div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">
                <GiHamburgerMenu className="text-xl" />
              </Button>
            </SheetTrigger>
            <SheetContent side={"left"}>
              <SheetHeader>
                <SheetTitle className=" text-black">Management App</SheetTitle>
                <SheetDescription className=" text-black">
                  Tracks all the Tasks of Employee and converts three apps into
                  one app.
                </SheetDescription>
              </SheetHeader>
              <br />
              <Separator />
              <div className="grid gap-4 py-4">
                <div className="grid grid-rows-4 items-center gap-4">
                  {navItems.map((item) => (
                    <Link
                      className=" flex flex-row items-center gap-2 h-8 hover:bg-slate-200 hover:rounded-md pl-2"
                      href={`${item.path}`}
                    >
                      {item.icon} {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Separator />
              <SheetTitle className=" text-black mt-4">Media</SheetTitle>
              <Link
                className=" mt-3 flex flex-row items-center gap-2 h-8 hover:bg-slate-200 hover:rounded-md pl-2"
                href={`/posts`}
              >
                {" "}
                <GiPostStamp /> Posts
              </Link>
            </SheetContent>
          </Sheet>
        </div>

        <SearchInput />

        <div>
          <Sheet>
            <SheetTrigger className=" mr-4" asChild>
              <Avatar>
                <AvatarFallback className=" cursor-pointer">CN</AvatarFallback>
              </Avatar>
            </SheetTrigger>
            <SheetContent side={"right"}>
              <SheetHeader>
                <SheetTitle className=" text-black">
                  <Avatar>
                    <AvatarFallback className=" cursor-pointer">
                      CN
                    </AvatarFallback>
                  </Avatar>
                </SheetTitle>
                <SheetDescription className=" text-black">
                  Tracks all the Tasks of Employee and converts three apps into
                  one app.
                </SheetDescription>
              </SheetHeader>
              <br />
              <Separator />
              <div className="grid gap-4 py-4">
                <div className="grid grid-rows-4 items-center gap-4">
                  <ProfileLink />
                  {profileItems.map((item) => (
                    <Link
                      className=" flex flex-row items-center gap-2 h-8 hover:bg-slate-200 hover:rounded-md pl-2"
                      href={`${item.path}`}
                    >
                      {item.icon} {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
      <Separator className=" bg-gray-600 mt-2" />
    </main>
  );
}

export default Navbar;
