"use client"

import { useEffect, useRef } from "react"

export default function VantaBackground() {

  const vantaRef = useRef<HTMLDivElement | null>(null)
  const effectRef = useRef<any>(null)

  useEffect(() => {

    const loadVanta = async () => {

      const THREE = await import("three")
      const NET = (await import("vanta/dist/vanta.net.min")).default

      effectRef.current = NET({
        el: vantaRef.current,
        THREE: THREE,

        mouseControls: true,
        touchControls: true,
        gyroControls: false,

        backgroundColor: 0x020617,

        color: 0x8b5cf6,
        points: 12,
        maxDistance: 22,
        spacing: 18
      })
    }

    loadVanta()

    return () => {
      if (effectRef.current) effectRef.current.destroy()
    }

  }, [])

  return (
    <div
      ref={vantaRef}
      style={{
        position:"fixed",
        inset:0,
        width:"100%",
        height:"100%",
        zIndex:0
      }}
    />
  )
}