"use client"

import { useState, useEffect, useRef } from "react"

interface AnimatedCounterProps {
  value: number
  duration?: number
  decimals?: number
  className?: string
}

export function AnimatedCounter({
  value,
  duration = 1500,
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const requestRef = useRef<number | null>(null)
  const previousValue = useRef<number>(0)

  const formatValue = (value: number) => {
    return value.toFixed(decimals)
  }

  useEffect(() => {
    // Skip animation for initial value
    if (previousValue.current === 0 && value === 0) {
      setDisplayValue(0)
      return
    }

    const startValue = previousValue.current
    const endValue = value
    const totalChange = endValue - startValue

    const animateValue = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const currentValue = startValue + totalChange * easedProgress
      
      setDisplayValue(currentValue)

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animateValue)
      } else {
        setDisplayValue(endValue)
        previousValue.current = endValue
        startTimeRef.current = null
      }
    }

    // Start animation
    requestRef.current = requestAnimationFrame(animateValue)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [value, duration])

  return <span className={className}>{formatValue(displayValue)}</span>
} 