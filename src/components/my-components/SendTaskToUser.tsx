import React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useSocket } from "@/app/custom-Hooks/SocketProvider";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { user, ITask, ApiResponse } from "@/types/ApiResponse";
import axios from "axios";
import { useToast } from "../ui/use-toast";

function SendTaskEmployeesCard({ user }: { user: user }) {
    const {toast} = useToast()
  const router = useRouter();
  const queryClient = useQueryClient();
  const { sendTask } = useSocket();
  const task = useSelector((state: RootState) => state.task.task);

  if (task === null) {
    return <div>SomeThing Went Wrong</div>;
  }
  

  const sendTaskToUser = async () => {
    const sokcetRoomName = `${user.id}_${user.name}`
    console.log(sokcetRoomName);
    
    const res = await sendTask(sokcetRoomName, task);
    console.log("send task res", res);

    if (res) {
       const axiosResponse =  axios.post<ApiResponse>(`/api/task/create-task?CompanyId=${task.Company.id}&recieverId=${user.id}` , {
            title : task.title ,
            content : task.content
        })
        if ((await axiosResponse).data.success) {
            toast({
                title : `Task Send To ${user.name}`

            })
        }
    }
  };

  const pushToProfile = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["profile/user"],
      exact: true,
    });
    router.push(`/profile/${user.id}`);
  };
  return (
    <div className="bg-white shadow-md rounded-md p-4 flex items-center cursor-pointer ">
      <Avatar>
        <AvatarImage src={user.avatar ? user.avatar : ""} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className=" ml-3">
        <h2 onClick={pushToProfile} className="text-xl font-semibold">
          {user.name}
        </h2>
        <p className="text-gray-600">{user.email}</p>

        <Button onClick={sendTaskToUser} className=" bg-blue-500 text-white">
          Send
        </Button>
      </div>
    </div>
  );
}

export default SendTaskEmployeesCard;
