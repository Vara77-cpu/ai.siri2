"use client"

import { useState } from "react"

export default function ModeSwitcher({ setLevel }: any) {

const [flash, setFlash] = useState(false)

const changeMode = (mode: string) => {
setFlash(true)

setTimeout(() => {

  setFlash(false)
  setLevel(mode)

}, 4000)

}

return (
<div className="w-full max-w-3xl mb-6 text-center">

  {flash && (
    <div className="fixed inset-0 bg-white animate-pulse z-50"></div>
  )}

  <h2 className="text-xl mb-4">
    Select Learning Mode
  </h2>

  <div className="flex justify-center gap-3 flex-wrap">

    <button
      onClick={() => changeMode("Kids")}
      className="bg-pink-600 px-4 py-2 rounded"
    >
      Kids
    </button>

    <button
      onClick={() => changeMode("Primary")}
      className="bg-green-600 px-4 py-2 rounded"
    >
      Primary
    </button>

    <button
      onClick={() => changeMode("Secondary")}
      className="bg-blue-600 px-4 py-2 rounded"
    >
      Secondary
    </button>

    <button
      onClick={() => changeMode("College")}
      className="bg-purple-600 px-4 py-2 rounded"
    >
      College
    </button>

  </div>

</div>

)

}
