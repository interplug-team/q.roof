'use client'

import Hero from '@/components/Hero'
import Roof from '@/components/Roof'
import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function roofPage() {
  const NoSSRComponent = dynamic(() => import('@/components/Roof'), {
    ssr: false,
  })

  const [shapes, setShapes] = useState<IShape[]>([])

  const historyShapes = useRef<any>([])

  const handleAddBox = () => {
    const rectangle = {
      format: 'rectangle',
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      fill: 'white',
      stroke: 'black',
      id: uuidv4(),
    }
    setShapes([...shapes, rectangle])
  }

  const handleAddLineHorizontal = () => {
    const horizontalLine = {
      format: 'line',
      x: 10,
      y: 10,
      points: [10, 10, 100, 10],
      stroke: 'black',
      id: uuidv4(),
    }
    setShapes([...shapes, horizontalLine])
  }

  const handleAddLineVerticality = () => {
    const verticalLine = {
      format: 'line',
      x: 10,
      y: 10,
      points: [10, 10, 10, 100],
      stroke: 'black',
      id: uuidv4(),
    }

    setShapes([...shapes, verticalLine])
  }

  const handleClear = () => {
    historyShapes.current.push(shapes)
    setShapes([])
  }

  const handleUndo = () => {
    if (shapes.length === 0) {
      alert('UNDO할 대상이 없습니다.')
      return
    }
    const nowShapes = [...shapes]
    historyShapes.current.push(nowShapes.pop())

    setShapes([...shapes].splice(0, shapes.length - 1))
  }

  const handleRedo = () => {
    if (historyShapes.current.length === 0) {
      alert('REDO할 대상이 없습니다.')
      return
    }

    const popShapes = historyShapes.current.pop()

    if (Array.isArray(popShapes)) {
      setShapes([...shapes, ...popShapes])
      return
    }

    setShapes([...shapes, popShapes])
  }

  const handleSave = () => {
    if (shapes.length === 0) {
      alert('복사할 대상이 없습니다.')
      return
    }

    setShapes([])
    //복사
    localStorage.setItem('shapes', JSON.stringify(shapes))
  }

  const handlePaste = () => {
    const copiedShapes = JSON.parse(localStorage.getItem('shapes')!)
    if (!copiedShapes) {
      alert('붙여넣기할 대상이 없습니다.')
      return
    }
    setShapes(copiedShapes)

    localStorage.removeItem('shapes')
  }

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
        <button
          className="w-30 mx-2 p-2 rounded bg-green-500 text-white"
          onClick={handleUndo}
        >
          UNDO
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-green-300 text-white"
          onClick={handleRedo}
        >
          REDO
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-black text-white"
          onClick={handleSave}
        >
          저장
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-black text-white"
          onClick={handlePaste}
        >
          붙여넣기
        </button>
      </div>
      <div className="container flex flex-wrap items-center justify-between mx-auto p-4 m-4 border">
        <Roof props={shapeProps} />
      </div>
    </>
  )
}
