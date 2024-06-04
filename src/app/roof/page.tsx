'use client'

import Hero from '@/components/Hero'
import Roof from '@/components/Roof'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function roofPage() {
  const NoSSRComponent = dynamic(() => import('@/components/Roof'), {
    ssr: false,
  })

  const [shapes, setShapes] = useState<IShape[]>([])

  const handleAddBox = () => {
    setShapes([
      ...shapes,
      {
        format: 'rectangle',
        x: 10,
        y: 10,
        width: 100,
        height: 100,
        fill: 'white',
        stroke: 'black',
        id: uuidv4(),
      },
    ])
  }

  const handleAddLineHorizontal = () => {
    setShapes([
      ...shapes,
      {
        format: 'line',
        x: 10,
        y: 10,
        points: [10, 10, 100, 10],
        stroke: 'black',
        id: uuidv4(),
      },
    ])
  }

  const handleAddLineVerticality = () => {
    setShapes([
      ...shapes,
      {
        format: 'line',
        x: 10,
        y: 10,
        points: [10, 10, 10, 100],
        stroke: 'black',
        id: uuidv4(),
      },
    ])
  }

  const handleClear = () => {
    setShapes([])
  }

  useEffect(() => {
    console.log(shapes)
  }, [shapes])

  interface IShape {
    format: string
    x: number
    y: number
    width?: number
    height?: number
    fill?: string
    points?: number[]
    stroke: string
    id: string
  }

  interface IShapeProps {
    shapes: IShape[]
    setShapes: React.Dispatch<React.SetStateAction<IShape[]>>
  }

  const shapeProps: IShapeProps = {
    shapes,
    setShapes,
  }

  return (
    <>
      <Hero title="Drawing on canvas 2D Roof" />
      <div className="flex justify-center my-8">
        <button
          className="w-30 mx-2 p-2 rounded bg-blue-500 text-white"
          onClick={handleAddBox}
        >
          ADD BOX
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-blue-500 text-white"
          onClick={handleAddLineHorizontal}
        >
          ADD HORIZONTAL LINE
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-blue-500 text-white"
          onClick={handleAddLineVerticality}
        >
          ADD VERTICALITY LINE
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-red-500 text-white"
          onClick={handleClear}
        >
          CLEAR
        </button>
      </div>
      <div className="container flex flex-wrap items-center justify-between mx-auto p-4 m-4 border">
        <Roof props={shapeProps} />
      </div>
    </>
  )
}
