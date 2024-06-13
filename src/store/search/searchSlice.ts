import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface initialstate {
    status : boolean 
    query : string | null
}

const initialState : initialstate ={
    status:false,
    query:  null
}

const SearchSlice=createSlice({
    name:"query",
    initialState,
    reducers:{
        inQuery:(state,action:PayloadAction<string> )=>{
            state.status=true,
            state.query=action.payload
        },
    
    }
})

export const {inQuery } = SearchSlice.actions
export default SearchSlice.reducer