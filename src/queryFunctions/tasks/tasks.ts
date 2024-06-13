import { ApiResponse } from "@/types/ApiResponse"
import axios from "axios"


export const getUserTasks = async() =>{
    const response = await axios.get<ApiResponse>("/api/task/get-user-tasks")

    if (response.data.success) {
        return response.data.tasks
    }
}