import React from 'react'
import Profile from '@/components/my-components/Profile'

interface params {
  id : string
}
function ProfilePage({params} : {params : params}) {
  return (
    <Profile userId={params.id}/>
  )
}

export default ProfilePage