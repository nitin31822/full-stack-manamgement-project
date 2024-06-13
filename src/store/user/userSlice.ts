"use client"
import { User } from "@prisma/client"
import {createSlice , PayloadAction} from "@reduxjs/toolkit"


export interface DataType {
    status : boolean ,
    userData : User | null
}

const initialData : DataType  = {
    status : false ,
    userData : null
}
const authSlice = createSlice({
    name : "auth" ,
    initialState: initialData ,
    reducers : {
        login : (state , action : PayloadAction<User>) =>{
            state.status = true
            state.userData = action.payload
        },
        logout : (state) =>{
          state.status = false
          state.userData = null
        }
    }
})

export const  {login  , logout} = authSlice.actions

export default authSlice.reducer