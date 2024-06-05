import { FLAG } from '@/app/roof/page'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Layer, Line, Rect, Stage, Transformer } from 'react-konva'

const Rectshape = ({ shapeProps, isSelected, onSelect, onChange }: any) => {
  const shapeRef = useRef() as React.MutableRefObject<any>
  const trRef = useRef() as React.MutableRefObject<any> // Add type assertion here

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  return (
    <>
      {shapeProps.format === 'rectangle' && (
        <Rect
          onClick={onSelect}
          onTap={onSelect}
          ref={shapeRef}
          {...shapeProps}
          draggable
          onDragEnd={(e) => {
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            })
          }}
          onTransformEnd={(e) => {
            // transformer is changing scale of the node
            // and NOT its width or height
            // but in the store we have only width and height
            // to match the data better we will reset scale on transform end
            const node = shapeRef.current
            const scaleX = node.scaleX()
            const scaleY = node.scaleY()

            // we will reset it back
            node.scaleX(1)
            node.scaleY(1)
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              width: Math.max(node.width() * scaleX),
              height: Math.max(node.height() * scaleY),
            })
          }}
        />
      )}
      {shapeProps.format === 'line' && (
        <Line
          {...shapeProps}
          onClick={onSelect}
          onTap={onSelect}
          ref={shapeRef}
          draggable
          onDragEnd={(e) => {
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            })
          }}
        />
      )}
      {isSelected && (
        <Transformer
          ref={trRef}
          fiipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            // if (newBox.width < 5 || newBox.height < 5) {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox
            }
            return newBox
          }}
        />
      )}
    </>
  )
}

// const initialRectangles = [
//   {
//     x: 10,
//     y: 10,
//     width: 100,
//     height: 100,
//     fill: 'white',
//     stroke: 'black',
//     id: 'rect1',
//   },
//   {
//     x: 150,
//     y: 150,
//     width: 100,
//     height: 100,
//     fill: 'white',
//     stroke: 'black',
//     id: 'rect2',
//   },
//   {
//     x: 10,
//     y: 390,
//     width: 100,
//     height: 100,
//     fill: 'white',
//     stroke: 'black',
//     id: 'rect3',
//   },
// ]

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

export default function Roof({ props }: { props: IShapeProps }) {
  // const [shapes, setShapes] = useState<IShape[]>([]) // Provide initial value as an empty array of type IShape[]
  const { shapes, setShapes, selectedId, selectShape, moveFigure } = props

  const checkDeselect = (e: any) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      selectShape(null)
    }
  }

  return (
    <>
      <Stage
        width={window.innerWidth}
        height={500}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer>
          {shapes.map((shape, i) => {
            return (
              <Rectshape
                key={i}
                shapeProps={shape}
                isSelected={shape.id === selectedId}
                onSelect={() => {
                  selectShape(shape.id)
                }}
                onChange={(newAttrs: any) => {
                  const _shapes = shapes.slice()
                  _shapes[i] = newAttrs
                  setShapes(_shapes)
                  moveFigure()
                }}
              />
            )
          })}
        </Layer>
      </Stage>
    </>
  )
}
