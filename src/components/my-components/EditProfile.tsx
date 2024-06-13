"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import {  useQueryClient } from "@tanstack/react-query";
import DeleteAvatar from "./DeleteAvatar";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useState } from "react";


interface FormType {
  avatar?: FileList;
  headline: string;
}

export function DialogDemo() {
  const { handleSubmit, register , reset } = useForm<FormType>();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProfile = async (data: FormType) => {
    try {
      const avatarImage = data.avatar?.[0]; // Ensure data.avatar is not undefined

      if (!avatarImage) {
        if (data.headline.trim() !== "") {
          setIsUpdating(true);
          // in this case user only updates headline not updating avatar
          const Response = await axios.post<ApiResponse>(
            "/api/users/update-user-headline",
            {
              headline: data.headline,
            }
          );

          setIsUpdating(false);
          if (Response.data.success) {
            toast({
              title: "Headline Updated",
            });
           reset()
            await queryClient.invalidateQueries({ queryKey: ["profile/user"] });
          } else {
            toast({
              title: "Error",
              variant: "destructive",
            });
          }
        }
      } else {
        if (data.headline.trim() !== "") {
          // in this case user updtes both headline and avatar
          setIsUpdating(true);
          const HeadlineResponse = await axios.post<ApiResponse>(
            "/api/users/update-user-headline",
            {
              headline: data.headline,
            }
          );
          if (HeadlineResponse.data.success) {
            toast({
              title: "Headline Updated",
            });

          } else {
            toast({
              title: "Error",
              variant: "destructive",
            });
            return
          }

          const formData = new FormData();
          formData.append("avatar", avatarImage);


          const AvatarResponse = await axios.post<ApiResponse>(
            "/api/users/update-user-avatar",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          setIsUpdating(false);
          console.log("response", AvatarResponse);

          if (AvatarResponse.data.success) {
            toast({
              title: "Avatar Updated",
            });
            await queryClient.invalidateQueries({ queryKey: ["profile/user"] });
          } else {
            toast({
              title: "Error",
              variant: "destructive",
            });
          }

        } else {
          // in this case user only updates avatar

          const formData = new FormData();
          formData.append("avatar", avatarImage);

          setIsUpdating(true);

          const res = await axios.post<ApiResponse>(
            "/api/users/update-user-avatar",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          setIsUpdating(false);
          console.log("response", res);

          if (res.data.success) {
            toast({
              title: "Avatar Updated",
            });
            await queryClient.invalidateQueries({ queryKey: ["profile/user"] });
          } else {
            toast({
              title: "Error",
              variant: "destructive",
            });
          }
        }
      }
    } catch (error) {}
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(updateProfile)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Headline
              </Label>
              <Input
                id="name"
                placeholder="Update Headline"
                className="col-span-3"
                {...register("headline")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Avatar
              </Label>
              {/* <Input type="file" id="username" value="@peduarte" className="col-span-3" /> */}
              <Input
                className="col-span-3"
                type="file"
                {...register("avatar")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">
              {isUpdating ? "Please Wait " : "Save Changes"}
            </Button>
           
        
          </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  );
}
