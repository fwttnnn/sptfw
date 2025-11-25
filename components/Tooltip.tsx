"use client"

import { useEffect, useRef } from "react"
import useMouse from "@/hooks/useMouse"
import useTooltip from "@/hooks/useTooltip"

import gsap from "gsap"

export default () => {
  const {show, text} = useTooltip()
  const {x, y} = useMouse()
  const wrapper  = useRef<HTMLDivElement | null>(null)
  
  useEffect(() => {
    if (!wrapper.current)
      return
    
    gsap.to(wrapper.current, {
      x: (x - (wrapper.current.clientWidth / 2)),
      y: (y - (wrapper.current.clientHeight / 2)) + 35,
      opacity: show ? 1 : 0,
      duration: 0.6,
      ease: "power3.out",
    })
  }, [x, y, show])

  return (
    <div
      ref={wrapper}
      className="pointer-events-none fixed top-0 left-0 opacity-0"
    >
      <span
        className="p-2 border bg-black/75"
      >
        {text}
      </span>
    </div>
  )
}
