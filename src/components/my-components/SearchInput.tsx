"use client"
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { AppDispatch } from '@/store/store'
import { inQuery } from '@/store/search/searchSlice'


interface FormQuery {
    query : string
  }

function SearchInput() {
    const queryClient = useQueryClient()
    const dispatch :AppDispatch = useDispatch()
    const router = useRouter()
    const {register , handleSubmit , reset} = useForm<FormQuery>({
        defaultValues : {
          query : ""
        }
      })

      const Search : SubmitHandler<FormQuery> = async(data) => {
        const searchQuery = data.query
        if (searchQuery.trim() !== "") {
         
          dispatch(inQuery(searchQuery))
          await queryClient.invalidateQueries({queryKey : ["search/companies"]})
          await queryClient.invalidateQueries({queryKey : ["search/users"]})
          reset()
          router.push("/search")
        }
       }
  return (
    <div className="  lg:w-1/2 w-full">
          <form onSubmit={handleSubmit(Search)}>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="search" placeholder="Search Here" {...register("query")}/>
            <Button
              type="submit"
              className=" bg-white text-black hover:bg-white hover:text-black"
            >
              Search
            </Button>
          </div>
          </form>
        </div>
  )
}

export default SearchInput