'use client'

import Hero from '@/components/Hero'
import Roof from '@/components/Roof'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export const FLAG = {
  DEFAULT: '',
  REDO: 'redo',
  UNDO: 'undo',
  DELETE: 'delete',
  CREATE: 'create',
  MOVE: 'move',
}

Object.freeze(FLAG)

export default function roofPage() {
  const NoSSRComponent = dynamic(() => import('@/components/Roof'), {
    ssr: false,
  })

  const [shapes, setShapes] = useState<IShape[]>([])

  const historyShapes = useRef<any>([])
  const historyStep = useRef<number>(0)
  const flag = useRef<any>(FLAG.DEFAULT)
  const [selectedId, selectShape] = useState<string | null>(null) // Add type annotation for selectedId
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
    createFigure(rectangle)
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
    createFigure(horizontalLine)
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
    createFigure(verticalLine)
  }

  const handleClear = () => {
    flag.current = FLAG.DELETE
    historyShapes.current.push(shapes)
    setShapes([])
  }

  const handleUndo = () => {
    if (historyStep.current === 0) {
      return
    }
    flag.current = FLAG.UNDO
    historyStep.current = historyStep.current - 1
    setShapes(historyShapes.current[historyStep.current])
  }

  const handleRedo = () => {
    if (historyShapes.current.length === historyStep.current + 1) {
      alert('REDO할 대상이 없습니다.')
      return
    }

    flag.current = FLAG.REDO
    historyStep.current = historyStep.current + 1
    setShapes(historyShapes.current[historyStep.current])
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

  const handleDelete = () => {
    if (!selectedId) {
      alert('삭제할 대상이 없습니다.')
      return
    }
    flag.current = FLAG.DELETE
    const newShapes = [...shapes].filter((elem) => elem.id !== selectedId)

    setShapes(newShapes)
  }

  const createFigure = (figure: any) => {
    flag.current = FLAG.CREATE
    setShapes([...shapes, figure])
  }

  const moveFigure = () => {
    flag.current = FLAG.MOVE
  }

  useEffect(() => {
    // redo, undo 로 인한 shape 변경일 경우 history에 넣지 않음
    switch (flag.current) {
      case FLAG.CREATE:
      case FLAG.DELETE:
      case FLAG.MOVE:
        historyShapes.current.push(shapes)
        historyStep.current = historyShapes.current.length
        break
      case FLAG.REDO:
        break
      case FLAG.UNDO:
        break
      case FLAG.DEFAULT:
        setIsLoading(true)
        if (isLoading) {
          return
        }

        historyShapes.current.push(new Array())
        historyStep.current = historyShapes.current.length
        break
    }
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
    selectedId: string | null
    selectShape: React.Dispatch<React.SetStateAction<string | null>>
    moveFigure: Function
  }

  const shapeProps: IShapeProps = {
    shapes,
    setShapes,
    selectedId,
    selectShape,
    moveFigure,
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

        <button
          className="w-30 mx-2 p-2 rounded bg-red-500 text-white"
          onClick={handleDelete}
        >
          삭제
        </button>
      </div>
      <div className="container flex flex-wrap items-center justify-between mx-auto p-4 m-4 border">
        <Roof props={shapeProps} />
      </div>
    </>
  )
}
