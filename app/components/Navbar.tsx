"use client"

import { useSession, signOut } from "next-auth/react"

export default function Navbar() {

  const { data: session } = useSession()

  return (
    <div style={{display:"flex",gap:"20px",alignItems:"center"}}>

      {session?.user && (
        <>
          <img
            src={session.user.image!}
            style={{width:"35px",borderRadius:"50%"}}
          />

          <span>{session.user.name}</span>

          <button onClick={()=>signOut()}>
            Logout
          </button>
        </>
      )}

    </div>
  )
}