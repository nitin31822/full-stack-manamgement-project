import {  configureStore ,  } from '@reduxjs/toolkit';
import CompanySlice from "./company/slice"
import userSlice from './user/userSlice';
import searchSlice from './search/searchSlice';
import friendSlice from './friend/friendSlice';
import TaskSlice from './task/TaskSlice';
export const store = configureStore({
    reducer : {
        company : CompanySlice ,
        user    : userSlice ,
        search  :  searchSlice ,
        friend : friendSlice ,
        task   : TaskSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;