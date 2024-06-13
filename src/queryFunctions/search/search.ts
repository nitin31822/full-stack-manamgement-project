import { ApiResponse } from "@/types/ApiResponse"
import axios from "axios"


export const searchUsers  = async(query : string) =>{
    try {
        const response = await axios.get<ApiResponse>(`/api/search/get-searched-user?query=${query}`)
        if (response.data.success) {
            return response.data.searchUsers
        }
    } catch (error) {
        
    }
}

export const searchCompanies = async(query : string) =>{
    try {
        const response = await axios.get<ApiResponse>(`/api/search/get-searched-company?query=${query}`)
        console.log(response);
        
        if (response.data.success) {
            return response.data.companies
        }
    } catch (error) {
        
    }
}