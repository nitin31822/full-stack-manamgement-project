import { Companies } from "@/types/ApiResponse"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
export interface DataType {
    status : boolean
    company : Companies | null
}

const initialState : DataType = {
    status : false,
    company : null
}

const companySlice = createSlice({
    name :"company" ,
    initialState : initialState ,
    reducers : {
        inCompany : (state , action: PayloadAction<Companies>) => {
         state.status = true
         state.company = action.payload
        }
    }
})

export const {inCompany} = companySlice.actions

export default companySlice.reducer