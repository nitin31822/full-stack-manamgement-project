import { ApiResponse } from "@/types/ApiResponse"
import axios from "axios"


export const getCompanies = async () => {
    const response = await axios.get<ApiResponse>("/api/company/get-companies")
    console.log("response" , response);
    
    if (response.data.success) {
        return response.data.companies
    }
}

export const getCompanyMembers = async (companyId : string) => {
    const response = await axios.get<ApiResponse>(`/api/company/get-company-members?companyId=${companyId}`)
    console.log(response);
    
    if (response.data.success) {
        return response.data.users
    }
}