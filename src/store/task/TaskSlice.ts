"use client"

import { ITask } from "@/types/ApiResponse"
import {createSlice , PayloadAction} from "@reduxjs/toolkit"


export interface DataType {
    status : boolean ,
    task : ITask | null
}

const initialData : DataType  = {
    status : false ,
    task : null
}
const TaskSlice = createSlice({
    name : "auth" ,
    initialState: initialData ,
    reducers : {
        newTask : (state , action : PayloadAction<ITask>) =>{
            state.status = true
            state.task = action.payload
        },
       
    }
})

export const  {newTask } = TaskSlice.actions

export default TaskSlice.reducer