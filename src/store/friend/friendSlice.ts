import {  user } from "@/types/ApiResponse"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
export interface DataType {
    status : boolean
    friend : user | null
}

const initialState : DataType = {
    status : false,
    friend : null
}

const friendSlice = createSlice({
    name :"friend" ,
    initialState : initialState ,
    reducers : {
        inFriend : (state , action: PayloadAction<user>) => {
         state.status = true
         state.friend = action.payload
        }
    }
})

export const {inFriend} = friendSlice.actions

export default friendSlice.reducer