'use client'

import React from 'react'
import { cn } from "@/lib/utils"

export default function Loader({ className, size = 'default' }) {
  return (
    <div className={cn(
      'flex items-center justify-center h-screen',
      className
    )}>
      <div className={cn(
        'animate-spin rounded-full border-t-2 border-b-2 border-gray-900',
        {
          'h-4 w-4': size === 'small',
          'h-8 w-8': size === 'default',
          'h-12 w-12': size === 'large',
        }
      )} />
    </div>
  )
}