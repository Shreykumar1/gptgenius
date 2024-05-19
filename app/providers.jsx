'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'

const Providers = ({children}) => {
  const [queryClient] = useState(()=>{
    return new QueryClient({
      defaultOptions : {
        query : {
          staleTime : 60 * 1000
        }
      }
    })
  })
  return (
    <QueryClientProvider client={queryClient}>
        <Toaster position='top-center'/>
        {children}
        <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default Providers