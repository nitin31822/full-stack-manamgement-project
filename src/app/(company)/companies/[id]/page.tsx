"use client"
import React from 'react'
import Profile from '@/components/my-components/CompanyProfile'

interface params {
    id : string
  }

function CompanyPage({params} : {params : params}) {
  return (
    <Profile CompanyId={params.id}/>
  )
}

export default CompanyPage