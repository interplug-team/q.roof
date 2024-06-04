'use client'

import Hero from '@/components/Hero'
import dynamic from 'next/dynamic'

export default function Intro() {
  const NoSSRComponent = dynamic(() => import('@/components/Intro'), {
    ssr: false,
  })

  return (
    <>
      <Hero title="Drawing on canvas 2D Intro" />
      <div className="container flex flex-wrap items-center justify-between mx-auto p-4 m-4 border">
        <NoSSRComponent />
      </div>
    </>
  )
}
