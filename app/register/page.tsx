"use client";

import { useState } from "react";

export default function RegisterPage() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [msg,setMsg] = useState("");

  const register = async () => {

    const res = await fetch("/api/register",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ name,email,password })
    });

    const data = await res.json();

    setMsg(data.message);
  };

  return (

    <div style={{padding:"40px"}}>

      <h1>Register</h1>

      <input
      placeholder="Name"
      onChange={(e)=>setName(e.target.value)}
      />

      <br/><br/>

      <input
      placeholder="Email"
      onChange={(e)=>setEmail(e.target.value)}
      />

      <br/><br/>

      <input
      type="password"
      placeholder="Password"
      onChange={(e)=>setPassword(e.target.value)}
      />

      <br/><br/>

      <button onClick={register}>
      Register
      </button>

      <p>{msg}</p>

    </div>

  );
}